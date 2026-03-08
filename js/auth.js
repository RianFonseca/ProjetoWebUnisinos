const Auth = (function () {
    const USERS_KEY = 'saudevida_users';
    const SESSION_KEY = 'saudevida_currentUser';
    const REMEMBER_KEY = 'saudevida_remember';

    function getUsers() {
        try {
            return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        } catch {
            return [];
        }
    }

    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function hashPassword(senha) {
        let h = 0;
        for (let i = 0; i < senha.length; i++) {
            h = ((h << 5) - h + senha.charCodeAt(i)) | 0;
        }
        return 'h_' + Math.abs(h).toString(36);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isLoggedIn() {
        return !!localStorage.getItem(SESSION_KEY);
    }

    function getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem(SESSION_KEY));
        } catch {
            return null;
        }
    }

    function login() {
        const email = document.getElementById('login-email').value.trim();
        const senha = document.getElementById('login-senha').value;
        const lembrar = document.getElementById('login-lembrar').checked;
        const errEl = document.getElementById('login-error');
        errEl.textContent = '';

        if (!email || !senha) {
            errEl.textContent = 'Preencha todos os campos.';
            return;
        }
        if (!isValidEmail(email)) {
            errEl.textContent = 'E-mail inválido.';
            return;
        }

        const users = getUsers();
        const user = users.find(u => u.email === email.toLowerCase());
        if (!user || user.senha !== hashPassword(senha)) {
            errEl.textContent = 'E-mail ou senha incorretos.';
            return;
        }

        localStorage.setItem(SESSION_KEY, JSON.stringify({ nome: user.nome, email: user.email }));

        if (lembrar) {
            localStorage.setItem(REMEMBER_KEY, email);
        } else {
            localStorage.removeItem(REMEMBER_KEY);
        }

        enterApp();
    }

    function register() {
        const nome = document.getElementById('reg-nome').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const senha = document.getElementById('reg-senha').value;
        const senha2 = document.getElementById('reg-senha2').value;
        const errEl = document.getElementById('register-error');
        errEl.textContent = '';

        if (!nome || !email || !senha || !senha2) {
            errEl.textContent = 'Preencha todos os campos.';
            return;
        }
        if (nome.length < 3) {
            errEl.textContent = 'Nome muito curto.';
            return;
        }
        if (!isValidEmail(email)) {
            errEl.textContent = 'E-mail inválido.';
            return;
        }
        if (senha.length < 4) {
            errEl.textContent = 'Senha deve ter no mínimo 4 caracteres.';
            return;
        }
        if (senha !== senha2) {
            errEl.textContent = 'As senhas não coincidem.';
            return;
        }

        const users = getUsers();
        if (users.find(u => u.email === email.toLowerCase())) {
            errEl.textContent = 'Já existe uma conta com este e-mail.';
            return;
        }

        users.push({
            nome,
            email: email.toLowerCase(),
            senha: hashPassword(senha),
            criadoEm: new Date().toISOString()
        });
        saveUsers(users);

        localStorage.setItem(SESSION_KEY, JSON.stringify({ nome, email: email.toLowerCase() }));
        enterApp();
    }

    function logout() {
        localStorage.removeItem(SESSION_KEY);
        document.getElementById('main-header').style.display = 'none';
        document.getElementById('mobile-menu').classList.remove('active');
        document.querySelector('.footer').style.display = 'none';
        document.getElementById('app-content').innerHTML = '';
        document.getElementById('auth-screen').style.display = 'flex';
        document.getElementById('auth-screen').classList.add('active');
        fillRememberedEmail();
    }

    function enterApp() {
        document.getElementById('auth-screen').classList.remove('active');

        const loading = document.getElementById('loading-screen');
        loading.style.display = 'flex';

        setTimeout(function () {
            loading.style.display = 'none';
            document.getElementById('auth-screen').style.display = 'none';
            document.getElementById('main-header').style.display = '';
            document.querySelector('.footer').style.display = '';
            App.init();
        }, 1500);
    }

    function showLogin() {
        document.getElementById('register-form').classList.remove('active');
        document.getElementById('login-form').classList.add('active');
        document.getElementById('register-error').textContent = '';
    }

    function showRegister() {
        document.getElementById('login-form').classList.remove('active');
        document.getElementById('register-form').classList.add('active');
        document.getElementById('login-error').textContent = '';
    }

    function togglePassword(inputId, btn) {
        const input = document.getElementById(inputId);
        if (input.type === 'password') {
            input.type = 'text';
            btn.innerHTML = '<i class="bi bi-eye-slash"></i>';
        } else {
            input.type = 'password';
            btn.innerHTML = '<i class="bi bi-eye"></i>';
        }
    }

    function fillRememberedEmail() {
        const saved = localStorage.getItem(REMEMBER_KEY);
        if (saved) {
            const el = document.getElementById('login-email');
            if (el) el.value = saved;
        }
    }

    function checkAuth() {
        if (isLoggedIn()) {
            document.getElementById('auth-screen').style.display = 'none';
            document.getElementById('main-header').style.display = '';
            document.querySelector('.footer').style.display = '';
            App.init();
        } else {
            document.getElementById('main-header').style.display = 'none';
            document.querySelector('.footer').style.display = 'none';
            document.getElementById('auth-screen').style.display = 'flex';
            document.getElementById('auth-screen').classList.add('active');
            fillRememberedEmail();
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        checkAuth();
    });

    return {
        login, register, logout, isLoggedIn, getCurrentUser,
        showLogin, showRegister, togglePassword, checkAuth
    };
})();
