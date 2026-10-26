// ========== Barra de progreso de scroll ==========
window.addEventListener('scroll', () => {
  const h = document.documentElement,
    b = document.body,
    st = 'scrollTop',
    sh = 'scrollHeight';
  const percent = ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100;
  const scrollBar = document.getElementById('scroll-bar');
  if (scrollBar) scrollBar.style.width = percent + '%';
});

document.addEventListener('DOMContentLoaded', () => {
  // ========== Aparición de secciones al hacer scroll ==========
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.fade-section').forEach((section) => {
    observer.observe(section);
  });

  // ========== Menú responsive ==========
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }

  // ========== Scroll suave para anclas internas ==========
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth',
      });
      if (nav && menuToggle) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    });
  });
});
