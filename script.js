document.addEventListener('DOMContentLoaded', () => {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    const darkModeToggle = document.getElementById('darkModeToggle');
    const rootElement = document.documentElement;

    // Enhanced theme application with animations
    const applyTheme = (theme, animate = false) => {
        if (animate) {
            darkModeToggle.style.transform = 'scale(0.8) rotate(180deg)';
            setTimeout(() => {
                darkModeToggle.style.transform = '';
            }, 200);
        }

        if (theme === 'dark') {
            rootElement.classList.add('dark-mode');
            if (darkModeToggle) {
                darkModeToggle.textContent = '☀️';
                darkModeToggle.style.background = 'var(--glass-white-strong)';
            }
        } else {
            rootElement.classList.remove('dark-mode');
            if (darkModeToggle) {
                darkModeToggle.textContent = '🌙';
                darkModeToggle.style.background = 'var(--glass-white)';
            }
        }
    };

    // Initialize theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    applyTheme(initialTheme);

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const newTheme = rootElement.classList.contains('dark-mode') ? 'light' : 'dark';
            applyTheme(newTheme, true);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Hamburger Menu Toggle Functionality
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinksWrapper = document.querySelector('.nav-links-wrapper');
    const navOverlay = document.querySelector('.nav-overlay');

    if (mobileNavToggle && navLinksWrapper && navOverlay) {
        const closeMenu = () => {
            navLinksWrapper.classList.remove('nav-open');
            navOverlay.classList.remove('visible');
            document.body.classList.remove('menu-open');
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
            document.body.classList.toggle('menu-open', isOpen);
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
        }, { threshold: 0 });
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

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        fetch('https://api.mcsrvstat.us/2/nexcore.top', {
            signal: controller.signal
        })
            .then(resp => {
                clearTimeout(timeoutId);
                if (!resp.ok) {
                    throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
                }
                return resp.json();
            })
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
                clearTimeout(timeoutId);
                console.error('Failed to fetch server status:', err);
                if (err.name === 'AbortError') {
                    statusEl.innerHTML = 'Status: <span class="status-offline">Timeout</span>';
                } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
                    statusEl.innerHTML = 'Status: <span class="status-offline">Connection Error</span>';
                } else {
                    statusEl.innerHTML = 'Status: <span class="status-offline">Unknown</span>';
                }
            });
    };

    fetchServerStatus();

    // Simple gallery slider
    const gallerySlides = document.querySelectorAll('.gallery-slide');
    const prevBtn = document.querySelector('.gallery-btn.prev');
    const nextBtn = document.querySelector('.gallery-btn.next');
    let currentSlide = 0;
    let autoSlideInterval;

    const showSlide = (index) => {
        gallerySlides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    };

    const stopAutoSlide = () => {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    };

    const startAutoSlide = () => {
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % gallerySlides.length;
            showSlide(currentSlide);
        }, 5000);
    };

    if (gallerySlides.length && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + gallerySlides.length) % gallerySlides.length;
            showSlide(currentSlide);
            startAutoSlide();
        });
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % gallerySlides.length;
            showSlide(currentSlide);
            startAutoSlide();
        });

        const galleryContainer = document.querySelector('.gallery-slide-container');
        if (galleryContainer) {
            galleryContainer.addEventListener('mouseenter', stopAutoSlide);
            galleryContainer.addEventListener('mouseleave', startAutoSlide);
        }

        startAutoSlide();
    }

    // Enhanced glassmorphism interactions
    const interactiveElements = document.querySelectorAll('.feature-item, .future-mode-item, .testimonial-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-15px) scale(1.02)';
            element.style.background = 'var(--glass-white-strong)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
            element.style.background = '';
        });
    });
    
    // Dropdown functionality
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        // Prevent default link behavior
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px)';
            }
        });
    });

    // Glassmorphism scroll effects
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // Parallax for glass orbs
        const glassOrbs = document.querySelectorAll('.hero .glass-orb');
        glassOrbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.2;
            orb.style.transform = `translate3d(0, ${scrolled * speed}px, 0) scale(${1 + scrolled * 0.0002})`;
        });
        
        // Enhanced navigation glass effect
        const nav = document.querySelector('nav');
        if (scrolled > 100) {
            nav.style.background = 'var(--glass-white-strong)';
            nav.style.boxShadow = 'var(--glass-shadow-hover)';
            nav.style.transform = 'translateX(-50%) scale(0.98)';
        } else {
            nav.style.background = 'var(--glass-white)';
            nav.style.boxShadow = 'var(--glass-shadow)';
            nav.style.transform = 'translateX(-50%) scale(1)';
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });

    // Premium page loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('page-loaded');
        
        // Staggered animations for elements
        const animatedElements = document.querySelectorAll('.animated-item');
        animatedElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animate-in');
            }, index * 100);
        });
    });
    
    // Smooth modern typing effect for hero title
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.classList.add('typing');
        
        let charIndex = 0;
        const typeInterval = setInterval(() => {
            heroTitle.textContent += originalText[charIndex];
            charIndex++;
            
            if (charIndex >= originalText.length) {
                clearInterval(typeInterval);
                heroTitle.classList.remove('typing');
            }
        }, 60);
    }
    
    // Glass interaction effects
    const buttons = document.querySelectorAll('.cta-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.filter = 'brightness(1.1)';
            button.style.background = 'var(--glass-white-strong)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.filter = '';
            button.style.background = '';
        });
        
        // Ripple effect on click
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            ripple.classList.add('ripple');
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // FOUC prevention: Make body visible after CSS and initial JS should be handled
    // The inline script in <head> handles initial theme class on <html>
    // This ensures body becomes visible
    document.body.classList.add('loaded');
    document.body.classList.remove('preload');

});
