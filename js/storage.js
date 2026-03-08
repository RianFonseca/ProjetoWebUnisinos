const Storage = (function () {
    const PREFIX = 'saudevida_';

    function get(key) {
        try {
            const raw = localStorage.getItem(PREFIX + key);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    function set(key, value) {
        localStorage.setItem(PREFIX + key, JSON.stringify(value));
    }

    function remove(key) {
        localStorage.removeItem(PREFIX + key);
    }

    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    function getAgendamentos() {
        return get('agendamentos') || [];
    }

    function saveAgendamento(ag) {
        const lista = getAgendamentos();
        const idx = lista.findIndex(a => a.id === ag.id);
        if (idx >= 0) {
            lista[idx] = ag;
        } else {
            ag.id = ag.id || generateId();
            ag.criadoEm = ag.criadoEm || new Date().toISOString();
            lista.push(ag);
        }
        set('agendamentos', lista);
        return ag;
    }

    function deleteAgendamento(id) {
        const lista = getAgendamentos().filter(a => a.id !== id);
        set('agendamentos', lista);
    }

    function getDiarioEntries() {
        return get('diario') || [];
    }

    function saveDiarioEntry(entry) {
        const lista = getDiarioEntries();
        const idx = lista.findIndex(e => e.id === entry.id);
        if (idx >= 0) {
            lista[idx] = entry;
        } else {
            entry.id = entry.id || generateId();
            entry.criadoEm = entry.criadoEm || new Date().toISOString();
            lista.push(entry);
        }
        set('diario', lista);
        return entry;
    }

    function deleteDiarioEntry(id) {
        const lista = getDiarioEntries().filter(e => e.id !== id);
        set('diario', lista);
    }

    function getPerfil() {
        return get('perfil') || {};
    }

    function savePerfil(data) {
        const perfil = Object.assign(getPerfil(), data);
        set('perfil', perfil);
        return perfil;
    }

    function getFavoritos() {
        return get('favoritos') || [];
    }

    function toggleFavorito(id) {
        let favs = getFavoritos();
        if (favs.includes(id)) {
            favs = favs.filter(f => f !== id);
        } else {
            favs.push(id);
        }
        set('favoritos', favs);
        return favs;
    }

    function isFavorito(id) {
        return getFavoritos().includes(id);
    }

    function getTheme() {
        return get('theme') || 'light';
    }

    function setTheme(theme) {
        set('theme', theme);
    }

    function exportData() {
        return {
            agendamentos: getAgendamentos(),
            diario: getDiarioEntries(),
            perfil: getPerfil(),
            favoritos: getFavoritos(),
            exportadoEm: new Date().toISOString()
        };
    }

    function importData(data) {
        if (data.agendamentos) set('agendamentos', data.agendamentos);
        if (data.diario) set('diario', data.diario);
        if (data.perfil) set('perfil', data.perfil);
        if (data.favoritos) set('favoritos', data.favoritos);
    }

    function clearAll() {
        const keys = Object.keys(localStorage).filter(k => k.startsWith(PREFIX));
        keys.forEach(k => localStorage.removeItem(k));
    }

    function getStats() {
        const ag = getAgendamentos();
        const di = getDiarioEntries();
        return {
            totalAgendamentos: ag.length,
            agendamentosConfirmados: ag.filter(a => a.status === 'confirmado').length,
            totalDiario: di.length,
            ultimoDiario: di.length ? di[di.length - 1] : null
        };
    }

    function initSampleData() {
        if (getAgendamentos().length || getDiarioEntries().length) return;

        const hoje = new Date();
        const amanha = new Date(hoje);
        amanha.setDate(amanha.getDate() + 1);
        const semana = new Date(hoje);
        semana.setDate(semana.getDate() + 7);

        set('agendamentos', [
            {
                id: generateId(),
                profissional: 'Dra. Maria Silva',
                especialidade: 'Clínica Geral',
                data: amanha.toISOString().split('T')[0],
                horario: '09:00',
                status: 'confirmado',
                observacoes: 'Check-up semestral',
                criadoEm: hoje.toISOString()
            },
            {
                id: generateId(),
                profissional: 'Dr. João Santos',
                especialidade: 'Cardiologia',
                data: semana.toISOString().split('T')[0],
                horario: '14:30',
                status: 'pendente',
                observacoes: 'Retorno — avaliação de exames',
                criadoEm: hoje.toISOString()
            }
        ]);

        const moods = ['otimo', 'bem', 'normal', 'mal', 'pessimo'];

        const diarioEntries = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(hoje);
            d.setDate(d.getDate() - i);
            diarioEntries.push({
                id: generateId(),
                data: d.toISOString().split('T')[0],
                humor: moods[Math.floor(Math.random() * 3)],
                agua: Math.floor(Math.random() * 6) + 3,
                sono: (Math.random() * 3 + 5.5).toFixed(1),
                pressao: `${Math.floor(Math.random() * 20) + 110}/${Math.floor(Math.random() * 10) + 70}`,
                notas: '',
                criadoEm: d.toISOString()
            });
        }
        set('diario', diarioEntries);
    }

    return {
        get, set, remove, generateId,
        getAgendamentos, saveAgendamento, deleteAgendamento,
        getDiarioEntries, saveDiarioEntry, deleteDiarioEntry,
        getPerfil, savePerfil,
        getFavoritos, toggleFavorito, isFavorito,
        getTheme, setTheme,
        exportData, importData, clearAll, getStats, initSampleData
    };
})();
