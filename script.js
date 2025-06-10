document.addEventListener('DOMContentLoaded', () => {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    const darkModeToggle = document.getElementById('darkModeToggle');
    const rootElement = document.documentElement; // Target <html> for dark mode class

    // Function to apply the theme and update toggle button
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            rootElement.classList.add('dark-mode');
            if (darkModeToggle) darkModeToggle.textContent = '☀️'; // Sun icon for light mode
        } else {
            rootElement.classList.remove('dark-mode');
            if (darkModeToggle) darkModeToggle.textContent = '🌙'; // Moon icon for dark mode
        }
    };

    // Check localStorage for saved theme (this part is mostly handled by inline script for initial load)
    // This script's main job for theme is the toggle button functionality
    // Initialize button text based on current theme (set by inline script)
    if (rootElement.classList.contains('dark-mode')) {
        if (darkModeToggle) darkModeToggle.textContent = '☀️';
    } else {
        if (darkModeToggle) darkModeToggle.textContent = '🌙';
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            let newTheme;
            if (rootElement.classList.contains('dark-mode')) {
                newTheme = 'light';
            } else {
                newTheme = 'dark';
            }
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    } else {
        console.warn('Dark mode toggle button with ID "darkModeToggle" was NOT found.');
    }

    // Hamburger Menu Toggle Functionality
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinksWrapper = document.querySelector('.nav-links-wrapper');
    const navOverlay = document.querySelector('.nav-overlay');

    if (mobileNavToggle && navLinksWrapper && navOverlay) {
        const closeMenu = () => {
            navLinksWrapper.classList.remove('nav-open');
            navOverlay.classList.remove('visible');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            const iconSpan = mobileNavToggle.querySelector('span');
            if (iconSpan) {
                iconSpan.textContent = '☰';
            }
        };

        mobileNavToggle.addEventListener('click', () => {
            const isOpen = navLinksWrapper.classList.toggle('nav-open');
            mobileNavToggle.setAttribute('aria-expanded', isOpen);
            const iconSpan = mobileNavToggle.querySelector('span');
            if (iconSpan) {
                iconSpan.textContent = isOpen ? '✕' : '☰';
            }
            navOverlay.classList.toggle('visible', isOpen);
        });

        navOverlay.addEventListener('click', closeMenu);

        navLinksWrapper.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    } else {
        if (!mobileNavToggle) console.warn('Mobile nav toggle button (.mobile-nav-toggle) not found.');
        if (!navLinksWrapper) console.warn('Nav links wrapper (.nav-links-wrapper) not found.');
        if (!navOverlay) console.warn('Navigation overlay (.nav-overlay) not found.');
    }

    // Intersection Observer for Scroll Animations
    const animatedItems = document.querySelectorAll('.animated-item');
    if (animatedItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedItems.forEach(item => {
            observer.observe(item);
        });
    }

    // Scroll Down Button
    const scrollDownButton = document.querySelector('.scroll-down');
    if (scrollDownButton) {
        scrollDownButton.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Copy IP Button Functionality
    const copyIpButton = document.getElementById('copy-ip-btn');
    const serverIpElement = document.getElementById('server-ip');

    if (copyIpButton && serverIpElement) {
        copyIpButton.addEventListener('click', () => {
            const ipAddress = serverIpElement.textContent;

            const handleSuccess = () => {
                copyIpButton.textContent = 'Copied!';
                copyIpButton.classList.add('copied');
                setTimeout(() => {
                    copyIpButton.textContent = 'Copy IP';
                    copyIpButton.classList.remove('copied');
                }, 2000);
            };

            const handleFailure = (err) => {
                console.error('Failed to copy IP: ', err);
                alert('Failed to copy IP. Please copy it manually: ' + ipAddress);
            };

            if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                navigator.clipboard.writeText(ipAddress).then(handleSuccess).catch(handleFailure);
            } else {
                try {
                    const textarea = document.createElement('textarea');
                    textarea.value = ipAddress;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.focus();
                    textarea.select();
                    const successful = document.execCommand('copy');
                    document.body.removeChild(textarea);
                    if (successful) {
                        handleSuccess();
                    } else {
                        handleFailure(new Error('execCommand failed'));
                    }
                } catch (err) {
                    handleFailure(err);
                }
            }
        });
    }

    // Back to Top Button Functionality
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', toggleVisibility);
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        toggleVisibility();
    }

    // Server Status Fetch
    const fetchServerStatus = () => {
        const statusEl = document.getElementById('server-status');
        if (!statusEl) return;

        fetch('https://api.mcsrvstat.us/2/nexcore.top')
            .then(resp => resp.json())
            .then(data => {
                if (data && data.online) {
                    let playerInfo = '';
                    if (data.players && typeof data.players.online === 'number') {
                        playerInfo = ` - ${data.players.online}`;
                        if (typeof data.players.max === 'number') {
                            playerInfo += `/${data.players.max}`;
                        }
                        playerInfo += ' players';
                    }
                    statusEl.innerHTML = `Status: <span class="status-online">Online</span>${playerInfo}`;
                } else {
                    statusEl.innerHTML = `Status: <span class="status-offline">Offline</span>`;
                }
            })
            .catch(err => {
                console.error('Failed to fetch server status', err);
                statusEl.textContent = 'Status: unknown';
            });
    };

    fetchServerStatus();

    // Simple gallery slider
    const gallerySlides = document.querySelectorAll('.gallery-slide');
    const prevBtn = document.querySelector('.gallery-btn.prev');
    const nextBtn = document.querySelector('.gallery-btn.next');
    let currentSlide = 0;

    const showSlide = (index) => {
        gallerySlides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    };

    if (gallerySlides.length && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + gallerySlides.length) % gallerySlides.length;
            showSlide(currentSlide);
        });
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % gallerySlides.length;
            showSlide(currentSlide);
        });
    }

    // FOUC prevention: Make body visible after CSS and initial JS should be handled
    // The inline script in <head> handles initial theme class on <html>
    // This ensures body becomes visible
    document.body.classList.add('loaded');

});
