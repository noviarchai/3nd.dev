# SKILL.md — Scrapy Web Scraper (Python)

## When to Use
Use Scrapy for large-scale, production-grade web scraping. Best for crawling multiple pages, following links, and handling cookies/sessions.

## Setup
```bash
pip3 install --break-system-packages scrapy beautifulsoup4 lxml
# Test with:
scrapy version
```

## Quick Test
```bash
scrapy shell 'https://example.com'
# Then in shell:
response.css('title::text').get()
response.xpath('//h1/text()').get()
```

## Common Patterns

### Basic Spider
```python
import scrapy

class MySpider(scrapy.Spider):
    name = 'myspider'
    start_urls = ['https://target-site.com/']

    def parse(self, response):
        # Extract items
        for item in response.css('.item'):
            yield {
                'title': item.css('.title::text').get(),
                'price': item.css('.price::text').get(),
                'url': item.css('a::attr(href)').get()
            }
        
        # Follow pagination
        next_page = response.css('a.next::attr(href)').get()
        if next_page:
            yield response.follow(next_page, self.parse)

    # Custom settings for this spider
    custom_settings = {
        'ROBOTSTXT_OBEY': True,
        'CONCURRENT_REQUESTS_PER_DOMAIN': 2,
        'DOWNLOAD_DELAY': 1,
        'USER_AGENT': 'Mozilla/5.0 (compatible; MyBot/1.0)'
    }
```

### Run a Spider
```bash
scrapy crawl myspider -o output.json
scrapy crawl myspider -o output.csv
scrapy crawl myspider -o output.jl  # JSON Lines
```

### Quick One-Page Scrape (Scrapy Shell)
```bash
scrapy shell 'https://example.com'
# CSS selectors:
response.css('title::text').get()
response.css('a::attr(href)').getall()
# XPath:
response.xpath('//h1/text()').get()
response.xpath('//div[@class="item"]').getall()
```

### Save to File
```bash
# Different formats
scrapy crawl myspider -o data.json
scrapy crawl myspider -o data.xml  
scrapy crawl myspider -o data.csv
```

### Custom Pipeline (Save to Database)
```python
# pipelines.py
import pymysql

class MySQLPipeline:
    def __init__(self):
        self.connection = pymysql.connect(host='localhost', user='root', password='pass', db='mydb')
    
    def process_item(self, item, spider):
        with self.connection.cursor() as cursor:
            cursor.execute("INSERT INTO items (title, price) VALUES (%s, %s)", (item['title'], item['price']))
        self.connection.commit()
        return item
```

## Settings (settings.py)
```python
# Respect robots.txt
ROBOTSTXT_OBEY = True

# Limit concurrency
CONCURRENT_REQUESTS_PER_DOMAIN = 4
DOWNLOAD_DELAY = 0.5

# Retry failed requests
RETRY_ENABLED = True
RETRY_TIMES = 3

# Set User-Agent
USER_AGENT = 'Mozilla/5.0 (compatible; MyBot/1.0; +http://mybot.com)'

# Enable cookies
COOKIES_ENABLED = True

# Cache responses (useful for development)
HTTPCACHE_ENABLED = True
HTTPCACHE_EXPIRATION_SECS = 86000
```

## Common CSS Selectors
```python
# Text content
response.css('h1::text').get()
response.css('.description::text').getall()

# Attributes
response.css('img::attr(src)').get()
response.css('a::attr(href)').getall()

# Multiple elements
response.css('li.product').getall()

# First element only
response.css('title::text').get()  # returns string
response.css('title::text').getall()  # returns list
```

## File Locations
- Spiders directory: `/home/pi/.openclaw/workspace/scrapy_spiders/`
- Create with: `scrapy genspider myspider domain.com`

## Notes
- Use `scrapy shell 'url'` to debug selectors interactively
- Always respect robots.txt and rate limits
- For JavaScript-rendered pages, use Playwright instead
- Use XPath for complex nested structures
- Scrapy is asynchronous — very fast but can overwhelm servers
