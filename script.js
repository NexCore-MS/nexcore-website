document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');

    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const rootHtmlElement = document.documentElement;
    const applyThemeButtonIcon = (theme) => {
        if (darkModeToggle) {
            darkModeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    };
    let currentTheme = rootHtmlElement.classList.contains('dark-mode') ? 'dark' : 'light';
    applyThemeButtonIcon(currentTheme);
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            let newTheme = rootHtmlElement.classList.contains('dark-mode') ? 'light' : 'dark';
            if (newTheme === 'dark') {
                rootHtmlElement.classList.add('dark-mode');
            } else {
                rootHtmlElement.classList.remove('dark-mode');
            }
            applyThemeButtonIcon(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    } else {
        console.warn('Dark mode toggle button with ID "darkModeToggle" not found.');
    }

    // Hamburger Menu Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinksWrapper = document.querySelector('.nav-links-wrapper');
    if (mobileNavToggle && navLinksWrapper) {
        mobileNavToggle.addEventListener('click', () => {
            const isOpened = navLinksWrapper.classList.toggle('nav-open');
            mobileNavToggle.setAttribute('aria-expanded', isOpened);
            const iconSpan = mobileNavToggle.querySelector('span');
            if (iconSpan) iconSpan.textContent = isOpened ? '✕' : '☰';
        });
        navLinksWrapper.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksWrapper.classList.contains('nav-open')) {
                    navLinksWrapper.classList.remove('nav-open');
                    mobileNavToggle.setAttribute('aria-expanded', 'false');
                    const iconSpan = mobileNavToggle.querySelector('span');
                    if (iconSpan) iconSpan.textContent = '☰';
                }
            });
        });
    } else {
        if (!mobileNavToggle) console.warn('Mobile nav toggle button not found.');
        if (!navLinksWrapper) console.warn('Nav links wrapper not found.');
    }

    // NEW: Search Bar Toggle Functionality
    const searchIcon = document.getElementById('searchIcon');
    const searchInput = document.getElementById('searchInput');
    const searchContainer = document.querySelector('.search-container');

    if (searchIcon && searchInput && searchContainer) {
        searchIcon.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from bubbling up if needed
            searchContainer.classList.toggle('search-active');
            if (searchContainer.classList.contains('search-active')) {
                searchInput.focus(); // Focus the input field when it becomes active
            }
        });

        // Optional: Close search if user clicks outside of it
        document.addEventListener('click', (event) => {
            if (searchContainer.classList.contains('search-active') && 
                !searchContainer.contains(event.target) && 
                event.target !== searchIcon && 
                !searchIcon.contains(event.target) /* check if click was on icon or its children */ ) {
                searchContainer.classList.remove('search-active');
            }
        });
        
        // Prevent clicks inside search input from closing it via the above listener
        searchInput.addEventListener('click', (event) => {
            event.stopPropagation();
        });

    } else {
        if (!searchIcon) console.warn('Search icon not found.');
        if (!searchInput) console.warn('Search input not found.');
        if (!searchContainer) console.warn('Search container not found.');
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
