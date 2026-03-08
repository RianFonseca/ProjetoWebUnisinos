const Perfil = (function () {
    let activeTab = 'dados';

    function render() {
        var perfil = Storage.getPerfil();
        var user = Auth.getCurrentUser();
        var stats = Storage.getStats();

        return `
      <div class="container">
        <div class="page-header">
          <h1><i class="bi bi-person"></i> Meu Perfil</h1>
          <p>Gerencie suas informações pessoais e de saúde.</p>
        </div>

        <div class="perfil-grid">
          <div class="perfil-sidebar">
            <div class="perfil-photo-card">
              <div class="perfil-photo"><i class="bi bi-person-circle" style="color:white;"></i></div>
              <h2>${user ? user.nome : perfil.nome || 'Usuário'}</h2>
              <p>${user ? user.email : ''}</p>
              <div class="perfil-quick-stats">
                <div class="perfil-stat">
                  <strong>${stats.totalAgendamentos}</strong>
                  <span>Agendamentos</span>
                </div>
                <div class="perfil-stat">
                  <strong>${stats.totalDiario}</strong>
                  <span>Registros</span>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-body" style="display:flex;flex-direction:column;gap:8px;">
                <button class="btn btn-secondary btn-sm btn-block" onclick="Perfil.exportData()"><i class="bi bi-download"></i> Exportar dados</button>
                <button class="btn btn-secondary btn-sm btn-block" onclick="Perfil.importDataModal()"><i class="bi bi-upload"></i> Importar dados</button>
                <button class="btn btn-danger btn-sm btn-block" onclick="Perfil.confirmClearData()"><i class="bi bi-trash"></i> Limpar dados</button>
              </div>
            </div>
          </div>

          <div class="perfil-main">
            <div class="perfil-tabs">
              <button class="perfil-tab ${activeTab === 'dados' ? 'active' : ''}" onclick="Perfil.setTab('dados')"><i class="bi bi-person"></i> Dados Pessoais</button>
              <button class="perfil-tab ${activeTab === 'saude' ? 'active' : ''}" onclick="Perfil.setTab('saude')"><i class="bi bi-heart-pulse"></i> Saúde</button>
              <button class="perfil-tab ${activeTab === 'emergencia' ? 'active' : ''}" onclick="Perfil.setTab('emergencia')"><i class="bi bi-telephone"></i> Emergência</button>
            </div>
            <div class="perfil-tab-content" id="perfil-tab-content">
              ${renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    `;
    }

    function renderTabContent() {
        switch (activeTab) {
            case 'dados': return renderDados();
            case 'saude': return renderSaude();
            case 'emergencia': return renderEmergencia();
            default: return renderDados();
        }
    }

    function renderDados() {
        var p = Storage.getPerfil();
        var imc = calcIMC(p.peso, p.altura);
        return `
      <h3 style="margin-bottom:20px;"><i class="bi bi-person"></i> Dados Pessoais</h3>
      <form onsubmit="return false;">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nome completo</label>
            <input type="text" class="form-control" id="pf-nome" value="${p.nome || ''}" placeholder="Seu nome">
          </div>
          <div class="form-group">
            <label class="form-label">Data de nascimento</label>
            <input type="date" class="form-control" id="pf-nasc" value="${p.nascimento || ''}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Telefone</label>
            <input type="tel" class="form-control" id="pf-tel" value="${p.telefone || ''}" placeholder="(00) 00000-0000">
          </div>
          <div class="form-group">
            <label class="form-label">Tipo sanguíneo</label>
            <select class="form-control" id="pf-sangue">
              <option value="">Selecione</option>
              ${['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(function (t) {
            return '<option value="' + t + '"' + (p.sangue === t ? ' selected' : '') + '>' + t + '</option>';
        }).join('')}
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Peso (kg)</label>
            <input type="number" class="form-control" id="pf-peso" value="${p.peso || ''}" step="0.1" placeholder="Ex: 70">
          </div>
          <div class="form-group">
            <label class="form-label">Altura (cm)</label>
            <input type="number" class="form-control" id="pf-altura" value="${p.altura || ''}" placeholder="Ex: 170">
          </div>
        </div>
        ${imc ? '<div style="background:var(--bg-input);border-radius:var(--border-radius-sm);padding:12px 16px;margin-bottom:20px;"><strong>IMC:</strong> ' + imc.valor + ' — <span class="' + imc.classe + '">' + imc.texto + '</span></div>' : ''}
        <div class="form-group">
          <label class="form-label">Endereço</label>
          <input type="text" class="form-control" id="pf-endereco" value="${p.endereco || ''}" placeholder="Seu endereço">
        </div>
        <button class="btn btn-primary" onclick="Perfil.saveDados()"><i class="bi bi-check-lg"></i> Salvar</button>
      </form>
    `;
    }

    function renderSaude() {
        var p = Storage.getPerfil();
        var alergias = p.alergias || [];
        var medicamentos = p.medicamentos || [];
        var condicoes = p.condicoes || [];

        return `
      <h3 style="margin-bottom:20px;"><i class="bi bi-heart-pulse"></i> Informações de Saúde</h3>

      <div style="margin-bottom:24px;">
        <label class="form-label">Alergias</label>
        <div class="tags-container" id="tags-alergias">
          ${alergias.map(function (a) { return '<span class="tag tag-allergy">' + a + ' <span class="tag-remove" onclick="Perfil.removeTag(\'alergias\',\'' + a + '\')">✕</span></span>'; }).join('')}
        </div>
        <div style="display:flex;gap:8px;margin-top:8px;">
          <input type="text" class="form-control" id="input-alergia" placeholder="Adicionar alergia" style="flex:1">
          <button class="btn btn-primary btn-sm" onclick="Perfil.addTag('alergias','input-alergia')"><i class="bi bi-plus"></i></button>
        </div>
      </div>

      <div style="margin-bottom:24px;">
        <label class="form-label">Medicamentos em uso</label>
        <div class="tags-container" id="tags-medicamentos">
          ${medicamentos.map(function (m) { return '<span class="tag tag-medication">' + m + ' <span class="tag-remove" onclick="Perfil.removeTag(\'medicamentos\',\'' + m + '\')">✕</span></span>'; }).join('')}
        </div>
        <div style="display:flex;gap:8px;margin-top:8px;">
          <input type="text" class="form-control" id="input-medicamento" placeholder="Adicionar medicamento" style="flex:1">
          <button class="btn btn-primary btn-sm" onclick="Perfil.addTag('medicamentos','input-medicamento')"><i class="bi bi-plus"></i></button>
        </div>
      </div>

      <div style="margin-bottom:24px;">
        <label class="form-label">Condições de saúde</label>
        <div class="tags-container" id="tags-condicoes">
          ${condicoes.map(function (c) { return '<span class="tag tag-condition">' + c + ' <span class="tag-remove" onclick="Perfil.removeTag(\'condicoes\',\'' + c + '\')">✕</span></span>'; }).join('')}
        </div>
        <div style="display:flex;gap:8px;margin-top:8px;">
          <input type="text" class="form-control" id="input-condicao" placeholder="Adicionar condição" style="flex:1">
          <button class="btn btn-primary btn-sm" onclick="Perfil.addTag('condicoes','input-condicao')"><i class="bi bi-plus"></i></button>
        </div>
      </div>
    `;
    }

    function renderEmergencia() {
        var p = Storage.getPerfil();
        var contatos = p.contatosEmergencia || [];

        return `
      <h3 style="margin-bottom:20px;"><i class="bi bi-telephone"></i> Contatos de Emergência</h3>

      <div class="emergency-list" id="contatos-list">
        ${contatos.length ? contatos.map(function (c, i) {
            return '<div class="emergency-card">' +
                '<div class="emergency-icon"><i class="bi bi-person"></i></div>' +
                '<div class="emergency-info"><h4>' + c.nome + '</h4><p>' + (c.parentesco ? c.parentesco + ' — ' : '') + c.telefone + '</p></div>' +
                '<div class="emergency-actions">' +
                '<button class="btn btn-icon btn-outline" onclick="Perfil.editContato(' + i + ')"><i class="bi bi-pencil"></i></button>' +
                '<button class="btn btn-icon btn-danger" onclick="Perfil.removeContato(' + i + ')"><i class="bi bi-trash"></i></button>' +
                '</div></div>';
        }).join('') : '<p style="color:var(--text-muted)">Nenhum contato cadastrado.</p>'}
      </div>
      <button class="btn btn-primary btn-sm" style="margin-top:16px;" onclick="Perfil.addContatoModal()"><i class="bi bi-plus"></i> Adicionar contato</button>

      <div style="margin-top:32px;">
        <h4 style="margin-bottom:12px;"><i class="bi bi-telephone"></i> Números úteis</h4>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;">
          <div class="stat-card" style="padding:16px;"><div class="stat-icon" style="font-size:1.2rem;margin-bottom:4px;"><i class="bi bi-telephone"></i></div><span class="stat-number" style="font-size:1.5rem;">192</span><span class="stat-label">SAMU</span></div>
          <div class="stat-card" style="padding:16px;"><div class="stat-icon" style="font-size:1.2rem;margin-bottom:4px;"><i class="bi bi-telephone"></i></div><span class="stat-number" style="font-size:1.5rem;">193</span><span class="stat-label">Bombeiros</span></div>
          <div class="stat-card" style="padding:16px;"><div class="stat-icon" style="font-size:1.2rem;margin-bottom:4px;"><i class="bi bi-telephone"></i></div><span class="stat-number" style="font-size:1.5rem;">188</span><span class="stat-label">CVV</span></div>
          <div class="stat-card" style="padding:16px;"><div class="stat-icon" style="font-size:1.2rem;margin-bottom:4px;"><i class="bi bi-telephone"></i></div><span class="stat-number" style="font-size:1.5rem;">136</span><span class="stat-label">Disque Saúde</span></div>
        </div>
      </div>
    `;
    }

    function setTab(tab) {
        activeTab = tab;
        var el = document.getElementById('perfil-tab-content');
        if (el) el.innerHTML = renderTabContent();
        document.querySelectorAll('.perfil-tab').forEach(function (b, i) {
            var tabs = ['dados', 'saude', 'emergencia'];
            b.classList.toggle('active', tabs[i] === tab);
        });
    }

    function saveDados() {
        Storage.savePerfil({
            nome: document.getElementById('pf-nome').value.trim(),
            nascimento: document.getElementById('pf-nasc').value,
            telefone: document.getElementById('pf-tel').value.trim(),
            sangue: document.getElementById('pf-sangue').value,
            peso: document.getElementById('pf-peso').value,
            altura: document.getElementById('pf-altura').value,
            endereco: document.getElementById('pf-endereco').value.trim()
        });
        App.toast('Dados salvos!', 'success');
        setTab('dados');
    }

    function addTag(campo, inputId) {
        var input = document.getElementById(inputId);
        var val = input.value.trim();
        if (!val) return;
        var p = Storage.getPerfil();
        if (!p[campo]) p[campo] = [];
        if (p[campo].includes(val)) {
            App.toast('Já adicionado.', 'warning');
            return;
        }
        p[campo].push(val);
        Storage.savePerfil(p);
        input.value = '';
        setTab('saude');
    }

    function removeTag(campo, val) {
        var p = Storage.getPerfil();
        p[campo] = (p[campo] || []).filter(function (x) { return x !== val; });
        Storage.savePerfil(p);
        setTab('saude');
    }

    function addContatoModal() {
        var html = `
      <form onsubmit="return false;">
        <div class="form-group"><label class="form-label">Nome</label><input type="text" class="form-control" id="ct-nome" required></div>
        <div class="form-group"><label class="form-label">Parentesco</label><input type="text" class="form-control" id="ct-parentesco" placeholder="Ex: Mãe, Pai..."></div>
        <div class="form-group"><label class="form-label">Telefone</label><input type="tel" class="form-control" id="ct-tel" required></div>
        <button class="btn btn-primary btn-block" onclick="Perfil.saveContato(-1)">Adicionar</button>
      </form>
    `;
        App.openModal('Novo contato', html);
    }

    function editContato(idx) {
        var p = Storage.getPerfil();
        var c = (p.contatosEmergencia || [])[idx];
        if (!c) return;
        var html = `
      <form onsubmit="return false;">
        <div class="form-group"><label class="form-label">Nome</label><input type="text" class="form-control" id="ct-nome" value="${c.nome}" required></div>
        <div class="form-group"><label class="form-label">Parentesco</label><input type="text" class="form-control" id="ct-parentesco" value="${c.parentesco || ''}"></div>
        <div class="form-group"><label class="form-label">Telefone</label><input type="tel" class="form-control" id="ct-tel" value="${c.telefone}" required></div>
        <button class="btn btn-primary btn-block" onclick="Perfil.saveContato(${idx})">Salvar</button>
      </form>
    `;
        App.openModal('Editar contato', html);
    }

    function saveContato(idx) {
        var nome = document.getElementById('ct-nome').value.trim();
        var parentesco = document.getElementById('ct-parentesco').value.trim();
        var tel = document.getElementById('ct-tel').value.trim();
        if (!nome || !tel) {
            App.toast('Preencha nome e telefone.', 'warning');
            return;
        }
        var p = Storage.getPerfil();
        if (!p.contatosEmergencia) p.contatosEmergencia = [];
        var contato = { nome: nome, parentesco: parentesco, telefone: tel };
        if (idx >= 0) {
            p.contatosEmergencia[idx] = contato;
        } else {
            p.contatosEmergencia.push(contato);
        }
        Storage.savePerfil(p);
        App.closeModal();
        App.toast('Contato salvo!', 'success');
        setTab('emergencia');
    }

    function removeContato(idx) {
        var p = Storage.getPerfil();
        p.contatosEmergencia.splice(idx, 1);
        Storage.savePerfil(p);
        App.toast('Contato removido.', 'info');
        setTab('emergencia');
    }

    function exportData() {
        var data = Storage.exportData();
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'saudevida_backup_' + new Date().toISOString().split('T')[0] + '.json';
        a.click();
        URL.revokeObjectURL(a.href);
        App.toast('Dados exportados!', 'success');
    }

    function importDataModal() {
        App.openModal('Importar dados',
            '<p style="margin-bottom:16px;">Selecione o arquivo JSON de backup.</p>' +
            '<input type="file" id="import-file" accept=".json" class="form-control">' +
            '<br><button class="btn btn-primary btn-block" style="margin-top:16px;" onclick="Perfil.processImport()">Importar</button>'
        );
    }

    function processImport() {
        var fileEl = document.getElementById('import-file');
        if (!fileEl.files.length) {
            App.toast('Selecione um arquivo.', 'warning');
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            try {
                var data = JSON.parse(e.target.result);
                Storage.importData(data);
                App.closeModal();
                App.toast('Dados importados!', 'success');
                App.navigate('perfil');
            } catch (err) {
                App.toast('Arquivo inválido.', 'error');
            }
        };
        reader.readAsText(fileEl.files[0]);
    }

    function confirmClearData() {
        App.openModal('Limpar todos os dados',
            '<div class="confirm-dialog">' +
            '<div class="confirm-icon"><i class="bi bi-exclamation-triangle"></i></div>' +
            '<h3>Limpar todos os dados?</h3>' +
            '<p>Essa ação é irreversível. Todos os seus dados serão apagados.</p>' +
            '<div class="confirm-buttons">' +
            '<button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>' +
            '<button class="btn btn-danger" onclick="Perfil.clearAllData()">Limpar tudo</button>' +
            '</div></div>'
        );
    }

    function clearAllData() {
        Storage.clearAll();
        App.closeModal();
        App.toast('Dados apagados.', 'info');
        App.navigate('perfil');
    }

    function calcIMC(peso, altura) {
        if (!peso || !altura) return null;
        var p = parseFloat(peso);
        var a = parseFloat(altura) / 100;
        if (!p || !a) return null;
        var val = (p / (a * a)).toFixed(1);
        var texto, classe;
        if (val < 18.5) { texto = 'Abaixo do peso'; classe = 'text-warning'; }
        else if (val < 25) { texto = 'Peso normal'; classe = 'text-success'; }
        else if (val < 30) { texto = 'Sobrepeso'; classe = 'text-warning'; }
        else { texto = 'Obesidade'; classe = 'text-danger'; }
        return { valor: val, texto: texto, classe: classe };
    }

    function init() { }
    function destroy() { activeTab = 'dados'; }

    return {
        render, init, destroy, setTab, saveDados,
        addTag, removeTag, addContatoModal, editContato, saveContato, removeContato,
        exportData, importDataModal, processImport, confirmClearData, clearAllData
    };
})();
