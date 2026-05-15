const fs = require('fs');
let c = fs.readFileSync('/var/www/3nd.dev/html/index.html', 'utf8');

// The .hero-logo CSS has malformed structure - some rules orphaned
// Let's find and fix the .hero-logo block
const oldBlock = `.hero-logo {
      width: 100%;
      height: auto;
      display: block;
    }
      box-shadow: 
        0 0 100px var(--purple-glow),
        0 0 180px rgba(157, 78, 221, 0.5);
      animation: logoPulse 3s ease-in-out infinite;
      position: relative;
      z-index: 1;
    }`;

const newBlock = `.hero-logo {
      width: 100%;
      height: auto;
      display: block;
      box-shadow: 0 0 100px var(--purple-glow), 0 0 180px rgba(157, 78, 221, 0.5);
      animation: logoPulse 3s ease-in-out infinite;
      position: relative;
      z-index: 1;
    }`;

c = c.replace(oldBlock, newBlock);
fs.writeFileSync('/var/www/3nd.dev/html/index.html', c);
console.log('Fixed .hero-logo CSS block');