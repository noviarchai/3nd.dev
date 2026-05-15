const fs = require('fs');
let c = fs.readFileSync('/var/www/111116.lab.3nd.dev/public/index.html', 'utf8');

// Add sharing toggle UI to the stats bar
const oldStats = '<div class="stat-label">Avg Score Delta</div><div class="stat-value" id="avgImprovement">0%</div>';
const newStats = '<div class="stat-label">Avg Score Delta</div><div class="stat-value" id="avgImprovement">0%</div><div class="stat-sub" id="sharingStatus" style="display:none;">Sharing OFF</div>';

// Update API calls to pass user email
const oldFetch = "fetch('/api/analyze'";
const newFetch = "fetch('/api/analyze', { headers: { 'X-User-Email': getUserId() } }";
c = c.replace(oldFetch, newFetch);

// Replace stats fetch
c = c.replace("fetch('/api/stats')", "fetch('/api/stats', { headers: { 'X-User-Email': getUserId() } })");
c = c.replace("fetch('/api/history')", "fetch('/api/history', { headers: { 'X-User-Email': getUserId() } })");
c = c.replace("fetch('/api/insights')", "fetch('/api/insights', { headers: { 'X-User-Email': getUserId() } })");
c = c.replace("fetch('/api/settings')", "fetch('/api/settings', { headers: { 'X-User-Email': getUserId() } })");

// Add user identification function
const userFunc = `function getUserId() {
  // Get from URL param or default to anonymous for testing
  const params = new URLSearchParams(window.location.search);
  return params.get('user') || 'anonymous';
}

// Show sharing status
async function loadSharingStatus() {
  const res = await fetch('/api/settings', { headers: { 'X-User-Email': getUserId() } });
  const data = await res.json();
  const el = document.getElementById('sharingStatus');
  if (el) {
    el.style.display = 'block';
    el.textContent = data.sharing_enabled ? '🔗 Sharing ON (all users learn together)' : '🔒 Sharing OFF (your data is private)';
    el.style.color = data.sharing_enabled ? 'var(--accent)' : 'var(--text2)';
  }
  // Show toggle for admin
  const toggleEl = document.getElementById('sharingToggle');
  if (toggleEl) toggleEl.style.display = 'inline-flex';
}`;

// Add after initial load call
c = c.replace('loadStats();', 'loadStats(); loadSharingStatus();');

// Add sharing toggle function
const toggleFunc = `async function toggleSharing() {
  const res = await fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-User-Email': getUserId() },
    body: JSON.stringify({ sharing: true, secret: '3nd-lab-admin' })
  });
  const data = await res.json();
  loadSharingStatus();
}`;

// Add to script
c = c.replace('async function loadStats()', toggleFunc + '\n\nasync function loadStats()');

fs.writeFileSync('/var/www/111116.lab.3nd.dev/public/index.html', c);
console.log('Updated frontend');