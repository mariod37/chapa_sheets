/* Menú único del sitio. Se edita acá y cambia en todas las páginas. */
(function () {
  // Pegá acá el link de Informes (si está vacío, la opción no se muestra).
  var INFORMES_URL = 'https://informes-chapa.netlify.app/';

  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (page.indexOf('vida-ministerio') === 0) page = 'vida-ministerio.html';

  var items = [
    { href: 'index.html', label: 'Discursos' },
    { href: 'asignaciones.html', label: 'Asignaciones' },
    { href: 'limpieza.html', label: 'Limpieza' },
    { href: 'predicacion.html', label: 'Predicación' },
    { href: 'vida-ministerio.html', label: 'Vida y Ministerio' },
    { href: 'Audio-video.html', label: 'Audio y Video' }
  ];
  if (INFORMES_URL) items.push({ href: INFORMES_URL, label: 'Informes', external: true });

  var current = 'Chapa Sheets';
  var links = items.map(function (it) {
    var active = !it.external && it.href.toLowerCase() === page;
    if (active) current = it.label;
    return '<li class="nav-item"><a class="nav-link' + (active ? ' active' : '') + '" href="' + it.href + '"' +
      (it.external ? ' target="_blank" rel="noopener"' : '') + (active ? ' aria-current="page"' : '') + '>' +
      it.label + '</a></li>';
  }).join('');

  var html =
    '<nav class="navbar navbar-dark bg-dark sticky-top navbar-expand-lg site-nav">' +
      '<div class="container-fluid">' +
        '<span class="navbar-brand mb-0 fw-semibold">' + current + '</span>' +
        '<button class="navbar-toggler site-nav-toggler ms-auto" type="button" data-bs-toggle="collapse" ' +
          'data-bs-target="#siteNavMenu" aria-controls="siteNavMenu" aria-expanded="false" aria-label="Abrir menú">' +
          '<span class="site-nav-icon" aria-hidden="true">&#9776;</span><span class="site-nav-label">Menú</span>' +
        '</button>' +
        '<div class="collapse navbar-collapse" id="siteNavMenu">' +
          '<ul class="navbar-nav ms-lg-auto">' + links + '</ul>' +
        '</div>' +
      '</div>' +
    '</nav>';

  var style = document.createElement('style');
  style.textContent =
    '.site-nav .navbar-brand{font-size:1.15rem}' +
    '.site-nav-toggler{display:inline-flex;align-items:center;gap:.5rem;min-height:48px;padding:.4rem .9rem;' +
      'border:2px solid #0d6efd;border-radius:.6rem;background:#0d6efd;color:#fff;font-weight:600;font-size:1.05rem}' +
    '.site-nav-toggler:focus{box-shadow:0 0 0 .25rem rgba(13,110,253,.4)}' +
    '.site-nav-icon{font-size:1.8rem;line-height:1}' +
    '.site-nav .nav-link{font-size:1.05rem;padding:.7rem .75rem}' +
    '.site-nav .nav-link.active{font-weight:700;color:#fff;border-bottom:3px solid #0d6efd}' +
    '@media (max-width:991.98px){.site-nav .nav-link{padding:.85rem .5rem;border-top:1px solid rgba(255,255,255,.1)}' +
      '.site-nav .nav-link.active{border-bottom:0;background:rgba(13,110,253,.25);border-radius:.4rem}}' +
    '@media (min-width:992px){.site-nav-toggler{display:none}}';
  document.head.appendChild(style);

  document.currentScript.insertAdjacentHTML('beforebegin', html);
})();
