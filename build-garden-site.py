#!/usr/bin/env python3
import os

BASE = '/var/www/gardenproject.3nd.dev'
os.makedirs(f'{BASE}/views/pages', exist_ok=True)
os.makedirs(f'{BASE}/public/css', exist_ok=True)
os.makedirs(f'{BASE}/public/js', exist_ok=True)
os.makedirs(f'{BASE}/data', exist_ok=True)

SITE_JSON = r'''{
  "hero": {
    "title": "FitGardener",
    "subtitle": "Where fitness meets the garden",
    "tagline": "Growing strength, growing greens — one bed at a time."
  },
  "about": {
    "title": "About Dan",
    "bio": "Gardening enthusiast and fitness junkie. I started FitGardener to document my journey building a productive garden while staying active and healthy. No fancy degrees — just dirty hands, hard work, and a passion for growing my own food.",
    "location": "Edmonton, Alberta",
    "specialties": ["Vegetable gardening", "Cold climate growing", "Composting", "Raised bed systems", "Fitness & garden routines"]
  },
  "garden": {
    "title": "The Garden",
    "description": "A work in progress. Each season I expand the plot, improve the soil, and try something new.",
    "setup": "2022",
    "size": "400 sq ft",
    "beds": 6,
    "highlight": "Tomatoes, zucchini, kale, herbs, and strawberries every summer."
  },
  "contact": {
    "title": "Get in Touch",
    "email": "dan@fitgardener.com",
    "note": "Have a question about gardening in cold climates? Send it over — I reply when I can."
  },
  "pages": [
    {
      "slug": "about",
      "title": "About",
      "content": "Learn more about Dan's story, background, and why FitGardener exists."
    },
    {
      "slug": "garden-journal",
      "title": "Garden Journal",
      "content": "Season-by-season notes on what worked, what failed, and what I'm trying next."
    },
    {
      "slug": "tips",
      "title": "Growing Tips",
      "content": "Practical tips for cold climate gardeners. What to plant when, how to extend your season, and simple tricks that actually work."
    },
    {
      "slug": "contact",
      "title": "Contact",
      "content": "Got questions? Want to collaborate? Reach out."
    }
  ],
  "posts": [
    {
      "date": "2026-05-01",
      "slug": "spring-planting-2026",
      "title": "Spring Planting 2026 — What's Going In",
      "excerpt": "Another year, another shot at the perfect garden. Here's the plan for this season.",
      "content": "Spring is finally here and the soil is warming up enough to work with. This year I'm trying a few new things: a potato patch in raised beds, more herbs along the south side of the house, and a cold frame for early season greens...\\n\\nThe compost is ready to work in. Last year's kitchen scraps broke down beautifully. Time to give back to the beds."
    },
    {
      "date": "2026-03-15",
      "slug": "seed-starting-indoors",
      "title": "Starting Seeds Indoors — What Actually Works",
      "excerpt": "After three years of trial and error, here are the only tips you actually need.",
      "content": "Seed starting doesn't need to be complicated. But most guides make it sound like you need a whole grow room setup. You don't.\\n\\nI start everything under a $40 grow light from Amazon, in solo cups with drainage holes, on a wire rack over a heater vent. That's it. No fancy humidity domes, no heating mats except for peppers...\\n\\nThe biggest lesson: less is more. Don't overwater. Don't overfeed. Give them light and walk away."
    },
    {
      "date": "2026-01-10",
      "slug": "winter-garden-reflection",
      "title": "What I Learned From Last Year's Garden",
      "excerpt": "The 2025 season was a mixed bag. Here's the honest recap.",
      "content": "2025 was my most ambitious garden yet — 6 raised beds, a new compost bin, and my first real attempt at winter gardening with a cold frame.\\n\\nThe cold frame failed. The tomatoes were incredible. The zucchini overwhelmed everyone I knew. The kale kept producing into November.\\n\\nBiggest win: no-dig beds. I layered cardboard, compost, and straw in the fall. Spring soil was dark, crumbly, and ready to plant with zero digging.\\n\\nBiggest fail: starting too many pepper varieties without labeling them. I still don't know what half my pepper plants were."
    }
  ]
}'''

APP_JS = r'''const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3841;
const DATA_FILE = path.join(__dirname, 'data', 'site.json');

let site = { hero: {}, about: {}, garden: {}, contact: {}, pages: [], posts: [] };
try {
  site = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
} catch(e) { console.log('Warning: data file not found, using defaults'); }

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('pages/home', { site, page: null, activePage: 'home' });
});

app.get('/:slug', (req, res, next) => {
  const slug = req.params.slug;
  const staticPage = site.pages.find(p => p.slug === slug);
  if (staticPage) {
    return res.render('pages/static', { site, page: staticPage, activePage: slug });
  }
  const post = site.posts.find(p => p.slug === slug);
  if (post) {
    return res.render('pages/post', { site, post, activePage: 'journal' });
  }
  next();
});

app.listen(PORT, () => {
  console.log('FitGardener running on port ' + PORT);
});
'''

