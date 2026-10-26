// ========== Barra de progreso, header y botón de volver arriba ==========
window.addEventListener('scroll', () => {
  const h = document.documentElement,
    b = document.body,
    st = 'scrollTop',
    sh = 'scrollHeight';
  const alto = (h[sh] || b[sh]) - h.clientHeight;
  const y = h[st] || b[st];
  const percent = alto > 0 ? (y / alto) * 100 : 0;

  const scrollBar = document.getElementById('scroll-bar');
  if (scrollBar) scrollBar.style.width = percent + '%';

  const header = document.getElementById('site-header');
  if (header) header.classList.toggle('scrolled', y > 10);

  const toTop = document.getElementById('to-top');
  if (toTop) toTop.classList.toggle('visible', y > 600);
});

document.addEventListener('DOMContentLoaded', () => {
  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      const abierto = nav.classList.toggle('active');
      menuToggle.classList.toggle('active', abierto);
      menuToggle.setAttribute('aria-expanded', String(abierto));
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
        behavior: sinMovimiento ? 'auto' : 'smooth',
      });
      if (nav && menuToggle) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ========== Volver arriba ==========
  const toTop = document.getElementById('to-top');
  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: sinMovimiento ? 'auto' : 'smooth' });
    });
  }

  // ========== Cifras que cuentan al entrar en pantalla ==========
  const cifras = document.querySelectorAll('.stat-num[data-count]');

  const pintar = (el, valor) => {
    el.textContent = valor + (el.dataset.suffix || '');
  };

  if (sinMovimiento) {
    cifras.forEach((el) => pintar(el, Number(el.dataset.count)));
  } else {
    const contador = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          contador.unobserve(el);

          const destino = Number(el.dataset.count) || 0;
          const duracion = 1400;
          const inicio = performance.now();

          const paso = (ahora) => {
            const avance = Math.min((ahora - inicio) / duracion, 1);
            // Desaceleración para que el número "aterrice" en vez de cortarse.
            const suave = 1 - Math.pow(1 - avance, 3);
            pintar(el, Math.round(destino * suave));
            if (avance < 1) requestAnimationFrame(paso);
          };

          requestAnimationFrame(paso);
        });
      },
      { threshold: 0.6 }
    );

    cifras.forEach((el) => contador.observe(el));
  }

  // ========== Pestañas de líneas de producto ==========
  const tabs = Array.from(document.querySelectorAll('.tab-btn'));

  const activar = (boton) => {
    tabs.forEach((t) => {
      const seleccionado = t === boton;
      t.setAttribute('aria-selected', String(seleccionado));
      t.tabIndex = seleccionado ? 0 : -1;

      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.classList.toggle('activo', seleccionado);
      panel.hidden = !seleccionado;
    });
  };

  tabs.forEach((boton, i) => {
    boton.addEventListener('click', () => activar(boton));

    boton.addEventListener('keydown', (e) => {
      let siguiente = null;
      if (e.key === 'ArrowRight') siguiente = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') siguiente = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') siguiente = tabs[0];
      if (e.key === 'End') siguiente = tabs[tabs.length - 1];
      if (!siguiente) return;
      e.preventDefault();
      activar(siguiente);
      siguiente.focus();
    });
  });
});
