# SKILL.md — Web Scraper (Cheerio)

## When to Use
Use Cheerio for fast, lightweight HTML parsing and scraping. Best for sites that don't require JavaScript rendering.

## Setup
```bash
cd /home/pi/.openclaw/workspace
npm install cheerio axios
```

## Quick Test
```javascript
const cheerio = require('cheerio');
const $ = cheerio.load('<html><body><h1>Hello</h1></body></html>');
console.log($('h1').text()); // "Hello"
```

## Common Patterns

### Fetch and Parse
```javascript
const cheerio = require('cheerio');
const axios = require('axios');

const { data } = await axios.get('https://target-site.com/page');
const $ = cheerio.load(data);

// Extract text
const title = $('h1').text().trim();
const paragraphs = $('p').map((i, el) => $(el).text().trim()).get();

// Extract attributes
const links = $('a').map((i, el) => $(el).attr('href')).get();
const images = $('img').map((i, el) => $(el).attr('src')).get();

// Extract structured data
const products = $('.product').map((i, el) => ({
  name: $(el).find('.name').text().trim(),
  price: $(el).find('.price').text().trim(),
  url: $(el).find('a').attr('href')
})).get();
```

### Load from Local HTML File
```javascript
const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('./page.html', 'utf8');
const $ = cheerio.load(html);
const title = $('title').text();
```

### Pagination / Multi-Page Scraping
```javascript
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeAllPages(baseUrl, maxPages = 10) {
  const results = [];
  for (let page = 1; page <= maxPages; page++) {
    const url = `${baseUrl}?page=${page}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const items = $('.item').map((i, el) => ({
      title: $(el).find('.title').text().trim()
    })).get();
    
    if (items.length === 0) break;
    results.push(...items);
  }
  return results;
}
```

### Handle Dynamic Classes (Common in React/Vue)
```javascript
// Many modern sites use hashed class names, use attribute selectors instead
const items = $('[data-testid="product-card"]').map((i, el) => ({
  name: $(el).attr('data-product-name'),
  price: $(el).find('[itemprop="price"]').text()
})).get();
```

## File Locations
- Workspace: `/home/pi/.openclaw/workspace`
- Requires: `cheerio` and `axios` (both in node_modules)

## Notes
- Cheerio is 8-10x faster than Puppeteer for static HTML
- No JavaScript rendering — use Playwright for SPA sites
- Always check robots.txt before scraping
- Respect rate limits — add delays between requests
