const fs = require('fs');
let c = fs.readFileSync('/var/www/lab.3nd.dev/public/dashboard.html', 'utf8');

const target = "Click to open tool";
if (c.includes(target)) {
  // Replace the green click-to-open div with a launch button
  const oldGreenDiv = '<div style="margin-top:8px;font-size:12px;color:var(--green);font-family:\'Rajdhani\',sans-serif;text-align:center;"><i class="ph ph-arrow-up-right"></i> Click to open tool</div>';
  
  const newBtn = '<button onclick="window.open(\'${t.live_url}\', \'_blank\'); event.stopPropagation();" style="margin-top:12px;width:100%;padding:10px;background:linear-gradient(135deg,var(--green),var(--blue));border:none;border-radius:8px;color:#000;font-family:\'Rajdhani\',sans-serif;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;"><i class="ph ph-rocket-launch"></i> Launch Tool</button>';
  
  c = c.replace(oldGreenDiv, newBtn);
  
  // Also update the cardLink logic - when tool is active, we still want the button visible
  // but we should remove the cardLink wrapping since the button now does the navigation
  
  fs.writeFileSync('/var/www/lab.3nd.dev/public/dashboard.html', c);
  console.log('Replaced: Launch button added');
} else {
  console.log('Target not found');
}