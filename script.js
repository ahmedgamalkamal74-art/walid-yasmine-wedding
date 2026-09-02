document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // ELEMENTS
  // =========================
  const body = document.body;

  const opening = document.getElementById("opening");
  const quran = document.getElementById("quran");
  const envelopeScene = document.getElementById("envelopeScene");
  const openInvitation = document.getElementById("openInvitation");

  const music = document.getElementById("music");
  const musicBtn = document.getElementById("musicBtn");
  const autoBtn = document.getElementById("autoBtn");

  // =========================
  // OPENING
  // =========================

  body.classList.add("locked");

  // بعد ظهور الآية، ننتقل للظرف
  setTimeout(() => {
    if (quran) quran.classList.add("is-hidden");
    if (envelopeScene) envelopeScene.classList.remove("is-hidden");
  }, 4000);

  // فتح الدعوة
  if (openInvitation) {
    openInvitation.addEventListener("click", async () => {

      if (opening) {
        opening.classList.add("done");
      }

      body.classList.remove("locked");

      // تشغيل الموسيقى بعد تفاعل المستخدم
      if (music) {
        try {
          music.volume = 0.7;
          music.currentTime = 0;
          await music.play();
        } catch (error) {
          console.log("Music could not autoplay:", error);
        }
      }

      if (musicBtn) {
        musicBtn.textContent = "🔊 MUSIC";
      }

      // إظهار العناصر تدريجيًا
      document.querySelectorAll(".reveal").forEach((element, index) => {
        setTimeout(() => {
          element.classList.add("in");
        }, index * 120);
      });

      // تشغيل الـ auto scroll
      setTimeout(() => {
        startAutoScroll();
      }, 1200);
    });
  }

  // =========================
  // MUSIC BUTTON
  // =========================

  if (musicBtn && music) {
    musicBtn.addEventListener("click", async () => {

      if (music.paused) {
        try {
          await music.play();
          musicBtn.textContent = "🔊 MUSIC";
        } catch (error) {
          console.log(error);
        }
      } else {
        music.pause();
        musicBtn.textContent = "🔇 MUSIC";
      }

    });
  }

  // =========================
  // REVEAL ON SCROLL
  // =========================

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });


  // =========================
  // COUNTDOWN
  // =========================

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  // 13 September 2026 - 7:00 PM Egypt
  const weddingDate = new Date("2026-09-13T19:00:00+03:00").getTime();

  function updateCountdown() {

    const now = Date.now();
    let difference = weddingDate - now;

    if (difference <= 0) {
      difference = 0;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) /
      (1000 * 60 * 60)
    );

    const minutes = Math.floor(
      (difference % (1000 * 60 * 60)) /
      (1000 * 60)
    );

    const seconds = Math.floor(
      (difference % (1000 * 60)) /
      1000
    );

    if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  // ==================================================
  // AUTO SCROLL
  // ==================================================

  let autoScrolling = false;
  let autoAnimation = null;
  let stopTimer = null;

  const stopPoints = Array.from(
    document.querySelectorAll("[data-stop]")
  );

  let currentStop = 0;

  function stopAutoScroll() {
    autoScrolling = false;

    if (autoAnimation) {
      cancelAnimationFrame(autoAnimation);
      autoAnimation = null;
    }

    if (stopTimer) {
      clearTimeout(stopTimer);
      stopTimer = null;
    }

    if (autoBtn) {
      autoBtn.textContent = "AUTO SCROLL";
    }
  }

  function scrollSlowlyTo(targetY, duration = 4500, callback) {

    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();

    function animate(currentTime) {

      if (!autoScrolling) return;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easing
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      window.scrollTo(
        0,
        startY + distance * eased
      );

      if (progress < 1) {
        autoAnimation = requestAnimationFrame(animate);
      } else if (callback) {
        callback();
      }
    }

    autoAnimation = requestAnimationFrame(animate);
  }


  function startAutoScroll() {

    if (autoScrolling) return;

    autoScrolling = true;

    if (autoBtn) {
      autoBtn.textContent = "STOP SCROLL";
    }

    currentStop = 0;

    goToNextStop();
  }


  function goToNextStop() {

    if (!autoScrolling) return;

    if (currentStop >= stopPoints.length) {
      autoScrolling = false;

      if (autoBtn) {
        autoBtn.textContent = "AUTO SCROLL";
      }

      return;
    }

    const element = stopPoints[currentStop];

    const rect = element.getBoundingClientRect();

    const targetY =
      window.scrollY +
      rect.top -
      (window.innerHeight * 0.12);

    scrollSlowlyTo(
      Math.max(0, targetY),
      5000,
      () => {

        if (!autoScrolling) return;

        // الوقوف عند كل صورة / مشهد
        stopTimer = setTimeout(() => {

          currentStop++;

          goToNextStop();

        }, 2000);

      }
    );
  }


  if (autoBtn) {

    autoBtn.addEventListener("click", () => {

      if (autoScrolling) {
        stopAutoScroll();
      } else {
        startAutoScroll();
      }

    });

  }


  // لو المستخدم عمل Scroll يدوي
  let manualScrollTimer;

  window.addEventListener(
    "wheel",
    () => {

      if (!autoScrolling) return;

      clearTimeout(manualScrollTimer);

      manualScrollTimer = setTimeout(() => {
        stopAutoScroll();
      }, 100);

    },
    { passive: true }
  );


  // =========================
  // FIREWORKS
  // =========================

  const fireworksContainer =
    document.getElementById("fireworks");

  let fireworksCanvas;
  let fireworksCtx;
  let fireworksRunning = false;

  const rockets = [];
  const particles = [];

  function createFireworksCanvas() {

    if (!fireworksContainer) return;

    fireworksCanvas =
      document.createElement("canvas");

    fireworksCanvas.style.position = "absolute";
    fireworksCanvas.style.inset = "0";
    fireworksCanvas.style.width = "100%";
    fireworksCanvas.style.height = "100%";
    fireworksCanvas.style.pointerEvents = "none";

    fireworksContainer.appendChild(
      fireworksCanvas
    );

    fireworksCtx =
      fireworksCanvas.getContext("2d");

    resizeFireworks();

    window.addEventListener(
      "resize",
      resizeFireworks
    );
  }


  function resizeFireworks() {

    if (!fireworksCanvas) return;

    const rect =
      fireworksContainer.getBoundingClientRect();

    fireworksCanvas.width =
      Math.max(1, Math.floor(rect.width));

    fireworksCanvas.height =
      Math.max(1, Math.floor(rect.height));
  }


  function launchRocket() {

    if (!fireworksCanvas) return;

    const width = fireworksCanvas.width;
    const height = fireworksCanvas.height;

    rockets.push({
      x: width * (0.15 + Math.random() * 0.7),
      y: height + 20,
      targetY: height * (0.15 + Math.random() * 0.38),
      speed: 7 + Math.random() * 3,
      trail: []
    });
  }


  function explodeRocket(rocket) {

    const amount = 70 + Math.floor(Math.random() * 40);

    for (let i = 0; i < amount; i++) {

      const angle =
        Math.PI * 2 * (i / amount);

      const speed =
        1.5 + Math.random() * 5;

      particles.push({
        x: rocket.x,
        y: rocket.y,

        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,

        life: 1,

        decay: 0.008 + Math.random() * 0.012,

        size: 1.2 + Math.random() * 2.5
      });
    }
  }


  function drawFireworks() {

    if (!fireworksCtx || !fireworksCanvas) return;

    const ctx = fireworksCtx;

    ctx.clearRect(
      0,
      0,
      fireworksCanvas.width,
      fireworksCanvas.height
    );


    // Rockets
    for (let i = rockets.length - 1; i >= 0; i--) {

      const rocket = rockets[i];

      rocket.trail.push({
        x: rocket.x,
        y: rocket.y
      });

      if (rocket.trail.length > 8) {
        rocket.trail.shift();
      }

      rocket.y -= rocket.speed;

      ctx.beginPath();
      ctx.arc(
        rocket.x,
        rocket.y,
        2,
        0,
        Math.PI * 2
      );

      ctx.fill();


      if (rocket.trail.length > 1) {

        ctx.beginPath();

        rocket.trail.forEach((point, index) => {

          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }

        });

        ctx.stroke();
      }


      if (rocket.y <= rocket.targetY) {

        explodeRocket(rocket);

        rockets.splice(i, 1);
      }

    }


    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {

      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      p.vy += 0.035;

      p.vx *= 0.985;
      p.vy *= 0.985;

      p.life -= p.decay;


      if (p.life <= 0) {

        particles.splice(i, 1);

        continue;
      }


      ctx.globalAlpha = p.life;

      ctx.beginPath();

      ctx.arc(
        p.x,
        p.y,
        p.size,
        0,
        Math.PI * 2
      );

      ctx.fill();

    }

    ctx.globalAlpha = 1;


    if (fireworksRunning) {
      requestAnimationFrame(drawFireworks);
    }
  }


  function startFireworks() {

    if (!fireworksContainer) return;

    if (fireworksRunning) return;

    fireworksRunning = true;

    createFireworksCanvas();

    drawFireworks();

    // أول صاروخ
    launchRocket();

    // صواريخ متتابعة
    const interval = setInterval(() => {

      if (!fireworksRunning) {
        clearInterval(interval);
        return;
      }

      launchRocket();

    }, 850);

    // مدة العرض
    setTimeout(() => {

      fireworksRunning = false;

      clearInterval(interval);

      rockets.length = 0;
      particles.length = 0;

      if (fireworksCtx && fireworksCanvas) {
        fireworksCtx.clearRect(
          0,
          0,
          fireworksCanvas.width,
          fireworksCanvas.height
        );
      }

    }, 12000);
  }


  // تشغيل الـFireworks عند الوصول لمشهدها
  if (fireworksContainer) {

    const fireworksObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {
              startFireworks();
            }

          });

        },
        {
          threshold: 0.35
        }
      );

    fireworksObserver.observe(
      fireworksContainer
    );
  }


  // =========================
  // MESSAGE FORM
  // =========================

  const messageForm =
    document.getElementById("messageForm");

  if (messageForm) {

    messageForm.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();

        const message =
          document.getElementById("message");

        if (message) {
          message.value = "";
        }

        alert(
          "Thank you for your beautiful message ❤️"
        );

      }
    );

  }


  // =========================
  // INITIAL REVEAL
  // =========================

  setTimeout(() => {

    document
      .querySelectorAll(".reveal")
      .forEach((element, index) => {

        setTimeout(() => {
          element.classList.add("in");
        }, index * 100);

      });

  }, 500);

});
