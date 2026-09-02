const weddingDate =
  new Date("2026-09-13T19:00:00+03:00");


const welcome =
  document.getElementById("welcome");

const envelope =
  document.querySelector(".envelope");

const sealButton =
  document.getElementById("sealButton");

const openButton =
  document.getElementById("openButton");


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


let invitationOpened = false;


/* =================================
   OPEN INVITATION
================================= */

async function openInvitation() {

  if (invitationOpened) return;

  invitationOpened = true;


  /* Open envelope */

  envelope.classList.add("open");


  /* Start music */

  try {

    await music.play();

    musicButton.classList.add("playing");

  } catch (error) {

    console.log(
      "Music autoplay was blocked."
    );

  }


  /* Hide opening */

  setTimeout(() => {

    welcome.classList.add("opened");

    document.body.classList.remove("locked");

  }, 1500);


  /* Start slow scroll */

  setTimeout(() => {

    startAutoScroll();

  }, 3500);

}


sealButton.addEventListener(
  "click",
  openInvitation
);


openButton.addEventListener(
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

let ringsAnimated = false;


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
   AUTO SCROLL
================================= */

let autoScrollStarted = false;

let userInteracting = false;

let interactionTimer;


function pauseAutoScroll() {

  userInteracting = true;

  clearTimeout(
    interactionTimer
  );


  interactionTimer =
    setTimeout(() => {

      userInteracting = false;

    }, 7000);

}


window.addEventListener(
  "touchstart",
  pauseAutoScroll,
  { passive: true }
);


window.addEventListener(
  "wheel",
  pauseAutoScroll,
  { passive: true }
);


window.addEventListener(
  "pointerdown",
  pauseAutoScroll,
  { passive: true }
);


function wait(ms) {

  return new Promise(
    resolve => setTimeout(resolve, ms)
  );

}


async function startAutoScroll() {

  if (autoScrollStarted) return;

  autoScrollStarted = true;


  await wait(2500);


  const sections =
    document.querySelectorAll(
      "#invitation > .section"
    );


  for (
    const section of sections
  ) {

    if (userInteracting) {

      await wait(2000);

      continue;

    }


    section.scrollIntoView({

      behavior: "smooth",

      block: "start"

    });


    /* Longer pause at rings */

    if (
      section.id === "rings-section"
    ) {

      await wait(7500);

    } else {

      await wait(4500);

    }

  }

}