MAIN_EJS = r'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= site.hero.title %> - <%= site.hero.subtitle %></title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <nav>
    <div class="nav-inner">
      <a href="/" class="logo"><%= site.hero.title %></a>
      <div class="nav-links">
        <a href="/">Home</a>
        <a href="/garden-journal">Journal</a>
        <a href="/about">About</a>
        <a href="/tips">Tips</a>
        <a href="/contact">Contact</a>
      </div>
      <button class="menu-toggle" onclick="toggleMenu()">☰</button>
    </div>
  </nav>

  <header class="hero">
    <div class="hero-content">
      <h1><%= site.hero.title %></h1>
      <p class="subtitle"><%= site.hero.subtitle %></p>
      <p class="tagline"><%= site.hero.tagline %></p>
    </div>
  </header>

  <main>
    <section class="intro">
      <div class="container">
        <div class="intro-grid">
          <div class="intro-text">
            <h2><%= site.about.title %></h2>
            <p><%= site.about.bio %></p>
            <div class="location">
              <span class="icon">📍</span> <%= site.about.location %>
            </div>
            <div class="specialties">
              <% site.about.specialties.forEach(function(s) { %>
                <span class="tag"><%= s %></span>
              <% }); %>
            </div>
          </div>
          <div class="intro-stats">
            <div class="stat-card">
              <div class="stat-num"><%= site.garden.setup %></div>
              <div class="stat-label">Garden Started</div>
            </div>
            <div class="stat-card">
              <div class="stat-num"><%= site.garden.size %></div>
              <div class="stat-label">Garden Size</div>
            </div>
            <div class="stat-card">
              <div class="stat-num"><%= site.garden.beds %></div>
              <div class="stat-label">Raised Beds</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="garden-highlight">
      <div class="container">
        <h2><%= site.garden.title %></h2>
        <p><%= site.garden.description %></p>
        <p class="highlight-text"><%= site.garden.highlight %></p>
      </div>
    </section>

    <section class="latest-posts">
      <div class="container">
        <h2>From the Journal</h2>
        <div class="posts-grid">
          <% site.posts.slice(0,3).forEach(function(post) { %>
            <a href="/<%= post.slug %>" class="post-card">
              <div class="post-date"><%= post.date %></div>
              <h3><%= post.title %></h3>
              <p><%= post.excerpt %></p>
              <span class="read-more">Read more →</span>
            </a>
          <% }); %>
        </div>
        <div class="view-all">
          <a href="/garden-journal" class="btn-outline">View all posts</a>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="container">
      <p>&copy; <%= new Date().getFullYear() %> FitGardener · <%= site.about.location %></p>
      <p class="footer-links">
        <a href="/about">About</a> ·
        <a href="/garden-journal">Journal</a> ·
        <a href="/tips">Tips</a> ·
        <a href="/contact">Contact</a>
      </p>
    </div>
  </footer>

  <script src="/js/main.js"></script>
</body>
</html>'''

STATIC_EJS = r'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= page.title %> - FitGardener</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <nav>
    <div class="nav-inner">
      <a href="/" class="logo">FitGardener</a>
      <div class="nav-links">
        <a href="/">Home</a>
        <a href="/garden-journal">Journal</a>
        <a href="/about">About</a>
        <a href="/tips">Tips</a>
        <a href="/contact">Contact</a>
      </div>
      <button class="menu-toggle" onclick="toggleMenu()">☰</button>
    </div>
  </nav>

  <div class="page-header">
    <div class="container">
      <h1><%= page.title %></h1>
    </div>
  </div>

  <main>
    <div class="container narrow">
      <div class="page-content">
        <%- page.content %>
      </div>
      <div class="back-link">
        <a href="/">← Back home</a>
      </div>
    </div>
  </main>

  <footer>
    <div class="container">
      <p>&copy; <%= new Date().getFullYear() %> FitGardener · <%= site.about.location %></p>
    </div>
  </footer>

  <script src="/js/main.js"></script>
</body>
</html>'''

