 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/script.js b/script.js
index b66429dee2c0a080275fb6c2c77d8c739aed45e0..1dab7e38df8ad644d9a6ac38e574d8f82aeaedbe 100644
--- a/script.js
+++ b/script.js
@@ -26,62 +26,88 @@ document.addEventListener('DOMContentLoaded', () => {
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
 
     if (mobileNavToggle && navLinksWrapper) {
         mobileNavToggle.addEventListener('click', () => {
-            const isOpened = navLinksWrapper.classList.toggle('nav-open');
-            mobileNavToggle.setAttribute('aria-expanded', isOpened);
+            const isOpening = !navLinksWrapper.classList.contains('nav-open');
+            mobileNavToggle.setAttribute('aria-expanded', isOpening);
             const iconSpan = mobileNavToggle.querySelector('span');
             if (iconSpan) {
-                iconSpan.textContent = isOpened ? '✕' : '☰';
+                iconSpan.textContent = isOpening ? '✕' : '☰';
+            }
+
+            if (isOpening) {
+                navLinksWrapper.style.maxHeight = navLinksWrapper.scrollHeight + 'px';
+                navLinksWrapper.classList.add('nav-open');
+                const cleanup = (e) => {
+                    if (e.propertyName === 'max-height') {
+                        navLinksWrapper.style.maxHeight = 'none';
+                        navLinksWrapper.removeEventListener('transitionend', cleanup);
+                    }
+                };
+                navLinksWrapper.addEventListener('transitionend', cleanup);
+            } else {
+                navLinksWrapper.style.maxHeight = navLinksWrapper.scrollHeight + 'px';
+                void navLinksWrapper.offsetHeight;
+                navLinksWrapper.classList.remove('nav-open');
+                navLinksWrapper.style.maxHeight = '0';
+            }
+        });
+
+        navLinksWrapper.addEventListener('transitionend', (e) => {
+            if (e.propertyName === 'max-height' && !navLinksWrapper.classList.contains('nav-open')) {
+                navLinksWrapper.style.maxHeight = '';
             }
         });
 
         navLinksWrapper.querySelectorAll('a').forEach(link => {
             link.addEventListener('click', () => {
                 if (navLinksWrapper.classList.contains('nav-open')) {
+                    navLinksWrapper.style.maxHeight = navLinksWrapper.scrollHeight + 'px';
+                    void navLinksWrapper.offsetHeight;
                     navLinksWrapper.classList.remove('nav-open');
+                    navLinksWrapper.style.maxHeight = '0';
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
 
EOF
)