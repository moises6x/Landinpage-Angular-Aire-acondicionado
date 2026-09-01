/* ==========================================================
   CONFIGURACIÓN INICIAL Y PREVENCIÓN DE SALTO DE SCROLL
   ========================================================== */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, 0);

  // Elementos principales del DOM
  const navbar = document.getElementById("navbar");
  const heroVideo = document.getElementById("heroVideo");
  const servicesSection = document.getElementById("servicios");
  const progressBar = document.getElementById("progressBar");

  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const navItems = document.querySelectorAll(".nav-links a");

  let isPlaying = false;

  // ==========================================================
  // MOTOR DE DESPLAZAMIENTO SUAVE (CINEMATIC SMOOTH SCROLL)
  // ==========================================================
  function smoothScrollTo(targetPosition, duration = 1100) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function easeInOutCubic(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t * t + b;
      t -= 2;
      return (c / 2) * (t * t * t + 2) + b;
    }

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        window.scrollTo(0, targetPosition);
      }
    }

    requestAnimationFrame(animation);
  }

  // Interceptar enlaces internos (#)
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        // Cerrar menú móvil si está abierto
        if (navToggle && navLinks) {
          navToggle.classList.remove("active");
          navLinks.classList.remove("open");
        }

        const headerOffset = 75;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        smoothScrollTo(Math.max(0, offsetPosition), 1200);
      }
    });
  });

  // ==========================================================
  // 1. MENÚ RESPONSIVO MÓVIL
  // ==========================================================
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active");
      navLinks.classList.toggle("open");
    });

    navItems.forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.classList.remove("active");
        navLinks.classList.remove("open");
      });
    });
  }

  // ==========================================================
  // 2. VIDEO HERO
  // ==========================================================
  if (heroVideo) {
    heroVideo.pause();
    heroVideo.currentTime = 0;
    heroVideo.loop = true;
    heroVideo.playbackRate = 0.75;
  }

  function playVideoLoop() {
    if (!heroVideo) return;
    isPlaying = true;
    heroVideo.playbackRate = 0.75;
    heroVideo.play().catch((err) => console.log("Autoplay:", err));
  }

  window.addEventListener("wheel", () => {
    if (window.scrollY < 120 && !isPlaying) playVideoLoop();
  }, { passive: true });

  window.addEventListener("touchmove", () => {
    if (window.scrollY < 120 && !isPlaying) playVideoLoop();
  }, { passive: true });

  window.addEventListener("keydown", (e) => {
    if (["ArrowDown", "PageDown", "Space"].includes(e.code) && window.scrollY < 120) {
      playVideoLoop();
    }
  });

  const hintBtn = document.querySelector(".scroll-down-hint");
  if (hintBtn) {
    hintBtn.addEventListener("click", () => {
      playVideoLoop();
    });
  }

  // ==========================================================
  // 3. ANIMACIONES EN TIEMPO REAL VINCULADAS AL SCROLL
  // ==========================================================
  function updateScrollProgressAnimations() {
    const windowHeight = window.innerHeight;
    const isMobile = window.innerWidth <= 768;

    // A. Animar carrusel de servicios
    const servicesCarousel = document.querySelector(".services-carousel-wrapper");
    if (servicesCarousel) {
      const rect = servicesCarousel.getBoundingClientRect();
      const enterPoint = windowHeight * 1.05;
      const targetPoint = windowHeight * 0.40;

      let progress = (enterPoint - rect.top) / (enterPoint - targetPoint);
      progress = Math.max(0, Math.min(1, progress));

      const ease = 1 - Math.pow(1 - progress, 2.5);
      const translateY = (1 - ease) * (isMobile ? 30 : 60);

      servicesCarousel.style.transform = `translateY(${translateY}px)`;
      servicesCarousel.style.opacity = ease;
    }

    // B. Tarjetas de "¿Por qué elegirnos?"
    const benefitCards = document.querySelectorAll(".benefit-card");
    benefitCards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const enterPoint = windowHeight * 1.0;
      const targetPoint = windowHeight * 0.6;

      let progress = (enterPoint - rect.top) / (enterPoint - targetPoint);
      progress = Math.max(0, Math.min(1, progress));

      const ease = 1 - Math.pow(1 - progress, 3);
      const delayOffset = isMobile ? 0 : index * 8;
      const translateY = (1 - ease) * (50 + delayOffset);

      card.style.transform = `translateY(${translateY}px)`;
      card.style.opacity = ease;
    });

    // C. Tarjetas de "Sectores"
    const sectorCards = document.querySelectorAll(".sector-card");
    sectorCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const enterPoint = windowHeight * 1.05;
      const targetPoint = windowHeight * 0.45;

      let progress = (enterPoint - rect.top) / (enterPoint - targetPoint);
      progress = Math.max(0, Math.min(1, progress));

      const ease = 1 - Math.pow(1 - progress, 2.5);
      const translateY = (1 - ease) * 45;

      card.style.transform = `translateY(${translateY}px)`;
      card.style.opacity = ease;
    });

    // D. Sección Cobertura (Texto e Imagen)
    const coverageGrid = document.querySelector(".coverage-grid");
    if (coverageGrid) {
      const rect = coverageGrid.getBoundingClientRect();
      const info = coverageGrid.querySelector(".coverage-info");
      const imgWrap = coverageGrid.querySelector(".coverage-image-wrapper");

      const enterPoint = windowHeight * 1.05;
      const targetPoint = windowHeight * 0.40;

      let progress = (enterPoint - rect.top) / (enterPoint - targetPoint);
      progress = Math.max(0, Math.min(1, progress));

      const ease = 1 - Math.pow(1 - progress, 2.5);
      const minScale = isMobile ? 0.8 : 0.55;
      const scale = minScale + ((1 - minScale) * ease);
      const translateY = (1 - ease) * (isMobile ? 40 : 100);
      const opacity = Math.min(1, ease * 1.5);

      if (imgWrap) {
        imgWrap.style.transform = `translateY(${translateY}px) scale(${scale})`;
        imgWrap.style.opacity = opacity;
      }

      if (info) {
        info.style.transform = `translateY(${(1 - ease) * 40}px)`;
        info.style.opacity = opacity;
      }
    }
  }

  // ==========================================================
  // 4. CONTROL DE SCROLL, PROGRESS BAR Y NAVBAR
  // ==========================================================
  function handleScroll() {
    const scrollY = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const servicesTop = servicesSection ? servicesSection.offsetTop : window.innerHeight;

    if (progressBar && totalHeight > 0) {
      progressBar.style.width = `${(scrollY / totalHeight) * 100}%`;
    }

    if (scrollY >= servicesTop - 80) {
      navbar?.classList.add("scrolled-light");
    } else {
      navbar?.classList.remove("scrolled-light");
    }

    if (scrollY < servicesTop - 150) {
      if (heroVideo && heroVideo.paused && isPlaying) {
        heroVideo.play().catch(() => {});
      }
    } else {
      if (heroVideo && !heroVideo.paused) {
        heroVideo.pause();
      }
    }

    updateScrollProgressAnimations();
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll);
  handleScroll();

  // ==========================================================
  // 5. CANVAS DE BRISA Y PARTÍCULAS
  // ==========================================================
  const canvas = document.getElementById("windParticles");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const dustParticles = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      speedX: Math.random() * 1.5 + 0.6,
      speedY: Math.random() * 0.4 - 0.2,
      alpha: Math.random() * 0.35 + 0.1,
      phase: Math.random() * Math.PI * 2
    }));

    const airStreams = [
      { y: height * 0.35, length: 380, speed: 2.2, amplitude: 18, wavelength: 0.008, phase: 0, alpha: 0.20 },
      { y: height * 0.48, length: 520, speed: 1.8, amplitude: 26, wavelength: 0.006, phase: 2, alpha: 0.24 },
      { y: height * 0.62, length: 440, speed: 2.5, amplitude: 22, wavelength: 0.007, phase: 4, alpha: 0.16 }
    ];

    let currentHeadPositions = airStreams.map(() => Math.random() * width);

    function renderAirFlow() {
      ctx.clearRect(0, 0, width, height);

      airStreams.forEach((stream, i) => {
        currentHeadPositions[i] += stream.speed;
        if (currentHeadPositions[i] - stream.length > width) {
          currentHeadPositions[i] = -50;
          stream.y = height * (0.2 + Math.random() * 0.6);
        }

        const headX = currentHeadPositions[i];
        const tailX = headX - stream.length;

        ctx.save();
        ctx.beginPath();
        const points = 35;
        for (let p = 0; p <= points; p++) {
          const segX = tailX + (stream.length / points) * p;
          const wave = Math.sin(segX * stream.wavelength + stream.phase) * stream.amplitude;
          const segY = stream.y + wave;
          if (p === 0) ctx.moveTo(segX, segY);
          else ctx.lineTo(segX, segY);
        }

        const gradient = ctx.createLinearGradient(tailX, stream.y, headX, stream.y);
        gradient.addColorStop(0, "rgba(6, 182, 212, 0)");
        gradient.addColorStop(0.5, `rgba(14, 165, 233, ${stream.alpha})`);
        gradient.addColorStop(0.85, `rgba(224, 242, 254, ${stream.alpha * 1.3})`);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.shadowBlur = 12;
        ctx.shadowColor = "rgba(6, 182, 212, 0.4)";
        ctx.stroke();
        ctx.restore();

        stream.phase += 0.015;
      });

      dustParticles.forEach((p) => {
        p.phase += 0.03;
        p.x += p.speedX;
        p.y += p.speedY + Math.sin(p.phase) * 0.35;

        if (p.x > width) {
          p.x = -10;
          p.y = Math.random() * height;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(14, 165, 233, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(6, 182, 212, 0.6)";
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(renderAirFlow);
    }

    renderAirFlow();
  }

  // ==========================================================
  // 6. FORMULARIO PRINCIPAL DE CONTACTO A WHATSAPP
  // ==========================================================
  const whatsappForm = document.getElementById("whatsappForm");
  if (whatsappForm) {
    whatsappForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre = document.getElementById("formNombre").value.trim();
      const telefono = document.getElementById("formTelefono").value.trim();
      const consulta = document.getElementById("formConsulta").value.trim();
      const numeroDestino = "51924161281";

      const mensaje = `Hola *Airclim*, deseo solicitar información:%0A%0A` +
        `👤 *Nombre:* ${encodeURIComponent(nombre)}%0A` +
        `📱 *Teléfono:* ${encodeURIComponent(telefono)}%0A` +
        `📝 *Consulta:* ${encodeURIComponent(consulta)}%0A%0A` +
        `_Enviado desde la página web._`;

      window.open(`https://wa.me/${numeroDestino}?text=${mensaje}`, "_blank");
    });
  }

  // ==========================================================
  // 7. FORMULARIO RÁPIDO DEL FOOTER A WHATSAPP
  // ==========================================================
  const footerCallbackForm = document.getElementById("footerCallbackForm");
  if (footerCallbackForm) {
    footerCallbackForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const phone = document.getElementById("callbackPhone").value.trim();
      const mensaje = `Hola *Airclim*, por favor comuníquense conmigo a mi número: *${encodeURIComponent(phone)}*. Solicito información sobre sus servicios de climatización.`;
      window.open(`https://wa.me/51924161281?text=${mensaje}`, "_blank");
    });
  }
});