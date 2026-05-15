const fs = require('fs');
let c = fs.readFileSync('/var/www/3nd.dev/html/index.html', 'utf8');

// Add debug rule at the end of styles to force hamburger visible on mobile
// Insert just before </style>
const styleEnd = c.indexOf('</style>');
const debugRule = `\n\n/* DEBUG: Force hamburger visible on mobile */
@media (max-width: 768px) {
  .menu-toggle {
    display: flex !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
}
/* end debug */`;

c = c.slice(0, styleEnd) + debugRule + c.slice(styleEnd);
fs.writeFileSync('/var/www/3nd.dev/html/index.html', c);
console.log('Added debug rule for hamburger');