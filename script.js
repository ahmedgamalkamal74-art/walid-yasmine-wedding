const weddingDate = new Date("2026-09-13T19:00:00+03:00");

const welcome = document.getElementById("welcome");
const envelope = document.querySelector(".envelope");

const sealButton = document.getElementById("sealButton");
const openButton = document.getElementById("openButton");

const music = document.getElementById("weddingMusic");
const musicButton = document.getElementById("musicButton");

const days = document.getElementById("days");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");

const ringsSection = document.getElementById("rings-section");

let opened = false;


/* =========================
   OPEN INVITATION
========================= */

async function openInvitation() {

  if (opened) return;

  opened = true;

  envelope.classList.add("open");

  /* Start music after user click */
  try {

    await music.play();

    musicButton.classList.add("playing");

  } catch (error) {

    console.log("Music playback was blocked.");

  }

  setTimeout(() => {

    welcome.classList.add("opened");

    document.body.classList.remove("locked");

  }, 1200);

}


/* Seal */
sealButton.addEventListener("click", openInvitation);


/* Open button */
openButton.addEventListener("click", openInvitation);


/* =========================
   MUSIC
========================= */

musicButton.addEventListener("click", async () => {

  if (music.paused) {

    try {

      await music.play();

      musicButton.classList.add("playing");

    } catch (error) {

      console.log("Music could not play.");

    }

  } else {

    music.pause();

    musicButton.classList.remove("playing");

  }

});


/* =========================
   COUNTDOWN
========================= */

function updateCountdown() {

  const now = new Date();

  const difference = weddingDate - now;

  if (difference <= 0) {

    days.textContent = "00";
    hours.textContent = "00";
    minutes.textContent = "00";
    seconds.textContent = "00";

    return;

  }

  const totalSeconds = Math.floor(difference / 1000);

  const d = Math.floor(totalSeconds / 86400);

  const h = Math.floor(
    (totalSeconds % 86400) / 3600
  );

  const m = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const s = totalSeconds % 60;


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

setInterval(updateCountdown, 1000);


/* =========================
   RINGS ANIMATION
========================= */

let ringsPlayed = false;

const ringsObserver = new IntersectionObserver(

  (entries) => {

    entries.forEach((entry) => {

      if (
        entry.isIntersecting &&
        !ringsPlayed
      ) {

        ringsPlayed = true;

        ringsSection.classList.add("animate");

        ringsObserver.unobserve(ringsSection);

      }

    });

  },

  {
    threshold: 0.35
  }

);

ringsObserver.observe(ringsSection);


/* =========================
   MESSAGE BUTTON
========================= */

const messageButton =
  document.getElementById("messageButton");

messageButton.addEventListener("click", () => {

  const name =
    document.getElementById("guestName").value.trim();

  const message =
    document.getElementById("guestMessage").value.trim();


  if (!name || !message) {

    alert("Please enter your name and message.");

    return;

  }


  alert(
    "Thank you, " +
    name +
    "! Your message means a lot to Walid & Yasmine. ♥"
  );


  document.getElementById("guestName").value = "";

  document.getElementById("guestMessage").value = "";

});


/* =========================
   SLOW AUTO SCROLL
========================= */

let autoScrollStarted = false;
let userScrolling = false;
let userTimer;


function pauseAutoScroll() {

  userScrolling = true;

  clearTimeout(userTimer);

  userTimer = setTimeout(() => {

    userScrolling = false;

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

  return new Promise(resolve => {

    setTimeout(resolve, ms);

  });

}


async function startAutoScroll() {

  if (autoScrollStarted) return;

  autoScrollStarted = true;

  await wait(3500);


  const sections =
    document.querySelectorAll(
      "#invitation > .section"
    );


  for (const section of sections) {

    if (userScrolling) {

      await wait(2000);

      continue;

    }


    section.scrollIntoView({

      behavior: "smooth",

      block: "start"

    });


    if (section.id === "rings-section") {

      await wait(6500);

    } else {

      await wait(4500);

    }

  }

}


/* Start auto-scroll after opening */
const originalOpenInvitation = openInvitation;


/* Slight delay so the first section can breathe */
sealButton.addEventListener("click", () => {

  setTimeout(() => {

    startAutoScroll();

  }, 2500);

});

openButton.addEventListener("click", () => {

  setTimeout(() => {

    startAutoScroll();

  }, 2500);

});
