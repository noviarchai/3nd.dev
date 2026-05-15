#!/usr/bin/env python3
"""Beauty Lashes — Super bright & light"""
import os

BASE = '/var/www/lashes.3nd.dev'

CSS = open('/home/pi/.openclaw/workspace/lashes-superbright.css').read()

HOME = open('/home/pi/.openclaw/workspace/lashes-superbright-home.html').read()

with open(BASE + '/public/css/style.css', 'w') as f:
    f.write(CSS)
with open(BASE + '/views/pages/home.ejs', 'w') as f:
    f.write(HOME)
print('Done!')