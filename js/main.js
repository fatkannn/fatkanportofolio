/* ==========================================================================
   PORTFOLIO — INTERACTIONS
   ========================================================================== */

(function () {
  "use strict";

  const PLAY_ICON = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;

  /* ---------------- Render: Skills ---------------- */
  function renderSkills() {
    const grid = document.getElementById("skillsGrid");
    if (!grid) return;
    grid.innerHTML = SKILLS_DATA.map((s) => `
      <div class="skill-card">
        <span class="skill-icon"><span class="icon" data-icon="${s.icon}"></span></span>
        <span class="skill-name">${s.name}</span>
      </div>
    `).join("");
    renderIcons(grid);
  }

  /* ---------------- Render: Featured Projects (logo grid) ---------------- */
  function renderProjects() {
    const grid = document.getElementById("logoGrid");
    if (!grid) return;

    grid.innerHTML = FEATURED_DATA.map((p) => `
      <a class="logo-card" href="${p.href}" data-id="${p.id}">
        <img src="${p.logo}" alt="${p.client} logo" loading="lazy">
        <span class="logo-card-name">${p.client}</span>
      </a>
    `).join("");
  }

  function openProject(id) {
    const p = FEATURED_DATA.find((x) => x.id === id);
    if (!p) return;

    if (p.type === "video") {
      openLightbox(p);
    } else if (p.type === "gallery") {
      openGallery(p);
    } else if (p.type === "interactive" && p.embedSrc) {
      openModuleModal(p);
    } else if (p.type === "externalset") {
      openExternalSet(p);
    } else if (p.type === "showcase") {
      openShowcase(p);
    } else if (p.type === "link" && p.href) {
      window.location.href = p.href;
    }
  }

  /* ---------------- Showcase (no downloadable asset yet) ---------------- */
  function openShowcase(p) {
    const modal = document.getElementById("showcaseModal");
    document.getElementById("showcaseImage").src = p.thumb;
    document.getElementById("showcaseClient").textContent = p.client;
    document.getElementById("showcaseType").textContent = p.projectType;
    document.getElementById("showcaseTitle").textContent = p.title;
    document.getElementById("showcaseDesc").textContent = p.desc;
    document.getElementById("showcaseTags").innerHTML = p.tags.map((t) => `<span class="project-tag">${t}</span>`).join("");
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeShowcase() {
    document.getElementById("showcaseModal").classList.remove("is-open");
    document.body.style.overflow = "";
  }

  /* ---------------- External Set (multiple external links, e.g. Lumi modules) ---------------- */
  function openExternalSet(p) {
    const modal = document.getElementById("showcaseModal");
    document.getElementById("showcaseImage").src = p.thumb;
    document.getElementById("showcaseClient").textContent = p.client;
    document.getElementById("showcaseType").textContent = p.projectType;
    document.getElementById("showcaseTitle").textContent = p.title;
    document.getElementById("showcaseDesc").textContent = p.desc;
    document.getElementById("showcaseTags").innerHTML = p.tags.map((t) => `<span class="project-tag">${t}</span>`).join("");

    const linksHtml = (p.items || []).map((item) =>
      `<a href="${item.url}" target="_blank" rel="noopener" class="showcase-link-item">
        <span>${item.title}</span>
        <span class="icon" data-icon="chevron-right"></span>
      </a>`
    ).join("");
    document.getElementById("showcaseLinks").innerHTML = linksHtml;
    renderIcons(document.getElementById("showcaseLinks"));

    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  /* ---------------- Filters (legacy, unused now but kept harmless) ---------------- */
  function initFilters() {
    const chips = document.querySelectorAll(".filter-chip");
    if (chips.length === 0) return;
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        const filter = chip.dataset.filter;
        document.querySelectorAll(".project-card").forEach((card) => {
          const show = filter === "all" || card.dataset.category === filter;
          card.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  /* ---------------- Gallery / Slideshow (images or videos) ---------------- */
  let galleryState = { slides: [], labels: [], index: 0, isVideo: false };

  function openGallery(p, isVideoSet) {
    galleryState = {
      slides: p.slides || [p.thumb],
      labels: p.slideLabels || [],
      index: 0,
      isVideo: !!isVideoSet || !!p.isVideoSet
    };
    const modal = document.getElementById("galleryModal");
    const title = document.getElementById("galleryModalTitle");
    title.textContent = p.title;
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    renderGallerySlide();
  }

  function renderGallerySlide() {
    const imgEl = document.getElementById("galleryImage");
    const videoEl = document.getElementById("galleryVideo");
    const counter = document.getElementById("galleryCounter");
    const label = document.getElementById("galleryLabel");
    const { slides, labels, index, isVideo } = galleryState;

    if (isVideo) {
      imgEl.style.display = "none";
      videoEl.style.display = "block";
      videoEl.src = slides[index];
      videoEl.play().catch(() => {});
    } else {
      videoEl.style.display = "none";
      videoEl.pause();
      videoEl.src = "";
      imgEl.style.display = "block";
      imgEl.src = slides[index];
    }

    counter.textContent = `${index + 1} / ${slides.length}`;
    label.textContent = labels[index] || "";

    document.getElementById("galleryPrev").disabled = index === 0;
    document.getElementById("galleryNext").disabled = index === slides.length - 1;
  }

  function galleryStep(delta) {
    const next = galleryState.index + delta;
    if (next < 0 || next >= galleryState.slides.length) return;
    galleryState.index = next;
    renderGallerySlide();
  }

  function closeGallery() {
    const videoEl = document.getElementById("galleryVideo");
    videoEl.pause();
    videoEl.src = "";
    document.getElementById("galleryModal").classList.remove("is-open");
    document.body.style.overflow = "";
  }

  /* ---------------- Video Lightbox ---------------- */
  function openLightbox(p) {
    const lightbox = document.getElementById("lightbox");
    const video = document.getElementById("lightboxVideo");
    const title = document.getElementById("lightboxTitle");
    const meta = document.getElementById("lightboxMeta");

    video.src = p.src;
    title.textContent = p.title;
    meta.textContent = p.tags.join(" · ");

    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    video.play().catch(() => {});
  }

  function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    const video = document.getElementById("lightboxVideo");
    video.pause();
    video.src = "";
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  /* ---------------- Module Modal ---------------- */
  function openModuleModal(p) {
    const modal = document.getElementById("moduleModal");
    const frame = document.getElementById("moduleModalFrame");
    const title = document.getElementById("moduleModalTitle");

    frame.src = p.embedSrc;
    title.textContent = p.title;
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeModuleModal() {
    const modal = document.getElementById("moduleModal");
    const frame = document.getElementById("moduleModalFrame");
    frame.src = "";
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  /* ---------------- Render: Timeline ---------------- */
  function renderTimeline() {
    const timeline = document.getElementById("timeline");
    if (!timeline) return;

    timeline.innerHTML = EXPERIENCE_DATA.map((e) => `
      <div class="timeline-item reveal">
        <div class="timeline-logo">${e.initials}</div>
        <div class="timeline-content">
          <span class="timeline-date">${e.date}</span>
          <h3 class="timeline-role">${e.role}</h3>
          <p class="timeline-org">${e.org}</p>
          <p class="timeline-desc">${e.desc}</p>
        </div>
      </div>
    `).join("");
  }

  /* ---------------- Nav ---------------- */
  function initNav() {
    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");

    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
      });
    });

    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
      navbar.style.boxShadow = window.scrollY > 8 ? "0 1px 0 rgba(15,23,42,0.06)" : "none";
    });
  }

  /* ---------------- Contact Form (client-side only, no backend) ---------------- */
  function initForm() {
    const form = document.getElementById("contactForm");
    const note = document.getElementById("formNote");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("cf-name").value.trim();
      const email = document.getElementById("cf-email").value.trim();
      const message = document.getElementById("cf-message").value.trim();

      const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:fatkanwork@gmail.com?subject=${subject}&body=${body}`;

      note.textContent = "Opening your email client...";
    });
  }

  /* ---------------- Scroll Reveal ---------------- */
  function initReveal() {
    const targets = document.querySelectorAll(".reveal, .skill-card, .project-card, .creative-tile, .timeline-item");
    if (!("IntersectionObserver" in window) || targets.length === 0) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    targets.forEach((el) => io.observe(el));
  }

  /* ---------------- Init ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderSkills();
    renderProjects();
    renderTimeline();
    initFilters();
    initNav();
    initForm();

    document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
    document.getElementById("lightbox").addEventListener("click", (e) => {
      if (e.target.id === "lightbox") closeLightbox();
    });
    document.getElementById("moduleModalClose").addEventListener("click", closeModuleModal);

    document.getElementById("showcaseClose").addEventListener("click", closeShowcase);
    document.getElementById("showcaseModal").addEventListener("click", (e) => {
      if (e.target.id === "showcaseModal") closeShowcase();
    });

    document.getElementById("galleryClose").addEventListener("click", closeGallery);
    document.getElementById("galleryModal").addEventListener("click", (e) => {
      if (e.target.id === "galleryModal") closeGallery();
    });
    document.getElementById("galleryPrev").addEventListener("click", () => galleryStep(-1));
    document.getElementById("galleryNext").addEventListener("click", () => galleryStep(1));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeLightbox(); closeModuleModal(); closeGallery(); closeShowcase(); }
      if (document.getElementById("galleryModal").classList.contains("is-open")) {
        if (e.key === "ArrowLeft") galleryStep(-1);
        if (e.key === "ArrowRight") galleryStep(1);
      }
    });

    renderIcons();
    requestAnimationFrame(initReveal);
  });
})();
