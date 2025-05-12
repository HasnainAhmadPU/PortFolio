document.addEventListener('DOMContentLoaded', function() {
    const initLoader = () => {
        const loader = document.getElementById('loader');
        const progressBar = document.getElementById('progressBar');
        let progress = 0;
        const duration = 2000;
        const intervalTime = 20;
        const increment = (intervalTime / duration) * 100;
        const loadingInterval = setInterval(() => {
            progress += increment;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
            if (progress >= 100) {
                clearInterval(loadingInterval);
                document.body.classList.add('loaded');
                setTimeout(() => loader.remove(), 500);
            }
        }, intervalTime);
    };

    const initHamburgerMenu = () => {
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const headerNav = document.querySelector('.header-nav');
        const navLinks = document.querySelectorAll('.header-nav a');
        const body = document.body;
        const contentWrapper = document.createElement('div');
        contentWrapper.id = 'content-wrapper';
        contentWrapper.style.transition = 'filter 0.3s ease';
        
        Array.from(body.children).forEach(child => {
            if (!child.classList.contains('main-header') &&
                !child.classList.contains('main-footer') &&
                child.id !== 'loader' &&
                child.id !== 'portfolio-content') {
                contentWrapper.appendChild(child);
            }
        });
        
        body.insertBefore(contentWrapper, document.querySelector('.main-footer'));

        if (!hamburgerBtn || !headerNav) return;

        const toggleMenu = (shouldOpen) => {
            const isOpen = typeof shouldOpen === 'boolean' ? shouldOpen : !headerNav.classList.contains('active');
            hamburgerBtn.classList.toggle('active', isOpen);
            headerNav.classList.toggle('active', isOpen);
            if (isOpen) {
                contentWrapper.style.filter = 'blur(5px)';
                body.style.overflow = 'hidden';
                headerNav.style.backdropFilter = 'none';
            } else {
                contentWrapper.style.filter = 'none';
                body.style.overflow = '';
            }
        };

        const closeOnLargeScreen = () => {
            if (window.innerWidth > 768) toggleMenu(false);
        };

        hamburgerBtn.addEventListener('click', () => toggleMenu());
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) toggleMenu(false);
            });
        });

        window.addEventListener('resize', closeOnLargeScreen);
        closeOnLargeScreen();
    };

    const initSmoothScrolling = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    const initLightModeToggle = () => {
        const lightModeToggle = document.createElement('button');
        lightModeToggle.innerHTML = '🌙';
        Object.assign(lightModeToggle.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '1000',
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '20px',
            cursor: 'pointer',
            backdropFilter: 'blur(px)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        });

        lightModeToggle.addEventListener('click', function() {
            const isLightMode = document.body.classList.toggle('light-mode');
            this.innerHTML = isLightMode ? '🌙' : '☀️';
            localStorage.setItem('lightMode', isLightMode);
        });

        if (localStorage.getItem('lightMode') === 'true') {
            document.body.classList.add('light-mode');
            lightModeToggle.innerHTML = '🌙';
        }

        document.body.appendChild(lightModeToggle);
    };

    const initDateDisplay = () => {
        const monthName = document.getElementById("month-name");
        const dayName = document.getElementById("day-name");
        const dayNumber = document.getElementById("day-number");
        const yearName = document.getElementById("year-name");
        const date = new Date();

        monthName.textContent = date.toLocaleString("en", { month: "long" });
        dayName.textContent = date.toLocaleString("en", { weekday: "long" });
        dayNumber.textContent = date.getDate();
        yearName.textContent = date.getFullYear();
    };

    initLoader();
    initHamburgerMenu();
    initSmoothScrolling();
    initLightModeToggle();
    initDateDisplay();
    const contactBtn = document.querySelector('.contact-btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', function () {
            window.location.href = this.getAttribute('data-url');
        });
    }
});