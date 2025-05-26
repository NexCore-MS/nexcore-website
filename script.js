document.addEventListener('DOMContentLoaded', () => {
    console.log('NexCore script.js loaded and DOMContentLoaded fired.'); // 1. Script start

    // Set current year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    } else {
        console.warn('Footer year element with ID "year" not found.');
    }

    // Dark Mode Toggle Functionality
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    console.log('Attempting to find darkModeToggle button. Found:', darkModeToggle); // 2. Button found?

    const applyTheme = (theme) => {
        console.log('Applying theme:', theme); // 4. or 7. Applying theme
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            if (darkModeToggle) darkModeToggle.textContent = '☀️'; // Sun icon
        } else {
            body.classList.remove('dark-mode');
            if (darkModeToggle) darkModeToggle.textContent = '🌙'; // Moon icon
        }
    };

    // Check for saved theme in localStorage
    let savedTheme = localStorage.getItem('theme');
    console.log('Initial check - Saved theme from localStorage:', savedTheme); // 3. localStorage check

    if (!savedTheme) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            savedTheme = 'dark';
            console.log('No saved theme. Using system preference: dark'); 
        } else {
            savedTheme = 'light';
            console.log('No saved theme. Defaulting to light theme (or system preference is light).');
        }
    }
    applyTheme(savedTheme); // Apply the initial theme

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            console.log('Dark mode toggle button CLICKED!'); // 5. Button click detected
            let newTheme;
            if (body.classList.contains('dark-mode')) {
                newTheme = 'light';
            } else {
                newTheme = 'dark';
            }
            console.log('New theme will be:', newTheme); // 6. New theme decided
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
            console.log('Set localStorage theme to:', newTheme); // 8. localStorage updated
        });
    } else {
        // This warning will appear if the button isn't found by its ID
        console.warn('Dark mode toggle button with ID "darkModeToggle" was NOT found by the script.');
    }

    // Intersection Observer for Scroll Animations
    const animatedItems = document.querySelectorAll('.animated-item');
    if (animatedItems.length > 0) {
        // console.log(`Found ${animatedItems.length} animated items to observe.`);
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
    } else {
        // console.log('No ".animated-item" elements found to observe on this page.');
    }

    // Copy IP Button Functionality
    const copyIpButton = document.getElementById('copy-ip-btn');
    const serverIpElement = document.getElementById('server-ip');

    if (copyIpButton && serverIpElement) {
        // console.log('Copy IP button and element found. Attaching listener.');
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
    } else {
        // Warnings if these specific elements are not on a page (e.g., rules.html)
        // if (!copyIpButton) console.log('Copy IP button with ID "copy-ip-btn" not found on this page (this is normal for non-index pages).');
        // if (!serverIpElement) console.log('Server IP element with ID "server-ip" not found on this page (this is normal for non-index pages).');
    }
});
