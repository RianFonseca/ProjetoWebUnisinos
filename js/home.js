const Home = (function () {
    let tipsInterval = null;
    let tipIdx = 0;

    const tips = [
        { icon: 'droplet', title: 'Hidratação', text: 'Beba pelo menos 2 litros de água por dia para manter seu corpo funcionando bem.' },
        { icon: 'moon-stars', title: 'Sono de Qualidade', text: 'Durma entre 7 e 9 horas por noite. Um bom sono é essencial para a saúde.' },
        { icon: 'bicycle', title: 'Exercícios Físicos', text: '30 minutos de atividade moderada por dia reduz riscos cardiovasculares.' },
        { icon: 'apple', title: 'Alimentação Saudável', text: 'Inclua frutas, verduras e grãos integrais em todas as refeições.' },
        { icon: 'emoji-smile', title: 'Saúde Mental', text: 'Pratique meditação ou atividades relaxantes para reduzir estresse e ansiedade.' }
    ];

    function render() {
        var stats = Storage.getStats();
        return `
      <section class="hero">
        <div class="container">
          <div class="hero-grid">
            <div class="hero-content">
              <h1>Cuidar da saúde é um <span class="highlight">ato de amor</span></h1>
              <p>Organize suas consultas, acompanhe seus hábitos e mantenha o controle do seu bem-estar com o SaúdeVida.</p>
              <div class="hero-buttons">
                <button class="btn btn-primary" onclick="App.navigate('agendamentos')"><i class="bi bi-calendar-check"></i> Agendar consulta</button>
                <button class="btn btn-secondary" onclick="App.navigate('diario')"><i class="bi bi-journal-text"></i> Meu diário</button>
              </div>
            </div>
            <div class="hero-visual">
              <div class="hero-illustration">
                <i class="bi bi-heart-pulse"></i>
                <div class="hero-float-card">
                  <div class="card-icon green"><i class="bi bi-calendar-check"></i></div>
                  <div class="card-info"><span>Próxima consulta</span><strong>Amanhã, 9h</strong></div>
                </div>
                <div class="hero-float-card">
                  <div class="card-icon blue"><i class="bi bi-droplet"></i></div>
                  <div class="card-info"><span>Hidratação</span><strong>6 copos hoje</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-header">
            <span class="section-badge"><i class="bi bi-grid"></i> Funcionalidades</span>
            <h2>Tudo que você precisa</h2>
            <p>Ferramentas para organizar e acompanhar sua saúde no dia a dia.</p>
          </div>
          <div class="features-grid">
            <div class="feature-card" data-page="agendamentos">
              <div class="feature-icon"><i class="bi bi-calendar-check"></i></div>
              <h3>Agendamentos</h3>
              <p>Organize e gerencie suas consultas médicas com facilidade.</p>
            </div>
            <div class="feature-card" data-page="diario">
              <div class="feature-icon"><i class="bi bi-journal-text"></i></div>
              <h3>Diário de Saúde</h3>
              <p>Registre humor, hidratação, sono e pressão arterial diariamente.</p>
            </div>
            <div class="feature-card" data-page="profissionais">
              <div class="feature-icon"><i class="bi bi-person-badge"></i></div>
              <h3>Profissionais</h3>
              <p>Encontre e conheça os profissionais de saúde disponíveis.</p>
            </div>
            <div class="feature-card" data-page="perfil">
              <div class="feature-icon"><i class="bi bi-person"></i></div>
              <h3>Meu Perfil</h3>
              <p>Gerencie dados pessoais, informações de saúde e emergência.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-header">
            <span class="section-badge"><i class="bi bi-bar-chart"></i> Resumo</span>
            <h2>Seus números</h2>
          </div>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon"><i class="bi bi-calendar-check"></i></div>
              <span class="stat-number">${stats.totalAgendamentos}</span>
              <span class="stat-label">Agendamentos</span>
            </div>
            <div class="stat-card">
              <div class="stat-icon"><i class="bi bi-check-circle"></i></div>
              <span class="stat-number">${stats.agendamentosConfirmados}</span>
              <span class="stat-label">Confirmados</span>
            </div>
            <div class="stat-card">
              <div class="stat-icon"><i class="bi bi-journal-text"></i></div>
              <span class="stat-number">${stats.totalDiario}</span>
              <span class="stat-label">Registros no diário</span>
            </div>
            <div class="stat-card">
              <div class="stat-icon"><i class="bi bi-heart-pulse"></i></div>
              <span class="stat-number">${stats.ultimoDiario ? stats.ultimoDiario.pressao || '--' : '--'}</span>
              <span class="stat-label">Última pressão</span>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-header">
            <span class="section-badge"><i class="bi bi-lightbulb"></i> Dicas</span>
            <h2>Dicas de Saúde</h2>
          </div>
          <div class="tips-carousel">
            <div class="tips-track" id="tips-track">
              ${tips.map(function (t) {
            return '<div class="tip-card">' +
                '<div class="tip-card-icon"><i class="bi bi-' + t.icon + '"></i></div>' +
                '<div><h3>' + t.title + '</h3><p>' + t.text + '</p></div></div>';
        }).join('')}
            </div>
            <div class="tips-nav" id="tips-dots">
              ${tips.map(function (_, i) {
            return '<button class="tip-dot ' + (i === 0 ? 'active' : '') + '" data-tip="' + i + '"></button>';
        }).join('')}
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-header">
            <span class="section-badge"><i class="bi bi-info-circle"></i> Sobre</span>
            <h2>Sobre o Projeto</h2>
          </div>
          <div class="card">
            <div class="card-body">
              <p>O <strong>SaúdeVida</strong> é um projeto acadêmico de extensão com foco em <strong>Cuidado em Saúde</strong>.</p>
              <br>
              <p>Cuidado em saúde é uma ação integral fruto do "entre-relações" de pessoas — traduzida em tratamento digno, com qualidade, acolhimento e vínculo.</p>
              <br>
              <p>Fonte: <a href="https://www.fiocruz.br" target="_blank" rel="noopener" style="color:var(--primary)">FioCruz</a></p>
            </div>
          </div>
        </div>
      </section>

      <section class="section" style="text-align:center; padding-bottom:80px;">
        <div class="container">
          <h2 style="margin-bottom:12px;">Comece a cuidar da sua saúde agora</h2>
          <p style="color:var(--text-secondary); margin-bottom:24px;">Registre seus dados de saúde, agende consultas e acompanhe seu bem-estar.</p>
          <button class="btn btn-primary" onclick="App.navigate('diario')"><i class="bi bi-journal-text"></i> Começar agora</button>
        </div>
      </section>
    `;
    }

    function init() {
        startCarousel();

        document.querySelectorAll('.stat-card, .feature-card').forEach(function (el) {
            el.classList.add('animate-in');
        });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-in').forEach(function (el) {
            observer.observe(el);
        });
    }

    function startCarousel() {
        var dots = document.getElementById('tips-dots');
        if (dots) {
            dots.addEventListener('click', function (e) {
                var btn = e.target.closest('.tip-dot');
                if (!btn) return;
                showTip(parseInt(btn.dataset.tip));
            });
        }

        tipsInterval = setInterval(function () {
            tipIdx = (tipIdx + 1) % tips.length;
            showTip(tipIdx);
        }, 5000);
    }

    function showTip(idx) {
        tipIdx = idx;
        var track = document.getElementById('tips-track');
        if (track) {
            track.style.transform = 'translateX(-' + (idx * 100) + '%)';
        }
        document.querySelectorAll('.tip-dot').forEach(function (d, i) {
            d.classList.toggle('active', i === idx);
        });
    }

    function destroy() {
        if (tipsInterval) {
            clearInterval(tipsInterval);
            tipsInterval = null;
        }
    }

    return { render, init, destroy };
})();
