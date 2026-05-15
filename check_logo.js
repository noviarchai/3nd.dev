const fs = require('fs');
let c = fs.readFileSync('/var/www/lab.3nd.dev/public/dashboard.html', 'utf8');

// Check if there's a background pattern on .sidebar-logo or a logo-icon div
if (c.includes('.sidebar-logo::before') || c.includes('.sidebar-logo {') && c.match(/\.sidebar-logo[\s\S]{0,200}background/)) {
  console.log('Found background on sidebar-logo');
} else {
  // Look for any background behind logo
  const sidebarIdx = c.indexOf('.sidebar-logo');
  const snippet = c.substring(sidebarIdx, sidebarIdx + 500);
  console.log('Sidebar logo CSS:', snippet.substring(0, 300));
}

// Check for any ::before on sidebar or logo
const beforeMatches = c.match(/\.sidebar[^\}]*::before[^\{]*\{[^\}]*\}/g);
if (beforeMatches) console.log('Sidebar before:', beforeMatches);

const logoBefore = c.match(/\.sidebar-logo[^\}]*::before[^\{]*\{[^\}]*\}/g);
if (logoBefore) console.log('Logo before:', logoBefore);

console.log('Done checking');