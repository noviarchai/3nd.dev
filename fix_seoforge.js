const fs = require('fs');
let c = fs.readFileSync('/var/www/111116.lab.3nd.dev/public/index.html', 'utf8');

// Fix the fetch call that has two objects instead of merged options
c = c.replace(
  "fetch('/api/analyze', { headers: { 'X-User-Email': getUserId() } }, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url})})",
  "fetch('/api/analyze', { method:'POST', headers: { 'Content-Type': 'application/json', 'X-User-Email': getUserId() }, body:JSON.stringify({url}) })"
);

// Ensure getUserId is defined early in the script section
const getUserIdFunc = `\nfunction getUserId() { return 'anonymous'; }\n`;
if (!c.includes('function getUserId')) {
  c = c.replace('async function loadStats()', 'function getUserId() { return new URLSearchParams(window.location.search).get(\'user\') || \'anonymous\'; }\n\nasync function loadStats()');
}

fs.writeFileSync('/var/www/111116.lab.3nd.dev/public/index.html', c);
console.log('Fixed getUserId and analyze fetch');