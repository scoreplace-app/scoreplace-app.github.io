function initRouter() {
  const links = document.querySelectorAll('.nav-link');
  const viewContainer = document.getElementById('view-container');

  const handleRoute = () => {
    const hash = window.location.hash || '#dashboard';
    const hashPath = hash.substring(1);
    const parts = hashPath.split('/');
    const view = parts[0];
    const param = parts[1] || null;

    links.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === hash) l.classList.add('active');
    });

    viewContainer.innerHTML = '';
    // Limpar scrollbar fixa do bracket ao mudar de view
    const fixedBar = document.getElementById('bracket-fixed-scrollbar');
    if (fixedBar) fixedBar.remove();

    switch (view) {
      case 'dashboard':
        renderDashboard(viewContainer);
        break;
      case 'tournaments':
        if (param) {
          renderTournaments(viewContainer, param);
        } else {
          window.location.replace('#dashboard');
        }
        break;
      case 'pre-draw':
        renderPreDraw(viewContainer, param);
        break;
      case 'bracket':
        renderBracket(viewContainer, param);
        break;
      case 'participants':
        renderParticipants(viewContainer, param);
        break;
      case 'rules':
        renderRules(viewContainer, param);
        break;
      default:
        viewContainer.innerHTML = `<div class="card"><div class="card-body"><h3>Em construção</h3><p>A página ${view} estará disponível em breve.</p></div></div>`;
    }
  };

  // Remove listener anterior para evitar duplicação (initRouter pode ser chamado múltiplas vezes)
  if (window._routerHandler) {
    window.removeEventListener('hashchange', window._routerHandler);
  }
  window._routerHandler = handleRoute;
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}