POST_EJS = r'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= post.title %> - FitGardener</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <nav>
    <div class="nav-inner">
      <a href="/" class="logo">FitGardener</a>
      <div class="nav-links">
        <a href="/">Home</a>
        <a href="/garden-journal">Journal</a>
        <a href="/about">About</a>
        <a href="/tips">Tips</a>
        <a href="/contact">Contact</a>
      </div>
      <button class="menu-toggle" onclick="toggleMenu()">☰</button>
    </div>
  </nav>

  <div class="page-header">
    <div class="container">
      <div class="post-meta"><%= post.date %></div>
      <h1><%= post.title %></h1>
    </div>
  </div>

  <main>
    <div class="container narrow">
      <div class="post-content">
        <%- post.content.replace(/\\n/g, '<br>') %>
      </div>
      <div class="back-link">
        <a href="/garden-journal">← Back to journal</a>
      </div>
    </div>
  </main>

  <footer>
    <div class="container">
      <p>&copy; <%= new Date().getFullYear() %> FitGardener · <%= site.about.location %></p>
    </div>
  </footer>

  <script src="/js/main.js"></script>
</body>
</html>'''

JOURNAL_EJS = r'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Garden Journal - FitGardener</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <nav>
    <div class="nav-inner">
      <a href="/" class="logo">FitGardener</a>
      <div class="nav-links">
        <a href="/">Home</a>
        <a href="/garden-journal">Journal</a>
        <a href="/about">About</a>
        <a href="/tips">Tips</a>
        <a href="/contact">Contact</a>
      </div>
      <button class="menu-toggle" onclick="toggleMenu()">☰</button>
    </div>
  </nav>

  <div class="page-header">
    <div class="container">
      <h1>Garden Journal</h1>
      <p class="page-desc">Season-by-season notes on what worked, what failed, and what I'm trying next.</p>
    </div>
  </div>

  <main>
    <div class="container">
      <div class="posts-list">
        <% site.posts.forEach(function(post) { %>
          <a href="/<%= post.slug %>" class="post-card">
            <div class="post-date"><%= post.date %></div>
            <h3><%= post.title %></h3>
            <p><%= post.excerpt %></p>
            <span class="read-more">Read more →</span>
          </a>
        <% }); %>
      </div>
    </div>
  </main>

  <footer>
    <div class="container">
      <p>&copy; <%= new Date().getFullYear() %> FitGardener · <%= site.about.location %></p>
    </div>
  </footer>

  <script src="/js/main.js"></script>
</body>
</html>'''

