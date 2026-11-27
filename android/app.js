(() => {
  const clave = 'agrogestion.url';
  const formulario = document.querySelector('form');
  const campo = document.getElementById('direccion');
  const abrir = document.getElementById('abrir');
  const cambiar = document.getElementById('cambiar');
  const instalar = document.getElementById('instalar');
  const ayuda = document.getElementById('ayuda');
  const aviso = document.querySelector('[role=status]');
  let solicitudInstalacion;

  function direccionValida(valor) {
    try {
      const url = new URL(valor);
      if (url.origin === 'https://script.google.com' && !url.username && !url.password &&
        /^\/macros\/s\/[\w-]+\/(dev|exec)$/.test(url.pathname)) return url.href;
    } catch {
      return null;
    }
    return null;
  }

  function mostrar(url) {
    formulario.hidden = Boolean(url);
    abrir.hidden = cambiar.hidden = !url;
    if (url) abrir.href = url;
  }

  try {
    mostrar(direccionValida(localStorage.getItem(clave)));
  } catch {
    mostrar(null);
  }

  cambiar.addEventListener('click', () => {
    campo.value = abrir.href;
    mostrar(null);
    campo.focus();
  });

  formulario.addEventListener('submit', evento => {
    evento.preventDefault();
    const url = direccionValida(campo.value.trim());
    if (!url) {
      aviso.textContent = 'Pega la dirección de Apps Script terminada en /dev o /exec.';
      return;
    }
    try {
      localStorage.setItem(clave, url);
    } catch {
      aviso.textContent = 'El navegador no permite guardar la dirección. Podrás abrirla durante esta sesión.';
      mostrar(url);
      return;
    }
    aviso.textContent = '';
    mostrar(url);
    abrir.focus();
  });

  function instalada() {
    instalar.hidden = ayuda.hidden = true;
    solicitudInstalacion = null;
  }

  if (matchMedia('(display-mode: standalone)').matches) instalada();
  window.addEventListener('appinstalled', instalada);
  window.addEventListener('beforeinstallprompt', evento => {
    evento.preventDefault();
    solicitudInstalacion = evento;
    instalar.hidden = false;
  });
  instalar.addEventListener('click', async () => {
    if (!solicitudInstalacion) return;
    const evento = solicitudInstalacion;
    solicitudInstalacion = null;
    instalar.hidden = true;
    try {
      await evento.prompt();
    } catch {
      ayuda.hidden = false;
    }
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => { ayuda.hidden = false; });
  }
})();
