document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const quranScreen = document.getElementById("quranScreen");
  const envelopeScreen = document.getElementById("envelopeScreen");
  const envelope = document.getElementById("envelope");
  const openInvitation = document.getElementById("openInvitation");

  const music = document.getElementById("music");
  const musicToggle = document.getElementById("musicToggle");
  const autoScrollBtn = document.getElementById("autoScrollBtn");

  /* =========================
     SETTINGS
  ========================= */

  const MUSIC_VOLUME = 0.7;
  const QURAN_TIME = 4200;
  const PAUSE_TIME = 2000;
  const SCROLL_SPEED = 45;

  let musicPlaying = false;
  let autoScrolling = false;
  let autoScrollStopped = false;

  music.volume = MUSIC_VOLUME;

  /* =========================
     OPENING
  ========================= */

  setTimeout(() => {
    if (quranScreen) {
      quranScreen.classList.add("hide");
    }

    setTimeout(() => {
      if (envelopeScreen) {
        envelopeScreen.classList.add("show");
      }
    }, 700);

  }, QURAN_TIME);


  /* =========================
     OPEN INVITATION
  ========================= */

  function openInvitationNow() {

    if (envelope) {
      envelope.classList.add("opened");
    }

    if (envelopeScreen) {
      envelopeScreen.classList.add("opened");
    }

    body.classList.remove("locked");

    /*
      محاولة تشغيل الموسيقى
      بعد تفاعل المستخدم مسموح للمتصفح
    */

    if (music) {
      music.volume = MUSIC_VOLUME;

      const playPromise = music.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            musicPlaying = true;
            updateMusicButton();
          })
          .catch(() => {
            musicPlaying = false;
            updateMusicButton();
          });
      }
    }

    /*
      إظهار المحتوى تدريجياً
    */

    document.body.classList.add("invitation-open");

    const topbar = document.querySelector(".topbar");

    if (topbar) {
      topbar.classList.add("show");
    }

    setTimeout(() => {
      const hero = document.querySelector(".hero");

      if (hero) {
        hero.classList.add("visible");
      }
    }, 500);

    /*
      النزول لبداية الدعوة
    */

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 1000);
  }


  if (envelope) {
    envelope.addEventListener("click", openInvitationNow);
  }

  if (openInvitation) {
    openInvitation.addEventListener("click", openInvitationNow);
  }


  /* =========================
     MUSIC BUTTON
  ========================= */

  function updateMusicButton() {

    if (!musicToggle) return;

    if (musicPlaying) {
      musicToggle.innerHTML = "♫ MUSIC";
      musicToggle.classList.add("playing");
    } else {
      musicToggle.innerHTML = "♫ PLAY MUSIC";
      musicToggle.classList.remove("playing");
    }
  }


  if (musicToggle) {

    musicToggle.addEventListener("click", async () => {

      if (!music) return;

      if (music.paused) {

        try {

          music.volume = MUSIC_VOLUME;

          await music.play();

          musicPlaying = true;

        } catch (error) {

          console.log("Music could not start:", error);

          musicPlaying = false;
        }

      } else {

        music.pause();

        musicPlaying = false;
      }

      updateMusicButton();
    });
  }


  if (music) {

    music.addEventListener("play", () => {
      musicPlaying = true;
      updateMusicButton();
    });

    music.addEventListener("pause", () => {
      musicPlaying = false;
      updateMusicButton();
    });
  }


  /* =========================
     REVEAL ANIMATIONS
  ========================= */

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("visible");

          }

        });

      },
      {
        threshold: 0.15
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });

  } else {

    revealElements.forEach((element) => {
      element.classList.add("visible");
    });

  }


  /* =========================
     COUNTDOWN
  ========================= */

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  const weddingDate = new Date("2026-09-13T19:00:00+03:00").getTime();


  function updateCountdown() {

    const now = Date.now();

    let difference = weddingDate - now;

    if (difference < 0) {
      difference = 0;
    }

    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
      (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
      (difference / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
      (difference / 1000) % 60
    );


    if (daysEl) {
      daysEl.textContent = String(days).padStart(2, "0");
    }

    if (hoursEl) {
      hoursEl.textContent = String(hours).padStart(2, "0");
    }

    if (minutesEl) {
      minutesEl.textContent = String(minutes).padStart(2, "0");
    }

    if (secondsEl) {
      secondsEl.textContent = String(seconds).padStart(2, "0");
    }
  }


  updateCountdown();

  setInterval(updateCountdown, 1000);


  /* =========================
     FIREWORKS
  ========================= */

  const ringsSection = document.querySelector(".rings");

  let fireworksStarted = false;


  function createFirework() {

    const container =
      document.querySelector(".fireworks") ||
      document.querySelector(".rings");

    if (!container) return;

    const firework = document.createElement("div");

    firework.className = "firework";

    const x = Math.random() * 90 + 5;
    const y = Math.random() * 45 + 5;

    firework.style.left = x + "%";
    firework.style.top = y + "%";

    container.appendChild(firework);

    setTimeout(() => {
      firework.remove();
    }, 1800);
  }


  function startFireworks() {

    if (fireworksStarted) return;

    fireworksStarted = true;

    for (let i = 0; i < 8; i++) {

      setTimeout(() => {
        createFirework();
      }, i * 350);

    }
  }


  if (ringsSection && "IntersectionObserver" in window) {

    const fireworkObserver = new IntersectionObserver(
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

    fireworkObserver.observe(ringsSection);
  }


  /* =========================
     AUTO SCROLL
  ========================= */

  const sections = Array.from(
    document.querySelectorAll(
      "[data-stop], section, .scene"
    )
  );


  function sleep(ms) {

    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

  }


  function getScrollTargets() {

    const targets = [];

    sections.forEach((section) => {

      const rect = section.getBoundingClientRect();

      const absoluteTop =
        window.scrollY + rect.top;

      if (
        !targets.some(
          (value) => Math.abs(value - absoluteTop) < 100
        )
      ) {
        targets.push(absoluteTop);
      }

    });

    return targets.sort((a, b) => a - b);
  }


  function smoothScrollTo(target) {

    return new Promise((resolve) => {

      const start = window.scrollY;

      const distance = target - start;

      if (Math.abs(distance) < 5) {
        resolve();
        return;
      }

      const duration =
        Math.min(
          10000,
          Math.max(
            3000,
            Math.abs(distance) * SCROLL_SPEED
          )
        );

      const startTime = performance.now();


      function step(currentTime) {

        if (autoScrollStopped) {
          resolve();
          return;
        }

        const elapsed =
          currentTime - startTime;

        let progress =
          Math.min(elapsed / duration, 1);

        /*
          ease-in-out
        */

        progress =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;


        window.scrollTo(
          0,
          start + distance * progress
        );


        if (progress < 1) {

          requestAnimationFrame(step);

        } else {

          resolve();

        }

      }


      requestAnimationFrame(step);

    });
  }


  async function startAutoScroll() {

    if (autoScrolling) return;

    autoScrolling = true;
    autoScrollStopped = false;

    if (autoScrollBtn) {
      autoScrollBtn.innerHTML = "STOP AUTO SCROLL";
      autoScrollBtn.classList.add("active");
    }


    const targets = getScrollTargets();

    for (let i = 0; i < targets.length; i++) {

      if (autoScrollStopped) break;

      const target = targets[i];

      if (target <= window.scrollY + 100) {
        continue;
      }

      await smoothScrollTo(target);

      if (autoScrollStopped) break;

      await sleep(PAUSE_TIME);
    }


    autoScrolling = false;

    if (autoScrollBtn) {
      autoScrollBtn.innerHTML = "AUTO SCROLL";
      autoScrollBtn.classList.remove("active");
    }
  }


  function stopAutoScroll() {

    if (!autoScrolling) return;

    autoScrollStopped = true;
    autoScrolling = false;

    if (autoScrollBtn) {
      autoScrollBtn.innerHTML = "AUTO SCROLL";
      autoScrollBtn.classList.remove("active");
    }
  }


  if (autoScrollBtn) {

    autoScrollBtn.addEventListener("click", () => {

      if (autoScrolling) {
        stopAutoScroll();
      } else {
        startAutoScroll();
      }

    });
  }


  /* =========================
     STOP AUTO SCROLL WHEN USER
     MANUALLY SCROLLS
  ========================= */

  let manualScrollTimer = null;

  function detectManualScroll() {

    if (!autoScrolling) return;

    clearTimeout(manualScrollTimer);

    manualScrollTimer = setTimeout(() => {

      if (autoScrolling) {
        stopAutoScroll();
      }

    }, 100);
  }


  window.addEventListener(
    "wheel",
    detectManualScroll,
    {
      passive: true
    }
  );


  window.addEventListener(
    "touchmove",
    detectManualScroll,
    {
      passive: true
    }
  );


  /* =========================
     GUEST MESSAGE
  ========================= */

  const guestForm =
    document.querySelector(".guest-form") ||
    document.querySelector("form");


  if (guestForm) {

    guestForm.addEventListener("submit", (event) => {

      event.preventDefault();

      const button =
        guestForm.querySelector(
          'button[type="submit"]'
        );

      if (button) {

        const originalText =
          button.textContent;

        button.textContent =
          "THANK YOU ♥";

        button.disabled = true;


        setTimeout(() => {

          button.textContent =
            originalText;

          button.disabled = false;

          guestForm.reset();

        }, 2500);
      }

    });
  }


  /* =========================
     INITIAL STATE
  ========================= */

  updateMusicButton();

});
