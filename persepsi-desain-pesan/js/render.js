/* ==========================================================================
   COURSE RENDERER
   Renders COURSE_DATA (from course-data.js) into the page, reconstructing
   Moodle labels, inline H5P embeds (ImageSlider -> slideshow, SingleChoiceSet
   -> quiz) as native interactive components.
   ========================================================================== */

(function () {
  "use strict";

  const IMG_BASE = "assets/images-web/";
  const H5P_IMG_BASE = "assets/h5p-images-web/";

  /* ---------------- Helpers ---------------- */
  function esc(str) {
    return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function findActivityById(id) {
    for (const s of COURSE_DATA) {
      for (const a of s.activities) {
        if (a.id === id) return a;
      }
    }
    return null;
  }

  function getYoutubeEmbedUrl(url) {
    if (!url) return null;
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : null;
  }

  /* ---------------- Renderers per activity type ---------------- */

  function renderLabel(a, sectionIdx, actIdx) {
    // Case 1: pure decorative image (banner) - render as a clean visual break
    if (a.is_image_only && a.images.length) {
      return `
        <figure class="content-banner">
          <img src="${IMG_BASE}${esc(a.images[0])}" alt="" loading="lazy">
        </figure>`;
    }

    // Case 2: label with inline H5P embed reference - render the slideshow/quiz component
    if (a.hvp_embed_ids && a.hvp_embed_ids.length) {
      const parts = a.hvp_embed_ids.map((hid) => {
        const hvpActivity = findActivityById(hid);
        if (!hvpActivity) return "";
        return renderHvpComponent(hvpActivity, `${sectionIdx}-${actIdx}-${hid}`);
      });
      // also render any lead-in text (heading) before the embed, stripped of the embed markers
      const headingHtml = stripEmbedArtifacts(a.html);
      return `
        <div class="content-block">
          ${headingHtml ? `<div class="content-text">${headingHtml}</div>` : ""}
          ${parts.join("")}
        </div>`;
    }

    // Case 3: label with video
    if (a.has_video && a.video_url) {
      const embedUrl = getYoutubeEmbedUrl(a.video_url);
      const headingHtml = stripEmbedArtifacts(a.html).replace(/<video[\s\S]*?<\/video>/gi, "");
      return `
        <div class="content-block">
          ${headingHtml ? `<div class="content-text">${headingHtml}</div>` : ""}
          ${embedUrl ? `
          <div class="video-embed">
            <iframe src="${embedUrl}" title="Video pembelajaran" loading="lazy" allowfullscreen></iframe>
          </div>` : ""}
        </div>`;
    }

    // Case 4: substantial text content (objectives, etc.)
    if (a.plain_text && a.plain_text.length > 5) {
      const cleanHtml = stripEmbedArtifacts(a.html);
      return `<div class="content-block"><div class="content-text">${cleanHtml}</div></div>`;
    }

    return "";
  }

  function resolveImagePaths(html) {
    if (!html) return "";
    return html.replace(/@@PLUGINFILE@@\/([^"'\s)]+)/g, (match, fname) => {
      let decoded;
      try { decoded = decodeURIComponent(fname); } catch (e) { decoded = fname; }
      const dot = decoded.lastIndexOf(".");
      const base = dot > -1 ? decoded.slice(0, dot) : decoded;
      const actualExt = (typeof IMG_EXT_LOOKUP !== "undefined") && IMG_EXT_LOOKUP[base];
      const finalName = actualExt ? base + actualExt : decoded;
      return IMG_BASE + finalName;
    });
  }

  function stripEmbedArtifacts(html) {
    if (!html) return "";
    const cleaned = html
      .replace(/\$@HVPEMBEDBYID\*\d+@\$/g, "")
      .replace(/<iframe[^>]*><\/iframe>/gi, "")
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<div class="h5p-placeholder"[^>]*>[\s\S]*?<\/div>/gi, "")
      .replace(/@@PLUGINFILE@@\/[^\s<"]+\.h5p[^\s<"]*/gi, "");
    return resolveImagePaths(cleaned);
  }

  function renderHvpComponent(hvpActivity, uid) {
    if (hvpActivity.library === "H5P.ImageSlider") {
      return renderSlideshow(hvpActivity, uid);
    }
    if (hvpActivity.library === "H5P.SingleChoiceSet") {
      return renderQuiz(hvpActivity, uid);
    }
    return "";
  }

  /* ---------------- Slideshow component (H5P.ImageSlider reconstruction) ---------------- */
  function renderSlideshow(hvpActivity, uid) {
    const slides = hvpActivity.parsed_slides || [];
    if (!slides.length) return "";
    const slideId = `slideshow-${uid}`;
    return `
      <div class="slideshow" id="${slideId}" data-index="0" data-count="${slides.length}">
        <div class="slideshow-head">
          <span class="slideshow-icon">&#9635;</span>
          <span class="slideshow-title">${esc(hvpActivity.title)}</span>
          <span class="slideshow-count"><span class="ss-current">1</span> / ${slides.length}</span>
        </div>
        <div class="slideshow-stage">
          <div class="slideshow-track" style="transform: translateX(0%)">
            ${slides.map((sl) => `
              <div class="slideshow-slide">
                <img src="${H5P_IMG_BASE}${esc(sl.filename)}" alt="${esc(sl.title || "")}" loading="lazy">
              </div>`).join("")}
          </div>
          ${slides.length > 1 ? `
          <button class="slideshow-nav slideshow-prev" aria-label="Slide sebelumnya" disabled>&#8249;</button>
          <button class="slideshow-nav slideshow-next" aria-label="Slide berikutnya">&#8250;</button>` : ""}
        </div>
        ${slides.length > 1 ? `
        <div class="slideshow-dots">
          ${slides.map((_, i) => `<button class="slideshow-dot ${i === 0 ? "is-active" : ""}" data-goto="${i}" aria-label="Ke slide ${i + 1}"></button>`).join("")}
        </div>` : ""}
      </div>`;
  }

  /* ---------------- Quiz component (H5P.SingleChoiceSet reconstruction) ---------------- */
  function renderQuiz(hvpActivity, uid) {
    const questions = hvpActivity.parsed_questions || [];
    if (!questions.length) return "";
    const quizId = `quiz-${uid}`;
    return `
      <div class="quiz-card" id="${quizId}" data-q-index="0" data-q-count="${questions.length}" data-score="0">
        <div class="quiz-head">
          <span class="quiz-badge">Kuis</span>
          <span class="quiz-title">${esc(hvpActivity.title)}</span>
        </div>
        <div class="quiz-body">
          ${questions.map((q, qi) => renderQuizQuestion(q, qi, questions.length)).join("")}
          <div class="quiz-result" style="display:none;">
            <p class="quiz-result-score"></p>
            <button class="quiz-retry-btn">Ulangi Kuis</button>
          </div>
        </div>
        <div class="quiz-progress">
          ${questions.map((_, i) => `<span class="quiz-progress-dot ${i === 0 ? "is-active" : ""}"></span>`).join("")}
        </div>
      </div>`;
  }

  function renderQuizQuestion(q, qi, total) {
    // In H5P SingleChoiceSet, answers[0] is always the correct one; we shuffle display order via JS at render time.
    const answers = q.answers.map((ans, ai) => ({ html: ans, correct: ai === 0 }));
    return `
      <div class="quiz-question" data-qi="${qi}" style="display:${qi === 0 ? "block" : "none"};">
        <p class="quiz-question-text">${qi + 1}. ${q.question}</p>
        <div class="quiz-answers">
          ${answers.map((ans, ai) => `
            <button class="quiz-answer" data-correct="${ans.correct}">${ans.html}</button>
          `).join("")}
        </div>
        <div class="quiz-feedback" style="display:none;"></div>
      </div>`;
  }

  /* ---------------- Section rendering ---------------- */
  function renderSection(section, idx) {
    const isIntro = idx === 0;
    const chapterNum = isIntro ? "" : String(idx).padStart(2, "0");

    // Track which hvp IDs were already rendered via inline label embeds,
    // so we don't render them a second time when we hit their standalone entry.
    const embeddedIds = new Set();
    section.activities.forEach((a) => {
      if (a.type === "label" && a.hvp_embed_ids) {
        a.hvp_embed_ids.forEach((id) => embeddedIds.add(id));
      }
    });

    const activitiesHtml = section.activities
      .map((a, ai) => {
        if (a.type === "label") return renderLabel(a, idx, ai);
        if (a.type === "resource") return renderResource(a);
        if (a.type === "hvp" && !embeddedIds.has(a.id)) {
          // Standalone H5P activity (most commonly the end-of-section quiz)
          return `<div class="content-block">${renderHvpComponent(a, `${idx}-${ai}-${a.id}`)}</div>`;
        }
        return "";
      })
      .join("");

    return `
      <section class="course-section ${isIntro ? "course-section-intro" : ""}" id="section-${idx}" data-section-index="${idx}">
        <div class="section-tab">
          ${chapterNum ? `<span class="section-tab-num">${chapterNum}</span>` : `<span class="section-tab-icon">&#9737;</span>`}
        </div>
        <div class="section-inner">
          <p class="section-eyebrow">${isIntro ? "Pembuka" : `Pokok Bahasan ${idx}`}</p>
          <h2 class="section-title">${esc(cleanSectionName(section.name))}</h2>
          <div class="section-body">
            ${activitiesHtml}
          </div>
        </div>
      </section>`;
  }

  function cleanSectionName(name) {
    // Strip "Pokok Bahasan N - " prefix since we render numbering separately
    return name.replace(/^Pokok Bahas\w*\s*\d+\s*-\s*/i, "").replace(/^Selamat Datang!$/, "Selamat Datang");
  }

  function renderResource(a) {
    return `
      <a class="resource-card" href="#" onclick="return false;">
        <span class="resource-icon">&#128196;</span>
        <span class="resource-info">
          <span class="resource-title">${esc(a.title)}</span>
          <span class="resource-hint">Dokumen pendukung mata kuliah</span>
        </span>
      </a>`;
  }

  /* ---------------- TOC rendering ---------------- */
  function renderTOC() {
    const tocGrid = document.getElementById("tocGrid");
    const tocList = document.getElementById("tocList");

    const tocCards = COURSE_DATA.map((s, idx) => {
      const isIntro = idx === 0;
      const num = isIntro ? "—" : String(idx).padStart(2, "0");
      const h5pCount = s.activities.filter((a) => a.type === "hvp").length;
      return `
        <a class="toc-card" href="#section-${idx}">
          <span class="toc-card-num">${num}</span>
          <span class="toc-card-title">${esc(cleanSectionName(s.name))}</span>
          ${h5pCount ? `<span class="toc-card-meta">${h5pCount} modul interaktif</span>` : ""}
        </a>`;
    }).join("");
    tocGrid.innerHTML = tocCards;

    const tocLinks = COURSE_DATA.map((s, idx) => {
      const isIntro = idx === 0;
      const num = isIntro ? "" : String(idx).padStart(2, "0") + ". ";
      return `<a href="#section-${idx}" data-section="${idx}">${num}${esc(cleanSectionName(s.name))}</a>`;
    }).join("");
    tocList.innerHTML = tocLinks;
  }

  /* ---------------- Interactions: slideshow ---------------- */
  function initSlideshows() {
    document.querySelectorAll(".slideshow").forEach((el) => {
      const track = el.querySelector(".slideshow-track");
      const prevBtn = el.querySelector(".slideshow-prev");
      const nextBtn = el.querySelector(".slideshow-next");
      const dots = el.querySelectorAll(".slideshow-dot");
      const counter = el.querySelector(".ss-current");
      const count = parseInt(el.dataset.count, 10);

      function goTo(i) {
        i = Math.max(0, Math.min(count - 1, i));
        el.dataset.index = i;
        track.style.transform = `translateX(-${i * 100}%)`;
        dots.forEach((d, di) => d.classList.toggle("is-active", di === i));
        if (counter) counter.textContent = i + 1;
        if (prevBtn) prevBtn.disabled = i === 0;
        if (nextBtn) nextBtn.disabled = i === count - 1;
      }

      if (prevBtn) prevBtn.addEventListener("click", () => goTo(parseInt(el.dataset.index, 10) - 1));
      if (nextBtn) nextBtn.addEventListener("click", () => goTo(parseInt(el.dataset.index, 10) + 1));
      dots.forEach((d) => d.addEventListener("click", () => goTo(parseInt(d.dataset.goto, 10))));
    });
  }

  /* ---------------- Interactions: quiz ---------------- */
  function initQuizzes() {
    document.querySelectorAll(".quiz-card").forEach((quiz) => {
      const questions = quiz.querySelectorAll(".quiz-question");
      const progressDots = quiz.querySelectorAll(".quiz-progress-dot");
      const resultBlock = quiz.querySelector(".quiz-result");
      const total = questions.length;

      questions.forEach((qEl, qi) => {
        const answerBtns = qEl.querySelectorAll(".quiz-answer");
        const feedback = qEl.querySelector(".quiz-feedback");

        answerBtns.forEach((btn) => {
          btn.addEventListener("click", () => {
            if (qEl.dataset.answered === "true") return;
            qEl.dataset.answered = "true";
            const correct = btn.dataset.correct === "true";
            answerBtns.forEach((b) => {
              b.disabled = true;
              if (b.dataset.correct === "true") b.classList.add("is-correct");
            });
            if (!correct) btn.classList.add("is-wrong");
            if (correct) {
              quiz.dataset.score = String(parseInt(quiz.dataset.score, 10) + 1);
            }
            feedback.style.display = "block";
            feedback.textContent = correct ? "Benar!" : "Kurang tepat — jawaban benar ditandai hijau.";
            feedback.className = "quiz-feedback " + (correct ? "is-correct" : "is-wrong");

            setTimeout(() => {
              if (qi < total - 1) {
                qEl.style.display = "none";
                questions[qi + 1].style.display = "block";
                progressDots[qi].classList.remove("is-active");
                progressDots[qi].classList.add("is-done");
                progressDots[qi + 1].classList.add("is-active");
              } else {
                qEl.style.display = "none";
                progressDots[qi].classList.remove("is-active");
                progressDots[qi].classList.add("is-done");
                showQuizResult(quiz, total);
              }
            }, 1400);
          });
        });
      });

      quiz.querySelector(".quiz-retry-btn")?.addEventListener("click", () => resetQuiz(quiz, questions, progressDots));
    });
  }

  function showQuizResult(quiz, total) {
    const resultBlock = quiz.querySelector(".quiz-result");
    const scoreEl = quiz.querySelector(".quiz-result-score");
    const score = parseInt(quiz.dataset.score, 10);
    resultBlock.style.display = "block";
    const pct = Math.round((score / total) * 100);
    let msg = `Skor kamu: ${score} / ${total} (${pct}%)`;
    scoreEl.textContent = msg;
    resultBlock.className = "quiz-result " + (pct >= 60 ? "is-good" : "is-needs-review");
  }

  function resetQuiz(quiz, questions, progressDots) {
    quiz.dataset.score = "0";
    quiz.querySelector(".quiz-result").style.display = "none";
    questions.forEach((qEl, qi) => {
      qEl.dataset.answered = "false";
      qEl.style.display = qi === 0 ? "block" : "none";
      qEl.querySelectorAll(".quiz-answer").forEach((b) => {
        b.disabled = false;
        b.classList.remove("is-correct", "is-wrong");
      });
      qEl.querySelector(".quiz-feedback").style.display = "none";
    });
    progressDots.forEach((d, i) => {
      d.classList.toggle("is-active", i === 0);
      d.classList.remove("is-done");
    });
  }

  /* ---------------- Lightbox for content images ---------------- */
  function initLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    document.querySelectorAll(".content-banner img, .slideshow-slide img").forEach((img) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => {
        lightboxImg.src = img.src;
        lightbox.classList.add("is-open");
        document.body.style.overflow = "hidden";
      });
    });
    document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
    function closeLightbox() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  }

  /* ---------------- Nav / TOC drawer toggle ---------------- */
  function initNav() {
    const toggle = document.getElementById("navToggle");
    const drawer = document.getElementById("tocDrawer");
    const scrim = document.getElementById("tocScrim");
    const closeBtn = document.getElementById("tocClose");

    function open() {
      drawer.classList.add("is-open");
      scrim.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
    }
    function close() {
      drawer.classList.remove("is-open");
      scrim.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
    toggle.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    scrim.addEventListener("click", close);
    drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));

    document.getElementById("startReadingBtn").addEventListener("click", () => {
      document.getElementById("section-0")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ---------------- Scroll progress tracking ---------------- */
  function initProgress() {
    const sections = Array.from(document.querySelectorAll(".course-section"));
    const fill = document.getElementById("progressFill");
    const label = document.getElementById("progressLabel");
    const total = sections.length - 1; // exclude intro from "chapter" count

    function update() {
      const scrollY = window.scrollY + window.innerHeight * 0.35;
      let current = 0;
      sections.forEach((s, i) => {
        if (s.offsetTop <= scrollY) current = i;
      });
      const pct = total > 0 ? (current / total) * 100 : 0;
      fill.style.width = pct + "%";
      label.textContent = `Bab ${current} / ${total}`;
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------------- Scroll reveal ---------------- */
  function initReveal() {
    const targets = document.querySelectorAll(".content-block, .content-banner, .slideshow, .quiz-card, .resource-card, .toc-card");
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
    targets.forEach((el) => {
      el.classList.add("reveal-target");
      io.observe(el);
    });
  }

  /* ---------------- Init ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    const main = document.getElementById("courseContent");
    main.innerHTML = COURSE_DATA.map((s, idx) => renderSection(s, idx)).join("");

    renderTOC();
    initNav();
    initSlideshows();
    initQuizzes();
    initLightbox();
    initProgress();
    requestAnimationFrame(initReveal);
  });
})();
