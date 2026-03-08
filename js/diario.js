const Diario = (function () {
    let moodSel = '';
    let waterCount = 0;

    const moods = [
        { value: 'otimo', label: 'Ótimo', color: '#00b894' },
        { value: 'bem', label: 'Bem', color: '#00cec9' },
        { value: 'normal', label: 'Normal', color: '#fdcb6e' },
        { value: 'mal', label: 'Mal', color: '#e17055' },
        { value: 'pessimo', label: 'Péssimo', color: '#d63031' }
    ];

    function getMoodLabel(val) {
        var m = moods.find(function (x) { return x.value === val; });
        return m ? m.label : val;
    }

    function getMoodColor(val) {
        var m = moods.find(function (x) { return x.value === val; });
        return m ? m.color : '#b2bec3';
    }

    function render() {
        moodSel = '';
        waterCount = 0;
        var entries = Storage.getDiarioEntries().slice().reverse();

        return `
      <div class="container">
        <div class="page-header">
          <h1><i class="bi bi-journal-text"></i> Diário de Saúde</h1>
          <p>Registre e acompanhe sua saúde diariamente.</p>
        </div>

        <div class="diario-grid">
          <div class="diario-form-section">
            <div class="card">
              <div class="card-header"><h3><i class="bi bi-plus-circle"></i> Novo Registro</h3></div>
              <div class="card-body">
                <div class="form-group">
                  <label class="form-label">Como você está se sentindo?</label>
                  <div class="mood-selector" id="mood-selector">
                    ${moods.map(function (m) {
            return '<button type="button" class="mood-option" data-mood="' + m.value + '" onclick="Diario.selectMood(\'' + m.value + '\')">' +
                '<span class="mood-dot" style="background:' + m.color + '"></span> ' + m.label + '</button>';
        }).join('')}
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label"><i class="bi bi-droplet"></i> Copos de água</label>
                  <div class="water-tracker">
                    <div class="water-glasses" id="water-glasses">
                      ${renderGlasses(0)}
                    </div>
                    <span class="water-count" id="water-count">0 copos</span>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label"><i class="bi bi-moon"></i> Horas de sono</label>
                    <input type="number" class="form-control" id="diario-sono" min="0" max="24" step="0.5" placeholder="Ex: 7.5">
                  </div>
                  <div class="form-group">
                    <label class="form-label"><i class="bi bi-heart-pulse"></i> Pressão arterial</label>
                    <input type="text" class="form-control" id="diario-pressao" placeholder="Ex: 120/80">
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label"><i class="bi bi-chat-text"></i> Anotações</label>
                  <textarea class="form-control" id="diario-notas" rows="3" placeholder="Como foi seu dia?"></textarea>
                </div>
                <button class="btn btn-primary btn-block" onclick="Diario.saveEntry()"><i class="bi bi-check-lg"></i> Salvar registro</button>
              </div>
            </div>

            <div class="chart-container">
              <h3><i class="bi bi-bar-chart"></i> Últimos 7 dias</h3>
              <div id="water-chart">${renderCharts()}</div>
            </div>
          </div>

          <div class="diario-entries" id="diario-entries">
            <h3 style="margin-bottom:16px;"><i class="bi bi-clock-history"></i> Registros anteriores</h3>
            ${entries.length ? entries.map(renderEntry).join('') : '<div class="empty-state"><div class="empty-state-icon"><i class="bi bi-journal-x"></i></div><h3>Nenhum registro</h3><p>Adicione seu primeiro registro ao lado.</p></div>'}
          </div>
        </div>
      </div>
    `;
    }

    function renderGlasses(count) {
        var html = '';
        for (var i = 0; i < 10; i++) {
            html += '<div class="water-glass ' + (i < count ? 'filled' : '') + '" onclick="Diario.setWater(' + (i + 1) + ')"></div>';
        }
        return html;
    }

    function renderEntry(e) {
        return `
      <div class="diario-entry">
        <div class="diario-entry-header">
          <span class="diario-entry-date"><i class="bi bi-calendar"></i> ${formatDate(e.data)}</span>
          <span class="diario-mood" style="background:${getMoodColor(e.humor)}20; color:${getMoodColor(e.humor)}">
            <span class="mood-dot" style="background:${getMoodColor(e.humor)}"></span> ${getMoodLabel(e.humor)}
          </span>
        </div>
        <div class="diario-entry-body">
          <div class="diario-metric"><span class="diario-metric-icon"><i class="bi bi-droplet"></i></span> ${e.agua} copos de água</div>
          <div class="diario-metric"><span class="diario-metric-icon"><i class="bi bi-moon"></i></span> ${e.sono}h de sono</div>
          ${e.pressao ? '<div class="diario-metric"><span class="diario-metric-icon"><i class="bi bi-heart-pulse"></i></span> ' + e.pressao + '</div>' : ''}
        </div>
        ${e.notas ? '<div class="diario-entry-notes">' + e.notas + '</div>' : ''}
        <div style="display:flex;gap:8px;margin-top:12px;">
          <button class="btn btn-icon btn-outline" onclick="Diario.editEntry('${e.id}')"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-icon btn-danger" onclick="Diario.confirmDelete('${e.id}')"><i class="bi bi-trash"></i></button>
        </div>
      </div>
    `;
    }

    function renderCharts() {
        var entries = Storage.getDiarioEntries().slice(-7);
        if (!entries.length) return '<p style="color:var(--text-muted)">Dados insuficientes.</p>';

        var maxW = Math.max.apply(null, entries.map(function (e) { return e.agua || 0; }));
        var maxS = Math.max.apply(null, entries.map(function (e) { return parseFloat(e.sono) || 0; }));
        if (maxW < 1) maxW = 1;
        if (maxS < 1) maxS = 1;

        var html = '<h4 style="font-size:0.9rem;margin-bottom:8px;"><i class="bi bi-droplet"></i> Água (copos)</h4><div class="mini-chart">';
        entries.forEach(function (e) {
            var pct = ((e.agua || 0) / maxW * 100).toFixed(0);
            var dia = e.data ? e.data.split('-')[2] : '';
            html += '<div class="mini-chart-bar" style="height:' + pct + '%"><span class="bar-value">' + (e.agua || 0) + '</span><span class="bar-label">' + dia + '</span></div>';
        });
        html += '</div>';

        html += '<h4 style="font-size:0.9rem;margin:16px 0 8px;"><i class="bi bi-moon"></i> Sono (horas)</h4><div class="mini-chart">';
        entries.forEach(function (e) {
            var sono = parseFloat(e.sono) || 0;
            var pct = (sono / maxS * 100).toFixed(0);
            var dia = e.data ? e.data.split('-')[2] : '';
            html += '<div class="mini-chart-bar" style="height:' + pct + '%;background:linear-gradient(to top, var(--secondary), var(--secondary-light))"><span class="bar-value">' + sono + '</span><span class="bar-label">' + dia + '</span></div>';
        });
        html += '</div>';
        return html;
    }

    function selectMood(val) {
        moodSel = val;
        document.querySelectorAll('.mood-option').forEach(function (b) {
            b.classList.toggle('selected', b.dataset.mood === val);
        });
    }

    function setWater(n) {
        waterCount = Math.max(0, n);
        var glasses = document.getElementById('water-glasses');
        if (glasses) glasses.innerHTML = renderGlasses(waterCount);
        var countEl = document.getElementById('water-count');
        if (countEl) countEl.textContent = waterCount + ' copos';
    }

    function saveEntry() {
        if (!moodSel) {
            App.toast('Selecione como está se sentindo.', 'warning');
            return;
        }
        var hoje = new Date().toISOString().split('T')[0];
        Storage.saveDiarioEntry({
            data: hoje,
            humor: moodSel,
            agua: waterCount,
            sono: document.getElementById('diario-sono').value || '0',
            pressao: document.getElementById('diario-pressao').value.trim(),
            notas: document.getElementById('diario-notas').value.trim()
        });
        App.toast('Registro salvo!', 'success');
        refreshPage();
    }

    function editEntry(id) {
        var entry = Storage.getDiarioEntries().find(function (e) { return e.id === id; });
        if (!entry) return;

        var html = `
      <form onsubmit="return false;">
        <div class="form-group">
          <label class="form-label">Humor</label>
          <div class="mood-selector">
            ${moods.map(function (m) {
            return '<button type="button" class="mood-option ' + (entry.humor === m.value ? 'selected' : '') + '" data-mood="' + m.value + '" onclick="this.parentElement.querySelectorAll(\'.mood-option\').forEach(function(b){b.classList.remove(\'selected\')});this.classList.add(\'selected\')">' +
                '<span class="mood-dot" style="background:' + m.color + '"></span> ' + m.label + '</button>';
        }).join('')}
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Copos de água</label>
          <input type="number" class="form-control" id="edit-agua" value="${entry.agua}" min="0">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Horas de sono</label>
            <input type="number" class="form-control" id="edit-sono" value="${entry.sono}" min="0" max="24" step="0.5">
          </div>
          <div class="form-group">
            <label class="form-label">Pressão arterial</label>
            <input type="text" class="form-control" id="edit-pressao" value="${entry.pressao || ''}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Anotações</label>
          <textarea class="form-control" id="edit-notas" rows="3">${entry.notas || ''}</textarea>
        </div>
        <button class="btn btn-primary btn-block" onclick="Diario.saveEditEntry('${id}')">Salvar</button>
      </form>
    `;
        App.openModal('Editar registro', html);
    }

    function saveEditEntry(id) {
        var entry = Storage.getDiarioEntries().find(function (e) { return e.id === id; });
        if (!entry) return;
        var sel = document.querySelector('.modal .mood-option.selected');
        entry.humor = sel ? sel.dataset.mood : entry.humor;
        entry.agua = parseInt(document.getElementById('edit-agua').value) || 0;
        entry.sono = document.getElementById('edit-sono').value || '0';
        entry.pressao = document.getElementById('edit-pressao').value.trim();
        entry.notas = document.getElementById('edit-notas').value.trim();
        Storage.saveDiarioEntry(entry);
        App.closeModal();
        App.toast('Registro atualizado!', 'success');
        refreshPage();
    }

    function confirmDelete(id) {
        App.openModal('Confirmar exclusão',
            '<div class="confirm-dialog">' +
            '<div class="confirm-icon"><i class="bi bi-exclamation-triangle"></i></div>' +
            '<h3>Excluir registro?</h3>' +
            '<p>Essa ação não pode ser desfeita.</p>' +
            '<div class="confirm-buttons">' +
            '<button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>' +
            '<button class="btn btn-danger" onclick="Diario.deleteEntry(\'' + id + '\')">Excluir</button>' +
            '</div></div>'
        );
    }

    function deleteEntry(id) {
        Storage.deleteDiarioEntry(id);
        App.closeModal();
        App.toast('Registro excluído.', 'info');
        refreshPage();
    }

    function refreshPage() {
        var container = document.getElementById('app-content');
        container.innerHTML = render();
        init();
    }

    function formatDate(d) {
        if (!d) return '';
        var p = d.split('-');
        return p[2] + '/' + p[1] + '/' + p[0];
    }

    function init() { }
    function destroy() { }

    return { render, init, destroy, selectMood, setWater, saveEntry, editEntry, saveEditEntry, confirmDelete, deleteEntry };
})();
