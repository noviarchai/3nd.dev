const fs = require('fs');
let c = fs.readFileSync('/var/www/lab.3nd.dev/public/dashboard.html', 'utf8');

// Add toggleSidebar function
const oldToggle = 'function toggleToolInfo(cardInner)';
const newToggle = `function toggleSidebar() { const sidebar = document.querySelector('.sidebar'); sidebar.classList.toggle('open'); }\n\nfunction toggleToolInfo(cardInner)`;

c = c.replace(oldToggle, newToggle);

// Make sure the menu-toggle button shows on mobile
// The CSS at .menu-toggle { display: block; } at 768px should handle this
// but we need to ensure .menu-toggle-btn exists and is styled properly

// Also fix the mobile CSS - the sidebar is set to translateX(-100%) but needs to be visible when toggled
// The CSS rule at 332: .sidebar { transform: translateX(-100%); } is correct but the button needs to be visible

fs.writeFileSync('/var/www/lab.3nd.dev/public/dashboard.html', c);
console.log('Added toggleSidebar function');