const fs = require('fs');
let html = fs.readFileSync('/tmp/nex-index-edited.html', 'utf8');

// Remove entire Companies section
const companiesStart = '<!-- Companies -->';
const companiesEnd = '</div>\n\n    <!-- FAQ -->';
const companiesStartIdx = html.indexOf(companiesStart);
const companiesEndIdx = html.indexOf(companiesEnd);

if (companiesStartIdx !== -1 && companiesEndIdx !== -1) {
  html = html.substring(0, companiesStartIdx) + html.substring(companiesEndIdx + companiesEnd.length);
  console.log('Removed Companies section');
}

// Remove Twitter contact card
html = html.split('<div class="contact-card">\n                <h3>🐦 Twitter</h3>\n                <p><a href="https://twitter.com/nexmonster" target="_blank">@nexmonster</a></p>\n                <p style="margin-top:0.5rem;font-size:0.8rem;color:var(--text-dim)">Follow for updates on what we\'re building</p>\n            </div>\n').join('');

// Remove Status contact card  
html = html.split('<div class="contact-card">\n                <h3>🌍 Status</h3>\n                <p><a href="status.html">System Status Page</a></p>\n                <p style="margin-top:0.5rem;font-size:0.8rem;color:var(--text-dim)">Real-time operations monitoring</p>\n            </div>\n').join('');

// Remove status from footer links
html = html.split('<li><a href="status.html">Status</a></li>\n').join('');

// Remove Portfolio from footer
html = html.split('<li><a href="index.html#companies">Portfolio</a></li>\n').join('');

// Change footer brand text
html = html.split('AI companies that build themselves, scale themselves, and compound. The future of autonomous business.')
  .join('We build software products that scale. Modern tools, fast execution, great results.');

// Remove Twitter social link
html = html.split('<a href="https://twitter.com/nexmonster" target="_blank" title="Twitter">𝕏</a>\n').join('');

fs.writeFileSync('/tmp/nex-index-final.html', html);
console.log('Done. Lines:', html.split('\n').length);
