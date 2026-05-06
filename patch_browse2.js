const fs = require('fs');
let c = fs.readFileSync('/var/www/lab.3nd.dev/public/dashboard.html', 'utf8');

// Update the isActivated check in renderTools to use server-provided is_activated when available
const oldCheck = 'const isActivated = myToolIds.includes(t.id);';
const newCheck = '// Use is_activated from browse API if available, otherwise fall back to client-side check\n        const isActivated = t.is_activated !== undefined ? t.is_activated : myToolIds.includes(t.id);';

c = c.replace(oldCheck, newCheck);

fs.writeFileSync('/var/www/lab.3nd.dev/public/dashboard.html', c);
console.log('Updated isActivated check to use server field');