(function () {
  "use strict";

  /* =========================================================
     1) COUNTDOWN — target: 28th August 2026, 9:58 AM IST (+05:30)
     ========================================================= */
  var TARGET = new Date("2026-08-28T09:58:00+05:30").getTime();

  function getTimeLeft() {
    var diff = Math.max(0, TARGET - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60)
    };
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function tickCountdown() {
    var t = getTimeLeft();
    var days = document.getElementById("cd-days");
    var hours = document.getElementById("cd-hours");
    var minutes = document.getElementById("cd-minutes");
    var seconds = document.getElementById("cd-seconds");
    if (days) days.textContent = pad2(t.days);
    if (hours) hours.textContent = pad2(t.hours);
    if (minutes) minutes.textContent = pad2(t.minutes);
    if (seconds) seconds.textContent = pad2(t.seconds);
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* =========================================================
     2) SCROLL REVEAL — fades/slides .reveal elements into view
     ========================================================= */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !items.length) {
      items.forEach(function (el) {
        el.classList.remove("opacity-0", "translate-y-8");
        el.classList.add("opacity-100", "translate-y-0");
      });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var delay = parseInt(el.getAttribute("data-delay") || "0", 10);
            setTimeout(function () {
              el.classList.remove("opacity-0", "translate-y-8");
              el.classList.add("opacity-100", "translate-y-0");
            }, delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* =========================================================
     3) FLOWER-EMOJI BURST (replaces confetti on scratch reveal)
     ========================================================= */
  var FLOWER_EMOJIS = ["🌸", "🌿", "🌼", "🌷", "💐", "🌺", "❀", "🎉", "✨", "🎊"];

  function spawnEmojiCluster(x, y) {
    var count = 10;
    for (var i = 0; i < count; i++) {
      (function () {
        var el = document.createElement("span");
        el.className = "emoji-burst-piece";
        el.textContent = FLOWER_EMOJIS[Math.floor(Math.random() * FLOWER_EMOJIS.length)];
        el.style.left = x + "px";
        el.style.top = y + "px";
        el.style.fontSize = 16 + Math.random() * 18 + "px";

        var angle = Math.random() * Math.PI * 2;
        var dist = 60 + Math.random() * 110;
        var dx = Math.cos(angle) * dist;
        var dy = Math.sin(angle) * dist - 40; // bias upward like a burst
        el.style.setProperty("--dx", dx + "px");
        el.style.setProperty("--dy", dy + "px");
        el.style.setProperty("--rot", Math.random() * 360 - 180 + "deg");

        document.body.appendChild(el);
        setTimeout(function () {
          el.remove();
        }, 1200);
      })();
    }
  }

  function burstFlowers(rect) {
    var points = [
      { x: rect.left + rect.width * 0.2, y: rect.top + rect.height * 0.4 },
      { x: rect.left + rect.width * 0.5, y: rect.top + rect.height * 0.3 },
      { x: rect.left + rect.width * 0.8, y: rect.top + rect.height * 0.4 }
    ];
    points.forEach(function (p) {
      spawnEmojiCluster(p.x, p.y);
    });
    setTimeout(function () {
      spawnEmojiCluster(rect.left + rect.width * 0.5, rect.top + rect.height * 0.5);
    }, 250);
  }

  /* =========================================================
     4) SCRATCH-TO-REVEAL CARD
     ========================================================= */
  function initScratchCard() {
    var canvas = document.getElementById("scratch-canvas");
    var card = document.getElementById("scratch-card");
    if (!canvas || !card) return function () {};

    var ctx = canvas.getContext("2d");
    var revealed = false;
    var drawing = false;

    function sizeCanvas() {
      var rect = card.getBoundingClientRect();
      var dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      paintCoating(rect.width, rect.height);
    }

    function paintCoating(w, h) {
      var gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, "#d98ba1");
      gradient.addColorStop(0.5, "#c75a85");
      gradient.addColorStop(1, "#8b3a5a");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "#fff7e8";
      ctx.font = '600 14px "Cinzel", serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("\u2726  SCRATCH TO REVEAL  \u2726", w / 2, h / 2);
    }

    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    function erase(clientX, clientY) {
      var rect = canvas.getBoundingClientRect();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(clientX - rect.left, clientY - rect.top, 28, 0, Math.PI * 2);
      ctx.fill();
    }

    function checkRevealed() {
      if (revealed) return;
      var w = canvas.width;
      var h = canvas.height;
      var data = ctx.getImageData(0, 0, w, h).data;
      var cleared = 0;
      for (var i = 3; i < data.length; i += 160) {
        if (data[i] < 60) cleared++;
      }
      var samples = data.length / 160;
      if (cleared / samples > 0.45) {
        revealed = true;
        canvas.style.transition = "opacity 0.6s ease-out";
        canvas.style.opacity = "0";
        canvas.style.pointerEvents = "none";
        burstFlowers(card.getBoundingClientRect());
      }
    }

    canvas.addEventListener("pointerdown", function (e) {
      if (revealed) return;
      drawing = true;
      canvas.setPointerCapture(e.pointerId);
      erase(e.clientX, e.clientY);
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!drawing || revealed) return;
      e.preventDefault();
      erase(e.clientX, e.clientY);
    });
    canvas.addEventListener("pointerup", function () {
      drawing = false;
      checkRevealed();
    });
    canvas.addEventListener("pointercancel", function () {
      drawing = false;
    });

    // Exposed so the page can re-measure once the card's container
    // (display:none until the envelope opens) becomes visible.
    return sizeCanvas;
  }

  /* =========================================================
     5) FLOWER RAIN — flowers fall from the top of the screen when the
        envelope is tapped open (replaces the old party-popper burst)
     ========================================================= */
  var RAIN_FLOWER_EMOJIS = ["🌸", "🌺", "🌼", "🌷", "💐", "❀", "🌿"];

  function rainFlowers() {
    var isMobile = window.innerWidth < 600;
    var count = isMobile ? 22 : 40;

    for (var i = 0; i < count; i++) {
      (function () {
        var delay = Math.random() * 900;
        setTimeout(function () {
          var el = document.createElement("span");
          el.className = "falling-flower";
          el.textContent = RAIN_FLOWER_EMOJIS[Math.floor(Math.random() * RAIN_FLOWER_EMOJIS.length)];
          var startX = Math.random() * 100; // vw
          var size = 16 + Math.random() * 20;
          var duration = 2600 + Math.random() * 2200;
          var sway = Math.random() * 90 - 45; // px drift while falling

          el.style.left = startX + "vw";
          el.style.fontSize = size + "px";
          el.style.setProperty("--sway", sway + "px");
          el.style.animationDuration = duration + "ms";

          document.body.appendChild(el);
          setTimeout(function () {
            el.remove();
          }, duration + 100);
        }, delay);
      })();
    }
  }

  /* =========================================================
     6) INTRO / ENVELOPE-OPEN TAP SCREEN
     ========================================================= */
  function initIntro(onOpenExtra) {
    var introScreen = document.getElementById("intro-screen");
    var poster = document.getElementById("intro-poster");
    var videoWrap = document.getElementById("intro-video-wrap");
    var video = document.getElementById("intro-video");
    var tapHint = document.getElementById("tap-hint");
    var mainContent = document.getElementById("main-content");
    var musicToggle = document.getElementById("music-toggle");
    var audio = document.getElementById("bg-audio");
    var opened = false;
    var settled = false;

    function openInvitation() {
      // Kept for the "no video source" fallback path — same soft crossfade
      // as before, just used when there's no video to fade out first.
      if (opened) return;
      opened = true;

      mainContent.style.display = "block";
      mainContent.style.opacity = "0";
      void mainContent.offsetHeight;
      mainContent.style.transition = "opacity 0.8s ease";
      requestAnimationFrame(function () {
        mainContent.style.opacity = "1";
      });

      musicToggle.classList.remove("hidden");
      if (audio) {
        audio.volume = 0.45;
        audio.play().catch(function () {});
      }
      initReveal();

      setTimeout(function () {
        introScreen.style.display = "none";
      }, 900);

      if (typeof onOpenExtra === "function") onOpenExtra();
    }

    function fadeOutVideoThenRevealHero() {
      if (opened) return;
      opened = true;

      // 1) Smoothly fade the video out over 1s
      videoWrap.style.transition = "opacity 1s ease";
      videoWrap.style.opacity = "0";

      setTimeout(function () {
        if (video) video.pause();
        videoWrap.style.display = "none";
        introScreen.style.display = "none";

        // 2) Fade the invitation in over 2s — homehero.jpg (the hero
        //    section) is the first thing on the page, so it's what
        //    fades into view.
        mainContent.style.display = "block";
        mainContent.style.opacity = "0";
        void mainContent.offsetHeight; // force reflow so the transition runs
        mainContent.style.transition = "opacity 0.8s ease";
        requestAnimationFrame(function () {
          mainContent.style.opacity = "1";
        });

        musicToggle.classList.remove("hidden");
        if (audio) {
          audio.volume = 0.45;
          audio.play().catch(function () {});
        }
        initReveal();

        if (typeof onOpenExtra === "function") onOpenExtra();
      }, 1000);
    }

    introScreen.addEventListener("click", function onTap() {
      introScreen.removeEventListener("click", onTap);
      if (tapHint) tapHint.style.display = "none";
      if (navigator.vibrate) navigator.vibrate(50);

      // 1) The flap lifts open, hinged at the top — same mechanic as the
      //    reference project's envelope-flap rotateX animation.
      poster.classList.add("is-open");

      // 2) The video "card" slides up out of the envelope, just like the
      //    reference project's card-container.
      videoWrap.classList.add("is-open");

      var hasSource = video && video.querySelector("source") && video.querySelector("source").getAttribute("src");
      if (hasSource) {
        var playPromise = video.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch(function () {
            video.muted = true;
            video.play().catch(function () {});
          });
        }
        video.addEventListener(
          "ended",
          function onEnded() {
            video.removeEventListener("ended", onEnded);
            fadeOutVideoThenRevealHero();
          },
          { once: true }
        );
      }

      // 3) Confetti burst, same timing as the reference project
      setTimeout(rainFlowers, 400);

      // Safety net: open the invitation even if the video never fires
      // "ended" (missing file, autoplay blocked, etc.)
      setTimeout(function () {
        if (opened) return;
        if (hasSource) {
          fadeOutVideoThenRevealHero();
        } else {
          openInvitation();
        }
      }, hasSource ? 9000 : 1700);
    });

    musicToggle.addEventListener("click", function () {
      var onIcon = document.getElementById("icon-volume-on");
      var offIcon = document.getElementById("icon-volume-off");
      if (!audio) return;
      if (audio.paused) {
        audio.play().catch(function () {});
        onIcon.classList.remove("hidden");
        offIcon.classList.add("hidden");
        musicToggle.setAttribute("aria-label", "Mute background music");
      } else {
        audio.pause();
        onIcon.classList.add("hidden");
        offIcon.classList.remove("hidden");
        musicToggle.setAttribute("aria-label", "Unmute background music");
      }
    });
  }

  /* =========================================================
     7) ENGAGEMENT GALLERY LIGHTBOX (no grid — opens straight to
        the first photo, navigated with prev/next)
     ========================================================= */
  function initGallery() {
    var openBtn = document.getElementById("open-gallery-btn");
    if (!openBtn) return;

    // 1.jpg first, then every other photo in the gallery/ folder.
    var files = [
      "1.jpg",
      "2.jpg",
      "3.jpg",
      "4.jpg",
      "5.jpg",
      "6.jpg",
      "7.jpg",
      "8.jpg",
      "9.jpg",
      "10.jpg",
      "11.jpg",
      "12.png",
      "13.jpg"
    ];

    function toUrl(name) {
      return "gallery/" + encodeURIComponent(name);
    }

    // Open straight into the single-photo lightbox (one image at a time,
    // navigated with prev/next) — there's no grid to show first.
    openBtn.addEventListener("click", function () {
      openLightbox(0);
    });

    // ---- Lightbox ----
    var lightbox = document.getElementById("gallery-lightbox");
    var lightboxImg = document.getElementById("gallery-lightbox-img");
    var lightboxCounter = document.getElementById("gallery-lightbox-counter");
    var lightboxClose = document.getElementById("gallery-lightbox-close");
    var lightboxPrev = document.getElementById("gallery-lightbox-prev");
    var lightboxNext = document.getElementById("gallery-lightbox-next");
    var current = 0;

    function openLightbox(index) {
      current = index;
      updateLightbox();
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
    function updateLightbox() {
      lightboxImg.src = toUrl(files[current]);
      lightboxImg.alt = "Engagement photo " + (current + 1);
      lightboxCounter.textContent = current + 1 + " / " + files.length;
    }
    function closeLightbox() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    }
    function nextPhoto() {
      current = (current + 1) % files.length;
      updateLightbox();
    }
    function prevPhoto() {
      current = (current - 1 + files.length) % files.length;
      updateLightbox();
    }

    lightboxClose.addEventListener("click", closeLightbox);
    lightboxNext.addEventListener("click", nextPhoto);
    lightboxPrev.addEventListener("click", prevPhoto);

    document.addEventListener("keydown", function (e) {
      if (lightbox.classList.contains("is-open")) {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") nextPhoto();
        if (e.key === "ArrowLeft") prevPhoto();
      }
    });

    var touchStartX = null;
    lightbox.addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.changedTouches[0].clientX;
      },
      { passive: true }
    );
    lightbox.addEventListener(
      "touchend",
      function (e) {
        if (touchStartX === null) return;
        var dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) {
          if (dx < 0) nextPhoto();
          else prevPhoto();
        }
        touchStartX = null;
      },
      { passive: true }
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    var resizeScratchCard = initScratchCard();
    initIntro(resizeScratchCard);
    initGallery();
  });
})();
