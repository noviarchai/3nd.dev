# SKILL.md — Browser Agent

## When to Use
Use this skill when you need to automate web browsers, scrape JavaScript-heavy sites, take screenshots, fill forms, or do any browser-based automation.

## Setup
```bash
cd /home/pi/.openclaw/workspace
npm install playwright
npx playwright install chromium
```

## Quick Test
```javascript
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://example.com');
  console.log(await page.title());
  await browser.close();
})();
```

## Common Patterns

### Basic Page Operations
```javascript
const { chromium } = require('playwright');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('https://target-site.com');
const title = await page.title();
const content = await page.content(); // full HTML
const text = await page.textContent('body');
await browser.close();
```

### Screenshot
```javascript
await page.screenshot({ path: 'screenshot.png', fullPage: true });
await page.screenshot({ path: 'element.png', selector: '#element-id' });
```

### Fill Forms & Submit
```javascript
await page.fill('#input-id', 'text to fill');
await page.click('button[type="submit"]');
await page.waitForNavigation({ waitUntil: 'networkidle0' });
```

### Click Elements
```javascript
await page.click('a.login-link');
await page.click('.card:nth-child(3) .btn');
```

### Wait for Elements
```javascript
await page.waitForSelector('#dynamic-content', { timeout: 10000 });
await page.waitForNavigation({ waitUntil: 'networkidle0' });
```

### Extract Data from Page
```javascript
const links = await page.$$eval('a', els => els.map(el => el.href));
const prices = await page.$$eval('.price', els => els.map(el => el.textContent.trim()));
const rows = await page.$$eval('table tr', rows => rows.map(row => {
  const cells = row.querySelectorAll('td');
  return Array.from(cells).map(cell => cell.textContent.trim());
}));
```

### Handle Multiple Pages
```javascript
const [newPage] = await Promise.all([
  page.waitForEvent('popup'),
  page.click('a[target="_blank"]')
]);
```

### Evaluate JavaScript in Page Context
```javascript
const result = await page.evaluate(() => {
  const data = document.querySelectorAll('.item');
  return Array.from(data).map(item => ({
    title: item.querySelector('h3').textContent,
    price: item.querySelector('.price').textContent
  }));
});
```

### Stealth Mode (Evade Bot Detection)
```javascript
const browser = await chromium.launch({
  headless: true,
  args: [
    '--disable-blink-features=AutomationControlled',
    '--disable-dev-shm-usage',
    '--no-sandbox'
  ]
});
await page.evaluateOnNewDocument(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => false });
});
```

## File Locations
- Workspace: `/home/pi/.openclaw/workspace`
- Browser: Chromium (arm64 compatible, installed via npx)

## Notes
- Always use `await` for async operations
- Close browser when done to free resources
- Use `waitUntil: 'networkidle0'` for SPAs that load data after initial render
- For CAPTCHAs or tough bot detection, combine with the stealth-browser skill
