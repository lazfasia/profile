const sections = [...document.querySelectorAll("section[id]")];
const navLinks = [...document.querySelectorAll("#navLinks a")];
const progressFill = document.getElementById("progressFill");
const toTop = document.getElementById("toTop");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const syncActiveNav = () => {
  const fromTop = window.scrollY + 140;
  let current = sections[0]?.id;
  sections.forEach((section) => {
    if (section.offsetTop <= fromTop) current = section.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
};

const syncProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressFill.style.height = `${Math.max(8, Math.min(100, ratio))}%`;
  toTop.classList.toggle("show", window.scrollY > 500);
};

window.addEventListener("scroll", () => {
  syncActiveNav();
  syncProgress();
});

syncActiveNav();
syncProgress();

document.querySelectorAll(".timeline-card").forEach((card) => {
  const toggle = () => card.classList.toggle("open");
  card.addEventListener("click", toggle);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  });
});

document.querySelectorAll(".case-card").forEach((card) => {
  const trigger = card.querySelector(".case-top");
  const toggle = () => card.classList.toggle("open");
  trigger.addEventListener("click", toggle);
  trigger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  });
});

const heroCard = document.getElementById("heroCard");
heroCard?.addEventListener("pointermove", (e) => {
  const rect = heroCard.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  heroCard.style.setProperty("--mx", `${x}%`);
  heroCard.style.setProperty("--my", `${y}%`);
});

const photoFrame = document.getElementById("photoFrame");
photoFrame?.addEventListener("pointermove", (e) => {
  const rect = photoFrame.getBoundingClientRect();
  const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
  const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
  photoFrame.style.transform = `rotateY(${x * 10}deg) rotateX(${y * -10}deg) translateY(-4px)`;
});

photoFrame?.addEventListener("pointerleave", () => {
  photoFrame.style.transform = "rotateY(0deg) rotateX(0deg) translateY(0px)";
});

const animateCount = (el) => {
  const target = Number(el.dataset.count || 0);
  const duration = 1400;
  const start = 0;
  const startTs = performance.now();

  const tick = (ts) => {
    const progress = Math.min((ts - startTs) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = "true";
        animateCount(entry.target);
      }
    });
  },
  { threshold: 0.7 }
);

document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));
