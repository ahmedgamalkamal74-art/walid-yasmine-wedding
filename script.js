document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const opening = document.getElementById("opening");
  const quran = document.getElementById("quran");
  const envelopeScene = document.getElementById("envelopeScene");
  const openInvitation = document.getElementById("openInvitation");

  const music = document.getElementById("music");
  const musicBtn = document.getElementById("musicBtn");
  const autoBtn = document.getElementById("autoBtn");

  /* =========================
     SETTINGS
  ========================= */

  const MUSIC_VOLUME = 0.7;
  const QURAN_DURATION = 4000;
  const PAUSE_BETWEEN_SCENES = 2000;

  let musicPlaying = false;
  let autoScrolling = false;
  let stopAutoScroll = false;


  /* =========================
     QURAN → ENVELOPE
  ========================= */

  setTimeout(() => {
    if (!quran || !envelopeScene) return;

    quran.style.opacity = "0";
    quran.style.visibility = "hidden";
    quran.style.pointerEvents = "none";

    envelopeScene.classList.remove("is-hidden");

    envelopeScene.style.opacity = "0";

    requestAnimationFrame(() => {
      envelopeScene.style.opacity = "1";
    });

  }, QURAN_DURATION);


  /* =========================
     OPEN INVITATION
  ========================= */

  function openInvitationNow() {

    if (openInvitation) {
      openInvitation.classList.add("opened");
    }

    if (envelopeScene) {
      envelopeScene.style.opacity = "0";
      envelopeScene.style.visibility = "hidden";
      envelopeScene.style.pointerEvents = "none";
    }

    if (opening) {
      setTimeout(() => {
        opening.classList.add("done");
      }, 700);
    }

    body.classList.remove("locked");

    /* MUSIC */

    if (music) {
      music.volume = MUSIC_VOLUME;

      music.play()
        .then(() => {
          musicPlaying = true;
          updateMusicButton();
        })
        .catch(() => {
          console.log("Music autoplay was blocked.");
        });
    }

    /* SHOW TOP BAR */

    const topbar = document.querySelector(".topbar");

    if (topbar) {
      topbar.classList.add("visible");
    }

    /* REVEAL HERO */

    setTimeout(() => {
      document.querySelectorAll(".reveal").forEach((el) => {
        el.classList.add("in");
      });
    }, 900);
  }


  if (openInvitation) {
    openInvitation.addEventListener("click", openInvitationNow);
  }


  /* =========================
     MUSIC
  ========================= */

  function updateMusicButton() {

    if (!musicBtn) return;

    if (musicPlaying) {
      musicBtn.innerHTML = "♫ <span>إيقاف الموسيقى</span>";
    } else {
      musicBtn.innerHTML = "♫ <span>الموسيقى</span>";
    }
  }


  if (musicBtn) {

    musicBtn.addEventListener("click", async () => {

      if (!music) return;

      if (music.paused) {

        try {
          music.volume = MUSIC_VOLUME;
          await music.play();

          musicPlaying = true;

        } catch (error) {
          console.log(error);
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
     REVEAL ON SCROLL
  ========================= */

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
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

    revealElements.forEach((el) => {
      observer.observe(el);
    });

  } else {

    revealElements.forEach((el) => {
      el.classList.add("in");
    });
  }


  /* =========================
     COUNTDOWN
  ========================= */

  const days = document.getElementById("days");
  const hours = document.getElementById("hours");
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");

  const weddingDate =
    new Date("2026-09-13T19:00:00+03:00").getTime();


  function updateCountdown() {

    const now = Date.now();

    let difference = weddingDate - now;

    if (difference < 0) {
      difference = 0;
    }

    const d = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    );

    const h = Math.floor(
      (difference / (1000 * 60 * 60)) % 24
    );

    const m = Math.floor(
      (difference / (1000 * 60)) % 60
    );

    const s = Math.floor(
      (difference / 1000) % 60
    );


    if (days) {
      days.textContent = String(d).padStart(2, "0");
    }

    if (hours) {
      hours.textContent = String(h).padStart(2, "0");
    }

    if (minutes) {
      minutes.textContent = String(m).padStart(2, "0");
    }

    if (seconds) {
      seconds.textContent = String(s).padStart(2, "0");
    }
  }


  updateCountdown();

  setInterval(updateCountdown, 1000);


  /* =========================
     FIREWORKS
  ========================= */

  const ringsScene = document.getElementById("ringsScene");
  const fireworks = document.getElementById("fireworks");

  let fireworksStarted = false;


  function startFireworks() {

    if (fireworksStarted || !fireworks) return;

    fireworksStarted = true;

    fireworks.classList.add("show");

    const bursts = fireworks.querySelectorAll(".burst");

    bursts.forEach((burst, index) => {

      burst.style.animationDelay =
        `${index * 0.25}s`;

    });


    /* محاولة تشغيل صوت الألعاب النارية */

    const fireworkSound =
      document.getElementById("fireworkSound");

    if (fireworkSound) {

      fireworkSound.volume = 0.35;

      fireworkSound.currentTime = 0;

      fireworkSound.play().catch(() => {});
    }
  }


  if (ringsScene && "IntersectionObserver" in window) {

    const ringObserver = new IntersectionObserver(
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

    ringObserver.observe(ringsScene);
  }


  /* =========================
     AUTO SCROLL
  ========================= */

  const scenes = Array.from(
    document.querySelectorAll("[data-stop]")
  );


  function sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }


  function scrollToPosition(target) {

    return new Promise(resolve => {

      const start = window.scrollY;
      const distance = target - start;

      const duration =
        Math.max(
          3000,
          Math.min(8500, Math.abs(distance) * 12)
        );

      const startTime = performance.now();


      function animate(currentTime) {

        if (stopAutoScroll) {
          resolve();
          return;
        }

        const elapsed =
          currentTime - startTime;

        let progress =
          Math.min(elapsed / duration, 1);


        /* Smooth easing */

        progress =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(
                -2 * progress + 2,
                2
              ) / 2;


        window.scrollTo(
          0,
          start + distance * progress
        );


        if (progress < 1) {

          requestAnimationFrame(animate);

        } else {

          resolve();
        }
      }


      requestAnimationFrame(animate);
    });
  }


  async function startAutoScroll() {

    if (autoScrolling) return;

    autoScrolling = true;
    stopAutoScroll = false;

    if (autoBtn) {
      autoBtn.textContent = "STOP AUTO SCROLL";
    }


    for (const scene of scenes) {

      if (stopAutoScroll) break;

      const rect =
        scene.getBoundingClientRect();

      const target =
        window.scrollY + rect.top;


      if (target <= window.scrollY + 100) {
        continue;
      }


      await scrollToPosition(target);


      if (stopAutoScroll) break;


      await sleep(PAUSE_BETWEEN_SCENES);
    }


    autoScrolling = false;

    if (autoBtn) {
      autoBtn.textContent = "AUTO SCROLL";
    }
  }


  function stopScrolling() {

    stopAutoScroll = true;
    autoScrolling = false;

    if (autoBtn) {
      autoBtn.textContent = "AUTO SCROLL";
    }
  }


  if (autoBtn) {

    autoBtn.addEventListener("click", () => {

      if (autoScrolling) {
        stopScrolling();
      } else {
        startAutoScroll();
      }

    });
  }


  /* =========================
     GUEST MESSAGE
  ========================= */

  const messageForm =
    document.getElementById("messageForm");

  const formResult =
    document.getElementById("formResult");


  if (messageForm) {

    messageForm.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();

        const name =
          document.getElementById("guestName");

        if (formResult) {

          formResult.textContent =
            `Thank you ${name.value} ♥`;

        }

        messageForm.reset();
      }
    );
  }


  /* =========================
     INITIAL
  ========================= */

  updateMusicButton();

});
