document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".page-loader");
  window.addEventListener("load", () => loader.classList.add("hide"));

  document.getElementById("year").textContent = new Date().getFullYear();

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", nav.classList.contains("open"));
  });

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  const counters = document.querySelectorAll("[data-target]");
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.target);
      const suffix = el.dataset.suffix || "";
      const duration = 1500;
      const start = performance.now();

      const update = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const value = Math.floor(progress * target);
        el.textContent = value.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString() + suffix;
      };
      requestAnimationFrame(update);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  const slider = document.getElementById("productSlider");
  const productCards = Array.from(slider.querySelectorAll(".product-card"));
  const dots = Array.from(document.querySelectorAll(".carousel-dot"));
  let currentSlide = 0;
  let autoPlay;

  const getStep = () => {
    if (!productCards.length) return 0;
    const cardWidth = productCards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(slider).gap) || 22;
    return cardWidth + gap;
  };

  const updateDots = () => {
    const step = getStep();
    if (!step) return;
    currentSlide = Math.round(slider.scrollLeft / step);
    currentSlide = Math.max(0, Math.min(currentSlide, productCards.length - 1));
    dots.forEach((dot, index) => dot.classList.toggle("active", index === currentSlide));
  };

  const goToSlide = (index) => {
    const step = getStep();
    currentSlide = (index + productCards.length) % productCards.length;
    slider.scrollTo({ left: currentSlide * step, behavior: "smooth" });
    dots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === currentSlide));
  };

  const nextSlide = () => {
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    const step = getStep();

    if (slider.scrollLeft + step >= maxScroll - 8) {
      slider.scrollTo({ left: 0, behavior: "smooth" });
      currentSlide = 0;
    } else {
      slider.scrollBy({ left: step, behavior: "smooth" });
      currentSlide = Math.min(currentSlide + 1, productCards.length - 1);
    }

    setTimeout(updateDots, 350);
  };

  const previousSlide = () => {
    const step = getStep();
    if (slider.scrollLeft <= 8) {
      slider.scrollTo({ left: slider.scrollWidth, behavior: "smooth" });
    } else {
      slider.scrollBy({ left: -step, behavior: "smooth" });
    }
    setTimeout(updateDots, 350);
  };

  const startAutoPlay = () => {
    clearInterval(autoPlay);
    autoPlay = setInterval(nextSlide, 4500);
  };

  document.querySelector(".next").addEventListener("click", () => {
    nextSlide();
    startAutoPlay();
  });

  document.querySelector(".prev").addEventListener("click", () => {
    previousSlide();
    startAutoPlay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index);
      startAutoPlay();
    });
  });

  slider.addEventListener("scroll", () => requestAnimationFrame(updateDots));
  slider.addEventListener("mouseenter", () => clearInterval(autoPlay));
  slider.addEventListener("mouseleave", startAutoPlay);
  slider.addEventListener("touchstart", () => clearInterval(autoPlay), { passive: true });
  slider.addEventListener("touchend", startAutoPlay, { passive: true });

  startAutoPlay();

  document.getElementById("whatsappForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const company = document.getElementById("company").value.trim() || "Not provided";
    const quantity = document.getElementById("quantity").value.trim() || "Not specified";
    const product = document.getElementById("product").value.trim();
    const message = document.getElementById("message").value.trim() || "No additional details";

    const text =
`Hello HELPFIX Engineering,

I would like to request a quotation.

Name: ${name}
Phone: ${phone}
Company: ${company}
Product / Equipment Needed: ${product}
Quantity: ${quantity}

Additional Details:
${message}

Thank you.`;

    window.open("https://wa.me/2349076816320?text=" + encodeURIComponent(text), "_blank");
  });

  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const top = section.offsetTop - 140;
      if (scrollY >= top) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  });
});