CSS = r'''/* Reset & Base */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #faf9f5;
  --bg-card: #ffffff;
  --text: #2d2a26;
  --text-muted: #6b6560;
  --accent: #3a7d44;
  --accent-light: #e8f5eb;
  --accent-hover: #2d5e35;
  --border: #e0ddd8;
  --shadow: 0 2px 8px rgba(0,0,0,0.08);
  --radius: 12px;
}

body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  min-height: 100vh;
}

a { color: var(--accent); text-decoration: none; }
a:hover { color: var(--accent-hover); }

/* Container */
.container { max-width: 960px; margin: 0 auto; padding: 0 20px; }
.container.narrow { max-width: 720px; }

/* Nav */
nav {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}
.nav-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}
.logo {
  font-size: 20px;
  font-weight: 700;
  color: var(--accent) !important;
  letter-spacing: -0.5px;
}
.nav-links { display: flex; gap: 28px; }
.nav-links a { color: var(--text-muted); font-size: 15px; font-weight: 500; }
.nav-links a:hover, .nav-links a.active { color: var(--accent); }
.menu-toggle { display: none; background: none; border: none; font-size: 24px; cursor: pointer; }

/* Hero */
.hero {
  background: linear-gradient(135deg, var(--accent) 0%, #2d5e35 100%);
  color: #fff;
  padding: 80px 20px;
  text-align: center;
}
.hero-content h1 {
  font-size: clamp(36px, 6vw, 56px);
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: -1px;
}
.hero .subtitle {
  font-size: clamp(16px, 2.5vw, 20px);
  opacity: 0.9;
  margin-bottom: 8px;
}
.hero .tagline {
  font-size: 15px;
  opacity: 0.75;
}

/* Page Header */
.page-header {
  background: var(--accent-light);
  border-bottom: 1px solid var(--border);
  padding: 40px 20px;
}
.page-header h1 { font-size: 32px; font-weight: 700; color: var(--accent); }
.page-desc { color: var(--text-muted); margin-top: 8px; }

/* Intro Section */
.intro { padding: 60px 0; }
.intro-grid { display: grid; grid-template-columns: 1fr auto; gap: 48px; align-items: start; }
.intro-text h2 { font-size: 24px; margin-bottom: 16px; color: var(--accent); }
.intro-text p { color: var(--text-muted); margin-bottom: 16px; font-size: 16px; }
.location { font-size: 14px; color: var(--text-muted); margin-bottom: 16px; }
.specialties { display: flex; flex-wrap: wrap; gap: 8px; }
.tag {
  background: var(--accent-light);
  color: var(--accent);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}
.intro-stats { display: flex; flex-direction: column; gap: 12px; }
.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 24px;
  text-align: center;
  box-shadow: var(--shadow);
}
.stat-num { font-size: 24px; font-weight: 700; color: var(--accent); }
.stat-label { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

/* Garden Highlight */
.garden-highlight {
  background: var(--accent-light);
  padding: 48px 0;
  text-align: center;
}
.garden-highlight h2 { font-size: 24px; margin-bottom: 12px; color: var(--accent); }
.garden-highlight p { color: var(--text-muted); max-width: 600px; margin: 0 auto 8px; }
.highlight-text { font-weight: 600; color: var(--accent-hover); margin-top: 8px !important; }

/* Posts */
.latest-posts { padding: 60px 0; }
.latest-posts h2 { font-size: 24px; margin-bottom: 32px; text-align: center; }
.posts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
.posts-list { display: flex; flex-direction: column; gap: 20px; max-width: 720px; margin: 0 auto; }

.post-card {
  display: block;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  transition: box-shadow 0.2s, transform 0.2s;
  box-shadow: var(--shadow);
}
.post-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}
.post-card h3 { font-size: 18px; margin-bottom: 8px; color: var(--text); }
.post-card p { font-size: 14px; color: var(--text-muted); margin-bottom: 12px; }
.post-date { font-size: 12px; color: var(--accent); font-weight: 600; margin-bottom: 6px; }
.read-more { font-size: 13px; font-weight: 600; color: var(--accent); }

.view-all { text-align: center; margin-top: 32px; }
.btn-outline {
  display: inline-block;
  padding: 10px 24px;
  border: 2px solid var(--accent);
  border-radius: 8px;
  color: var(--accent);
  font-weight: 600;
  transition: background 0.2s, color 0.2s;
}
.btn-outline:hover { background: var(--accent); color: #fff; }

/* Page Content */
.page-content {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 40px;
  box-shadow: var(--shadow);
  font-size: 16px;
  line-height: 1.8;
  margin: 40px 0;
}
.page-content p { margin-bottom: 16px; }
.post-content {
  font-size: 16px;
  line-height: 1.8;
  margin: 40px 0;
}
.post-content p { margin-bottom: 16px; }
.back-link { margin-bottom: 40px; }
.back-link a { color: var(--text-muted); font-size: 14px; }
.back-link a:hover { color: var(--accent); }

/* Footer */
footer {
  background: var(--bg-card);
  border-top: 1px solid var(--border);
  padding: 32px 0;
  text-align: center;
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 60px;
}
.footer-links { margin-top: 8px; }
.footer-links a { color: var(--text-muted); }
.footer-links a:hover { color: var(--accent); }

/* Mobile */
@media (max-width: 768px) {
  .nav-links { display: none; flex-direction: column; position: absolute; top: 64px; left: 0; right: 0; background: var(--bg-card); border-bottom: 1px solid var(--border); padding: 16px 20px; gap: 12px; }
  .nav-links.open { display: flex; }
  .menu-toggle { display: block; }
  .intro-grid { grid-template-columns: 1fr; }
  .intro-stats { flex-direction: row; }
  .stat-card { flex: 1; }
  .hero { padding: 60px 20px; }
  .page-content { padding: 24px; }
}
@media (max-width: 480px) {
  .intro-stats { flex-direction: column; }
  .posts-grid { grid-template-columns: 1fr; }
}'''

JS = r'''function toggleMenu() {
  var nav = document.querySelector('.nav-links');
  nav.classList.toggle('open');
}

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(function(link) {
  link.addEventListener('click', function() {
    document.querySelector('.nav-links').classList.remove('open');
  });
});

// Simple scroll animation
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.post-card, .stat-card').forEach(function(el) {
  el.classList.add('fade-in');
  observer.observe(el);
});
'''

# Write all files
files = {
    f'{BASE}/data/site.json': SITE_JSON,
    f'{BASE}/app.js': APP_JS,
    f'{BASE}/views/pages/home.ejs': MAIN_EJS,
    f'{BASE}/views/pages/static.ejs': STATIC_EJS,
    f'{BASE}/views/pages/post.ejs': POST_EJS,
    f'{BASE}/views/pages/journal.ejs': JOURNAL_EJS,
    f'{BASE}/public/css/style.css': CSS,
    f'{BASE}/public/js/main.js': JS,
}

for path, content in files.items():
    with open(path, 'w') as f:
        f.write(content)
    print(f'Written: {path}')

print('All files created!')
print(f'Total: {len(files)} files')