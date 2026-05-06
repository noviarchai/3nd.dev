const fs = require('fs');
let c = fs.readFileSync('/var/www/lab.3nd.dev/public/dashboard.html', 'utf8');

// Replace the conditional isActive section to always show launch button for ALL tools
const oldSection = `\${isActive ?
              \`<button onclick="window.open('\${t.live_url}', '_blank'); event.stopPropagation();" style="margin-top:12px;width:100%;padding:10px;background:linear-gradient(135deg,var(--green),var(--blue));border:none;border-radius:8px;color:#000;font-family:'Rajdhani',sans-serif;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;"><i class="ph ph-rocket-launch"></i> Launch Tool</button>\` :
              \`<div style="margin-top:8px;font-size:12px;color:#555;font-family:'Rajdhani',sans-serif;text-align:center;">\${t.subdomain || t.tool_number + '.lab.3nd.dev'}</div>\`
            }`;

// New: always show launch button, using live_url if available, otherwise subdomain
const newSection = `\${isActive || t.subdomain || t.tool_number ?
              \`<button onclick="window.open('\${t.live_url || 'https://' + (t.subdomain || t.tool_number + '.lab.3nd.dev')}', '_blank'); event.stopPropagation();" style="margin-top:12px;width:100%;padding:10px;background:linear-gradient(135deg,var(--green),var(--blue));border:none;border-radius:8px;color:#000;font-family:'Rajdhani',sans-serif;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;"><i class="ph ph-rocket-launch"></i> Launch Tool</button>\` :
              \`<div style="margin-top:8px;font-size:12px;color:#555;font-family:'Rajdhani',sans-serif;text-align:center;">Not deployed yet</div>\`
            }`;

c = c.replace(oldSection, newSection);
fs.writeFileSync('/var/www/lab.3nd.dev/public/dashboard.html', c);
console.log('Done');