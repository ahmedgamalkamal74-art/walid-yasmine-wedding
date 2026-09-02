/* =========================
   ENVELOPE
========================= */

const envelopeWrapper =
  document.getElementById("envelope");

const envelope =
  document.querySelector(".envelope");

const opening =
  document.getElementById("opening");

const website =
  document.getElementById("website");

const music =
  document.getElementById("weddingMusic");


envelopeWrapper.addEventListener("click", () => {

  envelope.classList.add("open");

  /*
    Optional music.
    If you add assets/music.mp3,
    it will start after the user taps.
  */

  if (music) {
    music.volume = 0.35;

    music.play().catch(() => {});
  }

  setTimeout(() => {

    opening.classList.add("hide");

    document.body.classList.remove("locked");

  }, 1300);

});


/* =========================
   COUNTDOWN
========================= */

const weddingDate =
  new Date("September 13, 2026 19:00:00").getTime();


function updateCountdown() {

  const now =
    new Date().getTime();

  const distance =
    weddingDate - now;


  if (distance <= 0) {

    document.getElementById("days").innerText = "00";
    document.getElementById("hours").innerText = "00";
    document.getElementById("minutes").innerText = "00";
    document.getElementById("seconds").innerText = "00";

    return;
  }


  const days =
    Math.floor(
      distance / (1000 * 60 * 60 * 24)
    );

  const hours =
    Math.floor(
      (distance %
        (1000 * 60 * 60 * 24))
      /
      (1000 * 60 * 60)
    );

  const minutes =
    Math.floor(
      (distance %
        (1000 * 60 * 60))
      /
      (1000 * 60)
    );

  const seconds =
    Math.floor(
      (distance %
        (1000 * 60))
      /
      1000
    );


  document.getElementById("days").innerText =
    String(days).padStart(2, "0");

  document.getElementById("hours").innerText =
    String(hours).padStart(2, "0");

  document.getElementById("minutes").innerText =
    String(minutes).padStart(2, "0");

  document.getElementById("seconds").innerText =
    String(seconds).padStart(2, "0");
}


updateCountdown();

setInterval(updateCountdown, 1000);


/* =========================
   RINGS ANIMATION
========================= */

const ringsSection =
  document.getElementById("rings");


const observer =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (
          entry.isIntersecting &&
          !entry.target.classList.contains("active")
        ) {

          entry.target.classList.add("active");

        }

      });

    },
    {
      threshold: 0.55
    }
  );


observer.observe(ringsSection);


/* =========================
   MESSAGE FORM
========================= */

const form =
  document.querySelector(".message-form");


form.addEventListener("submit", event => {

  event.preventDefault();

  alert(
    "Thank you for your beautiful message ❤️"
  );

  form.reset();

});


/* =========================
   PARALLAX CHANDELIER
========================= */

const chandelier =
  document.querySelector(".chandelier");


window.addEventListener(
  "scroll",
  () => {

    const hero =
      document.querySelector(".hero");

    if (!hero) return;

    const rect =
      hero.getBoundingClientRect();

    const progress =
      -rect.top * 0.08;

    if (
      rect.bottom > 0 &&
      rect.top < window.innerHeight
    ) {

      chandelier.style.marginTop =
        `${progress}px`;

    }

  },
  { passive: true }
);
