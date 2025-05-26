document.addEventListener('DOMContentLoaded', () => {
    // console.log('NexCore script.js loaded and DOMContentLoaded fired.');

    // Set current year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    } else {
        // console.warn('Footer year element with ID "year" not found.');
    }

    // Dark Mode Toggle Functionality
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // console.log('Attempting to find darkModeToggle button. Found:', darkModeToggle);

    const applyTheme = (theme) => {
        // console.log('Applying theme:', theme);
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            if (darkModeToggle) darkModeToggle.textContent = '☀️';
        } else {
            body.classList.remove('dark-mode');
            if (darkModeToggle) darkModeToggle.textContent = '🌙';
        }
    };

    let savedTheme = localStorage.getItem('theme');
    // console.log('Initial check - Saved theme from localStorage:', savedTheme);

    if (!savedTheme) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            savedTheme = 'dark';
            // console.log('No saved theme. Using system preference: dark'); 
        } else {
            savedTheme = 'light';
            // console.log('No saved theme. Defaulting to light theme (or system preference is light).');
        }
    }
    applyTheme(savedTheme);

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            // console.log('Dark mode toggle button CLICKED!');
            let newTheme;
            if (body.classList.contains('dark-mode')) {
                newTheme = 'light';
            } else {
                newTheme = 'dark';
            }
            // console.log('New theme will be:', newTheme);
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
            // console.log('Set localStorage theme to:', newTheme);
        });
    } else {
        console.warn('Dark mode toggle button with ID "darkModeToggle" was NOT found by the script.');
    }

    // Hamburger Menu Toggle Functionality
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinksWrapper = document.querySelector('.nav-links-wrapper');

    if (mobileNavToggle && navLinksWrapper) {
        // console.log('Mobile nav toggle and wrapper found.');
        mobileNavToggle.addEventListener('click', () => {
            // console.log('Mobile nav toggle clicked.');
            const isOpened = navLinksWrapper.classList.toggle('nav-open');
            mobileNavToggle.setAttribute('aria-expanded', isOpened);
            
            const iconSpan = mobileNavToggle.querySelector('span');
            if (iconSpan) {
                if (isOpened) {
                    iconSpan.textContent = '✕'; // Close icon (X)
                } else {
                    iconSpan.textContent = '☰'; // Hamburger icon
                }
            }
        });

        navLinksWrapper.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (event) => {
                // Only close if it's an anchor link on the same page, or any link if preferred
                const href = link.getAttribute('href');
                const isSamePageAnchor = href && href.startsWith('#') && window.location.pathname === link.pathname;
                const isDifferentPage = window.location.pathname !== link.pathname && link.hostname === window.location.hostname;


                if (navLinksWrapper.classList.contains('nav-open')) {
                    // Close for same-page anchor links or if navigating away from current page type (e.g. index.html to rules.html)
                    // This logic can be tricky. For simplicity, often closing on any link click is fine for mobile.
                    // Let's close it if it's a same page anchor OR if it's not just linking to the current page file.
                    let closeMenu = false;
                    if (isSamePageAnchor) {
                        closeMenu = true;
                    } else if (href && !href.startsWith('#') && (link.pathname !== window.location.pathname || link.hash)) {
                        // This condition is if it's a link to another page or section on another page
                        // We might not need to close it here as the page will reload/navigate
                        // But often good UX to close it anyway.
                        closeMenu = true; 
                    } else if (href === window.location.pathname + window.location.search + window.location.hash) {
                        // Link to the exact same current page, maybe just an anchor on current non-index page
                        closeMenu = true;
                    }


                    if (navLinksWrapper.classList.contains('nav-open')) { // Check again in case of complex logic
                        navLinksWrapper.classList.remove('nav-open');
                        mobileNavToggle.setAttribute('aria-expanded', 'false');
                        const iconSpan = mobileNavToggle.querySelector('span');
                        if (iconSpan) {
                            iconSpan.textContent = '☰';
                        }
                    }
                }
            });
        });
    } else {
        if (!mobileNavToggle) console.warn('Mobile nav toggle button (.mobile-nav-toggle) not found.');
        if (!navLinksWrapper) console.warn('Nav links wrapper (.nav-links-wrapper) not found.');
    }

    // Intersection Observer for Scroll Animations
    const animatedItems = document.querySelectorAll('.animated-item');
    if (animatedItems.length > 0) {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observerInstance.unobserve(entry.target); 
                }
            });
        }, { threshold: 0.1 });
        
        animatedItems.forEach(item => {
            observer.observe(item);
        });
    }

    // Copy IP Button Functionality
    const copyIpButton = document.getElementById('copy-ip-btn');
    const serverIpElement = document.getElementById('server-ip');

    if (copyIpButton && serverIpElement) {
        copyIpButton.addEventListener('click', () => {
            const ipAddress = serverIpElement.textContent;
            navigator.clipboard.writeText(ipAddress).then(() => {
                copyIpButton.textContent = 'Copied!';
                copyIpButton.classList.add('copied');
                setTimeout(() => {
                    copyIpButton.textContent = 'Copy IP';
                    copyIpButton.classList.remove('copied');
                }, 2000); 
            }).catch(err => {
                console.error('Failed to copy IP: ', err);
                alert('Failed to copy IP. Please copy it manually: ' + ipAddress);
            });
        });
    }
});
