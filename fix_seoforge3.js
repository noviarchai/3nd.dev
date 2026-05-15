const fs = require('fs');
let c = fs.readFileSync('/var/www/111116.lab.3nd.dev/public/index.html', 'utf8');

// Fix the deepAnalyze fetch to include X-User-Email
c = c.replace(
  "const res = await fetch('/api/analyze', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url})});",
  "const res = await fetch('/api/analyze', {method:'POST',headers:{'Content-Type':'application/json','X-User-Email': getUserId()},body:JSON.stringify({url})});"
);

fs.writeFileSync('/var/www/111116.lab.3nd.dev/public/index.html', c);
console.log('Fixed deepAnalyze fetch');