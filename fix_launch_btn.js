const fs = require('fs');
let c = fs.readFileSync('/var/www/lab.3nd.dev/public/dashboard.html', 'utf8');

// Fix the Launch button to pass user email as URL param
const old = "window.open('${t.live_url || 'https://' + (t.subdomain || t.tool_number + '.lab.3nd.dev')}', '_blank')";
const newBtn = "window.open('${t.live_url ? t.live_url + '?user=' + encodeURIComponent(currentUser.email) : 'https://' + (t.subdomain || t.tool_number + '.lab.3nd.dev')}', '_blank')";

c = c.replace(old, newBtn);

fs.writeFileSync('/var/www/lab.3nd.dev/public/dashboard.html', c);
console.log('Updated Launch button to pass user email');