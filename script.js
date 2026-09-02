const weddingDate = new Date("2026-09-13T19:00:00+03:00");

const welcomeScreen = document.getElementById("welcome");
const enterButton = document.getElementById("enterButton");
const envelope = document.querySelector(".envelope");

const music = document.getElementById("weddingMusic");
const musicToggle = document.getElementById("musicToggle");

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

const ringsSection = document.getElementById("rings-section");

let musicPlaying = false;
let invitationEntered = false;


/* =========================
   ENTER INVITATION
========================= */

enterButton.addEventListener("click", async () => {

  if (invitationEntered) return;

  invitationEntered = true;

  envelope.classList.add("open");

  try {
    await music.play();

    musicPlaying = true;
    musicToggle.classList.add("playing");

  } catch (error) {
    console.log("Music could not start automatically.");
  }

  setTimeout(() => {
    welcomeScreen.classList.add("hidden");
    document.body.classList.remove("no-scroll");
  }, 900);

});


/* =========================
   MUSIC BUTTON
========================= */

musicToggle.addEventListener("click", async () => {

  if (music.paused) {

    try {
      await music.play();

      musicPlaying = true;
      musicToggle.classList.add("playing");

    } catch (error) {
      console.log("Music could not play.");
    }

  } else {

    music.pause();

    musicPlaying = false;
    musicToggle.classList.remove("playing");

  }

});


/* =========================
   COUNTDOWN
========================= */

function updateCountdown() {

  const now = new Date();
  const difference = weddingDate - now;

  if (difference <= 0) {

    daysElement.textContent = "00";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";

    return;
  }

  const totalSeconds = Math.floor(difference / 1000);

  const days = Math.floor(totalSeconds / 86400);

  const hours = Math.floor(
    (totalSeconds % 86400) / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds = totalSeconds % 60;

  daysElement.textContent = String(days).padStart(2, "0");

  hoursElement.textContent = String(hours).padStart(2, "0");

  minutesElement.textContent = String(minutes).padStart(2, "0");

  secondsElement.textContent = String(seconds).padStart(2, "0");

}

updateCountdown();

setInterval(updateCountdown, 1000);


/* =========================
   RINGS ANIMATION
========================= */

let ringsAnimated = false;

const ringsObserver = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if (
        entry.isIntersecting &&
        !ringsAnimated
      ) {

        ringsAnimated = true;

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
   SLOW AUTO SCROLL
========================= */

let autoScrolling = false;
let userInteracting = false;

function sleep(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}


async function startAutoScroll() {

  if (autoScrolling) return;

  autoScrolling = true;

  await sleep(2500);

  const sections = document.querySelectorAll(
    "#invitation > .section"
  );

  for (const section of sections) {

    if (userInteracting) {
      await sleep(1500);
      continue;
    }

    section.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    if (section.id === "rings-section") {

      await sleep(6500);

    } else {

      await sleep(3500);

    }

  }

  autoScrolling = false;

}


/* =========================
   USER INTERACTION
========================= */

let interactionTimer;

function pauseAutoScroll() {

  userInteracting = true;

  clearTimeout(interactionTimer);

  interactionTimer = setTimeout(() => {

    userInteracting = false;

  }, 5000);

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


/* =========================
   START AUTO SCROLL
========================= */

setTimeout(() => {

  if (invitationEntered) {
    startAutoScroll();
  }

}, 4500);
