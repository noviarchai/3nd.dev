# SKILL.md — Research Agent

## When to Use
Use this skill when you need to research markets, find pain points, validate SaaS ideas, gather competitive intelligence, or do any form of systematic online research.

## Tools Available
1. **Playwright** (Node.js) — JavaScript-heavy sites, browser automation
2. **Cheerio + Axios** (Node.js) — Fast HTML scraping, HTTP requests
3. **Scrapy** (Python) — Large-scale crawling, following links
4. **Selenium** (Python) — Full browser automation, form filling

## Research Workflow

### Phase 1: Idea Discovery
```javascript
// Search Reddit for pain points
const { chromium } = require('playwright');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// Search Reddit for complaints about a niche
await page.goto('https://www.reddit.com/search/?q=saas+invoicing+problems');
const posts = await page.$$eval('h3', els => els.map(el => el.textContent));
// ... extract complaints, upvotes, comments
```

### Phase 2: Validate Demand
```javascript
// Check search volume / competition
const axios = require('axios');
const cheerio = require('cheerio');

// Check G2 for product reviews and complaints
const { data } = await axios.get('https://www.g2.com/products/hubspot-crm/reviews');
const $ = cheerio.load(data);
// Extract 1-3 star reviews = pain points
```

### Phase 3: Competitive Analysis
```python
# Use Scrapy to crawl competitor sites
import scrapy

class CompetitorSpider(scrapy.Spider):
    name = 'competitor'
    start_urls = ['https://competitor.com/pricing']
    
    def parse(self, response):
        plans = response.css('.pricing-plan')
        for plan in plans:
            yield {
                'name': plan.css('h3::text').get(),
                'price': plan.css('.price::text').get(),
                'features': plan.css('.features li::text').getall()
            }
```

### Phase 4: Extract Email Addresses (for outreach)
```python
import scrapy

class EmailSpider(scrapy.Spider):
    name = 'emails'
    start_urls = ['https://target-site.com/contact']
    
    def parse(self, response):
        # Extract emails using regex
        import re
        page_text = response.text
        emails = re.findall(r'[\w\.-]+@[\w\.-]+\.\w+', page_text)
        yield {'emails': list(set(emails))}
```

## Data Sources to Research

### Forums / Communities (Pain Points)
- Reddit (r/SaaS, r/startups, r/Entrepreneur, niche-specific subs)
- Hacker News
- Indie Hackers
- Product Hunt comments
- Twitter/X search

### Review Sites (Competitor Weaknesses)
- G2.com
- Capterra.com
- Trustpilot
- GetApp.com
- SoftwareReviews.com

### Job Boards (Market Demand)
- Indeed (job counts for skills)
- LinkedIn Jobs
- AngelList

### SEO / Traffic Data
- SimilarWeb (free tier)
- Ahrefs free backlink checker
- Google Trends

## Research Prompts Template

When researching a market, look for:
1. **Repeated complaints** — What do people whine about most?
2. **Workarounds** — What hacks do they use instead of proper tools?
3. **Switching barriers** — Why don't they just use existing solutions?
4. **Price sensitivity** — Are they complaining about pricing?
5. **Integration needs** — What do they need to connect?

## Output Format
```javascript
{
  market: "Invoicing for freelancers",
  painPoints: [
    { issue: "Late payments", frequency: "high", evidence: "500+ reddit complaints" },
    { issue: "Manual follow-ups", frequency: "high", evidence: "G2 1-star reviews" }
  ],
  competitors: [
    { name: "Harvest", weakness: "Expensive for small freelancers" },
    { name: "Wave", weakness: "Poor mobile experience" }
  ],
  opportunity: "Affordable, automated follow-up system",
  estimatedMarketSize: "$500M",
  monetizationPath: "$19-49/mo subscription"
}
```

## File Locations
- Research data: `/home/pi/.openclaw/workspace/research/`
- Scripts: `/home/pi/.openclaw/workspace/research/scripts/`
- Output: `/home/pi/.openclaw/workspace/research/output/`

## Notes
- Always respect robots.txt and terms of service
- Use delays between requests
- Cross-reference claims from multiple sources
- Look for patterns, not just individual complaints
- The best SaaS ideas come from founder pain points
