const App = (function () {
    let currentPage = 'home';
    const pages = { home: Home, agendamentos: Agendamentos, diario: Diario, profissionais: Profissionais, perfil: Perfil };

    function init() {
        Storage.initSampleData();
        applyTheme(Storage.getTheme());
        setupNavigation();
        setupThemeToggle();
        setupMobileMenu();
        setupModal();
        setupHeaderScroll();
        showUserGreeting();
        navigate('home');
    }

    function navigate(page) {
        if (pages[currentPage] && pages[currentPage].destroy) {
            pages[currentPage].destroy();
        }
        currentPage = page;
        renderCurrentPage();
        updateActiveNav();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeMobileMenu();
    }

    function renderCurrentPage() {
        var container = document.getElementById('app-content');
        var mod = pages[currentPage];
        if (mod) {
            container.innerHTML = mod.render();
            if (mod.init) mod.init();
        }
    }

    function updateActiveNav() {
        document.querySelectorAll('[data-page]').forEach(function (el) {
            el.classList.toggle('active', el.dataset.page === currentPage);
        });
    }

    function setupNavigation() {
        document.addEventListener('click', function (e) {
            var link = e.target.closest('[data-page]');
            if (!link) return;
            e.preventDefault();
            navigate(link.dataset.page);
        });
    }

    function setupThemeToggle() {
        document.getElementById('theme-toggle').addEventListener('click', function () {
            var next = Storage.getTheme() === 'light' ? 'dark' : 'light';
            Storage.setTheme(next);
            applyTheme(next);
        });
    }

    function applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        var icon = document.getElementById('theme-icon');
        icon.innerHTML = theme === 'dark'
            ? '<i class="bi bi-sun"></i>'
            : '<i class="bi bi-moon"></i>';
    }

    function setupMobileMenu() {
        var menu = document.getElementById('mobile-menu');
        document.getElementById('hamburger').addEventListener('click', function () {
            menu.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
        document.getElementById('mobile-close').addEventListener('click', closeMobileMenu);
        menu.querySelector('.mobile-menu-overlay').addEventListener('click', closeMobileMenu);
    }

    function closeMobileMenu() {
        document.getElementById('mobile-menu').classList.remove('open');
        document.body.style.overflow = '';
    }

    function setupModal() {
        document.getElementById('modal-close').addEventListener('click', closeModal);
        document.getElementById('modal-overlay').addEventListener('click', function (e) {
            if (e.target === this) closeModal();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeModal();
        });
    }

    function openModal(title, body) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = body;
        document.getElementById('modal-overlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        document.getElementById('modal-overlay').classList.remove('active');
        document.body.style.overflow = '';
    }

    function setupHeaderScroll() {
        var header = document.getElementById('main-header');
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    function showUserGreeting() {
        var user = Auth.getCurrentUser();
        if (user) {
            var nameEl = document.querySelector('.nav-desktop .nav-link[data-page="perfil"]');
            if (nameEl) {
                var first = user.nome.split(' ')[0];
                nameEl.innerHTML = '<span class="nav-icon"><i class="bi bi-person"></i></span> ' + first;
            }
        }
    }

    function toast(msg, type) {
        type = type || 'info';
        var container = document.getElementById('toast-container');
        var el = document.createElement('div');
        el.className = 'toast ' + type;

        var icons = { success: 'check-circle', error: 'x-circle', info: 'info-circle', warning: 'exclamation-triangle' };
        el.innerHTML = '<span class="toast-icon"><i class="bi bi-' + (icons[type] || 'info-circle') + '"></i></span><span class="toast-message">' + msg + '</span>';

        container.appendChild(el);
        setTimeout(function () {
            el.classList.add('toast-out');
            setTimeout(function () { el.remove(); }, 300);
        }, 3500);
    }

    return { init, navigate, openModal, closeModal, toast };
})();
