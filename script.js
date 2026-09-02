document.addEventListener("DOMContentLoaded", () => {

  const opening = document.getElementById("opening");
  const invitation = document.getElementById("invitation");
  const envelope = document.getElementById("envelope");
  const openBtn = document.getElementById("openBtn");

  const music = document.getElementById("music");
  const musicBtn = document.getElementById("musicBtn");


  /* =====================================================
     OPEN INVITATION
  ===================================================== */

  openBtn.addEventListener("click", async () => {

    envelope.classList.add("open");

    try {
      music.volume = 0.7;
      await music.play();
    } catch (error) {
      console.log("Music waiting for browser permission.");
    }

    setTimeout(() => {

      opening.classList.add("hide");

      invitation.classList.add("show");

      startAutoScroll();

    }, 1200);

  });


  /* =====================================================
     MUSIC BUTTON
  ===================================================== */

  let musicPlaying = false;

  music.addEventListener("play", () => {
    musicPlaying = true;
    musicBtn.textContent = "♫";
  });

  music.addEventListener("pause", () => {
    musicPlaying = false;
    musicBtn.textContent = "▶";
  });

  musicBtn.addEventListener("click", () => {

    if (musicPlaying) {

      music.pause();

    } else {

      music.play().catch(() => {});

    }

  });


  /* =====================================================
     COUNTDOWN
     13 SEPTEMBER 2026 - 7:00 PM
  ===================================================== */

  const weddingDate = new Date(
    "2026-09-13T19:00:00+03:00"
  ).getTime();


  function updateCountdown() {

    const now = new Date().getTime();

    const distance = weddingDate - now;


    if (distance <= 0) {

      document.getElementById("days").textContent = "00";
      document.getElementById("hours").textContent = "00";
      document.getElementById("minutes").textContent = "00";
      document.getElementById("seconds").textContent = "00";

      return;
    }


    const days = Math.floor(
      distance / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24))
      / (1000 * 60 * 60)
    );

    const minutes = Math.floor(
      (distance % (1000 * 60 * 60))
      / (1000 * 60)
    );

    const seconds = Math.floor(
      (distance % (1000 * 60))
      / 1000
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
     AUTO SCROLL
     Slow scrolling + 2 second pause at each section
  ===================================================== */

  let autoScrolling = false;
  let autoScrollStopped = false;


  async function startAutoScroll() {

    if (autoScrolling) return;

    autoScrolling = true;

    await wait(1000);


    const sections =
      document.querySelectorAll(".invitation .section");


    for (let i = 0; i < sections.length; i++) {

      if (autoScrollStopped) break;


      const section = sections[i];

      section.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });


      await wait(6500);


      if (autoScrollStopped) break;


      await wait(2000);

    }

    autoScrolling = false;

  }


  function wait(ms) {

    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });

  }


  /* =====================================================
     STOP AUTO SCROLL WHEN USER TOUCHES / SCROLLS
  ===================================================== */

  let userInteracting = false;

  window.addEventListener(
    "wheel",
    () => {

      if (!autoScrolling) return;

      userInteracting = true;
      autoScrollStopped = true;

    },
    { passive: true }
  );


  window.addEventListener(
    "touchstart",
    () => {

      if (!autoScrolling) return;

      userInteracting = true;
      autoScrollStopped = true;

    },
    { passive: true }
  );


  /* =====================================================
     FIREWORKS
  ===================================================== */

  const canvas = document.getElementById("fireworks");

  const ctx = canvas.getContext("2d");

  let particles = [];

  let rockets = [];


  function resizeCanvas() {

    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;

  }

  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);


  class Rocket {

    constructor() {

      this.x =
        Math.random() * canvas.width;

      this.y =
        canvas.height + 10;

      this.targetY =
        canvas.height * (
          0.15 + Math.random() * 0.35
        );

      this.speed =
        5 + Math.random() * 3;

      this.dead = false;

    }


    update() {

      this.y -= this.speed;

      if (this.y <= this.targetY) {

        this.explode();

        this.dead = true;

      }

    }


    explode() {

      const amount = 65;

      for (let i = 0; i < amount; i++) {

        const angle =
          Math.PI * 2 *
          (i / amount);

        const speed =
          1.5 + Math.random() * 4;

        particles.push(
          new Particle(
            this.x,
            this.y,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
          )
        );

      }

    }

  }


  class Particle {

    constructor(x, y, vx, vy) {

      this.x = x;
      this.y = y;

      this.vx = vx;
      this.vy = vy;

      this.life = 1;

      this.gravity = 0.035;

      this.size =
        1 + Math.random() * 2;

    }


    update() {

      this.x += this.vx;

      this.y += this.vy;

      this.vy += this.gravity;

      this.vx *= .99;

      this.life -= .015;

    }


    draw() {

      ctx.beginPath();

      ctx.arc(
        this.x,
        this.y,
        this.size,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        `rgba(234,215,160,${this.life})`;

      ctx.shadowBlur = 15;

      ctx.shadowColor =
        "#e8cf8d";

      ctx.fill();

    }

  }


  function fireworksLoop() {

    ctx.fillStyle =
      "rgba(8,6,8,.18)";

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    if (
      Math.random() < 0.035 &&
      rockets.length < 3
    ) {

      rockets.push(
        new Rocket()
      );

    }


    rockets.forEach(
      rocket => rocket.update()
    );

    rockets =
      rockets.filter(
        rocket => !rocket.dead
      );


    particles.forEach(
      particle => {

        particle.update();

        particle.draw();

      }
    );


    particles =
      particles.filter(
        particle => particle.life > 0
      );


    requestAnimationFrame(
      fireworksLoop
    );

  }


  fireworksLoop();


  /* =====================================================
     DECORATIVE GOLD PARTICLES
  ===================================================== */

  const goldParticles =
    document.querySelector(".gold-particles");


  for (let i = 0; i < 35; i++) {

    const particle =
      document.createElement("span");

    particle.style.left =
      Math.random() * 100 + "%";

    particle.style.top =
      Math.random() * 100 + "%";

    particle.style.animationDelay =
      Math.random() * 5 + "s";

    particle.style.animationDuration =
      3 + Math.random() * 5 + "s";

    goldParticles.appendChild(
      particle
    );

  }

});
