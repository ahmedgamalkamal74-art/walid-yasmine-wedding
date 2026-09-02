/* =========================================================
   ELEMENTS
========================================================= */

const welcome = document.getElementById("welcome");
const envelopeButton = document.getElementById("envelopeButton");

const music = document.getElementById("weddingMusic");
const musicButton = document.getElementById("musicButton");

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const invitation = document.getElementById("invitation");


/* =========================================================
   WEDDING DATE
========================================================= */

const weddingDate =
  new Date("2026-09-13T19:00:00+03:00");


/* =========================================================
   OPEN INVITATION
========================================================= */

let invitationOpened = false;
let autoScrollStarted = false;

function openInvitation() {

  if (invitationOpened) return;

  invitationOpened = true;

  welcome.classList.add("opening");

  /* Start music after user interaction */
  if (music) {

    music.volume = 0.45;

    music.play()
      .then(() => {
        musicButton.classList.add("playing");
      })
      .catch(() => {
        /* Browser may block autoplay */
      });
  }


  /*
    Give the card enough time to rise
    before removing the opening screen.
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
    Start slow automatic movement
    after the invitation has appeared.
  */

  setTimeout(() => {

    if (!autoScrollStarted) {
      startAutoScroll();
    }

  }, 5200);
}


envelopeButton.addEventListener(
  "click",
  openInvitation
);


/* =========================================================
   MUSIC
========================================================= */

let musicPlaying = false;


musicButton.addEventListener("click", () => {

  if (!music) return;


  if (music.paused) {

    music.play()
      .then(() => {

        musicPlaying = true;

        musicButton.classList.add("playing");

      })
      .catch(() => {});

  } else {

    music.pause();

    musicPlaying = false;

    musicButton.classList.remove("playing");
  }

});


if (music) {

  music.addEventListener("play", () => {
    musicPlaying = true;
    musicButton.classList.add("playing");
  });


  music.addEventListener("pause", () => {
    musicPlaying = false;
    musicButton.classList.remove("playing");
  });

}


/* =========================================================
   COUNTDOWN
========================================================= */

function updateCountdown() {

  const now = new Date();

  const difference =
    weddingDate.getTime() - now.getTime();


  if (difference <= 0) {

    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";

    return;
  }


  const totalSeconds =
    Math.floor(difference / 1000);


  const days =
    Math.floor(totalSeconds / 86400);


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


  daysEl.textContent =
    String(days).padStart(2, "0");


  hoursEl.textContent =
    String(hours).padStart(2, "0");


  minutesEl.textContent =
    String(minutes).padStart(2, "0");


  secondsEl.textContent =
    String(seconds).padStart(2, "0");
}


updateCountdown();

setInterval(updateCountdown, 1000);


/* =========================================================
   3D SCROLL ENGINE
========================================================= */

const scenes =
  document.querySelectorAll(".scene");


function updateSceneDepth() {

  const viewportHeight =
    window.innerHeight;


  const viewportCenter =
    viewportHeight / 2;


  scenes.forEach((scene) => {

    const rect =
      scene.getBoundingClientRect();


    const sceneCenter =
      rect.top + rect.height / 2;


    const distance =
      sceneCenter - viewportCenter;


    /*
      Keep movement subtle.
      The invitation should feel like one
      continuous physical scene.
    */

    const normalized =
      Math.max(
        -1,
        Math.min(
          1,
          distance / viewportHeight
        )
      );


    const y =
      normalized * -38;


    const z =
      Math.abs(normalized) * -70;


    const rotate =
      normalized * -1.2;


    const opacity =
      1 -
      Math.max(
        0,
        Math.abs(normalized) - .35
      ) * .45;


    scene.style.setProperty(
      "--scene-y",
      `${y}px`
    );


    scene.style.setProperty(
      "--scene-z",
      `${z}px`
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

}


let scrollTick = false;


window.addEventListener(
  "scroll",
  () => {

    if (!scrollTick) {

      window.requestAnimationFrame(() => {

        updateSceneDepth();

        scrollTick = false;

      });

      scrollTick = true;
    }

  },
  { passive: true }
);


window.addEventListener(
  "resize",
  updateSceneDepth
);


updateSceneDepth();


/* =========================================================
   RINGS OBSERVER
========================================================= */

const rings =
  document.querySelectorAll(".ring");


const ringObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.style.transition =
            "transform 1.5s cubic-bezier(.16,1,.3,1)";

          if (
            entry.target.classList.contains(
              "ring-one"
            )
          ) {

            entry.target.style.transform =
              "rotate(-20deg) translateY(-10px)";

          } else {

            entry.target.style.transform =
              "rotate(20deg) translateY(-10px)";
          }

        }

      });

    },
    {
      threshold: .4
    }
  );


rings.forEach((ring) => {
  ringObserver.observe(ring);
});


/* =========================================================
   AUTO SCROLL
========================================================= */

let autoScrollFrame = null;
let autoScrollCancelled = false;


function cancelAutoScroll() {

  autoScrollCancelled = true;

  if (autoScrollFrame) {

    cancelAnimationFrame(
      autoScrollFrame
    );

    autoScrollFrame = null;
  }
}


function startAutoScroll() {

  if (autoScrollStarted) return;

  if (autoScrollCancelled) return;

  autoScrollStarted = true;


  const scrollSpeed = 0.35;


  function move() {

    if (autoScrollCancelled) return;


    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;


    if (window.scrollY >= maxScroll - 5) {

      autoScrollFrame = null;

      return;
    }


    window.scrollBy(
      0,
      scrollSpeed
    );


    autoScrollFrame =
      requestAnimationFrame(move);
  }


  autoScrollFrame =
    requestAnimationFrame(move);
}


/*
  Any interaction cancels the
  automatic scrolling.
*/

[
  "wheel",
  "touchstart",
  "touchmove",
  "pointerdown",
  "keydown"
].forEach((eventName) => {

  window.addEventListener(
    eventName,
    () => {

      if (
        eventName === "keydown" &&
        ![
          "ArrowDown",
          "ArrowUp",
          "PageDown",
          "PageUp",
          " ",
          "Home",
          "End"
        ].includes(event.key)
      ) {
        return;
      }

      cancelAutoScroll();

    },
    {
      passive:
        eventName !== "keydown"
    }
  );

});


/* =========================================================
   INITIAL STATE
========================================================= */

window.addEventListener(
  "load",
  () => {

    updateCountdown();

    updateSceneDepth();

  }
);
