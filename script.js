document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D Interactive Website
    console.log('🎮 NexCore 3D Interactive Website Loading...');

    // Year Display
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ================================
    // 3D CUSTOM CURSOR SYSTEM
    // ================================
    const customCursor = document.createElement('div');
    customCursor.id = 'custom-cursor';
    document.body.appendChild(customCursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    // Mouse tracking for 3D cursor
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor following
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        customCursor.style.left = cursorX + 'px';
        customCursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor hover effects
    const interactiveElements = document.querySelectorAll('a, button, .feature-item, .future-mode-item, .testimonial-item, .gallery-btn, .cta-button');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            customCursor.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            customCursor.classList.remove('hover');
        });
    });

    // ================================
    // 3D BACKGROUND CANVAS SYSTEM
    // ================================
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 3D Particle System
    class Particle3D {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.z = Math.random() * 1000;
            this.size = Math.random() * 3 + 1;
            this.speed = Math.random() * 2 + 1;
            this.color = ['#00d4ff', '#32cd32', '#764ba2', '#feca57'][Math.floor(Math.random() * 4)];
            this.rotation = 0;
            this.rotationSpeed = Math.random() * 0.02 + 0.01;
        }

        update() {
            this.y += this.speed;
            this.rotation += this.rotationSpeed;
            
            // Mouse interaction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                this.x -= dx * 0.001;
                this.y -= dy * 0.001;
            }

            if (this.y > canvas.height + 10) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            // 3D effect with perspective
            const scale = 1000 / (1000 - this.z);
            ctx.scale(scale, scale);
            
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;
            
            ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
            ctx.restore();
        }
    }

    // Create particles
    const particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle3D());
    }

    // Animate particles
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ================================
    // MINECRAFT PARTICLE SYSTEM
    // ================================
    function createMinecraftParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'minecraft-particles';
        document.body.appendChild(particlesContainer);

        setInterval(() => {
            if (particlesContainer.children.length < 15) {
                createMinecraftParticle(particlesContainer);
            }
        }, 1200);
    }

    function createMinecraftParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'minecraft-particle';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 20000);
    }

    // ================================
    // 3D THEME SYSTEM
    // ================================
    const darkModeToggle = document.getElementById('darkModeToggle');
    const rootElement = document.documentElement;

    const applyTheme = (theme, animate = false) => {
        if (animate) {
            darkModeToggle.style.transform = 'scale(0.8) rotateY(180deg)';
            setTimeout(() => {
                darkModeToggle.style.transform = '';
            }, 300);
        }

        if (theme === 'dark') {
            rootElement.classList.add('dark-mode');
            if (darkModeToggle) {
                darkModeToggle.textContent = '☀️';
                darkModeToggle.style.background = 'var(--bg-glass-strong)';
            }
        } else {
            rootElement.classList.remove('dark-mode');
            if (darkModeToggle) {
                darkModeToggle.textContent = '🌙';
                darkModeToggle.style.background = 'var(--bg-glass)';
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

    // ================================
    // 3D MOBILE NAVIGATION
    // ================================
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
    }

    // ================================
    // 3D DROPDOWN SYSTEM
    // ================================
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        let isOpen = false;
        let closeTimeout;
        
        if (!toggle || !menu) return;
        
        const openDropdown = () => {
            clearTimeout(closeTimeout);
            if (isOpen) return;
            isOpen = true;
            dropdown.classList.add('active');
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            menu.style.transform = 'translateX(-50%) translateY(0) rotateX(0deg)';
        };
        
        const closeDropdown = () => {
            if (!isOpen) return;
            isOpen = false;
            dropdown.classList.remove('active');
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
            menu.style.transform = 'translateX(-50%) translateY(-15px) rotateX(-10deg)';
        };
        
        const scheduleClose = () => {
            closeTimeout = setTimeout(closeDropdown, 300);
        };
        
        // Desktop hover behavior
        dropdown.addEventListener('mouseenter', openDropdown);
        dropdown.addEventListener('mouseleave', scheduleClose);
        
        // Mobile click behavior
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            if (isOpen) {
                closeDropdown();
            } else {
                openDropdown();
            }
        });
        
        // Keep dropdown open when hovering over menu
        menu.addEventListener('mouseenter', () => {
            clearTimeout(closeTimeout);
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                closeDropdown();
            }
        });
        
        // Close dropdown when clicking on menu items
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeDropdown();
            });
        });
    });

    // ================================
    // 3D INTERSECTION OBSERVER
    // ================================
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

    // ================================
    // 3D SCROLL INTERACTIONS
    // ================================
    const scrollDownButton = document.querySelector('.scroll-down');
    if (scrollDownButton) {
        scrollDownButton.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ================================
    // 3D COPY IP FUNCTIONALITY
    // ================================
    const copyIpButton = document.getElementById('copy-ip-btn');
    const serverIpElement = document.getElementById('server-ip');

    if (copyIpButton && serverIpElement) {
        copyIpButton.addEventListener('click', () => {
            const ipAddress = serverIpElement.textContent;

            const handleSuccess = () => {
                copyIpButton.textContent = 'Copied!';
                copyIpButton.classList.add('copied');
                
                // 3D success animation
                copyIpButton.style.transform = 'scale(1.2) rotateY(360deg)';
                setTimeout(() => {
                    copyIpButton.style.transform = '';
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

    // ================================
    // 3D BACK TO TOP BUTTON
    // ================================
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
            // 3D scroll animation
            backToTopButton.style.transform = 'translateY(-8px) scale(1.5) rotateY(720deg)';
            setTimeout(() => {
                backToTopButton.style.transform = '';
            }, 600);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        toggleVisibility();
    }

    // ================================
    // 3D SERVER STATUS SYSTEM
    // ================================
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
                
                // 3D success pulse
                statusEl.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    statusEl.style.transform = '';
                }, 300);
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
    setInterval(fetchServerStatus, 30000); // Update every 30 seconds

    // ================================
    // 3D GALLERY SYSTEM
    // ================================
    const gallerySlides = document.querySelectorAll('.gallery-slide');
    const prevBtn = document.querySelector('.gallery-btn.prev');
    const nextBtn = document.querySelector('.gallery-btn.next');
    let currentSlide = 0;
    let autoSlideInterval;

    const showSlide = (index) => {
        gallerySlides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
                slide.style.transform = 'translateZ(10px) scale(1.02)';
            } else {
                slide.classList.remove('active');
                slide.style.transform = 'translateZ(0) scale(1)';
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
            
            // 3D button animation
            prevBtn.style.transform = 'translateY(-50%) scale(1.3) rotateZ(-90deg)';
            setTimeout(() => {
                prevBtn.style.transform = '';
            }, 200);
        });
        
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % gallerySlides.length;
            showSlide(currentSlide);
            startAutoSlide();
            
            // 3D button animation
            nextBtn.style.transform = 'translateY(-50%) scale(1.3) rotateZ(90deg)';
            setTimeout(() => {
                nextBtn.style.transform = '';
            }, 200);
        });

        const galleryContainer = document.querySelector('.gallery-slide-container');
        if (galleryContainer) {
            galleryContainer.addEventListener('mouseenter', stopAutoSlide);
            galleryContainer.addEventListener('mouseleave', startAutoSlide);
        }

        startAutoSlide();
    }

    // ================================
    // 3D ENHANCED INTERACTIONS
    // ================================
    const enhance3DElements = () => {
        // Feature items 3D effects
        const featureItems = document.querySelectorAll('.feature-item, .future-mode-item, .testimonial-item');
        
        featureItems.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-20px) rotateX(10deg) rotateY(5deg) scale(1.05)';
                element.style.boxShadow = 'var(--shadow-neon), 0 25px 50px rgba(0, 0, 0, 0.5)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
                element.style.boxShadow = '';
            });

            // Add click ripple effect
            element.addEventListener('click', (e) => {
                const ripple = document.createElement('div');
                ripple.classList.add('ripple');
                
                const rect = element.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                element.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 800);
            });
        });

        // CTA buttons enhanced 3D effects
        const ctaButtons = document.querySelectorAll('.cta-button');
        ctaButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-8px) scale(1.1) rotateX(-5deg) rotateY(2deg)';
                button.style.boxShadow = 'var(--shadow-minecraft), 0 0 60px rgba(50, 205, 50, 0.8), 0 20px 40px rgba(0, 0, 0, 0.5)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
                button.style.boxShadow = '';
            });
        });

        // Navigation logo 3D enhancement
        const navLogo = document.querySelector('.nav-logo');
        if (navLogo) {
            navLogo.addEventListener('mouseenter', () => {
                navLogo.style.transform = 'scale(1.1) rotateX(10deg) rotateY(5deg)';
                navLogo.style.textShadow = '0 0 50px rgba(0, 212, 255, 0.8)';
            });
            
            navLogo.addEventListener('mouseleave', () => {
                navLogo.style.transform = '';
                navLogo.style.textShadow = '';
            });
        }
    };

    // ================================
    // 3D PARALLAX SCROLL EFFECTS
    // ================================
    let ticking = false;
    
    function update3DScrollEffects() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // 3D Parallax for glass orbs
        const glassOrbs = document.querySelectorAll('.hero .glass-orb');
        glassOrbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.3;
            const rotationSpeed = (index + 1) * 0.1;
            orb.style.transform = `translateY(${scrolled * speed}px) rotateX(${scrolled * rotationSpeed}deg) rotateY(${scrolled * rotationSpeed * 2}deg) scale(${1 + scrolled * 0.0003})`;
        });
        
        // Enhanced navigation 3D effect
        const nav = document.querySelector('nav');
        if (scrolled > 100) {
            nav.style.background = 'var(--bg-glass-strong)';
            nav.style.borderColor = 'var(--border-neon-strong)';
            nav.style.transform = 'translateX(-50%) translateY(-2px) translateZ(15px) scale(0.98)';
            nav.style.boxShadow = 'var(--shadow-neon)';
        } else {
            nav.style.background = 'var(--bg-glass)';
            nav.style.borderColor = 'var(--border-primary)';
            nav.style.transform = 'translateX(-50%) translateZ(0) scale(1)';
            nav.style.boxShadow = '';
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(update3DScrollEffects);
            ticking = true;
        }
    });

    // ================================
    // INITIALIZE ALL 3D SYSTEMS
    // ================================
    window.addEventListener('load', () => {
        document.body.classList.add('page-loaded');
        document.body.classList.remove('preload');
        
        // Initialize 3D enhancements
        enhance3DElements();
        
        // Initialize Minecraft particles if on desktop
        if (window.innerWidth > 768) {
            createMinecraftParticles();
        }
        
        // Staggered 3D animations for elements
        const animatedElements = document.querySelectorAll('.animated-item');
        animatedElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animate-in');
            }, index * 150);
        });
        
        console.log('🚀 NexCore 3D Interactive Website Loaded Successfully!');
    });

    // ================================
    // 3D PERFORMANCE OPTIMIZATION
    // ================================
    // Reduce animations on mobile/low-end devices
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        document.body.classList.add('reduced-motion');
    }

    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause heavy animations
            canvas.style.display = 'none';
        } else {
            // Resume animations
            canvas.style.display = 'block';
        }
    });
});

// ================================
// 3D ERROR HANDLING
// ================================
window.addEventListener('error', (e) => {
    console.error('3D Website Error:', e.error);
});

// ================================
// 3D RESIZE HANDLER
// ================================
window.addEventListener('resize', () => {
    // Recalculate 3D transformations on resize
    const nav = document.querySelector('nav');
    if (nav) {
        nav.style.transform = 'translateX(-50%) translateZ(0)';
    }
});