const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3841;
const DATA_FILE = path.join(__dirname, 'data', 'site.json');

// Load site content
let site = { hero: {}, about: {}, garden: {}, contact: {}, pages: [], posts: [] };
try {
  site = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
} catch(e) { console.log('Warning: data file not found, using defaults'); }

// Ensure data dir exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// --- Routes ---

// Home / Blog
app.get('/', (req, res) => {
  res.render('pages/home', {
    site,
    page: null,
    activePage: 'home'
  });
});

// Static pages
app.get('/:slug', (req, res, next) => {
  const slug = req.params.slug;

  // Check static pages
  const staticPage = site.pages.find(p => p.slug === slug);
  if (staticPage) {
    return res.render('pages/static', {
      site,
      page: staticPage,
      activePage: slug
    });
  }

  // Check blog posts
  const post = site.posts.find(p => p.slug === slug);
  if (post) {
    return res.render('pages/post', {
      site,
      post,
      activePage: 'journal'
    });
  }

  next();
});

// --- Start ---
app.listen(PORT, () => {
  console.log('FitGardener running on port ' + PORT);
});

// PM2 startup
if (require.main === module) {
  const pm2 = require('pm2');
  pm2.connect().then(() => {
    pm2.start({
      name: 'gardenproject',
      script: __filename,
      cwd: __dirname
    }, (err) => {
      if (err) console.error('PM2 start error:', err);
      pm2.disconnect();
    });
  });
}