/* =========================================================
   WALID & YASMIN
   WEDDING INVITATION
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const welcome = document.getElementById("welcome");
const envelopeButton = document.getElementById("envelopeButton");

const music = document.getElementById("weddingMusic");
const musicButton = document.getElementById("musicButton");

const scenes = document.querySelectorAll(".scene");

const coupleScene = document.querySelector(".couple-scene");


/* =========================================================
   WEDDING DATE
========================================================= */

const weddingDate = new Date(
  "2026-09-13T19:00:00+03:00"
);


/* =========================================================
   OPEN INVITATION
========================================================= */

let invitationOpened = false;


function openInvitation() {

  if (invitationOpened) return;

  invitationOpened = true;

  welcome.classList.add("opening");


  /* Start music */
  startMusic();


  /*
    Give the card time to rise
    before completely removing
    the opening screen.
  */

  setTimeout(() => {

    welcome.classList.add("opened");

    document.body.classList.remove("locked");

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });

  }, 2600);


  /*
    Start the cinematic automatic
    scroll after the first scene.
  */

  setTimeout(() => {

    startAutoScroll();

  }, 5200);

}


if (envelopeButton) {

  envelopeButton.addEventListener(
    "click",
    openInvitation
  );

}


/* =========================================================
   MUSIC
========================================================= */

let musicPlaying = false;


async function startMusic() {

  if (!music) return;

  try {

    music.volume = 0.55;

    await music.play();

    musicPlaying = true;

    updateMusicButton();

  } catch (error) {

    musicPlaying = false;

    updateMusicButton();

  }

}


function updateMusicButton() {

  if (!musicButton) return;

  const icon =
    musicButton.querySelector(".music-icon");

  if (!icon) return;

  icon.textContent =
    musicPlaying ? "♫" : "♪";

}


if (musicButton) {

  musicButton.addEventListener(
    "click",
    async () => {

      if (!music) return;


      if (music.paused) {

        try {

          await music.play();

          musicPlaying = true;

        } catch (error) {

          musicPlaying = false;

        }

      } else {

        music.pause();

        musicPlaying = false;

      }


      updateMusicButton();

    }
  );

}


/* =========================================================
   COUNTDOWN
========================================================= */

function updateCountdown() {

  const now = new Date();

  const difference =
    weddingDate.getTime() -
    now.getTime();


  if (difference <= 0) {

    setValue("days", "00");
    setValue("hours", "00");
    setValue("minutes", "00");
    setValue("seconds", "00");

    return;
  }


  const totalSeconds =
    Math.floor(difference / 1000);


  const days =
    Math.floor(
      totalSeconds / 86400
    );


  const hours =
    Math.floor(
      (totalSeconds % 86400) / 3600
    );


  const minutes =
    Math.floor(
      (totalSeconds % 3600) / 60
    );


  const seconds =
    totalSeconds % 60;


  setValue(
    "days",
    String(days).padStart(2, "0")
  );


  setValue(
    "hours",
    String(hours).padStart(2, "0")
  );


  setValue(
    "minutes",
    String(minutes).padStart(2, "0")
  );


  setValue(
    "seconds",
    String(seconds).padStart(2, "0")
  );

}


function setValue(id, value) {

  const element =
    document.getElementById(id);

  if (element) {

    element.textContent = value;

  }

}


updateCountdown();

setInterval(
  updateCountdown,
  1000
);


/* =========================================================
   3D SCROLL ENGINE
========================================================= */

let ticking = false;


function updateSceneDepth() {

  const viewportCenter =
    window.innerHeight / 2;


  scenes.forEach(scene => {

    const rect =
      scene.getBoundingClientRect();


    const sceneCenter =
      rect.top +
      rect.height / 2;


    const distance =
      sceneCenter -
      viewportCenter;


    const normalized =
      Math.max(
        -1,
        Math.min(
          1,
          distance /
          window.innerHeight
        )
      );


    /*
      Z movement:
      scenes closer to the center
      feel deeper and more alive.
    */

    const z =
      Math.round(
        -normalized * 70
      );


    const y =
      Math.round(
        normalized * 28
      );


    const rotate =
      normalized * -1.2;


    const opacity =
      1 -
      Math.max(
        0,
        Math.abs(normalized) - .75
      ) * .7;


    scene.style.setProperty(
      "--scene-z",
      `${z}px`
    );


    scene.style.setProperty(
      "--scene-y",
      `${y}px`
    );


    scene.style.setProperty(
      "--scene-rotate",
      `${rotate}deg`
    );


    scene.style.setProperty(
      "--scene-opacity",
      opacity
    );

  });


  ticking = false;

}


function requestSceneUpdate() {

  if (!ticking) {

    window.requestAnimationFrame(
      updateSceneDepth
    );

    ticking = true;

  }

}


window.addEventListener(
  "scroll",
  requestSceneUpdate,
  {
    passive: true
  }
);


