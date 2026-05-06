const fs = require('fs');
let c = fs.readFileSync('/var/www/lab.3nd.dev/public/dashboard.html', 'utf8');

// Find the loadDashboard function and modify it to fetch all tools for browse
// Replace the renderTools(allTools, 'browse-tools', false); with a browse-specific fetch

const oldBrowse = "renderTools(allTools, 'browse-tools', false);";
const newBrowse = `// Browse all uses a separate endpoint that returns all tools with activation status
(async () => {
  try {
    const browseRes = await fetch('/tools/api/browse');
    const browseTools = await browseRes.json();
    renderTools(browseTools, 'browse-tools', false);
  } catch(e) {
    renderTools(allTools, 'browse-tools', false);
  }
})();`;

c = c.replace(oldBrowse, newBrowse);

// Also update the renderTools function to show activation badge for non-activated tools in browse view
// The isActivated logic should work correctly with the new is_activated field

fs.writeFileSync('/var/www/lab.3nd.dev/public/dashboard.html', c);
console.log('Updated dashboard to use browse API');