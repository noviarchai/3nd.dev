const fs = require('fs');
let c = fs.readFileSync('/var/www/lab.3nd.dev/public/dashboard.html', 'utf8');

// Add CSS for menu-toggle-btn to show as hamburger on mobile
// Find the @media (max-width: 768px) section and add button styles
const oldMedia = '      .menu-toggle { display: block; }';
const newMedia = `      .menu-toggle-btn { display: none !important; }
      @media (max-width: 768px) {
        .menu-toggle-btn { display: flex !important; align-items: center; justify-content: center; width: 40px; height: 40px; background: var(--bg3); border: 1px solid var(--border); border-radius: 8px; color: var(--white); font-size: 20px; cursor: pointer; position: fixed; top: 16px; left: 16px; z-index: 200; }
      }`;

c = c.replace(oldMedia, newMedia);

// Ensure .menu-toggle-btn is hidden by default (not shown on desktop)
if (!c.includes('.menu-toggle-btn { display: none')) {
  // Find the .sidebar-logo style and add button hide rule after it
  const sidebarLogoEnd = c.indexOf('.sidebar-logo span');
  const insertPoint = c.indexOf('}', sidebarLogoEnd) + 1;
  const hideBtn = '\n    .menu-toggle-btn { display: none; }\n';
  c = c.slice(0, insertPoint) + hideBtn + c.slice(insertPoint);
}

fs.writeFileSync('/var/www/lab.3nd.dev/public/dashboard.html', c);
console.log('Fixed mobile hamburger menu');