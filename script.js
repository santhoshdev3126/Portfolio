(function () {
  "use strict";

  // ---------- PAGE LOADER ----------
  window.addEventListener("load", () => {
    const loader = document.getElementById("page-loader");
    if (loader) {
      setTimeout(() => {
        loader.classList.add("hidden");
      }, 1400);
    }
  });

  // ---------- THEME TOGGLE (Dark / Light) ----------
  const themeToggle = document.getElementById("theme-toggle");
  const root = document.documentElement;

  const savedTheme = localStorage.getItem("theme") || "dark";
  root.setAttribute("data-theme", savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  // ---------- COMMUNICATION VIDEO OVERLAY ----------
  const videoOverlay = document.getElementById("video-overlay");
  const videoClose = document.getElementById("video-close");
  const commCards = document.querySelectorAll(".comm-card");
  const videoPanels = document.querySelectorAll(".video-content");

  function openVideo(id) {
    if (!videoOverlay) return;

    videoPanels.forEach((panel) => {
      const match = panel.getAttribute("data-video-panel") === String(id);
      panel.hidden = !match;

      const vid = panel.querySelector("video");
      if (vid && !match) {
        vid.pause();
      }
    });

    videoOverlay.classList.add("open");
    videoOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("overlay-open");
  }

  function closeVideo() {
    if (!videoOverlay) return;

    videoPanels.forEach((panel) => {
      const vid = panel.querySelector("video");
      if (vid) vid.pause();
    });

    videoOverlay.classList.remove("open");
    videoOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overlay-open");
  }

  commCards.forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-video");
      openVideo(id);
    });
  });

  if (videoClose) {
    videoClose.addEventListener("click", closeVideo);
  }

  if (videoOverlay) {
    videoOverlay.addEventListener("click", (e) => {
      if (e.target === videoOverlay) closeVideo();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeVideo();
  });

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  if (isTouch) {
    document.body.classList.add("touch-device");
  }

  // ---------- CUSTOM CURSOR ----------
  const cursor = document.querySelector(".cursor");
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  if (!isTouch && cursor) {
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + "px";
      cursorDot.style.top = mouseY + "px";
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = ringX + "px";
      cursorRing.style.top = ringY + "px";
      const label = cursor.querySelector(".cursor-label");
      if (label) {
        label.style.left = ringX + "px";
        label.style.top = ringY + "px";
      }
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover states
    const interactables = document.querySelectorAll("a, button, .skill-item, .project-card, .comm-card");
    interactables.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        if (el.classList.contains("project-card")) {
          cursor.classList.add("is-view");
        } else {
          cursor.classList.add("is-hover");
        }
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("is-hover", "is-view");
      });
    });
  }

  // ---------- SCROLL PROGRESS ----------
  const progressBar = document.querySelector(".scroll-progress");
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = progress + "%";
      progressBar.setAttribute("aria-valuenow", Math.round(progress));
    }
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // ---------- NAVBAR ----------
  const navbar = document.getElementById("navbar");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navLinkEls = document.querySelectorAll(".nav-link");

  function onScrollNav() {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      navLinks.classList.toggle("open", !open);
      document.body.style.overflow = !open ? "hidden" : "";
    });

    navLinkEls.forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  // Active section highlighting
  const sections = document.querySelectorAll("section[id]");
  function highlightNav() {
    const scrollPos = window.scrollY + 120;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");
      const link = document.querySelector(`.nav-link[data-section="${id}"]`);
      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          navLinkEls.forEach((l) => l.classList.remove("active"));
          link.classList.add("active");
        }
      }
    });
  }
  window.addEventListener("scroll", highlightNav, { passive: true });

  // ---------- MAGNETIC BUTTONS ----------
  if (!isTouch && !prefersReducedMotion) {
    document.querySelectorAll("[data-magnetic]").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0, 0)";
      });
    });
  }

  // ---------- GSAP SETUP ----------
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("GSAP not loaded");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  if (prefersReducedMotion) {
    // Minimal reveals only
    gsap.set([".timeline-card", ".edu-item", ".project-card"], { opacity: 1, y: 0, scale: 1 });
    return;
  }

  // ---------- HERO SCROLL DISSOLVE ----------
  const heroName = document.querySelector(".hero-name");
  if (heroName) {
    gsap.to(heroName, {
      scale: 1.5,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  // Fade out other hero elements
  gsap.to([".hero-sub", ".hero-mission", ".hero-ctas", ".scroll-indicator"], {
    opacity: 0,
    y: -40,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "60% top",
      scrub: true,
    },
  });

  // ---------- ABOUT TEXT REVEAL ----------
  const aboutSub = document.querySelector(".about-sub");
  if (aboutSub) {
    gsap.from(aboutSub, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: aboutSub,
        start: "top 85%",
      },
    });
  }

  // ---------- STAT COUNTERS ----------
  document.querySelectorAll(".stat-block").forEach((block) => {
    const valueEl = block.querySelector(".stat-value");
    const target = parseFloat(block.dataset.count);
    const suffix = block.dataset.suffix || "";
    const isDecimal = target % 1 !== 0;

    ScrollTrigger.create({
      trigger: block,
      start: "top 85%",
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => {
            valueEl.textContent = isDecimal
              ? obj.val.toFixed(1) + suffix
              : Math.round(obj.val) + suffix;
          },
        });
      },
    });
  });

  // ---------- CINEMATIC HORIZONTAL TEXT ----------
  const cinematicTrack = document.querySelector(".cinematic-track");
  if (cinematicTrack) {
    gsap.to(cinematicTrack, {
      x: () => -(cinematicTrack.scrollWidth - window.innerWidth + 100),
      ease: "none",
      scrollTrigger: {
        trigger: ".cinematic-scroll",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  }

  // ---------- SKILLS INTERACTION ----------
  const skillItems = document.querySelectorAll(".skill-item");
  const clusters = document.querySelector(".skills-clusters");
  const tooltip = document.querySelector(".skill-tooltip");

  skillItems.forEach((item) => {
    item.addEventListener("mouseenter", (e) => {
      skillItems.forEach((s) => s.classList.remove("is-active"));
      item.classList.add("is-active");
      if (clusters) clusters.classList.add("is-faded");

      if (tooltip && !isTouch) {
        tooltip.textContent = item.dataset.desc || "";
        tooltip.classList.add("visible");
        const rect = item.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 + "px";
        tooltip.style.top = rect.bottom + 12 + "px";
        tooltip.style.transform = "translateX(-50%)";
      }
    });

    item.addEventListener("mouseleave", () => {
      item.classList.remove("is-active");
      if (clusters) clusters.classList.remove("is-faded");
      if (tooltip) tooltip.classList.remove("visible");
    });
  });

  // ---------- EXPERIENCE TIMELINE ----------
  const timelineLine = document.querySelector(".timeline-line");

  if (timelineLine) {
    gsap.to(timelineLine, {
      height: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: ".timeline",
        start: "top 70%",
        end: "bottom 40%",
        scrub: true,
      },
    });
  }

  // Animate ALL timeline cards
  gsap.utils.toArray(".timeline-card").forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.9,
      delay: i * 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
      },
    });
  });

  // Chart line draw — works for EVERY experience card
  gsap.utils.toArray(".dashboard-viz").forEach((viz) => {
    const line = viz.querySelector(".chart-line");
    if (!line) return;

    ScrollTrigger.create({
      trigger: viz,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 1.6,
          ease: "power2.inOut",
        });
      },
    });
  });

  // ---------- PROJECT CARDS SCROLL SCRUB ----------
  document.querySelectorAll(".project-card").forEach((card) => {
    const tags = card.querySelector(".project-tags");

    gsap.fromTo(
      card,
      { scale: 0.7, borderRadius: "40px" },
      {
        scale: 1.05,
        borderRadius: "0px",
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          end: "center center",
          scrub: true,
        },
      }
    );

    if (tags) {
      gsap.fromTo(
        tags,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top 60%",
            end: "center center",
            scrub: true,
          },
        }
      );
    }

    // 3D tilt + spotlight (desktop only)
    if (!isTouch) {
      const spotlight = card.querySelector(".project-spotlight");
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `scale(${getComputedScale(card)}) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        if (spotlight) {
          spotlight.style.left = x + "px";
          spotlight.style.top = y + "px";
        }
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    }
  });

  function getComputedScale(el) {
    const style = window.getComputedStyle(el);
    const matrix = new DOMMatrixReadOnly(style.transform);
    return matrix.a || 1;
  }

  // ---------- EDUCATION LIST ----------
  gsap.utils.toArray(".edu-item").forEach((item, i) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: i * 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 90%",
      },
    });
  });

  // ---------- FOOTER ZOOM ----------
  const footerZoom = document.querySelector(".footer-zoom");
  if (footerZoom) {
    gsap.fromTo(
      footerZoom,
      { scale: 1.15, opacity: 0.4 },
      {
        scale: 1,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".footer",
          start: "top 90%",
          end: "top 40%",
          scrub: true,
        },
      }
    );
  }

  // ---------- SECTION HEADINGS FADE IN ----------
  gsap.utils.toArray(".section-heading").forEach((heading) => {
    gsap.from(heading, {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: heading,
        start: "top 88%",
      },
    });
  });

})();