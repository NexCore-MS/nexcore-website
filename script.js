document.addEventListener('DOMContentLoaded', () => {
    // console.log('NexCore script.js loaded and DOMContentLoaded fired.');

    // Set current year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Dark Mode Toggle Functionality
    const darkModeToggle = document.getElementById('darkModeToggle');
    const rootHtmlElement = document.documentElement; // Target <html> element

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            rootHtmlElement.classList.add('dark-mode');
            if (darkModeToggle) darkModeToggle.textContent = '☀️'; 
        } else {
            rootHtmlElement.classList.remove('dark-mode');
            if (darkModeToggle) darkModeToggle.textContent = '🌙'; 
        }
    };

    // Initial theme is set by inline script in <head>.
    // This part mainly ensures the button icon is correct on load.
    let currentTheme = rootHtmlElement.classList.contains('dark-mode') ? 'dark' : 'light';
    if (darkModeToggle) { // Update button icon based on class already set by inline script
        darkModeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    }
    
    // Toggle button event listener
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            let newTheme;
            if (rootHtmlElement.classList.contains('dark-mode')) {
                newTheme = 'light';
            } else {
                newTheme = 'dark';
            }
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    } else {
        console.warn('Dark mode toggle button with ID "darkModeToggle" was NOT found by the script.');
    }

    // Hamburger Menu Toggle Functionality (remains the same)
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinksWrapper = document.querySelector('.nav-links-wrapper');

    if (mobileNavToggle && navLinksWrapper) {
        mobileNavToggle.addEventListener('click', () => {
            const isOpened = navLinksWrapper.classList.toggle('nav-open');
            mobileNavToggle.setAttribute('aria-expanded', isOpened);
            const iconSpan = mobileNavToggle.querySelector('span');
            if (iconSpan) {
                iconSpan.textContent = isOpened ? '✕' : '☰';
            }
        });
        navLinksWrapper.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksWrapper.classList.contains('nav-open')) {
                    navLinksWrapper.classList.remove('nav-open');
                    mobileNavToggle.setAttribute('aria-expanded', 'false');
                    const iconSpan = mobileNavToggle.querySelector('span');
                    if (iconSpan) {
                        iconSpan.textContent = '☰';
                    }
                }
            });
        });
    } else {
        if (!mobileNavToggle) console.warn('Mobile nav toggle button (.mobile-nav-toggle) not found.');
        if (!navLinksWrapper) console.warn('Nav links wrapper (.nav-links-wrapper) not found.');
    }

    // Intersection Observer for Scroll Animations (remains the same)
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
        animatedItems.forEach(item => { observer.observe(item); });
    }

    // Copy IP Button Functionality (remains the same)
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