window.addEventListener(
  "resize",
  requestSceneUpdate
);


updateSceneDepth();


/* =========================================================
   COUPLE PARALLAX
========================================================= */

function updateCoupleParallax() {

  if (!coupleScene) return;


  const rect =
    coupleScene.getBoundingClientRect();


  const viewportCenter =
    window.innerHeight / 2;


  const sceneCenter =
    rect.top +
    rect.height / 2;


  const distance =
    sceneCenter -
    viewportCenter;


  const normalized =
    Math.max(
      -1,
      Math.min(
        1,
        distance /
        window.innerHeight
      )
    );


  const y =
    normalized * -14;


  const z =
    normalized * -18;


  coupleScene.style.setProperty(
    "--couple-y",
    `${y}px`
  );


  coupleScene.style.setProperty(
    "--couple-z",
    `${z}px`
  );

}


window.addEventListener(
  "scroll",
  updateCoupleParallax,
  {
    passive: true
  }
);


window.addEventListener(
  "resize",
  updateCoupleParallax
);


updateCoupleParallax();


/* =========================================================
   RINGS OBSERVER
========================================================= */

const rings =
  document.querySelectorAll(".ring");


const ringObserver =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add(
            "ring-visible"
          );

        }

      });

    },
    {
      threshold: .25
    }
  );


rings.forEach(ring => {

  ringObserver.observe(ring);

});


/* =========================================================
   AUTO SCROLL
========================================================= */

let autoScrollActive = false;

let autoScrollTimer = null;

let autoScrollIndex = 0;

let userInterrupted = false;


const autoScrollSections =
  document.querySelectorAll(
    "#invitation > .section"
  );


function startAutoScroll() {

  if (autoScrollActive) return;

  if (userInterrupted) return;

  autoScrollActive = true;

  autoScrollIndex = 0;


  autoScrollTimer =
    setTimeout(
      moveToNextSection,
      4200
    );

}


function moveToNextSection() {

  if (!autoScrollActive) return;

  if (userInterrupted) {

    stopAutoScroll();

    return;

  }


  if (
    autoScrollIndex >=
    autoScrollSections.length - 1
  ) {

    stopAutoScroll();

    return;

  }


  autoScrollIndex++;


  const nextSection =
    autoScrollSections[
      autoScrollIndex
    ];


  if (!nextSection) {

    stopAutoScroll();

    return;

  }


  nextSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });


  autoScrollTimer =
    setTimeout(
      moveToNextSection,
      5200
    );

}


function stopAutoScroll() {

  autoScrollActive = false;

  clearTimeout(
    autoScrollTimer
  );

  autoScrollTimer = null;

}


/* =========================================================
   USER INTERACTION CANCELS AUTO SCROLL
========================================================= */

function interruptAutoScroll() {

  if (!invitationOpened) return;

  userInterrupted = true;

  stopAutoScroll();

}


window.addEventListener(
  "wheel",
  interruptAutoScroll,
  {
    passive: true
  }
);


window.addEventListener(
  "touchstart",
  interruptAutoScroll,
  {
    passive: true
  }
);


window.addEventListener(
  "touchmove",
  interruptAutoScroll,
  {
    passive: true
  }
);


window.addEventListener(
  "keydown",
  event => {

    const keys = [
      "ArrowDown",
      "ArrowUp",
      "PageDown",
      "PageUp",
      " ",
      "Home",
      "End"
    ];


    if (keys.includes(event.key)) {

      interruptAutoScroll();

    }

  }
);


/* =========================================================
   MOUSE MOVE DEPTH
========================================================= */

const hero =
  document.querySelector(".hero");


if (hero && !("ontouchstart" in window)) {

  hero.addEventListener(
    "mousemove",
    event => {

      const x =
        (event.clientX /
          window.innerWidth) -
        .5;


      const y =
        (event.clientY /
          window.innerHeight) -
        .5;


      const couple =
        document.querySelector(
          ".couple-art"
        );


      if (couple) {

        couple.style.marginLeft =
          `${x * 10}px`;

        couple.style.marginTop =
          `${y * 7}px`;

      }

    }
  );


  hero.addEventListener(
    "mouseleave",
    () => {

      const couple =
        document.querySelector(
          ".couple-art"
        );


      if (couple) {

        couple.style.marginLeft = "0";

        couple.style.marginTop = "0";

      }

    }
  );

}


/* =========================================================
   PREVENT DOUBLE TAP / BUTTON ISSUES
========================================================= */

if (envelopeButton) {

  envelopeButton.addEventListener(
    "touchend",
    event => {

      event.preventDefault();

      if (!invitationOpened) {

        openInvitation();

      }

    },
    {
      passive: false
    }
  );

}


/* =========================================================
   INITIAL UI
========================================================= */

updateMusicButton();

updateSceneDepth();

updateCoupleParallax();
