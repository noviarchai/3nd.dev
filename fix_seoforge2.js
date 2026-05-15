const fs = require('fs');
let c = fs.readFileSync('/var/www/111116.lab.3nd.dev/public/index.html', 'utf8');

// Add getUserId function before loadDashboard
const oldVars = 'let lastAnalysis = null;\nlet allHistory = [];';
const newVars = 'let lastAnalysis = null;\nlet allHistory = [];\n\nfunction getUserId() { return new URLSearchParams(window.location.search).get(\'user\') || \'anonymous\'; }';

c = c.replace(oldVars, newVars);

fs.writeFileSync('/var/www/111116.lab.3nd.dev/public/index.html', c);
console.log('Added getUserId function');