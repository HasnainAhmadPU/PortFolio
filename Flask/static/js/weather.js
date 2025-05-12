document.addEventListener('DOMContentLoaded', () => {
    const initLoader = () => {
        const loader = document.getElementById('loader');
        const progressBar = document.getElementById('progressBar');
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += 1;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
            if (progress >= 100) {
                clearInterval(loadingInterval);
                document.body.classList.add('loaded');
                setTimeout(() => loader.remove(), 500);
            }
        }, 20);
    };

    const initHamburgerMenu = () => {
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const headerNav = document.querySelector('.header-nav');
        if (!hamburgerBtn || !headerNav) return;

        const toggleMenu = (isOpen = !headerNav.classList.contains('active')) => {
            hamburgerBtn.classList.toggle('active', isOpen);
            headerNav.classList.toggle('active', isOpen);
            document.getElementById('content-wrapper').style.filter = isOpen ? 'blur(5px)' : 'none';
            document.body.style.overflow = isOpen ? 'hidden' : '';
            headerNav.style.backdropFilter = isOpen ? 'none' : '';
        };

        document.querySelectorAll('.header-nav a').forEach(link => {
            link.addEventListener('click', () => window.innerWidth <= 768 && toggleMenu(false));
        });

        hamburgerBtn.addEventListener('click', () => toggleMenu());
        window.addEventListener('resize', () => window.innerWidth > 768 && toggleMenu(false));
    };

    const initSmoothScrolling = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', e => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                targetElement && window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
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

        lightModeToggle.addEventListener('click', () => {
            const isLightMode = document.body.classList.toggle('light-mode');
            lightModeToggle.innerHTML = isLightMode ? '🌙' : '☀️';
            localStorage.setItem('lightMode', isLightMode);
        });

        if (localStorage.getItem('lightMode') === 'true') {
            document.body.classList.add('light-mode');
            lightModeToggle.innerHTML = '🌙';
        }

        document.body.appendChild(lightModeToggle);
    };

    const initWeatherApp = () => {
        const weatherIcons = {
            clouds: "/static/images/cloud.png",
            clear: "/static/images/clear.png",
            rain: "/static/images/rain.png",
            drizzle: "/static/images/drizzle.png",
            snow: "/static/images/snow.png",
            thunderstorm: "/static/images/thunderstorm.png",
            mist: "/static/images/mist.png",
            fog: "/static/images/mist.png",
            default: "/static/images/sun.png"
        };

        const checkWeather = async city => {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=8c77042e721109158ba07b30a4a48e55`);
                if (!response.ok) throw new Error("City not found");
                
                const data = await response.json();
                document.getElementById("location").textContent = data.name;
                document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
                document.getElementById("wind-speed").textContent = `${data.wind.speed} kmph`;
                document.getElementById("humidity").textContent = `${data.main.humidity}%`;
                document.getElementById("weather-icon").src = 
                    weatherIcons[data.weather[0].main.toLowerCase()] || weatherIcons.default;
            } catch (error) {
                alert(error.message);
                document.getElementById("weather-icon").src = weatherIcons.default;
            }
        };

        const searchInput = document.getElementById("search-input");
        const searchWeather = () => searchInput.value.trim() && checkWeather(searchInput.value.trim());
        
        document.getElementById("search-btn").addEventListener("click", searchWeather);
        searchInput.addEventListener("keypress", e => e.key === "Enter" && searchWeather());
    };
    initLoader();
    initHamburgerMenu();
    initSmoothScrolling();
    initLightModeToggle();
    initWeatherApp();
    const contactBtn = document.querySelector('.contact-btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', function () {
            window.location.href = this.getAttribute('data-url');
        });
    }
});