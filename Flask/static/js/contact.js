document.addEventListener('DOMContentLoaded', function () {
    const initLoader = () => {
        const loader = document.getElementById('loader');
        const progressBar = document.getElementById('progressBar');

        if (!loader || !progressBar) return;

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
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => loader.remove(), 500);
                }, 500);
            }
        }, intervalTime);
    };
    const initHamburgerMenu = () => {
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const headerNav = document.querySelector('.header-nav');
        const navLinks = document.querySelectorAll('.header-nav a');
        const body = document.body;

        if (!hamburgerBtn || !headerNav) return;

        const contentWrapper = document.createElement('div');
        contentWrapper.id = 'content-wrapper';
        contentWrapper.style.transition = 'filter 0.3s ease';
        Array.from(body.children).forEach(child => {
            if (!child.classList.contains('main-header') &&
                !child.classList.contains('main-footer') &&
                child.id !== 'loader') {
                contentWrapper.appendChild(child);
            }
        });

        body.insertBefore(contentWrapper, document.querySelector('.main-footer'));

        const toggleMenu = (shouldOpen) => {
            const isOpen = typeof shouldOpen === 'boolean' ? shouldOpen : !headerNav.classList.contains('active');

            hamburgerBtn.classList.toggle('active', isOpen);
            headerNav.classList.toggle('active', isOpen);

            if (isOpen) {
                contentWrapper.style.filter = 'blur(5px)';
                body.style.overflow = 'hidden';
            } else {
                contentWrapper.style.filter = 'none';
                body.style.overflow = '';
            }
        };

        const closeOnLargeScreen = () => {
            if (window.innerWidth > 768) {
                toggleMenu(false);
            }
        };

        hamburgerBtn.addEventListener('click', () => toggleMenu());

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    toggleMenu(false);
                }
            });
        });

        window.addEventListener('resize', closeOnLargeScreen);
        closeOnLargeScreen();
    };
    const initSmoothScrolling = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#' || targetId === '#!') return;

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
        lightModeToggle.ariaLabel = 'Toggle light/dark mode';

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
            backdropFilter: 'blur(5px)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease'
        });

        lightModeToggle.addEventListener('click', function () {
            const isLightMode = document.body.classList.toggle('light-mode');
            this.innerHTML = isLightMode ? '🌙' : '☀️';
            localStorage.setItem('lightMode', isLightMode);
        });

        if (localStorage.getItem('lightMode') === 'true') {
            document.body.classList.add('light-mode');
            lightModeToggle.innerHTML = '☀️';
        }
        document.body.appendChild(lightModeToggle);
    };
    const initContactForm = () => {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const responseDiv = document.getElementById('formResponse');

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            try {
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                const result = await response.json();

                if (result.status === 'success') {
                    responseDiv.textContent = result.message;
                    responseDiv.style.color = 'green';
                    this.reset();
                } else {
                    responseDiv.textContent = 'Error: ' + result.message;
                    responseDiv.style.color = 'red';
                }

                setTimeout(() => {
                    responseDiv.textContent = '';
                }, 3000);

            } catch (error) {
                responseDiv.textContent = 'Network error occurred';
                responseDiv.style.color = 'red';
                console.error('Form submission error:', error);
                responseDiv.textContent = 'Network error occurred';
                responseDiv.style.color = 'red';
                console.error('Form submission error:', error);
                setTimeout(() => {
                    responseDiv.textContent = '';
                }, 3000);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        });
    };
    const initContactButton = () => {
        const contactBtn = document.querySelector('.contact-btn');
        if (!contactBtn) return;

        contactBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    };
    initLoader();
    initHamburgerMenu();
    initSmoothScrolling();
    initLightModeToggle();
    initContactForm();
    initContactButton();
});