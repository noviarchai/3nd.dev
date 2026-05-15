const fs = require('fs');
let c = fs.readFileSync('/var/www/3nd.dev/html/index.html', 'utf8');

// Make sure .nav-links has display:flex in mobile and .menu-toggle is properly visible
const oldMediaNavLinks = `      .nav-links {
        position: fixed;
        top: 0;
        right: -100%;
        width: 280px;
        height: 100vh;
        background: var(--bg-secondary);
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 32px;
        transition: right 0.4s ease;
        z-index: 1000;
      }`;
const newMediaNavLinks = `      .nav-links {
        display: flex;
        position: fixed;
        top: 0;
        right: -100%;
        width: 280px;
        height: 100vh;
        background: var(--bg-secondary);
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 32px;
        transition: right 0.4s ease;
        z-index: 1000;
      }`;
c = c.replace(oldMediaNavLinks, newMediaNavLinks);

// Fix menu-toggle positioning - don't use fixed, let it be within nav flow but absolutely positioned
const oldToggle = `      .menu-toggle {
        display: flex;
        position: fixed;
        right: 20px;
        top: 20px;
      }`;
const newToggle = `      .menu-toggle {
        display: flex;
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
      }`;
c = c.replace(oldToggle, newToggle);

// Also make sure nav element doesn't clip overflow
const oldNav = `nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 20px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(10, 10, 10, 0.95);
      border-bottom: 1px solid rgba(157, 78, 221, 0.15);
      transition: background 0.3s ease, padding 0.3s ease, border-color 0.3s ease;
    }`;
const newNav = `nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 20px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(10, 10, 10, 0.95);
      border-bottom: 1px solid rgba(157, 78, 221, 0.15);
      transition: background 0.3s ease, padding 0.3s ease, border-color 0.3s ease;
      overflow: visible;
    }`;
c = c.replace(oldNav, newNav);

fs.writeFileSync('/var/www/3nd.dev/html/index.html', c);
console.log('Fixed mobile hamburger visibility');