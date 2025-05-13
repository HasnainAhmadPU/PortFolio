document.addEventListener('DOMContentLoaded', function () {
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
        const children = Array.from(body.children);
        children.forEach(child => {
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

        lightModeToggle.addEventListener('click', function () {
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
    initLoader();
    initHamburgerMenu();
    initSmoothScrolling();
    initLightModeToggle();
});
document.addEventListener('DOMContentLoaded', () => {
    class ProfessionalCalculator {
        constructor() {
            this.display = document.getElementById('display');
            this.operationDisplay = document.getElementById('operation-display');
            this.buttons = document.querySelectorAll('.calculator button');
            this.currentInput = '0';
            this.previousInput = '';
            this.operation = null;
            this.resetScreen = false;
            this.fullOperation = '';
            this.lastResult = null;
            this.init();
        }
        
        init() {
            this.updateDisplay();
            this.buttons.forEach(btn => {
                btn.addEventListener('click', () => this.handleInput(btn.dataset.value));
            });
            document.addEventListener('keydown', (e) => {
                const keyMap = {
                    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
                    '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
                    '.': '.', '+': '+', '-': '-', '*': '*', '/': '/',
                    '%': '%', 'Enter': '=', '=': '=', 'Escape': 'AC',
                    'Backspace': 'DEL'
                };
                if (keyMap[e.key]) {
                    e.preventDefault();
                    this.handleInput(keyMap[e.key]);
                }
            });
        }
        
        updateDisplay() {
            let displayValue = this.currentInput.replace(/,/g, '');
            if (displayValue.includes('.')) {
                const [integerPart, decimalPart] = displayValue.split('.');
                displayValue = `${this.formatNumber(integerPart)}.${decimalPart}`;
            } else {
                displayValue = this.formatNumber(displayValue);
            }
            if (displayValue.length > 12) {
                displayValue = parseFloat(this.currentInput).toExponential(6);
            }
            this.display.textContent = displayValue;
            let operationText = this.fullOperation;
            if (this.operation && this.resetScreen) {
                operationText = `${this.formatNumber(this.previousInput)} ${this.operation} `;
            }
            this.operationDisplay.textContent = operationText || '0';
            this.buttons.forEach(btn => {
                btn.classList.toggle('active-operation', 
                    this.operation === btn.dataset.value && !this.resetScreen);
            });
        }
        
        formatNumber(num) {
            const isNegative = num.startsWith('-');
            num = isNegative ? num.substring(1) : num;
            let formatted = num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return isNegative ? `-${formatted}` : formatted;
        }
        
        handleInput(value) {
            if (value >= '0' && value <= '9') this.handleNumber(value);
            else if (value === '.') this.handleDecimal();
            else if (value === 'AC') this.clearAll();
            else if (value === 'DEL') this.handleDelete();
            else if (value === '=') this.handleEquals();
            else this.handleOperator(value);
            this.updateDisplay();
        }
        
        handleNumber(num) {
            if (this.currentInput === '0' || this.resetScreen) {
                this.currentInput = num;
                this.resetScreen = false;
            } else if (this.currentInput.replace(/,/g, '').length < 12) {
                this.currentInput += num;
            }
            if (this.operation && this.resetScreen) {
                this.fullOperation = `${this.previousInput} ${this.operation} `;
            }
            this.fullOperation += num;
        }
        
        handleDecimal() {
            if (this.resetScreen) {
                this.currentInput = '0.';
                this.resetScreen = false;
                this.fullOperation = '0.';
                return;
            }
            if (!this.currentInput.includes('.')) {
                this.currentInput += '.';
                this.fullOperation += '.';
            }
        }
        
        handleOperator(op) {
            if (this.currentInput === '0' && this.fullOperation === '') return;
            if (this.operation && !this.resetScreen) {
                this.calculate();
            }
            this.previousInput = this.currentInput;
            this.operation = op;
            this.resetScreen = true;
            this.fullOperation = `${this.currentInput} ${op} `;
        }
        
        calculate() {
            const prev = parseFloat(this.previousInput.replace(/,/g, ''));
            const current = parseFloat(this.currentInput.replace(/,/g, ''));
            if (isNaN(prev)) return;
            const operations = {
                '+': (a, b) => a + b,
                '-': (a, b) => a - b,
                '*': (a, b) => a * b,
                '/': (a, b) => a / b,
                '%': (a, b) => a % b
            };
            if (operations[this.operation]) {
                let result;
                try {
                    result = operations[this.operation](prev, current);
                    if (!isFinite(result)) {
                        this.currentInput = 'Error';
                        this.resetScreen = true;
                        return;
                    }
                    result = Math.round(result * 100000000) / 100000000;
                    this.lastResult = result;
                    this.currentInput = result.toString();
                    this.fullOperation += ` = ${result}`;
                    this.operation = null;
                } catch (e) {
                    this.currentInput = 'Error';
                    this.resetScreen = true;
                }
            }
        }
        
        handleEquals() {
            if (this.operation === null && this.lastResult !== null) {
                this.previousInput = this.currentInput;
                this.currentInput = this.lastResult.toString();
                this.operation = '+';
            }
            if (this.operation && !this.resetScreen) {
                this.calculate();
                this.resetScreen = true;
                setTimeout(() => {
                    this.fullOperation = '';
                    this.updateDisplay();
                }, 1500);
            }
        }
        
        clearAll() {
            this.currentInput = '0';
            this.previousInput = '';
            this.operation = null;
            this.fullOperation = '';
            this.resetScreen = false;
            this.lastResult = null;
        }
        
        handleDelete() {
            if (this.resetScreen) return;
            const current = this.currentInput.replace(/,/g, '');
            if (current.length === 1 || (current.length === 2 && current.startsWith('-'))) {
                this.currentInput = '0';
            } else {
                this.currentInput = current.slice(0, -1);
                if (!this.currentInput.includes('.')) {
                    this.currentInput = this.formatNumber(this.currentInput);
                }
            }
            this.fullOperation = this.fullOperation.slice(0, -1);
        }
    }
    new ProfessionalCalculator();
    const contactBtn = document.querySelector('.contact-btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', function () {
            window.location.href = this.getAttribute('data-url');
        });
    }
});