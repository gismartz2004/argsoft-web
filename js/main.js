// ========== Partículas 2D ligero ==========
const canvas = document.getElementById('particles-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

// Solo inicializar si el canvas existe y es visible
if (canvas && canvas.style.display !== 'none') {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

let particlesArray = [];
const particleCount = 80;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
    if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
  }
  draw() {
    ctx.fillStyle = 'rgba(0, 240, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particlesArray = [];
  for (let i = 0; i < particleCount; i++) {
    particlesArray.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
  }
  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});

initParticles();
animateParticles();

// ========== Gestión de temas ==========
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('argsoft-theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);

  document.querySelectorAll('.theme-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      root.setAttribute('data-theme', theme);
      localStorage.setItem('argsoft-theme', theme);
    });
  });

  // ========== Fade al hacer scroll ==========
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-section').forEach(section => {
    observer.observe(section);
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
});

// ====== Interacción con clientes ======
document.querySelectorAll('.cliente').forEach(card => {
  const url = card.dataset.url;

  // Al hacer clic en la tarjeta → ir al sitio del cliente
  card.addEventListener('click', (e) => {
    if (!e.target.classList.contains('btn-ver-mas')) {
      window.open(url, '_blank');
    }
  });

  // Al hacer clic en "Ver más" → abrir modal
  card.querySelector('.btn-ver-mas').addEventListener('click', (e) => {
    e.stopPropagation();
    const modalId = card.dataset.modal;
    document.getElementById(modalId).style.display = 'block';
  });
});

// Cerrar modal
document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal').style.display = 'none';
  });
});

// Cerrar al hacer clic fuera del contenido
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});

// ====== Menú responsive ======
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace (móvil)
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }
});
// Funciones para los modales de imágenes
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevenir scroll
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Restaurar scroll
  }
}

// Cerrar modal al hacer clic fuera de la imagen
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('image-modal')) {
    e.target.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    const modals = document.querySelectorAll('.image-modal');
    modals.forEach(modal => {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  }
});

// Inicializar modales en DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  // También puedes añadir eventos de clic aquí si prefieres
  const visualContainers = document.querySelectorAll('.visual-container');
  visualContainers.forEach(container => {
    container.style.cursor = 'pointer';
  });
});