const fs = require('fs');
let c = fs.readFileSync('/var/www/3nd.dev/html/index.html', 'utf8');

// Fix squished hero background on mobile - add object-fit: cover
const old = '#hero-bg img {\n      width: 100%;\n      height: 100%;\n      \n      object-position: center;\n    }';
const newImg = '#hero-bg img {\n      width: 100%;\n      height: 100%;\n      object-fit: cover;\n      object-position: center;\n    }';

c = c.replace(old, newImg);

// Also ensure mobile nav menu works properly with proper z-index
const oldNav = `      .menu-toggle {
        display: flex;
      }`;
const newNav = `      .menu-toggle {
        display: flex;
        position: fixed;
        right: 20px;
        top: 20px;
      }`;
c = c.replace(oldNav, newNav);

// Make sure .nav-links has proper z-index on mobile
const oldNavLinks = `      .nav-links {
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
      }`;
const newNavLinks = `      .nav-links {
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
c = c.replace(oldNavLinks, newNavLinks);

fs.writeFileSync('/var/www/3nd.dev/html/index.html', c);
console.log('Fixed 3nd.dev mobile hero background');