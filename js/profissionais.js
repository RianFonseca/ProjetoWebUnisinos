const Profissionais = (function () {
    const lista = [
        {
            id: 'p1', nome: 'Dra. Maria Silva', especialidade: 'Clínica Geral',
            crm: 'CRM/SP 123456', telefone: '(11) 98765-4321', email: 'maria.silva@saude.com',
            endereco: 'Rua das Flores, 100 — Centro', horarios: 'Seg a Sex, 8h às 17h',
            rating: 4.8, avatar: '<i class="bi bi-person-badge"></i>',
            descricao: 'Médica com 15 anos de experiência em atendimento geral e preventivo.'
        },
        {
            id: 'p2', nome: 'Dr. João Santos', especialidade: 'Cardiologia',
            crm: 'CRM/SP 234567', telefone: '(11) 91234-5678', email: 'joao.santos@saude.com',
            endereco: 'Av. Paulista, 500 — Bela Vista', horarios: 'Seg a Qui, 9h às 16h',
            rating: 4.9, avatar: '<i class="bi bi-person-badge"></i>',
            descricao: 'Cardiologista especializado em prevenção e tratamento de doenças cardiovasculares.'
        },
        {
            id: 'p3', nome: 'Dra. Ana Oliveira', especialidade: 'Dermatologia',
            crm: 'CRM/SP 345678', telefone: '(11) 93456-7890', email: 'ana.oliveira@saude.com',
            endereco: 'Rua Augusta, 200 — Consolação', horarios: 'Ter a Sáb, 10h às 18h',
            rating: 4.7, avatar: '<i class="bi bi-person-badge"></i>',
            descricao: 'Especialista em dermatologia clínica e estética com foco em cuidados preventivos.'
        },
        {
            id: 'p4', nome: 'Dr. Pedro Costa', especialidade: 'Ortopedia',
            crm: 'CRM/SP 456789', telefone: '(11) 94567-8901', email: 'pedro.costa@saude.com',
            endereco: 'Rua dos Pinheiros, 300', horarios: 'Seg a Sex, 7h às 15h',
            rating: 4.6, avatar: '<i class="bi bi-person-badge"></i>',
            descricao: 'Ortopedista com foco em medicina esportiva e reabilitação.'
        },
        {
            id: 'p5', nome: 'Dra. Carla Ferreira', especialidade: 'Psicologia',
            crm: 'CRP 06/12345', telefone: '(11) 95678-9012', email: 'carla.ferreira@saude.com',
            endereco: 'Rua Oscar Freire, 400', horarios: 'Seg a Sex, 8h às 20h',
            rating: 4.9, avatar: '<i class="bi bi-person-badge"></i>',
            descricao: 'Psicóloga clínica com abordagem cognitivo-comportamental.'
        },
        {
            id: 'p6', nome: 'Dr. Lucas Mendes', especialidade: 'Neurologia',
            crm: 'CRM/SP 567890', telefone: '(11) 96789-0123', email: 'lucas.mendes@saude.com',
            endereco: 'Alameda Santos, 600', horarios: 'Seg, Qua e Sex, 9h às 17h',
            rating: 4.8, avatar: '<i class="bi bi-person-badge"></i>',
            descricao: 'Neurologista com experiência em distúrbios do sono e cefaleia.'
        },
        {
            id: 'p7', nome: 'Dra. Julia Lima', especialidade: 'Nutrição',
            crm: 'CRN 3/45678', telefone: '(11) 97890-1234', email: 'julia.lima@saude.com',
            endereco: 'Rua Haddock Lobo, 700', horarios: 'Seg a Sex, 8h às 18h',
            rating: 4.7, avatar: '<i class="bi bi-person-badge"></i>',
            descricao: 'Nutricionista especializada em reeducação alimentar e nutrição funcional.'
        },
        {
            id: 'p8', nome: 'Dr. Roberto Alves', especialidade: 'Psiquiatria',
            crm: 'CRM/SP 678901', telefone: '(11) 98901-2345', email: 'roberto.alves@saude.com',
            endereco: 'Rua Bela Cintra, 800', horarios: 'Ter a Sáb, 9h às 17h',
            rating: 4.6, avatar: '<i class="bi bi-person-badge"></i>',
            descricao: 'Psiquiatra com foco em transtornos de ansiedade e humor.'
        },
        {
            id: 'p9', nome: 'Dra. Fernanda Rocha', especialidade: 'Ginecologia',
            crm: 'CRM/SP 789012', telefone: '(11) 99012-3456', email: 'fernanda.rocha@saude.com',
            endereco: 'Av. Brasil, 900 — Jardim América', horarios: 'Seg a Sex, 8h às 16h',
            rating: 4.8, avatar: '<i class="bi bi-person-badge"></i>',
            descricao: 'Ginecologista com experiência em saúde da mulher e medicina preventiva.'
        }
    ];

    function render() {
        var esps = [];
        lista.forEach(function (p) {
            if (esps.indexOf(p.especialidade) === -1) esps.push(p.especialidade);
        });

        return `
      <div class="container">
        <div class="page-header">
          <h1><i class="bi bi-person-badge"></i> Profissionais</h1>
          <p>Encontre e conheça os profissionais de saúde disponíveis.</p>
        </div>
        <div class="agenda-toolbar">
          <div class="search-box">
            <input type="text" id="prof-busca" placeholder="Buscar profissional..." oninput="Profissionais.filter()">
          </div>
        </div>
        <div class="pill-nav" id="prof-pills">
          <button class="pill active" data-esp="" onclick="Profissionais.filterEsp(this)">Todos</button>
          ${esps.map(function (e) {
            return '<button class="pill" data-esp="' + e + '" onclick="Profissionais.filterEsp(this)">' + e + '</button>';
        }).join('')}
        </div>
        <div class="prof-grid" id="prof-grid">
          ${lista.map(renderCard).join('')}
        </div>
      </div>
    `;
    }

    function renderCard(p) {
        var fav = Storage.isFavorito(p.id);
        return `
      <div class="prof-card" data-esp="${p.especialidade}" data-nome="${p.nome.toLowerCase()}">
        <div class="prof-card-header">
          <div class="prof-avatar">${p.avatar}</div>
          <h3>${p.nome}</h3>
          <span class="prof-specialty">${p.especialidade}</span>
        </div>
        <div class="prof-card-body">
          <div class="prof-info-item">
            <span class="prof-info-icon"><i class="bi bi-card-text"></i></span> ${p.crm}
          </div>
          <div class="prof-info-item">
            <span class="prof-info-icon"><i class="bi bi-telephone"></i></span> ${p.telefone}
          </div>
          <div class="prof-info-item">
            <span class="prof-info-icon"><i class="bi bi-clock"></i></span> ${p.horarios}
          </div>
          <div class="prof-info-item">
            <span class="prof-rating"><i class="bi bi-star-fill"></i> ${p.rating}</span>
            <button class="btn btn-icon" style="margin-left:auto;color:${fav ? 'var(--danger)' : 'var(--text-muted)'}" onclick="event.stopPropagation();Profissionais.toggleFav('${p.id}')">
              <i class="bi bi-${fav ? 'heart-fill' : 'heart'}"></i>
            </button>
          </div>
        </div>
        <div class="prof-card-footer">
          <button class="btn btn-secondary btn-sm" onclick="Profissionais.showDetails('${p.id}')"><i class="bi bi-info-circle"></i> Detalhes</button>
          <button class="btn btn-primary btn-sm" onclick="Profissionais.agendar('${p.id}')"><i class="bi bi-calendar-plus"></i> Agendar</button>
        </div>
      </div>
    `;
    }

    function filter() {
        var q = (document.getElementById('prof-busca').value || '').toLowerCase();
        var espAtivo = document.querySelector('#prof-pills .pill.active');
        var esp = espAtivo ? espAtivo.dataset.esp : '';

        document.querySelectorAll('.prof-card').forEach(function (card) {
            var matchNome = card.dataset.nome.includes(q);
            var matchEsp = !esp || card.dataset.esp === esp;
            card.style.display = (matchNome && matchEsp) ? '' : 'none';
        });
    }

    function filterEsp(btn) {
        document.querySelectorAll('#prof-pills .pill').forEach(function (p) { p.classList.remove('active'); });
        btn.classList.add('active');
        filter();
    }

    function toggleFav(id) {
        Storage.toggleFavorito(id);
        var grid = document.getElementById('prof-grid');
        if (grid) {
            grid.innerHTML = lista.map(renderCard).join('');
            filter();
        }
    }

    function showDetails(id) {
        var p = lista.find(function (x) { return x.id === id; });
        if (!p) return;
        var html = `
      <div style="text-align:center;margin-bottom:20px;">
        <div class="prof-avatar" style="width:80px;height:80px;font-size:2rem;margin:0 auto 12px;background:linear-gradient(135deg,var(--primary),var(--secondary));color:white;display:flex;align-items:center;justify-content:center;border-radius:50%;">${p.avatar}</div>
        <h3>${p.nome}</h3>
        <span class="prof-specialty" style="background:var(--primary-bg);color:var(--primary);display:inline-block;padding:4px 14px;border-radius:20px;font-size:0.82rem;margin-top:6px;">${p.especialidade}</span>
        <div class="prof-rating" style="margin-top:8px;"><i class="bi bi-star-fill"></i> ${p.rating}</div>
      </div>
      <p style="margin-bottom:16px;color:var(--text-secondary)">${p.descricao}</p>
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px;">
        <div class="prof-info-item"><span class="prof-info-icon"><i class="bi bi-card-text"></i></span> ${p.crm}</div>
        <div class="prof-info-item"><span class="prof-info-icon"><i class="bi bi-telephone"></i></span> ${p.telefone}</div>
        <div class="prof-info-item"><span class="prof-info-icon"><i class="bi bi-envelope"></i></span> ${p.email}</div>
        <div class="prof-info-item"><span class="prof-info-icon"><i class="bi bi-geo-alt"></i></span> ${p.endereco}</div>
        <div class="prof-info-item"><span class="prof-info-icon"><i class="bi bi-clock"></i></span> ${p.horarios}</div>
      </div>
      <button class="btn btn-primary btn-block" onclick="Profissionais.agendar('${p.id}')"><i class="bi bi-calendar-plus"></i> Agendar consulta</button>
    `;
        App.openModal(p.nome, html);
    }

    function agendar(id) {
        var p = lista.find(function (x) { return x.id === id; });
        if (!p) return;
        App.closeModal();
        App.navigate('agendamentos');
        setTimeout(function () {
            Agendamentos.openModal();
            setTimeout(function () {
                var profEl = document.getElementById('ag-prof');
                var espEl = document.getElementById('ag-esp');
                if (profEl) profEl.value = p.nome;
                if (espEl) espEl.value = p.especialidade;
            }, 100);
        }, 200);
    }

    function init() { }
    function destroy() { }

    return { render, init, destroy, filter, filterEsp, toggleFav, showDetails, agendar };
})();
