document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Dark Mode Toggle Functionality
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Function to apply the saved or preferred theme
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            if (darkModeToggle) darkModeToggle.textContent = '☀️'; // Sun icon for light mode
        } else {
            body.classList.remove('dark-mode');
            if (darkModeToggle) darkModeToggle.textContent = '🌙'; // Moon icon for dark mode
        }
    };

    // Check for saved theme in localStorage
    let savedTheme = localStorage.getItem('theme');

    // If no saved theme, check system preference
    if (!savedTheme) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            savedTheme = 'dark';
        } else {
            savedTheme = 'light'; // Default to light if no system preference or saved theme
        }
    }
    
    applyTheme(savedTheme); // Apply the initial theme

    // Toggle button event listener
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            let newTheme;
            if (body.classList.contains('dark-mode')) {
                newTheme = 'light';
            } else {
                newTheme = 'dark';
            }
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
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
