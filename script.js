/* =====================================================
   ELEMENTS
===================================================== */

const quranIntro = document.getElementById("quranIntro");
const opening = document.getElementById("opening");
const openInvitation = document.getElementById("openInvitation");

const music = document.getElementById("music");
const musicToggle = document.getElementById("musicToggle");

const rings = document.getElementById("rings");

const messageForm = document.getElementById("messageForm");
const formSuccess = document.getElementById("formSuccess");


/* =====================================================
   INTRO SEQUENCE
===================================================== */

window.addEventListener("load", () => {

  /*
    The Quran verse appears first.
    After a short pause, it fades out
    and the envelope becomes visible.
  */

  setTimeout(() => {

    quranIntro.classList.add("hide");

    setTimeout(() => {

      opening.classList.add("show");

    }, 900);

  }, 3600);

});


/* =====================================================
   OPEN INVITATION
===================================================== */

openInvitation.addEventListener("click", async () => {

  if (openInvitation.classList.contains("opened")) {
    return;
  }

  openInvitation.classList.add("opened");

  /*
    Start music directly from the user interaction.
    This is much more reliable on mobile browsers.
  */

  try {
    music.volume = 0.7;
    await music.play();
  } catch (error) {
    console.log("Music could not start automatically.");
  }

  /*
    Let the envelope stay open briefly
    before revealing the main invitation.
  */

  setTimeout(() => {

    opening.classList.add("hide");

    document.body.classList.remove("locked");
    document.body.classList.add("invitation-open");

    /*
      Start at the hero.
    */

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });

  }, 1300);

});


/* =====================================================
   MUSIC
===================================================== */

musicToggle.addEventListener("click", async () => {

  if (music.paused) {

    try {
      await music.play();
      musicToggle.textContent = "♫";
    } catch (error) {
      console.log("Music playback failed.");
    }

  } else {

    music.pause();
    musicToggle.textContent = "×";

  }

});


/* =====================================================
   COUNTDOWN
===================================================== */

const weddingDate = new Date(
  2026,
  8,
  13,
  19,
  0,
  0
);


function updateCountdown() {

  const now = new Date();

  const difference =
    weddingDate.getTime() - now.getTime();


  if (difference <= 0) {

    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";

    return;
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


  document.getElementById("days").textContent =
    String(days).padStart(2, "0");

  document.getElementById("hours").textContent =
    String(hours).padStart(2, "0");

  document.getElementById("minutes").textContent =
    String(minutes).padStart(2, "0");

  document.getElementById("seconds").textContent =
    String(seconds).padStart(2, "0");

}


updateCountdown();

setInterval(updateCountdown, 1000);


/* =====================================================
   RINGS SCROLL ANIMATION
===================================================== */

const ringsObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          rings.classList.add("active");

        }

      });

    },
    {
      threshold: 0.55
    }
  );


ringsObserver.observe(rings);


/* =====================================================
   MESSAGE FORM
===================================================== */

messageForm.addEventListener("submit", (event) => {

  event.preventDefault();

  formSuccess.classList.add("show");

  messageForm.reset();

});


/* =====================================================
   SMOOTH SCROLL
===================================================== */

document.querySelectorAll('a[href^="#"]').forEach(link => {

  link.addEventListener("click", event => {

    const targetId =
      link.getAttribute("href");

    const target =
      document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: "smooth"
    });

  });

});
