
// Gestión de temas
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const buttons = document.querySelectorAll('.theme-toggle button');
  const savedTheme = localStorage.getItem('argsoft-theme') || 'dark';

  // Aplicar tema guardado
  root.setAttribute('data-theme', savedTheme);

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      root.setAttribute('data-theme', theme);
      localStorage.setItem('argsoft-theme', theme);
    });
  });
});