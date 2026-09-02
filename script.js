/* ==================================================
   ELEMENTS
================================================== */

const quranIntro =
  document.getElementById("quranIntro");

const opening =
  document.getElementById("opening");

const openInvitation =
  document.getElementById("openInvitation");

const music =
  document.getElementById("music");

const musicToggle =
  document.getElementById("musicToggle");

const hero =
  document.getElementById("hero");

const chandelier =
  document.querySelector(".grand-chandelier");

const rings =
  document.getElementById("rings");

const messageForm =
  document.getElementById("messageForm");

const formSuccess =
  document.getElementById("formSuccess");


/* ==================================================
   AUDIO ENGINE
   Used only for the ONE firework sound.
================================================== */

let audioContext = null;
let fireworkSoundPlayed = false;


function prepareAudio() {

  if (!audioContext) {

    const AudioContext =
      window.AudioContext ||
      window.webkitAudioContext;

    if (AudioContext) {
      audioContext = new AudioContext();
    }

  }

}


/* ==================================================
   FIREWORK SOUND
   A short cinematic "pop + shimmer".
================================================== */

function playFireworkSound() {

  if (fireworkSoundPlayed) {
    return;
  }

  fireworkSoundPlayed = true;

  if (!audioContext) {
    return;
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }


  const now =
    audioContext.currentTime;


  /* Main impact */

  const oscillator =
    audioContext.createOscillator();

  const gain =
    audioContext.createGain();

  oscillator.type = "sine";

  oscillator.frequency.setValueAtTime(
    125,
    now
  );

  oscillator.frequency.exponentialRampToValueAtTime(
    48,
    now + .35
  );

  gain.gain.setValueAtTime(
    .0001,
    now
  );

  gain.gain.exponentialRampToValueAtTime(
    .32,
    now + .015
  );

  gain.gain.exponentialRampToValueAtTime(
    .0001,
    now + .38
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start(now);
  oscillator.stop(now + .4);


  /* Soft shimmer */

  const shimmer =
    audioContext.createOscillator();

  const shimmerGain =
    audioContext.createGain();

  shimmer.type = "triangle";

  shimmer.frequency.setValueAtTime(
    850,
    now + .05
  );

  shimmer.frequency.exponentialRampToValueAtTime(
    1300,
    now + .3
  );

  shimmerGain.gain.setValueAtTime(
    .0001,
    now
  );

  shimmerGain.gain.exponentialRampToValueAtTime(
    .08,
    now + .06
  );

  shimmerGain.gain.exponentialRampToValueAtTime(
    .0001,
    now + .4
  );

  shimmer.connect(shimmerGain);
  shimmerGain.connect(audioContext.destination);

  shimmer.start(now);
  shimmer.stop(now + .42);

}


/* ==================================================
   QURAN → ENVELOPE
================================================== */

window.addEventListener("load", () => {

  setTimeout(() => {

    quranIntro.classList.add("hide");

    setTimeout(() => {

      opening.classList.add("show");

    }, 900);

  }, 4000);

});


/* ==================================================
   OPEN INVITATION
================================================== */

openInvitation.addEventListener(
  "click",
  async () => {

    if (
      openInvitation.classList.contains("opened")
    ) {
      return;
    }


    openInvitation.classList.add("opened");


    /*
      Prepare Web Audio while the user
      has interacted with the page.
    */

    prepareAudio();


    if (audioContext &&
        audioContext.state === "suspended") {

      try {
        await audioContext.resume();
      } catch (error) {
        console.log(error);
      }

    }


    /* Start wedding music */

    try {

      music.volume = 0.7;

      await music.play();

    } catch (error) {

      console.log(
        "Music playback was blocked."
      );

    }


    /*
      Give the envelope time to open.
    */

    setTimeout(() => {

      opening.classList.add("hide");

      document.body.classList.remove(
        "locked"
      );

      document.body.classList.add(
        "invitation-open"
      );

      window.scrollTo({
        top: 0,
        behavior: "instant"
      });

    }, 1500);

  }
);


/* ==================================================
   MUSIC BUTTON
================================================== */

musicToggle.addEventListener(
  "click",
  async () => {

    if (music.paused) {

      try {

        await music.play();

        musicToggle.textContent = "♫";

      } catch (error) {

        console.log(error);

      }

    } else {

      music.pause();

      musicToggle.textContent = "×";

    }

  }
);


/* ==================================================
   COUNTDOWN
================================================== */

const weddingDate =
  new Date(
    2026,
    8,
    13,
    19,
    0,
    0
  );


function updateCountdown() {

  const now =
    new Date();

  const difference =
    weddingDate.getTime() -
    now.getTime();


  if (difference <= 0) {

    document.getElementById("days")
      .textContent = "00";

    document.getElementById("hours")
      .textContent = "00";

    document.getElementById("minutes")
      .textContent = "00";

    document.getElementById("seconds")
      .textContent = "00";

    return;

  }


  const days =
    Math.floor(
      difference /
      (1000 * 60 * 60 * 24)
    );


  const hours =
    Math.floor(
      (difference /
        (1000 * 60 * 60)) % 24
    );


  const minutes =
    Math.floor(
      (difference /
        (1000 * 60)) % 60
    );


  const seconds =
    Math.floor(
      (difference / 1000) % 60
    );


  document.getElementById("days")
    .textContent =
    String(days).padStart(2, "0");


  document.getElementById("hours")
    .textContent =
    String(hours).padStart(2, "0");


  document.getElementById("minutes")
    .textContent =
    String(minutes).padStart(2, "0");


  document.getElementById("seconds")
    .textContent =
    String(seconds).padStart(2, "0");

}


updateCountdown();

setInterval(
  updateCountdown,
  1000
);


/* ==================================================
   HERO / CHANDELIER SCROLL
================================================== */

let ticking = false;


function updateScrollScene() {

  const scrollY =
    window.scrollY;

  const heroHeight =
    hero.offsetHeight;


  /*
    Chandelier slowly rises as the
    user moves away from the hero.
  */

  const progress =
    Math.min(
      scrollY / (heroHeight * .75),
      1
    );


  const movement =
    progress * -300;


  chandelier.style.setProperty(
    "--chandelier-shift",
    `${movement}px`
  );


  ticking = false;

}


window.addEventListener(
  "scroll",
  () => {

    if (!ticking) {

      window.requestAnimationFrame(
        updateScrollScene
      );

      ticking = true;

    }

  },
  { passive: true }
);


/* ==================================================
   RINGS OBSERVER
================================================== */

const ringsObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach(entry => {

        if (
          entry.isIntersecting &&
          !rings.classList.contains("active")
        ) {

          rings.classList.add("active");


          /*
            Wait until the rings meet,
            then fire the ONE firework.
          */

          setTimeout(() => {

            rings.classList.add(
              "firework-active"
            );

            playFireworkSound();

          }, 2350);

        }

      });

    },
    {
      threshold: .55
    }
  );


ringsObserver.observe(rings);


/* ==================================================
   TIMELINE PROGRESS
================================================== */

const timeline =
  document.querySelector(".timeline");

const timelineProgress =
  document.querySelector(".timeline-progress");


const timelineObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          timelineProgress.style.height =
            "100%";

        }

      });

    },
    {
      threshold: .35
    }
  );


timelineObserver.observe(timeline);


/* ==================================================
   MESSAGE
================================================== */

messageForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();

    formSuccess.classList.add(
      "show"
    );

    messageForm.reset();

  }
);


/* ==================================================
   ANCHOR SCROLL
================================================== */

document
  .querySelectorAll(
    'a[href^="#"]'
  )
  .forEach(link => {

    link.addEventListener(
      "click",
      event => {

        const targetID =
          link.getAttribute("href");

        const target =
          document.querySelector(
            targetID
          );

        if (!target) {
          return;
        }

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth"
        });

      }
    );

  });
