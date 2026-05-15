#!/usr/bin/env python3
"""Beauty Lashes full build script — runs on VPS"""
import os, subprocess, json

BASE = '/var/www/lashes.3nd.dev'
os.makedirs(f'{BASE}/views/pages', exist_ok=True)
os.makedirs(f'{BASE}/views/admin', exist_ok=True)
os.makedirs(f'{BASE}/public/css', exist_ok=True)
os.makedirs(f'{BASE}/public/js', exist_ok=True)
os.makedirs(f'{BASE}/data', exist_ok=True)

def w(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  ✓ {path}')

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

# ===================== SITE.JSON =====================
site_json = r'''{
  "business": {
    "name": "Beauty Lashes",
    "phone": "+1 (780) 555-0100",
    "email": "hello@beautylashes.ca",
    "address": "Edmonton, Alberta",
    "hours": "Tue–Sat: 9am – 6pm",
    "notice": "Appointments fill up fast — book in advance to secure your preferred time!",
    "social": {
      "instagram": "https://instagram.com/beautylashes",
      "facebook": "https://facebook.com/beautylashes"
    }
  },
  "whyUs": [
    {"icon": "sparkle", "title": "Premium Products", "text": "We only use medical-grade adhesive and ethically sourced lash fibers."},
    {"icon": "gem", "title": "Impeccable Hygiene", "text": "Every tool is sanitized between clients. Your safety is non-negotiable."},
    {"icon": "flower", "title": "Relaxed Studio", "text": "A calm, clean space designed to help you unwind during your appointment."},
    {"icon": "heart", "title": "Personalized Service", "text": "Every set is tailored to your eye shape, lifestyle, and desired level of drama."}
  ]
}'''

w(f'{BASE}/data/site.json', site_json)

# ===================== CSS =====================
css = r'''/* =========================================
   BEAUTY LASHES — Vintage Glam, Dark Luxury
   ========================================= */

:root {
  --black: #0d0d0d;
  --black-soft: #161616;
  --black-card: #1e1e1e;
  --pink-deep: #e891a0;
  --pink: #f2a4b8;
  --pink-light: #fcd5df;
  --pink-glow: rgba(242,164,184,0.15);
  --gold: #d4a853;
  --gold-light: #f0d590;
  --cream: #fdf8f4;
  --cream-dark: #f5ede5;
  --peach: #f0c4a8;
  --text: #f0e8e2;
  --text-warm: #b8a89a;
  --text-muted: #7a6e66;
  --border: rgba(242,164,184,0.12);
  --border-light: rgba(255,255,255,0.06);
  --shadow: 0 4px 24px rgba(0,0,0,0.4);
  --shadow-lg: 0 8px 48px rgba(0,0,0,0.5);
  --radius: 16px;
  --radius-sm: 10px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  font-family: 'DM Sans', 'Helvetica Neue', sans-serif;
  background: var(--black);
  color: var(--text);
  line-height: 1.65;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

h1, h2, h3, h4 {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
  line-height: 1.15;
  color: #fff;
  letter-spacing: -0.3px;
}

a { color: var(--pink); text-decoration: none; transition: color 0.2s; }
a:hover { color: var(--gold-light); }

img { max-width: 100%; display: block; }

/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');

/* ---- Layout ---- */
.container { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
.container-sm { max-width: 780px; margin: 0 auto; padding: 0 24px; }

/* ---- Sparkle Decorations ---- */
.sparkle {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: var(--gold);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  opacity: 0.7;
}

/* ---- NAV ---- */
nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(13,13,13,0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  transition: background 0.3s;
}
.nav-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 24px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Playfair Display', serif;
  font-size: 18px;
  font-style: italic;
  color: var(--pink) !important;
  font-weight: 600;
}
.nav-logo img { height: 44px; width: auto; }
.nav-links { display: flex; gap: 32px; align-items: center; }
.nav-links a {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--text-warm);
  position: relative;
}
.nav-links a::after {
  content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
  height: 1.5px; background: var(--gold); transform: scaleX(0);
  transition: transform 0.25s ease;
}
.nav-links a:hover, .nav-links a.active { color: var(--pink); }
.nav-links a:hover::after, .nav-links a.active::after { transform: scaleX(1); }
.nav-cta {
  background: var(--pink) !important;
  color: var(--black) !important;
  padding: 8px 20px;
  border-radius: 50px;
  font-weight: 600 !important;
}
.nav-cta:hover { background: var(--gold) !important; color: var(--black) !important; }
.nav-cta::after { display: none !important; }
.menu-toggle { display: none; background: none; border: none; font-size: 26px; cursor: pointer; color: var(--text); }

/* ---- BUTTONS ---- */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  border-radius: 50px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}
.btn-pink {
  background: var(--pink);
  color: var(--black);
}
.btn-pink:hover {
  background: var(--gold);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(242,164,184,0.3);
}
.btn-outline {
  background: transparent;
  color: #fff;
  border: 1.5px solid rgba(255,255,255,0.2);
}
.btn-outline:hover {
  border-color: var(--pink);
  color: var(--pink);
  background: var(--pink-glow);
}
.btn-gold {
  background: var(--gold);
  color: var(--black);
}
.btn-gold:hover {
  background: var(--gold-light);
  transform: translateY(-2px);
}

/* ---- SECTION LABELS ---- */
.section-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 14px;
}
.section-label::before, .section-label::after {
  content: ''; flex: 0 0 24px; height: 1px; background: var(--gold);
}

/* ---- HERO ---- */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: var(--black);
  padding: 0 24px;
}
.hero-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 60% 40%, rgba(232,145,160,0.08) 0%, transparent 60%),
              radial-gradient(ellipse at 30% 70%, rgba(212,168,83,0.05) 0%, transparent 50%);
}
.hero-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%);
}
.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
}
.hero-logo {
  height: 200px;
  width: auto;
  margin: 0 auto 32px;
  animation: fadeIn 1s ease;
}
.hero-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 20px;
  animation: fadeIn 0.8s ease 0.2s both;
}
.hero h1 {
  font-size: clamp(48px, 8vw, 88px);
  color: #fff;
  margin-bottom: 20px;
  font-style: italic;
  animation: fadeIn 0.8s ease 0.3s both;
}
.hero h1 span { color: var(--pink); }
.hero-sub {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(16px, 2vw, 22px);
  font-style: italic;
  color: var(--text-warm);
  margin-bottom: 40px;
  animation: fadeIn 0.8s ease 0.4s both;
}
.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeIn 0.8s ease 0.5s both;
}
.hero-scroll {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  animation: bounce 2s infinite;
}
@keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(6px)} }

/* ---- INTRO STRIP ---- */
.intro-strip {
  background: var(--black-soft);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 32px 0;
}
.intro-strip-inner {
  display: flex;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;
  max-width: 800px;
  margin: 0 auto;
}
.intro-strip-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--text-warm);
}
.intro-strip-item .icon { font-size: 20px; }

/* ---- SERVICES ---- */
.services { padding: 100px 0; background: var(--black); }
.services-header { text-align: center; margin-bottom: 60px; }
.section-title { font-size: clamp(28px, 4vw, 48px); margin-bottom: 12px; }
.section-sub { font-size: 17px; color: var(--text-muted); max-width: 540px; margin: 0 auto; font-family: 'Cormorant Garamond', serif; font-style: italic; }
.services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
.service-card {
  background: var(--black-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 32px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}
.service-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--pink), var(--gold));
  transform: scaleX(0);
  transition: transform 0.3s;
}
.service-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--pink-deep); }
.service-card:hover::before { transform: scaleX(1); }
.service-name { font-family: 'Playfair Display', serif; font-size: 20px; margin-bottom: 10px; color: #fff; }
.service-desc { font-size: 14px; color: var(--text-muted); margin-bottom: 20px; line-height: 1.6; }
.service-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.service-price { font-size: 28px; font-weight: 700; color: var(--gold); }
.service-duration { font-size: 12px; color: var(--text-muted); background: var(--black); padding: 4px 10px; border-radius: 50px; }
.service-book { width: 100%; justify-content: center; padding: 12px; background: var(--black); color: var(--pink); border: 1.5px solid var(--pink); font-size: 12px; }
.service-book:hover { background: var(--pink); color: var(--black); }

/* ---- WHY US ---- */
.why-us { padding: 100px 0; background: var(--black-soft); }
.why-us-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }
.why-card {
  text-align: center;
  padding: 36px 24px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: all 0.3s;
  background: var(--black-card);
}
.why-card:hover { border-color: var(--gold); transform: translateY(-2px); }
.why-icon { font-size: 36px; margin-bottom: 16px; }
.why-card h3 { font-size: 18px; margin-bottom: 8px; }
.why-card p { font-size: 14px; color: var(--text-muted); line-height: 1.6; }

/* ---- GALLERY ---- */
.gallery { padding: 100px 0; background: var(--black); }
.gallery-header { text-align: center; margin-bottom: 48px; }
.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.gallery-item {
  border-radius: var(--radius-sm);
  overflow: hidden;
  position: relative;
  aspect-ratio: 4/3;
  background: var(--black-card);
}
.gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.gallery-item:hover img { transform: scale(1.05); }
.gallery-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  opacity: 0;
  transition: opacity 0.3s;
  display: flex;
  align-items: flex-end;
  padding: 16px;
}
.gallery-item:hover .gallery-overlay { opacity: 1; }
.gallery-caption { font-size: 13px; color: #fff; }

/* ---- TESTIMONIALS ---- */
.testimonials { padding: 100px 0; background: var(--black-soft); }
.testimonials-header { text-align: center; margin-bottom: 48px; }
.testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
.testimonial-card {
  background: var(--black-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 32px;
}
.testimonial-stars { color: var(--gold); font-size: 14px; margin-bottom: 14px; letter-spacing: 2px; }
.testimonial-text { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-style: italic; color: var(--text); margin-bottom: 16px; line-height: 1.6; }
.testimonial-author { font-size: 13px; font-weight: 600; color: var(--pink); }

/* ---- BOOKING CTA ---- */
.booking-cta {
  padding: 100px 0;
  background: var(--black);
  text-align: center;
  position: relative;
  overflow: hidden;
}
.booking-cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(242,164,184,0.06), transparent 70%);
}
.booking-cta h2 { font-size: clamp(28px, 4vw, 48px); margin-bottom: 12px; position: relative; }
.booking-cta p { font-size: 17px; color: var(--text-muted); margin-bottom: 36px; font-family: 'Cormorant Garamond', serif; font-style: italic; position: relative; }

/* ---- FORMS ---- */
.form-group { margin-bottom: 20px; }
.form-label { display: block; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--text-warm); margin-bottom: 8px; }
.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 14px 18px;
  background: var(--black-card);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  color: #fff;
  font-size: 15px;
  font-family: 'DM Sans', sans-serif;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--pink);
}
.form-select { appearance: none; cursor: pointer; }
.form-textarea { resize: vertical; min-height: 120px; }
.form-checkbox { display: flex; align-items: flex-start; gap: 12px; cursor: pointer; }
.form-checkbox input { width: 18px; height: 18px; accent-color: var(--pink); flex-shrink: 0; margin-top: 2px; }
.form-checkbox span { font-size: 13px; color: var(--text-muted); line-height: 1.5; }

/* ---- FOOTER ---- */
footer {
  background: var(--black-soft);
  border-top: 1px solid var(--border);
  padding: 64px 0 32px;
}
.footer-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
.footer-brand-name { font-family: 'Playfair Display', serif; font-size: 22px; font-style: italic; color: var(--pink); margin-bottom: 10px; }
.footer-tagline { font-size: 14px; color: var(--text-muted); margin-bottom: 16px; }
.footer-social { display: flex; gap: 12px; }
.footer-social a { color: var(--text-muted); font-size: 13px; }
.footer-social a:hover { color: var(--gold); }
.footer-heading { font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; }
.footer-links { display: flex; flex-direction: column; gap: 8px; }
.footer-links a { font-size: 14px; color: var(--text-muted); }
.footer-links a:hover { color: var(--pink); }
.footer-bottom { border-top: 1px solid var(--border); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: var(--text-muted); }
.footer-bottom a { color: var(--text-muted); }
.footer-bottom a:hover { color: var(--pink); }

/* ---- PAGE HEADERS ---- */
.page-header {
  padding: 140px 0 72px;
  background: var(--black-soft);
  text-align: center;
  position: relative;
  overflow: hidden;
}
.page-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 0%, rgba(232,145,160,0.08), transparent 60%);
}
.page-header h1 { font-size: clamp(28px, 5vw, 52px); margin-bottom: 10px; position: relative; }
.page-header p { color: var(--text-muted); font-family: 'Cormorant Garamond', serif; font-size: 18px; font-style: italic; position: relative; }

/* ---- CONTENT SECTIONS ---- */
.section { padding: 80px 0; }
.section-dark { background: var(--black-soft); }
.section-cream { background: var(--cream); color: var(--black); }
.section-cream h1, .section-cream h2, .section-cream h3 { color: var(--black); }

/* ---- ABOUT PAGE ---- */
.about-content { max-width: 720px; margin: 0 auto; }
.about-content p { font-size: 17px; color: var(--text-warm); margin-bottom: 20px; line-height: 1.8; }
.values-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-top: 48px; }
.value-card { background: var(--black-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; }
.value-card h3 { font-size: 18px; margin-bottom: 8px; color: var(--pink); }
.value-card p { font-size: 14px; color: var(--text-muted); line-height: 1.6; }

/* ---- POLICIES ---- */
.policy-block { background: var(--black-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 32px; margin-bottom: 20px; }
.policy-block h3 { font-size: 18px; color: var(--pink); margin-bottom: 12px; }
.policy-block p { font-size: 15px; color: var(--text-warm); line-height: 1.7; }

/* ---- MOBILE ---- */
@media(max-width: 768px) {
  .nav-links { display: none; flex-direction: column; position: absolute; top: 72px; left: 0; right: 0; background: rgba(13,13,13,0.97); backdrop-filter: blur(20px); padding: 20px 24px; gap: 12px; border-bottom: 1px solid var(--border); }
  .nav-links.open { display: flex; }
  .menu-toggle { display: block; }
  .hero { min-height: 85vh; }
  .hero-logo { height: 140px; }
  .hero-actions { flex-direction: column; align-items: center; }
  .hero-actions .btn { width: 100%; max-width: 280px; justify-content: center; }
  .intro-strip-inner { gap: 20px; }
  .services-grid, .gallery-grid, .testimonials-grid, .why-us-grid { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr; gap: 32px; }
  .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
}

/* ---- FADE IN ---- */
.fade-in { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease, transform 0.6s ease; }
.fade-in.visible { opacity: 1; transform: translateY(0); }

/* ---- ADMIN ---- */
.admin-body { background: #111; color: #f0e8e2; }
.admin-sidebar { width: 240px; background: #0d0d0d; border-right: 1px solid rgba(242,164,184,0.1); position: fixed; top: 0; left: 0; bottom: 0; padding: 24px 0; }
.admin-sidebar .logo { font-family: 'Playfair Display', serif; font-size: 18px; font-style: italic; color: var(--pink); padding: 0 24px 24px; display: block; border-bottom: 1px solid rgba(242,164,184,0.1); margin-bottom: 16px; }
.admin-nav-item { display: block; padding: 12px 24px; font-size: 13px; color: var(--text-muted); text-decoration: none; transition: all 0.2s; }
.admin-nav-item:hover, .admin-nav-item.active { background: rgba(242,164,184,0.08); color: var(--pink); }
.admin-main { margin-left: 240px; padding: 32px; min-height: 100vh; }
.admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
.admin-header h2 { font-size: 24px; font-family: 'Playfair Display', serif; }
.admin-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 32px; }
.admin-stat { background: #1a1a1a; border: 1px solid rgba(242,164,184,0.1); border-radius: 12px; padding: 20px; }
.admin-stat .num { font-size: 32px; font-weight: 700; color: var(--pink); }
.admin-stat .label { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th { text-align: left; padding: 12px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); border-bottom: 1px solid rgba(242,164,184,0.1); }
.admin-table td { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.04); color: var(--text-warm); }
.admin-table tr:hover td { background: rgba(242,164,184,0.04); }
.status-badge { display: inline-block; padding: 3px 10px; border-radius: 50px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.status-new { background: rgba(242,164,184,0.15); color: var(--pink); }
.status-confirmed { background: rgba(212,168,83,0.15); color: var(--gold); }
.status-completed { background: rgba(90,200,120,0.15); color: #6de89a; }
.status-cancelled { background: rgba(200,80,80,0.15); color: #e85454; }
.login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--black); }
.login-box { background: var(--black-card); border: 1px solid var(--border); border-radius: 20px; padding: 48px; width: 400px; text-align: center; }
.login-box h1 { font-family: 'Playfair Display', serif; font-size: 28px; font-style: italic; color: var(--pink); margin-bottom: 32px; }
.login-box input { width: 100%; padding: 14px 18px; background: var(--black); border: 1.5px solid var(--border); border-radius: 10px; color: #fff; font-size: 15px; margin-bottom: 16px; box-sizing: border-box; }
.login-box input:focus { outline: none; border-color: var(--pink); }
.login-box button { width: 100%; padding: 14px; background: var(--pink); color: var(--black); border: none; border-radius: 50px; font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; }
.login-box button:hover { background: var(--gold); }
.login-error { color: #e85454; font-size: 13px; margin-top: 12px; }
.admin-card { background: #1a1a1a; border: 1px solid rgba(242,164,184,0.1); border-radius: 12px; padding: 24px; margin-bottom: 20px; }
.admin-card h3 { font-size: 16px; margin-bottom: 16px; color: var(--text); }
.settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media(max-width: 900px) {
  .admin-sidebar { width: 200px; }
  .admin-main { margin-left: 200px; }
}
@media(max-width: 600px) {
  .admin-sidebar { display: none; }
  .admin-main { margin-left: 0; padding: 16px; }
  .settings-grid { grid-template-columns: 1fr; }
  .login-box { width: auto; margin: 0 16px; }
}'''

w(f'{BASE}/public/css/style.css', css)

# ===================== JAVASCRIPT =====================
js = r'''function toggleMenu() {
  document.querySelector('.nav-links').classList.toggle('open');
}
document.querySelectorAll('.nav-links a').forEach(function(link) {
  link.addEventListener('click', function() {
    document.querySelector('.nav-links').classList.remove('open');
  });
});
// Scroll animations
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-in').forEach(function(el) { observer.observe(el); });
// Forms
document.querySelectorAll('form[data-ajax]').forEach(function(form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var btn = form.querySelector('[type=submit]');
    var orig = btn.textContent;
    btn.textContent = 'Sending...'; btn.disabled = true;
    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    }).then(function(r) { return r.json(); })
      .then(function(d) {
        if (d.success) {
          form.innerHTML = '<div style="text-align:center;padding:40px 0"><div style="font-size:40px;margin-bottom:16px">✨</div><h3 style=\'margin-bottom:8px\'>Request Received!</h3><p style=\'color:#b8a89a\'>' + d.message + '</p></div>';
        } else {
          alert(d.error || 'Something went wrong. Please try again.');
          btn.textContent = orig; btn.disabled = false;
        }
      })
      .catch(function() {
        alert('Connection error. Please try again.');
        btn.textContent = orig; btn.disabled = false;
      });
  });
});'''

w(f'{BASE}/public/js/main.js', js)

# ===================== EJS TEMPLATES =====================

print("Writing EJS templates...")

# HOME
home_ejs = r'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Beauty Lashes — Premium Lash Extensions in Edmonton</title>
  <meta name="description" content="Beauty Lashes offers expert lash extension services in Edmonton. Classic, Hybrid, Volume, and Mega Volume fills, lifts, and tints.">
  <link rel="stylesheet" href="/css/style.css">
  <link rel="icon" href="/images/logo.jpg" type="image/jpeg">
</head>
<body>
  <nav>
    <div class="nav-inner">
      <a href="/" class="nav-logo"><img src="/images/logo.jpg" alt="Beauty Lashes"></a>
      <div class="nav-links">
        <a href="/">Home</a>
        <a href="/services">Services</a>
        <a href="/gallery">Gallery</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="/booking" class="nav-cta">Book Now</a>
      </div>
      <button class="menu-toggle" onclick="toggleMenu()">☰</button>
    </div>
  </nav>

  <section class="hero">
    <div class="hero-bg"></div>
    <div class="hero-vignette"></div>
    <div class="hero-content">
      <img src="/images/logo.jpg" alt="Beauty Lashes" class="hero-logo">
      <div class="hero-eyebrow">Edmonton's Premier Lash Studio</div>
      <h1>Wake Up With <span>Flawless</span> Lashes</h1>
      <p class="hero-sub">Expert lash extensions tailored to your unique eye shape, lifestyle, and desired drama.</p>
      <div class="hero-actions">
        <a href="/booking" class="btn btn-pink">Book Appointment</a>
        <a href="/services" class="btn btn-outline">View Services</a>
      </div>
    </div>
    <div class="hero-scroll">
      <span>Discover</span>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
    </div>
  </section>

  <div class="intro-strip">
    <div class="intro-strip-inner">
      <div class="intro-strip-item"><span class="icon">📍</span> Edmonton, Alberta</div>
      <div class="intro-strip-item"><span class="icon">📅</span> Tue – Sat</div>
      <div class="intro-strip-item"><span class="icon">⭐</span> 5-Star Rated</div>
      <div class="intro-strip-item"><span class="icon">✨</span> Premium Lashes</div>
    </div>
  </div>

  <section class="services">
    <div class="container">
      <div class="services-header">
        <div class="section-label">Our Services</div>
        <h2 class="section-title">Lash Services</h2>
        <p class="section-sub">From natural classic sets to show-stopping mega volume — find your perfect look.</p>
      </div>
      <div class="services-grid">
        <% site.services.forEach(function(s) { if(s.enabled) { %>
          <div class="service-card fade-in">
            <div class="service-name"><%= s.name %></div>
            <div class="service-desc"><%= s.description %></div>
            <div class="service-meta">
              <span class="service-price">$<%= s.price %></span>
              <span class="service-duration"><%= s.duration %></span>
            </div>
            <a href="/booking?service=<%= encodeURIComponent(s.name) %>" class="btn service-book">Book Now</a>
          </div>
        <% }}); %>
      </div>
    </div>
  </section>

  <section class="why-us">
    <div class="container">
      <div class="services-header">
        <div class="section-label">Why Beauty Lashes</div>
        <h2 class="section-title">The Beauty Lashes Difference</h2>
      </div>
      <div class="why-us-grid">
        <% site.whyUs.forEach(function(w) { %>
          <div class="why-card fade-in">
            <div class="why-icon"><%= w.icon %></div>
            <h3><%= w.title %></h3>
            <p><%= w.text %></p>
          </div>
        <% }); %>
      </div>
    </div>
  </section>

  <section class="testimonials">
    <div class="container">
      <div class="testimonials-header">
        <div class="section-label">Love Letters</div>
        <h2 class="section-title">What Clients Say</h2>
      </div>
      <div class="testimonials-grid">
        <% site.testimonials.forEach(function(t) { if(t.visible) { %>
          <div class="testimonial-card fade-in">
            <div class="testimonial-stars">★★★★★</div>
            <div class="testimonial-text">"<%= t.text %>"</div>
            <div class="testimonial-author">— <%= t.name %></div>
          </div>
        <% }}); %>
      </div>
    </div>
  </section>

  <section class="booking-cta">
    <div class="container">
      <div class="section-label">Ready?</div>
      <h2>Book Your Appointment Today</h2>
      <p>Slots fill up quickly — reserve yours now and get ready to flutter.</p>
      <a href="/booking" class="btn btn-pink" style="position:relative">Book Now →</a>
    </div>
  </section>

  <footer>
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand-name">Beauty Lashes</div>
          <div class="footer-tagline">Premium lash extensions in Edmonton. Every set, a masterpiece.</div>
          <div class="footer-social">
            <a href="<%= site.business.social.instagram %>">Instagram</a>
            <a href="<%= site.business.social.facebook %>">Facebook</a>
          </div>
        </div>
        <div>
          <div class="footer-heading">Quick Links</div>
          <div class="footer-links">
            <a href="/">Home</a>
            <a href="/services">Services</a>
            <a href="/gallery">Gallery</a>
            <a href="/about">About</a>
            <a href="/booking">Book Now</a>
          </div>
        </div>
        <div>
          <div class="footer-heading">Contact</div>
          <div class="footer-links">
            <a href="tel:<%= site.business.phone %>"><%= site.business.phone %></a>
            <a href="mailto:<%= site.business.email %>"><%= site.business.email %></a>
            <span style="font-size:14px;color:var(--text-muted)"><%= site.business.hours %></span>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© <%= new Date().getFullYear() %> Beauty Lashes. All rights reserved.</span>
        <a href="/policies">Policies</a>
      </div>
    </div>
  </footer>

  <script src="/js/main.js"></script>
</body>
</html>'''

w(f'{BASE}/views/pages/home.ejs', home_ejs)

# SERVICES
services_ejs = r'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Services — Beauty Lashes</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <nav>
    <div class="nav-inner">
      <a href="/" class="nav-logo"><img src="/images/logo.jpg" alt="Beauty Lashes"></a>
      <div class="nav-links">
        <a href="/">Home</a>
        <a href="/services" class="active">Services</a>
        <a href="/gallery">Gallery</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="/booking" class="nav-cta">Book Now</a>
      </div>
      <button class="menu-toggle" onclick="toggleMenu()">☰</button>
    </div>
  </nav>

  <div class="page-header">
    <div class="container">
      <div class="section-label">Our Services</div>
      <h1>Lash Services & Pricing</h1>
      <p>Every service is performed with precision, premium products, and your comfort in mind.</p>
    </div>
  </div>

  <section class="services" style="padding-top: 60px;">
    <div class="container">
      <div class="services-grid">
        <% site.services.forEach(function(s) { if(s.enabled) { %>
          <div class="service-card fade-in">
            <div class="service-name"><%= s.name %></div>
            <div class="service-desc"><%= s.description %></div>
            <div class="service-meta">
              <span class="service-price">$<%= s.price %></span>
              <span class="service-duration"><%= s.duration %></span>
            </div>
            <a href="/booking?service=<%= encodeURIComponent(s.name) %>" class="btn service-book">Book This Service</a>
          </div>
        <% }}); %>
      </div>
    </div>
  </section>

  <section class="booking-cta">
    <div class="container">
      <h2>Not Sure Which Service Is Right for You?</h2>
      <p>Send us a message and we'll help you choose the perfect set.</p>
      <a href="/contact" class="btn btn-outline" style="position:relative">Ask a Question</a>
    </div>
  </section>

  <footer>
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand-name">Beauty Lashes</div>
          <div class="footer-tagline">Premium lash extensions in Edmonton.</div>
        </div>
        <div>
          <div class="footer-heading">Links</div>
          <div class="footer-links">
            <a href="/">Home</a>
            <a href="/services">Services</a>
            <a href="/gallery">Gallery</a>
            <a href="/booking">Book</a>
          </div>
        </div>
        <div>
          <div class="footer-heading">Contact</div>
          <div class="footer-links">
            <a href="tel:<%= site.business.phone %>"><%= site.business.phone %></a>
            <a href="mailto:<%= site.business.email %>"><%= site.business.email %></a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© <%= new Date().getFullYear() %> Beauty Lashes.</span>
        <a href="/policies">Policies</a>
      </div>
    </div>
  </footer>
  <script src="/js/main.js"></script>
</body>
</html>'''

w(f'{BASE}/views/pages/services.ejs', services_ejs)

# BOOKING
booking_ejs = r'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Book Appointment — Beauty Lashes</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <nav>
    <div class="nav-inner">
      <a href="/" class="nav-logo"><img src="/images/logo.jpg" alt="Beauty Lashes"></a>
      <div class="nav-links">
        <a href="/">Home</a>
        <a href="/services">Services</a>
        <a href="/gallery">Gallery</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="/booking" class="nav-cta">Book Now</a>
      </div>
      <button class="menu-toggle" onclick="toggleMenu()">☰</button>
    </div>
  </nav>

  <div class="page-header">
    <div class="container">
      <div class="section-label">Appointments</div>
      <h1>Book Your Appointment</h1>
      <p><%= site.business.notice %></p>
    </div>
  </div>

  <section class="section">
    <div class="container-sm">
      <div style="background: var(--black-card); border: 1px solid var(--border); border-radius: 20px; padding: 40px;">
        <form action="/booking" method="POST" data-ajax>
          <div class="form-group">
            <label class="form-label">Your Name *</label>
            <input type="text" name="name" class="form-input" placeholder="Full name" required>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <div class="form-group">
              <label class="form-label">Phone *</label>
              <input type="tel" name="phone" class="form-input" placeholder="(780) 555-0000" required>
            </div>
            <div class="form-group">
              <label class="form-label">Email *</label>
              <input type="email" name="email" class="form-input" placeholder="you@email.com" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Service *</label>
            <select name="service" class="form-select" required>
              <option value="">Select a service...</option>
              <% site.services.forEach(function(s) { if(s.enabled) { %>
                <option value="<%= s.name %>"><%= s.name %> — $<%= s.price %></option>
              <% }}); %>
            </select>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <div class="form-group">
              <label class="form-label">Preferred Date</label>
              <input type="date" name="date" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">Preferred Time</label>
              <select name="time" class="form-select">
                <option value="">No preference</option>
                <option>9:00 AM</option><option>10:00 AM</option><option>11:00 AM</option>
                <option>12:00 PM</option><option>1:00 PM</option><option>2:00 PM</option>
                <option>3:00 PM</option><option>4:00 PM</option><option>5:00 PM</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Notes</label>
            <textarea name="notes" class="form-textarea" placeholder="Any allergies, preferences, or special requests..."></textarea>
          </div>
          <div class="form-group">
            <label class="form-checkbox">
              <input type="checkbox" required>
              <span>I have read and agree to the <a href="/policies">booking policies</a>, including the cancellation and deposit policy.</span>
            </label>
          </div>
          <button type="submit" class="btn btn-pink" style="width:100%;justify-content:center;padding:16px">
            Request Appointment
          </button>
        </form>
      </div>
    </div>
  </section>

  <footer>
    <div class="container">
      <div class="footer-bottom">
        <span>© <%= new Date().getFullYear() %> Beauty Lashes.</span>
        <a href="/policies">Policies</a>
      </div>
    </div>
  </footer>
  <script src="/js/main.js"></script>
</body>
</html>'''

w(f'{BASE}/views/pages/booking.ejs', booking_ejs)

# GALLERY
gallery_ejs = r'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gallery — Beauty Lashes</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <nav>
    <div class="nav-inner">
      <a href="/" class="nav-logo"><img src="/images/logo.jpg" alt="Beauty Lashes"></a>
      <div class="nav-links">
        <a href="/">Home</a>
        <a href="/services">Services</a>
        <a href="/gallery" class="active">Gallery</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="/booking" class="nav-cta">Book Now</a>
      </div>
      <button class="menu-toggle" onclick="toggleMenu()">☰</button>
    </div>
  </nav>

  <div class="page-header">
    <div class="container">
      <div class="section-label">Gallery</div>
      <h1>Our Work</h1>
      <p>Every set is custom-designed. Here are some of our favourite transformations.</p>
    </div>
  </div>

  <section class="gallery" style="padding-top: 60px;">
    <div class="container">
      <% if(gallery && gallery.length) { %>
        <div class="gallery-grid">
          <% gallery.forEach(function(img) { %>
            <div class="gallery-item fade-in">
              <img src="/images/uploads/<%= img.image %>" alt="<%= img.caption || 'Lash extension work' %>" onerror="this.style.display='none'">
              <div class="gallery-overlay">
                <span class="gallery-caption"><%= img.caption || '' %></span>
              </div>
            </div>
          <% }); %>
        </div>
      <% } else { %>
        <div style="text-align:center;padding:80px 0;color:var(--text-muted)">
          <div style="font-size:48px;margin-bottom:16px">✨</div>
          <p>Gallery coming soon! Check back after your first visit.</p>
        </div>
      <% } %>
    </div>
  </section>

  <section class="booking-cta">
    <div class="container">
      <h2>Ready for Your Close-Up?</h2>
      <p>Book your appointment and let us make your lashes the star.</p>
      <a href="/booking" class="btn btn-pink" style="position:relative">Book Now →</a>
    </div>
  </section>

  <footer>
    <div class="container">
      <div class="footer-bottom">
        <span>© <%= new Date().getFullYear() %> Beauty Lashes.</span>
        <a href="/policies">Policies</a>
      </div>
    </div>
  </footer>
  <script src="/js/main.js"></script>
</body>
</html>'''

w(f'{BASE}/views/pages/gallery.ejs', gallery_ejs)

# ABOUT
about_ejs = r'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About — Beauty Lashes</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <nav>
    <div class="nav-inner">
      <a href="/" class="nav-logo"><img src="/images/logo.jpg" alt="Beauty Lashes"></a>
      <div class="nav-links">
        <a href="/">Home</a>
        <a href="/services">Services</a>
        <a href="/gallery">Gallery</a>
        <a href="/about" class="active">About</a>
        <a href="/contact">Contact</a>
        <a href="/booking" class="nav-cta">Book Now</a>
      </div>
      <button class="menu-toggle" onclick="toggleMenu()">☰</button>
    </div>
  </nav>

  <div class="page-header">
    <div class="container">
      <div class="section-label">About</div>
      <h1>Beauty Lashes</h1>
      <p>Edmonton's destination for gorgeous, long-lasting lash extensions.</p>
    </div>
  </div>

  <section class="section section-dark">
    <div class="container-sm">
      <div class="about-content">
        <div style="text-align:center;margin-bottom:40px">
          <img src="/images/logo.jpg" alt="Beauty Lashes" style="height:180px;width:auto;margin:0 auto;border-radius:12px">
        </div>
        <p>Beauty Lashes was created with one mission: to give every client the lashes they've always wanted — without the guesswork. We believe lash extensions should be effortless. Wake up, look great, live your life.</p>
        <p>Every set is applied with surgical precision, medical-grade adhesive, and ethically sourced lash fibers in a range of weights and styles. No matter your eye shape, lifestyle, or desired drama level, we'll find the perfect combination for you.</p>
        <p>Our studio is a calm, clean space designed for one thing: making you feel amazing. We keep things intimate, thorough, and relaxed.</p>
      </div>

      <div class="values-grid">
        <div class="value-card">
          <h3>✨ Clean & Precise</h3>
          <p>Every tool is sanitized between clients. We follow strict hygiene protocols because your safety comes first.</p>
        </div>
        <div class="value-card">
          <h3>🌸 Personalized Service</h3>
          <p>No two sets are alike. We assess your natural lashes, eye shape, and goals before every appointment.</p>
        </div>
        <div class="value-card">
          <h3>💎 Premium Products</h3>
          <p>We use only medical-grade adhesive and high-quality lash fibers that look beautiful and last.</p>
        </div>
        <div class="value-card">
          <h3>💖 Confidence Boost</h3>
          <p>Lashes that look incredible and feel comfortable. We measure success by how confident you feel.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="booking-cta">
    <div class="container">
      <h2>Come See the Difference</h2>
      <p>Your best lashes are just one appointment away.</p>
      <a href="/booking" class="btn btn-pink" style="position:relative">Book Now →</a>
    </div>
  </section>

  <footer>
    <div class="container">
      <div class="footer-bottom">
        <span>© <%= new Date().getFullYear() %> Beauty Lashes.</span>
        <a href="/policies">Policies</a>
      </div>
    </div>
  </footer>
  <script src="/js/main.js"></script>
</body>
</html>'''

w(f'{BASE}/views/pages/about.ejs', about_ejs)

# CONTACT
contact_ejs = r'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact — Beauty Lashes</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <nav>
    <div class="nav-inner">
      <a href="/" class="nav-logo"><img src="/images/logo.jpg" alt="Beauty Lashes"></a>
      <div class="nav-links">
        <a href="/">Home</a>
        <a href="/services">Services</a>
        <a href="/gallery">Gallery</a>
        <a href="/about">About</a>
        <a href="/contact" class="active">Contact</a>
        <a href="/booking" class="nav-cta">Book Now</a>
      </div>
      <button class="menu-toggle" onclick="toggleMenu()">☰</button>
    </div>
  </nav>

  <div class="page-header">
    <div class="container">
      <div class="section-label">Get in Touch</div>
      <h1>Contact Us</h1>
      <p>Questions, concerns, or ready to book? We'd love to hear from you.</p>
    </div>
  </div>

  <section class="section">
    <div class="container-sm">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px">
        <div>
          <form action="/contact" method="POST" data-ajax>
            <div class="form-group">
              <label class="form-label">Your Name</label>
              <input type="text" name="name" class="form-input" placeholder="Full name">
            </div>
            <div class="form-group">
              <label class="form-label">Phone</label>
              <input type="tel" name="phone" class="form-input" placeholder="(780) 555-0000">
            </div>
            <div class="form-group">
              <label class="form-label">Email *</label>
              <input type="email" name="email" class="form-input" placeholder="you@email.com" required>
            </div>
            <div class="form-group">
              <label class="form-label">Message</label>
              <textarea name="message" class="form-textarea" placeholder="How can we help?"></textarea>
            </div>
            <button type="submit" class="btn btn-pink" style="width:100%;justify-content:center">Send Message</button>
          </form>
        </div>
        <div>
          <div style="margin-bottom:32px">
            <div class="form-label" style="margin-bottom:12px">Phone</div>
            <a href="tel:<%= site.business.phone %>" style="font-size:18px"><%= site.business.phone %></a>
          </div>
          <div style="margin-bottom:32px">
            <div class="form-label" style="margin-bottom:12px">Email</div>
            <a href="mailto:<%= site.business.email %>" style="font-size:18px"><%= site.business.email %></a>
          </div>
          <div style="margin-bottom:32px">
            <div class="form-label" style="margin-bottom:12px">Location</div>
            <p style="color:var(--text-muted)"><%= site.business.address %></p>
          </div>
          <div>
            <div class="form-label" style="margin-bottom:12px">Hours</div>
            <p style="color:var(--text-muted)"><%= site.business.hours %></p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer>
    <div class="container">
      <div class="footer-bottom">
        <span>© <%= new Date().getFullYear() %> Beauty Lashes.</span>
        <a href="/policies">Policies</a>
      </div>
    </div>
  </footer>
  <script src="/js/main.js"></script>
</body>
</html>'''

w(f'{BASE}/views/pages/contact.ejs', contact_ejs)

# POLICIES
policies_ejs = r'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Salon Policies — Beauty Lashes</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <nav>
    <div class="nav-inner">
      <a href="/" class="nav-logo"><img src="/images/logo.jpg" alt="Beauty Lashes"></a>
      <div class="nav-links">
        <a href="/">Home</a>
        <a href="/services">Services</a>
        <a href="/gallery">Gallery</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="/booking" class="nav-cta">Book Now</a>
      </div>
      <button class="menu-toggle" onclick="toggleMenu()">☰</button>
    </div>
  </nav>

  <div class="page-header">
    <div class="container">
      <div class="section-label">Policies</div>
      <h1>Salon Policies</h1>
      <p>Please read before your appointment.</p>
    </div>
  </div>

  <section class="section">
    <div class="container-sm">
      <div class="policy-block">
        <h3>📅 Booking Policy</h3>
        <p><%= site.policies.booking || 'A deposit is required to confirm your booking. You will receive a confirmation within 24 hours.' %></p>
      </div>
      <div class="policy-block">
        <h3>❌ Cancellation Policy</h3>
        <p><%= site.policies.cancellation || 'We require at least 24 hours notice for cancellations. Late cancellations may forfeit your deposit.' %></p>
      </div>
      <div class="policy-block">
        <h3>⏰ Late Arrival Policy</h3>
        <p><%= site.policies.late || 'Please arrive on time. We can extend a grace period of 10 minutes — beyond that, service time may be reduced.' %></p>
      </div>
      <div class="policy-block">
        <h3>💰 Deposit Policy</h3>
        <p><%= site.policies.deposit || 'Deposits are non-refundable but may be applied to a future booking within 30 days.' %></p>
      </div>
      <div class="policy-block">
        <h3>🌿 Lash Aftercare</h3>
        <p><%= site.policies.aftercare || 'Avoid getting lashes wet for 24 hours. Do not use oil-based products near your eyes. Gently brush daily with a spoolie.' %></p>
      </div>
      <div class="policy-block">
        <h3>⚠️ Allergy & Irritation Disclaimer</h3>
        <p><%= site.policies.allergy || 'Though rare, some clients may experience irritation or allergic reactions. A patch test is available upon request.' %></p>
      </div>
    </div>
  </section>

  <footer>
    <div class="container">
      <div class="footer-bottom">
        <span>© <%= new Date().getFullYear() %> Beauty Lashes.</span>
        <a href="/">Home</a>
      </div>
    </div>
  </footer>
  <script src="/js/main.js"></script>
</body>
</html>'''

w(f'{BASE}/views/pages/policies.ejs', policies_ejs)

# ADMIN LOGIN
admin_login_ejs = r'''<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Admin Login — Beauty Lashes</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body class="login-page">
  <div class="login-box">
    <h1>Beauty Lashes</h1>
    <form action="/admin/login" method="POST">
      <input type="text" name="username" placeholder="Username" required autofocus>
      <input type="password" name="password" placeholder="Password" required>
      <button type="submit">Sign In</button>
      <% if(error) { %>
        <div class="login-error"><%= error %></div>
      <% } %>
    </form>
  </div>
</body>
</html>'''

w(f'{BASE}/views/admin/login.ejs', admin_login_ejs)

# ADMIN DASHBOARD
admin_dashboard_ejs = r'''<!DOCTYPE html>
<html class="admin-body">
<head>
  <meta charset="UTF-8">
  <title>Admin — Beauty Lashes</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <aside class="admin-sidebar">
    <a href="/" class="logo">Beauty Lashes</a>
    <a href="/admin" class="admin-nav-item <%= page==='dashboard'?'active':'' %>">Dashboard</a>
    <a href="/admin/appointments" class="admin-nav-item <%= page==='appointments'?'active':'' %>">Appointments</a>
    <a href="/admin/clients" class="admin-nav-item <%= page==='clients'?'active':'' %>">Clients</a>
    <a href="/admin/leads" class="admin-nav-item <%= page==='leads'?'active':'' %>">Leads</a>
    <a href="/admin/gallery" class="admin-nav-item <%= page==='gallery'?'active':'' %>">Gallery</a>
    <a href="/admin/services" class="admin-nav-item <%= page==='services'?'active':'' %>">Services</a>
    <a href="/admin/settings" class="admin-nav-item <%= page==='settings'?'active':'' %>">Settings</a>
    <a href="/admin/logout" class="admin-nav-item" style="margin-top:24px">Logout</a>
  </aside>
  <main class="admin-main">
    <div class="admin-header">
      <h2>Dashboard</h2>
    </div>
    <div class="admin-stats">
      <div class="admin-stat"><div class="num"><%= stats.today %></div><div class="label">Today's Bookings</div></div>
      <div class="admin-stat"><div class="num"><%= stats.pending %></div><div class="label">Pending Requests</div></div>
      <div class="admin-stat"><div class="num"><%= stats.clients %></div><div class="label">Total Clients</div></div>
      <div class="admin-stat"><div class="num"><%= stats.revenue || 0 %></div><div class="label">Est. Revenue ($)</div></div>
    </div>

    <% if(leads && leads.length) { %>
    <div class="admin-card">
      <h3>New Inquiries</h3>
      <table class="admin-table">
        <tr><th>Date</th><th>Name</th><th>Contact</th><th>Message</th><th>Status</th></tr>
        <% leads.slice(0,5).forEach(function(l) { %>
          <tr>
            <td><%= l.created_at ? l.created_at.split('T')[0] : '' %></td>
            <td><%= l.name %></td>
            <td><%= l.email %><br><small style="color:var(--text-muted)"><%= l.phone %></small></td>
            <td><%= l.message %></td>
            <td><span class="status-badge status-new">New</span></td>
          </tr>
        <% }); %>
      </table>
      <a href="/admin/leads" class="btn btn-outline" style="margin-top:16px;width:auto;padding:8px 16px">View All →</a>
    </div>
    <% } %>

    <div class="admin-card">
      <h3>Recent Appointments</h3>
      <table class="admin-table">
        <tr><th>Date</th><th>Client</th><th>Service</th><th>Status</th></tr>
        <% appointments.slice(0,8).forEach(function(a) { %>
          <tr>
            <td><%= a.date || 'TBD' %> <small style="color:var(--text-muted)"><%= a.time || '' %></small></td>
            <td><%= a.name %><br><small style="color:var(--text-muted)"><%= a.phone %></small></td>
            <td><%= a.service %></td>
            <td><span class="status-badge status-<%= a.status %>"><%= a.status %></span></td>
          </tr>
        <% }); %>
      </table>
      <a href="/admin/appointments" class="btn btn-outline" style="margin-top:16px;width:auto;padding:8px 16px">View All →</a>
    </div>
  </main>
</body>
</html>'''

w(f'{BASE}/views/admin/dashboard.ejs', admin_dashboard_ejs)

# ADMIN CLIENTS
admin_clients_ejs = r'''<!DOCTYPE html>
<html class="admin-body">
<head>
  <meta charset="UTF-8">
  <title>Clients — Beauty Lashes Admin</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <aside class="admin-sidebar">
    <a href="/" class="logo">Beauty Lashes</a>
    <a href="/admin" class="admin-nav-item">Dashboard</a>
    <a href="/admin/appointments" class="admin-nav-item">Appointments</a>
    <a href="/admin/clients" class="admin-nav-item active">Clients</a>
    <a href="/admin/leads" class="admin-nav-item">Leads</a>
    <a href="/admin/gallery" class="admin-nav-item">Gallery</a>
    <a href="/admin/services" class="admin-nav-item">Services</a>
    <a href="/admin/settings" class="admin-nav-item">Settings</a>
    <a href="/admin/logout" class="admin-nav-item" style="margin-top:24px">Logout</a>
  </aside>
  <main class="admin-main">
    <div class="admin-header">
      <h2>Clients</h2>
    </div>
    <div class="admin-card">
      <h3>Add New Client</h3>
      <form action="/admin/clients" method="POST" style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end">
        <div class="form-group" style="margin:0;flex:1;min-width:140px">
          <label class="form-label">Name</label>
          <input type="text" name="name" class="form-input" required>
        </div>
        <div class="form-group" style="margin:0;flex:1;min-width:140px">
          <label class="form-label">Phone</label>
          <input type="text" name="phone" class="form-input">
        </div>
        <div class="form-group" style="margin:0;flex:1;min-width:160px">
          <label class="form-label">Email</label>
          <input type="email" name="email" class="form-input">
        </div>
        <div class="form-group" style="margin:0;flex:1;min-width:120px">
          <label class="form-label">Birthday</label>
          <input type="date" name="birthday" class="form-input">
        </div>
        <button type="submit" class="btn btn-pink" style="width:auto;padding:12px 24px">Add Client</button>
      </form>
    </div>
    <div class="admin-card">
      <table class="admin-table">
        <tr><th>Name</th><th>Contact</th><th>Birthday</th><th>Tags</th><th>Notes</th><th></th></tr>
        <% clients.forEach(function(c) { %>
          <tr>
            <td><strong><%= c.name %></strong></td>
            <td><%= c.email %><br><small style="color:var(--text-muted)"><%= c.phone %></small></td>
            <td><small style="color:var(--text-muted)"><%= c.birthday || '—' %></small></td>
            <td><small style="color:var(--text-muted)"><%= c.tags || '—' %></small></td>
            <td><small style="color:var(--text-muted)"><%= c.notes ? c.notes.substring(0,50)+'...' : '—' %></small></td>
            <td>
              <form action="/admin/clients/<%= c.id %>/delete" method="POST" style="display:inline">
                <button type="submit" class="btn btn-outline" style="width:auto;padding:4px 10px;font-size:11px" onclick="return confirm('Delete this client?')">Delete</button>
              </form>
            </td>
          </tr>
        <% }); %>
        <% if(clients.length === 0) { %>
          <tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:32px">No clients yet.</td></tr>
        <% } %>
      </table>
    </div>
  </main>
</body>
</html>'''

w(f'{BASE}/views/admin/clients.ejs', admin_clients_ejs)

# ADMIN APPOINTMENTS
admin_appointments_ejs = r'''<!DOCTYPE html>
<html class="admin-body">
<head>
  <meta charset="UTF-8">
  <title>Appointments — Beauty Lashes Admin</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <aside class="admin-sidebar">
    <a href="/" class="logo">Beauty Lashes</a>
    <a href="/admin" class="admin-nav-item">Dashboard</a>
    <a href="/admin/appointments" class="admin-nav-item active">Appointments</a>
    <a href="/admin/clients" class="admin-nav-item">Clients</a>
    <a href="/admin/leads" class="admin-nav-item">Leads</a>
    <a href="/admin/gallery" class="admin-nav-item">Gallery</a>
    <a href="/admin/services" class="admin-nav-item">Services</a>
    <a href="/admin/settings" class="admin-nav-item">Settings</a>
    <a href="/admin/logout" class="admin-nav-item" style="margin-top:24px">Logout</a>
  </aside>
  <main class="admin-main">
    <div class="admin-header"><h2>Appointments</h2></div>
    <div class="admin-card">
      <table class="admin-table">
        <tr><th>Date/Time</th><th>Client</th><th>Service</th><th>Notes</th><th>Status</th><th>Actions</th></tr>
        <% appointments.forEach(function(a) { %>
          <tr>
            <td><strong><%= a.date || 'TBD' %></strong><br><small style="color:var(--text-muted)"><%= a.time || '' %></small></td>
            <td><%= a.name %><br><small style="color:var(--text-muted)"><%= a.phone %><br><%= a.email %></small></td>
            <td><%= a.service %></td>
            <td><small style="color:var(--text-muted)"><%= a.notes || '—' %></small></td>
            <td><span class="status-badge status-<%= a.status %>"><%= a.status %></span></td>
            <td>
              <form action="/admin/appointments/<%= a.id %>/status" method="POST" style="display:flex;gap:6px;flex-wrap:wrap">
                <select name="status" class="form-select" style="padding:4px 8px;font-size:12px;width:auto">
                  <option value="new" <%= a.status==='new'?'selected':'' %>>New</option>
                  <option value="confirmed" <%= a.status==='confirmed'?'selected':'' %>>Confirmed</option>
                  <option value="completed" <%= a.status==='completed'?'selected':'' %>>Completed</option>
                  <option value="cancelled" <%= a.status==='cancelled'?'selected':'' %>>Cancelled</option>
                  <option value="noshow" <%= a.status==='noshow'?'selected':'' %>>No Show</option>
                </select>
                <input type="text" name="admin_notes" class="form-input" placeholder="Notes" value="<%= a.admin_notes || '' %>" style="padding:4px 8px;font-size:12px;width:120px">
                <button type="submit" class="btn btn-pink" style="width:auto;padding:5px 12px;font-size:11px">Update</button>
              </form>
            </td>
          </tr>
        <% }); %>
        <% if(appointments.length === 0) { %>
          <tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:32px">No appointments yet.</td></tr>
        <% } %>
      </table>
    </div>
  </main>
</body>
</html>'''

w(f'{BASE}/views/admin/appointments.ejs', admin_appointments_ejs)

# ADMIN LEADS
admin_leads_ejs = r'''<!DOCTYPE html>
<html class="admin-body">
<head>
  <meta charset="UTF-8">
  <title>Leads — Beauty Lashes Admin</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <aside class="admin-sidebar">
    <a href="/" class="logo">Beauty Lashes</a>
    <a href="/admin" class="admin-nav-item">Dashboard</a>
    <a href="/admin/appointments" class="admin-nav-item">Appointments</a>
    <a href="/admin/clients" class="admin-nav-item">Clients</a>
    <a href="/admin/leads" class="admin-nav-item active">Leads</a>
    <a href="/admin/gallery" class="admin-nav-item">Gallery</a>
    <a href="/admin/services" class="admin-nav-item">Services</a>
    <a href="/admin/settings" class="admin-nav-item">Settings</a>
    <a href="/admin/logout" class="admin-nav-item" style="margin-top:24px">Logout</a>
  </aside>
  <main class="admin-main">
    <div class="admin-header"><h2>Contact Leads</h2></div>
    <div class="admin-card">
      <table class="admin-table">
        <tr><th>Date</th><th>Name</th><th>Contact</th><th>Message</th><th>Status</th><th></th></tr>
        <% leads.forEach(function(l) { %>
          <tr>
            <td><%= l.created_at ? l.created_at.split('T')[0] : '' %></td>
            <td><%= l.name %></td>
            <td><%= l.email %><br><small style="color:var(--text-muted)"><%= l.phone %></small></td>
            <td><%= l.message %></td>
            <td><span class="status-badge status-<%= l.status %>"><%= l.status %></span></td>
            <td>
              <form action="/admin/leads/<%= l.id %>/status" method="POST" style="display:flex;gap:6px">
                <select name="status" class="form-select" style="padding:4px 8px;font-size:12px;width:auto">
                  <option value="new" <%= l.status==='new'?'selected':'' %>>New</option>
                  <option value="contacted" <%= l.status==='contacted'?'selected':'' %>>Contacted</option>
                  <option value="booked" <%= l.status==='booked'?'selected':'' %>>Booked</option>
                  <option value="lost" <%= l.status==='lost'?'selected':'' %>>Lost</option>
                </select>
                <button type="submit" class="btn btn-pink" style="width:auto;padding:5px 12px;font-size:11px">Update</button>
              </form>
            </td>
          </tr>
        <% }); %>
        <% if(!leads || leads.length === 0) { %>
          <tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:32px">No leads yet.</td></tr>
        <% } %>
      </table>
    </div>
  </main>
</body>
</html>'''

w(f'{BASE}/views/admin/leads.ejs', admin_leads_ejs)

# ADMIN GALLERY
admin_gallery_ejs = r'''<!DOCTYPE html>
<html class="admin-body">
<head>
  <meta charset="UTF-8">
  <title>Gallery — Beauty Lashes Admin</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <aside class="admin-sidebar">
    <a href="/" class="logo">Beauty Lashes</a>
    <a href="/admin" class="admin-nav-item">Dashboard</a>
    <a href="/admin/appointments" class="admin-nav-item">Appointments</a>
    <a href="/admin/clients" class="admin-nav-item">Clients</a>
    <a href="/admin/leads" class="admin-nav-item">Leads</a>
    <a href="/admin/gallery" class="admin-nav-item active">Gallery</a>
    <a href="/admin/services" class="admin-nav-item">Services</a>
    <a href="/admin/settings" class="admin-nav-item">Settings</a>
    <a href="/admin/logout" class="admin-nav-item" style="margin-top:24px">Logout</a>
  </aside>
  <main class="admin-main">
    <div class="admin-header"><h2>Gallery</h2></div>
    <div class="admin-card">
      <h3>Upload Image</h3>
      <form action="/admin/gallery/upload" method="POST" enctype="multipart/form-data" style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end">
        <div class="form-group" style="margin:0">
          <label class="form-label">Image</label>
          <input type="file" name="image" accept="image/jpeg,image/png,image/webp" required style="color:#fff;font-size:13px">
        </div>
        <div class="form-group" style="margin:0;flex:1">
          <label class="form-label">Caption</label>
          <input type="text" name="caption" class="form-input" placeholder="Before & After — Volume Set">
        </div>
        <button type="submit" class="btn btn-pink" style="width:auto;padding:12px 24px">Upload</button>
      </form>
    </div>
    <div class="admin-card">
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px">
        <% if(gallery && gallery.length) { gallery.forEach(function(img) { %>
          <div style="border:1px solid rgba(242,164,184,0.1);border-radius:10px;overflow:hidden;position:relative">
            <img src="/images/uploads/<%= img.image %>" style="width:100%;aspect-ratio:4/3;object-fit:cover" onerror="this.style.display='none'">
            <div style="padding:10px;font-size:12px;color:var(--text-muted)"><%= img.caption || '' %></div>
            <form action="/admin/gallery/delete/<%= img.id %>" method="POST" style="padding:8px">
              <button type="submit" class="btn btn-outline" style="width:100%;padding:6px;font-size:11px;color:#e85454;border-color:#e85454">Delete</button>
            </form>
          </div>
        <% }); } else { %>
          <p style="color:var(--text-muted);grid-column:1/-1;text-align:center;padding:32px">No gallery images yet.</p>
        <% } %>
      </div>
    </div>
  </main>
</body>
</html>'''

w(f'{BASE}/views/admin/gallery.ejs', admin_gallery_ejs)

# ADMIN SERVICES
admin_services_ejs = r'''<!DOCTYPE html>
<html class="admin-body">
<head>
  <meta charset="UTF-8">
  <title>Services — Beauty Lashes Admin</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <aside class="admin-sidebar">
    <a href="/" class="logo">Beauty Lashes</a>
    <a href="/admin" class="admin-nav-item">Dashboard</a>
    <a href="/admin/appointments" class="admin-nav-item">Appointments</a>
    <a href="/admin/clients" class="admin-nav-item">Clients</a>
    <a href="/admin/leads" class="admin-nav-item">Leads</a>
    <a href="/admin/gallery" class="admin-nav-item">Gallery</a>
    <a href="/admin/services" class="admin-nav-item active">Services</a>
    <a href="/admin/settings" class="admin-nav-item">Settings</a>
    <a href="/admin/logout" class="admin-nav-item" style="margin-top:24px">Logout</a>
  </aside>
  <main class="admin-main">
    <div class="admin-header"><h2>Services Management</h2></div>
    <div class="admin-card">
      <h3>Add Service</h3>
      <form action="/admin/services/add" method="POST" style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end">
        <div class="form-group" style="margin:0;flex:2;min-width:160px">
          <label class="form-label">Service Name</label>
          <input type="text" name="name" class="form-input" required>
        </div>
        <div class="form-group" style="margin:0;flex:2;min-width:200px">
          <label class="form-label">Description</label>
          <input type="text" name="description" class="form-input">
        </div>
        <div class="form-group" style="margin:0;flex:1;min-width:80px">
          <label class="form-label">Duration</label>
          <input type="text" name="duration" class="form-input" placeholder="60 min">
        </div>
        <div class="form-group" style="margin:0;flex:1;min-width:80px">
          <label class="form-label">Price ($)</label>
          <input type="number" name="price" class="form-input" step="0.01" required>
        </div>
        <button type="submit" class="btn btn-pink" style="width:auto;padding:12px 24px">Add</button>
      </form>
    </div>
    <div class="admin-card">
      <table class="admin-table">
        <tr><th>Name</th><th>Description</th><th>Duration</th><th>Price</th><th>Status</th><th></th></tr>
        <% services.forEach(function(s) { %>
          <tr>
            <form action="/admin/services/<%= s.id %>/edit" method="POST" style="display:contents">
              <td><input type="text" name="name" value="<%= s.name %>" class="form-input" style="padding:6px 10px;font-size:13px"></td>
              <td><input type="text" name="description" value="<%= s.description || '' %>" class="form-input" style="padding:6px 10px;font-size:13px"></td>
              <td><input type="text" name="duration" value="<%= s.duration || '' %>" class="form-input" style="padding:6px 10px;font-size:13px;width:80px"></td>
              <td><input type="number" name="price" value="<%= s.price %>" class="form-input" style="padding:6px 10px;font-size:13px;width:80px"></td>
              <td>
                <form action="/admin/services/<%= s.id %>/toggle" method="POST" style="display:inline">
                  <button type="submit" class="btn btn-outline" style="width:auto;padding:4px 10px;font-size:11px;<%= s.enabled?'border-color:#6de89a;color:#6de89a':'color:#e85454'%>">
                    <%= s.enabled?'Enabled':'Disabled' %>
                  </button>
                </form>
              </td>
              <td><button type="submit" class="btn btn-pink" style="width:auto;padding:5px 12px;font-size:11px">Save</button></td>
            </form>
          </tr>
        <% }); %>
      </table>
    </div>
  </main>
</body>
</html>'''

w(f'{BASE}/views/admin/services.ejs', admin_services_ejs)

# ADMIN SETTINGS
admin_settings_ejs = r'''<!DOCTYPE html>
<html class="admin-body">
<head>
  <meta charset="UTF-8">
  <title>Settings — Beauty Lashes Admin</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <aside class="admin-sidebar">
    <a href="/" class="logo">Beauty Lashes</a>
    <a href="/admin" class="admin-nav-item">Dashboard</a>
    <a href="/admin/appointments" class="admin-nav-item">Appointments</a>
    <a href="/admin/clients" class="admin-nav-item">Clients</a>
    <a href="/admin/leads" class="admin-nav-item">Leads</a>
    <a href="/admin/gallery" class="admin-nav-item">Gallery</a>
    <a href="/admin/services" class="admin-nav-item">Services</a>
    <a href="/admin/settings" class="admin-nav-item active">Settings</a>
    <a href="/admin/logout" class="admin-nav-item" style="margin-top:24px">Logout</a>
  </aside>
  <main class="admin-main">
    <div class="admin-header"><h2>Business Settings</h2></div>
    <div class="admin-card">
      <h3>Business Info</h3>
      <form action="/admin/settings" method="POST">
        <div class="settings-grid">
          <div class="form-group">
            <label class="form-label">Business Name</label>
            <input type="text" name="name" class="form-input" value="<%= settings.name || 'Beauty Lashes' %>">
          </div>
          <div class="form-group">
            <label class="form-label">Phone</label>
            <input type="text" name="phone" class="form-input" value="<%= settings.phone || '' %>">
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" name="email" class="form-input" value="<%= settings.email || '' %>">
          </div>
          <div class="form-group">
            <label class="form-label">Address</label>
            <input type="text" name="address" class="form-input" value="<%= settings.address || '' %>">
          </div>
          <div class="form-group">
            <label class="form-label">Business Hours</label>
            <input type="text" name="hours" class="form-input" value="<%= settings.hours || '' %>">
          </div>
          <div class="form-group">
            <label class="form-label">Booking Notice</label>
            <input type="text" name="notice" class="form-input" value="<%= settings.notice || '' %>">
          </div>
        </div>
        <div style="margin-top:20px">
          <button type="submit" class="btn btn-pink" style="width:auto;padding:12px 32px">Save Settings</button>
        </div>
      </form>
    </div>
    <div class="admin-card">
      <h3>Change Admin Password</h3>
      <p style="color:var(--text-muted);font-size:14px;margin-bottom:16px">Contact developer to reset admin password.</p>
    </div>
  </main>
</body>
</html>'''

w(f'{BASE}/views/admin/settings.ejs', admin_settings_ejs)

print("\nAll templates written!")
print(f"Total files created in {BASE}")