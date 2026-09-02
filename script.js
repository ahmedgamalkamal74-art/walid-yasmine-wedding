/* =================================
   WEDDING DATE
================================= */

const weddingDate =
  new Date("2026-09-13T19:00:00+03:00");


/* =================================
   ELEMENTS
================================= */

const welcome =
  document.getElementById("welcome");

const envelope =
  document.querySelector(".envelope");

const envelopeButton =
  document.getElementById("envelopeButton");

const music =
  document.getElementById("weddingMusic");

const musicButton =
  document.getElementById("musicButton");

const days =
  document.getElementById("days");

const hours =
  document.getElementById("hours");

const minutes =
  document.getElementById("minutes");

const seconds =
  document.getElementById("seconds");

const ringsSection =
  document.getElementById("rings-section");


/* =================================
   STATE
================================= */

let invitationOpened = false;
let ringsAnimated = false;

let autoScrollStarted = false;
let autoScrollCancelled = false;

let userInteracting = false;
let interactionTimer = null;


/* =================================
   OPEN INVITATION
================================= */

async function openInvitation() {

  if (invitationOpened) return;

  invitationOpened = true;

  /* Open envelope */

  envelope.classList.add("open");

  envelopeButton.classList.add("opened");

  envelopeButton.setAttribute(
    "aria-label",
    "Wedding invitation opened"
  );


  /* Start music */

  try {

    await music.play();

    musicButton.classList.add("playing");

  } catch (error) {

    /*
      Browser may block autoplay.
      The music button remains available.
    */

    console.log(
      "Music autoplay was blocked."
    );

  }


  /*
    Give the envelope enough time to open
    before revealing the invitation.
  */

  setTimeout(() => {

    welcome.classList.add("opened");

    document.body.classList.remove("locked");

  }, 1550);


  /*
    Start the gentle automatic journey
    after the opening transition.
  */

  setTimeout(() => {

    startAutoScroll();

  }, 3000);

}


/* =================================
   ENVELOPE CLICK
================================= */

envelopeButton.addEventListener(
  "click",
  openInvitation
);


/* =================================
   MUSIC
================================= */

musicButton.addEventListener(
  "click",
  async () => {

    if (music.paused) {

      try {

        await music.play();

        musicButton.classList.add(
          "playing"
        );

      } catch (error) {

        console.log(
          "Music could not play."
        );

      }

    } else {

      music.pause();

      musicButton.classList.remove(
        "playing"
      );

    }

  }
);


/* =================================
   COUNTDOWN
================================= */

function updateCountdown() {

  const now = new Date();

  const difference =
    weddingDate - now;


  if (difference <= 0) {

    days.textContent = "00";
    hours.textContent = "00";
    minutes.textContent = "00";
    seconds.textContent = "00";

    return;

  }


  const totalSeconds =
    Math.floor(difference / 1000);


  const d =
    Math.floor(
      totalSeconds / 86400
    );


  const h =
    Math.floor(
      (totalSeconds % 86400) / 3600
    );


  const m =
    Math.floor(
      (totalSeconds % 3600) / 60
    );


  const s =
    totalSeconds % 60;


  days.textContent =
    String(d).padStart(2, "0");

  hours.textContent =
    String(h).padStart(2, "0");

  minutes.textContent =
    String(m).padStart(2, "0");

  seconds.textContent =
    String(s).padStart(2, "0");

}


updateCountdown();

setInterval(
  updateCountdown,
  1000
);


/* =================================
   RINGS ANIMATION
================================= */

const ringsObserver =
  new IntersectionObserver(

    (entries) => {

      entries.forEach((entry) => {

        if (
          entry.isIntersecting &&
          !ringsAnimated
        ) {

          ringsAnimated = true;

          ringsSection.classList.add(
            "animate"
          );

          ringsObserver.unobserve(
            ringsSection
          );

        }

      });

    },

    {
      threshold: 0.35
    }

  );


ringsObserver.observe(
  ringsSection
);


/* =================================
   USER INTERACTION
================================= */

function pauseAutoScroll() {

  if (!invitationOpened) return;

  userInteracting = true;

  /*
    Once the visitor manually scrolls,
    the automatic journey is cancelled.
    The visitor remains fully in control.
  */

  autoScrollCancelled = true;

  clearTimeout(
    interactionTimer
  );


  interactionTimer =
    setTimeout(() => {

      userInteracting = false;

    }, 1500);

}


window.addEventListener(
  "wheel",
  pauseAutoScroll,
  {
    passive: true
  }
);


window.addEventListener(
  "touchstart",
  pauseAutoScroll,
  {
    passive: true
  }
);


window.addEventListener(
  "pointerdown",
  pauseAutoScroll,
  {
    passive: true
  }
);


window.addEventListener(
  "keydown",
  (event) => {

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

      pauseAutoScroll();

    }

  }
);


/* =================================
   WAIT
================================= */

function wait(ms) {

  return new Promise(
    resolve =>
      setTimeout(resolve, ms)
  );

}


/* =================================
   AUTO SCROLL
================================= */

async function startAutoScroll() {

  if (autoScrollStarted) return;

  autoScrollStarted = true;

  /*
    Let the user see the hero first.
  */

  await wait(2500);


  if (
    autoScrollCancelled ||
    userInteracting
  ) {
    return;
  }


  const sections =
    Array.from(
      document.querySelectorAll(
        "#invitation > .section"
      )
    );


  /*
    Start from the second section
    because the hero is already visible.
  */

  for (
    let index = 1;
    index < sections.length;
    index++
  ) {

    if (
      autoScrollCancelled ||
      userInteracting
    ) {
      return;
    }


    const section =
      sections[index];


    section.scrollIntoView({

      behavior: "smooth",

      block: "start"

    });


    /*
      Rings get extra time so the
      animation can be appreciated.
    */

    if (
      section.id === "rings-section"
    ) {

      await wait(7000);

    } else {

      await wait(4500);

    }


    if (
      autoScrollCancelled ||
      userInteracting
    ) {
      return;
    }

  }

}
