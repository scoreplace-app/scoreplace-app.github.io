function initRouter() {
  const links = document.querySelectorAll('.nav-link');
  const viewContainer = document.getElementById('view-container');

  const handleRoute = () => {
    const hash = window.location.hash || '#dashboard';
    const hashPath = hash.substring(1);
    const parts = hashPath.split('/');
    const view = parts[0];
    const param = parts[1] || null;

    // --- Track invited tournament IDs for visibility ---
    if (view === 'tournaments' && param && window.AppStore) {
      if (window.AppStore._invitedTournamentIds.indexOf(param) === -1) {
        window.AppStore._invitedTournamentIds.push(param);
      }
    }

    // --- Invite redirect: if not logged in and visiting a tournament, save destination and show login ---
    const isLoggedIn = !!(window.AppStore && window.AppStore.currentUser);
    if (!isLoggedIn && view === 'tournaments' && param) {
      // Save the intended destination so we can redirect after login
      window._pendingInviteHash = hash;
      // Show a friendly message and the login modal
      viewContainer.innerHTML = '';
      viewContainer.innerHTML = `
        <div style="max-width: 500px; margin: 3rem auto; text-align: center; padding: 2rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">\u{1F3C6}</div>
          <h2 style="color: var(--text-bright); margin-bottom: 0.5rem;">Voc\u00EA foi convidado!</h2>
          <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Fa\u00E7a login para ver este torneio e se inscrever.</p>
          <button class="btn btn-primary" onclick="if(typeof openModal==='function')openModal('modal-login');" style="padding: 0.75rem 2rem; font-size: 1rem; font-weight: 600;">
            Entrar com Google
          </button>
        </div>`;
      return;
    }

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
        viewContainer.innerHTML = `<div class="card"><div class="card-body"><h3>Em constru\u00E7\u00E3o</h3><p>A p\u00E1gina ${view} estar\u00E1 dispon\u00EDvel em breve.</p></div></div>`;
    }
  };

  // Remove listener anterior para evitar duplica\u00E7\u00E3o (initRouter pode ser chamado m\u00FAltiplas vezes)
  if (window._routerHandler) {
    window.removeEventListener('hashchange', window._routerHandler);
  }
  window._routerHandler = handleRoute;
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}
