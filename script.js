 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/script.js b/script.js
index 4956932fadace2bc8a8083785ff39925880d250d..b66429dee2c0a080275fb6c2c77d8c739aed45e0 100644
--- a/script.js
+++ b/script.js
@@ -114,31 +114,74 @@ document.addEventListener('DOMContentLoaded', () => {
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
 
+    // Back to Top Button Functionality
+    const backToTopButton = document.getElementById('backToTop');
+    if (backToTopButton) {
+        const toggleVisibility = () => {
+            if (window.scrollY > 300) {
+                backToTopButton.classList.add('visible');
+            } else {
+                backToTopButton.classList.remove('visible');
+            }
+        };
+        window.addEventListener('scroll', toggleVisibility);
+        backToTopButton.addEventListener('click', () => {
+            window.scrollTo({ top: 0, behavior: 'smooth' });
+        });
+        toggleVisibility();
+    }
+
+    // Server Status Fetch
+    const fetchServerStatus = () => {
+        const statusEl = document.getElementById('server-status');
+        if (!statusEl) return;
+
+        fetch('https://api.mcsrvstat.us/2/nexcore.top')
+            .then(resp => resp.json())
+            .then(data => {
+                if (data && data.online) {
+                    let playerInfo = '';
+                    if (data.players && typeof data.players.online === 'number') {
+                        playerInfo = ` - ${data.players.online}/${data.players.max} players`;
+                    }
+                    statusEl.innerHTML = `Status: <span class="status-online">Online</span>${playerInfo}`;
+                } else {
+                    statusEl.innerHTML = `Status: <span class="status-offline">Offline</span>`;
+                }
+            })
+            .catch(err => {
+                console.error('Failed to fetch server status', err);
+                statusEl.textContent = 'Status: unknown';
+            });
+    };
+
+    fetchServerStatus();
+
     // FOUC prevention: Make body visible after CSS and initial JS should be handled
     // The inline script in <head> handles initial theme class on <html>
     // This ensures body becomes visible
     document.body.classList.add('loaded');
 
 });
 
EOF
)