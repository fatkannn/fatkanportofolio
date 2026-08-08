/* ==========================================================================
   SHOWCASE PAGE — nav toggle, icons, Thriftbest slideshow/video,
   Creative Portfolio grid render + load-more + gallery modal
   ========================================================================== */

(function () {
  "use strict";

  const TILES_PER_PAGE = 4;
  let visibleCount = TILES_PER_PAGE;

  /* ---------------- Nav ---------------- */
  function initNav() {
    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");
    if (!toggle || !links) return;

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
  }

  /* ---------------- Thriftbest: Logo Brief slideshow ---------------- */
  function initThriftbestSlideshow() {
    const el = document.getElementById("thriftbestSlideshow");
    if (!el) return;
    const track = el.querySelector(".tb-slideshow-track");
    const prevBtn = el.querySelector(".tb-prev");
    const nextBtn = el.querySelector(".tb-next");
    const counter = el.querySelector(".tb-current");
    const count = parseInt(el.dataset.count, 10);

    function goTo(i) {
      i = Math.max(0, Math.min(count - 1, i));
      el.dataset.index = i;
      track.style.transform = `translateX(-${i * 100}%)`;
      counter.textContent = i + 1;
      prevBtn.disabled = i === 0;
      nextBtn.disabled = i === count - 1;
    }
    prevBtn.addEventListener("click", () => goTo(parseInt(el.dataset.index, 10) - 1));
    nextBtn.addEventListener("click", () => goTo(parseInt(el.dataset.index, 10) + 1));
  }

  /* ---------------- Thriftbest: inline video (click-to-play, no autoplay, no popup) ---------------- */
  function initThriftbestVideo() {
    const thumb = document.getElementById("thriftbestVideoThumb");
    const videoEl = document.getElementById("thriftbestVideoEl");
    if (!thumb || !videoEl) return;

    function playVideo() {
      thumb.style.display = "none";
      videoEl.style.display = "block";
      videoEl.play().catch(() => {});
    }
    thumb.addEventListener("click", playVideo);
    thumb.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); playVideo(); }
    });
  }

  /* ---------------- Creative Portfolio: render grid ---------------- */
  const PLAY_ICON_SC = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';

  function renderCreativeGrid() {
    const grid = document.getElementById("creativeGridSc");
    if (!grid || typeof CREATIVE_DATA_SC === "undefined") return;

    const itemsToShow = CREATIVE_DATA_SC.slice(0, visibleCount);
    grid.innerHTML = itemsToShow.map((c) => `
      <article class="creative-tile is-visible" data-id="${c.id}">
        <div class="creative-thumb">
          <img src="${c.thumb}" alt="" loading="lazy">
          <div class="creative-thumb-overlay">
            <span class="project-play">${PLAY_ICON_SC}</span>
          </div>
          <span class="creative-count-badge">${c.slides.length}</span>
        </div>
        <div class="creative-body">
          <span class="creative-tag">${c.tag}</span>
          <h4 class="creative-title">${c.title}</h4>
        </div>
      </article>
    `).join("");

    grid.querySelectorAll(".creative-tile").forEach((tile) => {
      tile.addEventListener("click", () => {
        const c = CREATIVE_DATA_SC.find((x) => x.id === tile.dataset.id);
        if (c) openGallerySc(c, c.isVideoSet);
      });
    });

    const loadMoreBtn = document.getElementById("creativeLoadMoreBtn");
    if (loadMoreBtn) {
      loadMoreBtn.style.display = visibleCount >= CREATIVE_DATA_SC.length ? "none" : "inline-flex";
    }
  }

  function initLoadMore() {
    const btn = document.getElementById("creativeLoadMoreBtn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      visibleCount += TILES_PER_PAGE;
      renderCreativeGrid();
    });
  }

  /* ---------------- Gallery / Slideshow modal (Creative Portfolio) ---------------- */
  let galleryStateSc = { slides: [], labels: [], index: 0, isVideo: false };

  function openGallerySc(c, isVideoSet) {
    galleryStateSc = {
      slides: c.slides || [c.thumb],
      labels: c.slideLabels || [],
      index: 0,
      isVideo: !!isVideoSet || !!c.isVideoSet
    };
    const modal = document.getElementById("galleryModalSc");
    document.getElementById("galleryModalTitleSc").textContent = c.title;
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    renderGallerySlideSc();
  }

  function renderGallerySlideSc() {
    const imgEl = document.getElementById("galleryImageSc");
    const videoEl = document.getElementById("galleryVideoSc");
    const counter = document.getElementById("galleryCounterSc");
    const label = document.getElementById("galleryLabelSc");
    const { slides, labels, index, isVideo } = galleryStateSc;

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

    counter.textContent = (index + 1) + " / " + slides.length;
    label.textContent = labels[index] || "";

    document.getElementById("galleryPrevSc").disabled = index === 0;
    document.getElementById("galleryNextSc").disabled = index === slides.length - 1;
  }

  function galleryStepSc(delta) {
    const next = galleryStateSc.index + delta;
    if (next < 0 || next >= galleryStateSc.slides.length) return;
    galleryStateSc.index = next;
    renderGallerySlideSc();
  }

  function closeGallerySc() {
    const videoEl = document.getElementById("galleryVideoSc");
    if (videoEl) { videoEl.pause(); videoEl.src = ""; }
    document.getElementById("galleryModalSc").classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function initGalleryModalSc() {
    const modal = document.getElementById("galleryModalSc");
    if (!modal) return;
    document.getElementById("galleryCloseSc").addEventListener("click", closeGallerySc);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeGallerySc(); });
    document.getElementById("galleryPrevSc").addEventListener("click", function () { galleryStepSc(-1); });
    document.getElementById("galleryNextSc").addEventListener("click", function () { galleryStepSc(1); });
    document.addEventListener("keydown", function (e) {
      if (!modal.classList.contains("is-open")) return;
      if (e.key === "Escape") closeGallerySc();
      if (e.key === "ArrowLeft") galleryStepSc(-1);
      if (e.key === "ArrowRight") galleryStepSc(1);
    });
  }

  /* ---------------- Init ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initThriftbestSlideshow();
    initThriftbestVideo();
    renderCreativeGrid();
    initLoadMore();
    initGalleryModalSc();
    renderIcons();
  });
})();
