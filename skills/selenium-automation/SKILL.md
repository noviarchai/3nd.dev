# SKILL.md — Selenium Browser Automation (Python)

## When to Use
Use Selenium when you need full browser automation with Python, especially for testing, form filling, and JavaScript-heavy sites. For simpler cases, consider Playwright (Node.js) instead.

## Setup
```bash
pip3 install --break-system-packages selenium
# Install browser drivers
# Chrome: chromedriver
# Firefox: geckodriver
```

## Quick Test
```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument('--headless')
driver = webdriver.Chrome(options=options)
driver.get('https://example.com')
print(driver.title)
driver.quit()
```

## Common Patterns

### Basic Operations
```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--disable-blink-features=AutomationControlled')

driver = webdriver.Chrome(options=options)
driver.get('https://target-site.com')

# Get page source
html = driver.page_source

# Find elements
title = driver.find_element(By.TAG_NAME, 'h1').text
links = driver.find_elements(By.CSS_SELECTOR, 'a')
for link in links:
    print(link.get_attribute('href'))
```

### Form Filling
```python
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Fill input
driver.find_element(By.NAME, 'username').send_keys('myuser')
driver.find_element(By.NAME, 'password').send_keys('mypass')

# Click button
driver.find_element(By.ID, 'login-btn').click()

# Wait for navigation
WebDriverWait(driver, 10).until(EC.title_contains('Dashboard'))
```

### Wait for Elements
```python
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

# Wait for element to be visible
element = WebDriverWait(driver, 10).until(
    EC.visibility_of_element_located((By.ID, 'dynamic-content'))
)

# Wait for text
WebDriverWait(driver, 10).until(
    EC.text_to_be_present_in_element((By.CLASS_NAME, 'status'), 'Ready')
)

# Wait for page load
WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, 'body')))
```

### Screenshot
```python
driver.save_screenshot('screenshot.png')
driver.find_element(By.ID, 'element').screenshot('element.png')
```

### Execute JavaScript
```python
# Scroll page
driver.execute_script('window.scrollTo(0, document.body.scrollHeight)')

# Get element data
data = driver.execute_script('''
    const el = document.querySelector('.data-container');
    return el ? el.textContent : null;
''')
```

### Handle Multiple Windows
```python
# Get all window handles
main_window = driver.window_handles[0]

# Click opens new window
driver.find_element(By.TAG_NAME, 'a').click()

# Switch to new window
for handle in driver.window_handles:
    if handle != main_window:
        new_window = handle
        break

driver.switch_to.window(new_window)
print(driver.title)

# Switch back
driver.switch_to.window(main_window)
```

### Select Dropdowns
```python
from selenium.webdriver.support.ui import Select

dropdown = Select(driver.find_element(By.NAME, 'country'))
dropdown.select_by_visible_text('United States')
dropdown.select_by_value('US')
dropdown.select_by_index(2)
```

### Stealth Options
```python
options = Options()
options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--disable-blink-features=AutomationControlled')
options.add_argument('--disable-gpu')
options.add_argument('--window-size=1920,1080')
options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

# Remove webdriver flag
driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
```

## File Locations
- Scripts: `/home/pi/.openclaw/workspace/selenium_scripts/`
- Screenshots: `/home/pi/.openclaw/workspace/screenshots/`

## Notes
- Selenium is slower than Playwright for headless browsing
- Use headless mode for automation
- Always `driver.quit()` to close browser
- Use explicit waits instead of `time.sleep()`
- Chrome + chromedriver must match versions
