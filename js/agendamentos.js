const Agendamentos = (function () {
    const especialidades = [
        'Clínica Geral', 'Cardiologia', 'Dermatologia', 'Endocrinologia',
        'Gastroenterologia', 'Ginecologia', 'Neurologia', 'Oftalmologia',
        'Ortopedia', 'Otorrinolaringologia', 'Pediatria', 'Psiquiatria',
        'Psicologia', 'Urologia', 'Nutrição'
    ];

    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    function render() {
        var lista = getFiltered();
        return `
      <div class="container">
        <div class="page-header">
          <h1><i class="bi bi-calendar-check"></i> Agendamentos</h1>
          <p>Gerencie suas consultas e compromissos de saúde.</p>
          <div class="page-header-actions">
            <button class="btn btn-primary" onclick="Agendamentos.openModal()"><i class="bi bi-plus-lg"></i> Novo agendamento</button>
          </div>
        </div>
        <div class="agenda-toolbar">
          <div class="search-box">
            <input type="text" id="ag-busca" placeholder="Buscar agendamento..." oninput="Agendamentos.refreshList()">
          </div>
          <select class="filter-select" id="ag-filtro" onchange="Agendamentos.refreshList()">
            <option value="">Todos os status</option>
            <option value="pendente">Pendente</option>
            <option value="confirmado">Confirmado</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
        <div class="agenda-list" id="ag-list">
          ${lista.length ? lista.map(renderCard).join('') : renderEmpty()}
        </div>
      </div>
    `;
    }

    function renderCard(ag) {
        var parts = ag.data ? ag.data.split('-') : ['', '', ''];
        var dia = parts[2];
        var mes = meses[parseInt(parts[1]) - 1] || '';
        var statusLabels = { pendente: 'Pendente', confirmado: 'Confirmado', concluido: 'Concluído', cancelado: 'Cancelado' };
        return `
      <div class="agenda-card">
        <div class="agenda-date-badge">
          <span class="day">${dia}</span>
          <span class="month">${mes}</span>
        </div>
        <div class="agenda-info">
          <h3>${ag.profissional}</h3>
          <div class="agenda-meta">
            <span><i class="bi bi-tag"></i> ${ag.especialidade}</span>
            <span><i class="bi bi-clock"></i> ${ag.horario}</span>
          </div>
          <span class="agenda-status status-${ag.status}" onclick="Agendamentos.changeStatus('${ag.id}')" style="cursor:pointer;">
            ${statusLabels[ag.status] || ag.status}
          </span>
          ${ag.observacoes ? '<p style="margin-top:6px;font-size:0.88rem;color:var(--text-secondary)"><i class="bi bi-chat-text"></i> ' + ag.observacoes + '</p>' : ''}
        </div>
        <div class="agenda-actions">
          <button class="btn btn-icon btn-outline" title="Editar" onclick="Agendamentos.openModal('${ag.id}')"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-icon btn-danger" title="Excluir" onclick="Agendamentos.confirmDelete('${ag.id}')"><i class="bi bi-trash"></i></button>
        </div>
      </div>
    `;
    }

    function renderEmpty() {
        return `
      <div class="empty-state">
        <div class="empty-state-icon"><i class="bi bi-calendar-x"></i></div>
        <h3>Nenhum agendamento</h3>
        <p>Clique em "Novo agendamento" para criar seu primeiro.</p>
      </div>
    `;
    }

    function getFiltered() {
        var lista = Storage.getAgendamentos();
        var buscaEl = document.getElementById('ag-busca');
        var filtroEl = document.getElementById('ag-filtro');

        if (buscaEl && buscaEl.value.trim()) {
            var q = buscaEl.value.toLowerCase();
            lista = lista.filter(function (a) {
                return a.profissional.toLowerCase().includes(q) ||
                    a.especialidade.toLowerCase().includes(q) ||
                    (a.observacoes && a.observacoes.toLowerCase().includes(q));
            });
        }
        if (filtroEl && filtroEl.value) {
            lista = lista.filter(function (a) { return a.status === filtroEl.value; });
        }
        lista.sort(function (a, b) { return new Date(a.data) - new Date(b.data); });
        return lista;
    }

    function refreshList() {
        var el = document.getElementById('ag-list');
        if (!el) return;
        var lista = getFiltered();
        el.innerHTML = lista.length ? lista.map(renderCard).join('') : renderEmpty();
    }

    function openModal(id) {
        var ag = id ? Storage.getAgendamentos().find(function (a) { return a.id === id; }) : null;
        var html = `
      <form onsubmit="return false;">
        <div class="form-group">
          <label class="form-label">Profissional</label>
          <input type="text" class="form-control" id="ag-prof" value="${ag ? ag.profissional : ''}" required placeholder="Nome do profissional">
        </div>
        <div class="form-group">
          <label class="form-label">Especialidade</label>
          <select class="form-control" id="ag-esp" required>
            <option value="">Selecione</option>
            ${especialidades.map(function (e) {
            return '<option value="' + e + '"' + (ag && ag.especialidade === e ? ' selected' : '') + '>' + e + '</option>';
        }).join('')}
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Data</label>
            <input type="date" class="form-control" id="ag-data" value="${ag ? ag.data : ''}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Horário</label>
            <input type="time" class="form-control" id="ag-hora" value="${ag ? ag.horario : ''}" required>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Observações</label>
          <textarea class="form-control" id="ag-obs" rows="3" placeholder="Observações opcionais...">${ag ? ag.observacoes || '' : ''}</textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-block" onclick="Agendamentos.saveForm('${id || ''}')">${ag ? 'Salvar alterações' : 'Criar agendamento'}</button>
      </form>
    `;
        App.openModal(ag ? 'Editar Agendamento' : 'Novo Agendamento', html);
    }

    function saveForm(id) {
        var prof = document.getElementById('ag-prof').value.trim();
        var esp = document.getElementById('ag-esp').value;
        var data = document.getElementById('ag-data').value;
        var hora = document.getElementById('ag-hora').value;
        var obs = document.getElementById('ag-obs').value.trim();

        if (!prof || !esp || !data || !hora) {
            App.toast('Preencha os campos obrigatórios.', 'warning');
            return;
        }

        var ag = id ? Storage.getAgendamentos().find(function (a) { return a.id === id; }) || {} : {};
        ag.profissional = prof;
        ag.especialidade = esp;
        ag.data = data;
        ag.horario = hora;
        ag.observacoes = obs;
        ag.status = ag.status || 'pendente';

        Storage.saveAgendamento(ag);
        App.closeModal();
        refreshList();
        App.toast(id ? 'Agendamento atualizado!' : 'Agendamento criado!', 'success');
    }

    function changeStatus(id) {
        var ag = Storage.getAgendamentos().find(function (a) { return a.id === id; });
        if (!ag) return;
        var ciclo = ['pendente', 'confirmado', 'concluido', 'cancelado'];
        var i = ciclo.indexOf(ag.status);
        ag.status = ciclo[(i + 1) % ciclo.length];
        Storage.saveAgendamento(ag);
        refreshList();
    }

    function confirmDelete(id) {
        App.openModal('Confirmar exclusão',
            '<div class="confirm-dialog">' +
            '<div class="confirm-icon"><i class="bi bi-exclamation-triangle"></i></div>' +
            '<h3>Excluir agendamento?</h3>' +
            '<p>Essa ação não pode ser desfeita.</p>' +
            '<div class="confirm-buttons">' +
            '<button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>' +
            '<button class="btn btn-danger" onclick="Agendamentos.deleteAgendamento(\'' + id + '\')">Excluir</button>' +
            '</div></div>'
        );
    }

    function deleteAgendamento(id) {
        Storage.deleteAgendamento(id);
        App.closeModal();
        refreshList();
        App.toast('Agendamento excluído.', 'info');
    }

    function init() { }
    function destroy() { }

    return { render, init, destroy, openModal, saveForm, changeStatus, confirmDelete, deleteAgendamento, refreshList };
})();
