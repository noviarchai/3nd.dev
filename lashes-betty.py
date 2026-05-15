#!/usr/bin/env python3
"""Beauty Lashes — Dark hero where logo belongs, bright cream body"""
import os

BASE = '/var/www/lashes.3nd.dev'

CSS = r'''/* =============================================
   BEAUTY LASHES — Betty Boop Glam Era
   Dark hero with logo, cream body everywhere else
   ============================================= */

:root {
  --cream: #fdf8f4;
  --cream-warm: #f9f3ec;
  --cream-dark: #f0ebe4;
  --white: #ffffff;
  --black: #0d0d0d;
  --black-card: #1a1a1a;
  --pink: #ff2d6f;
  --pink-deep: #d91a5e;
  --pink-light: #ffe4ef;
  --gold: #c9922a;
  --gold-light: #f5d98a;
  --text: #222222;
  --text-warm: #555555;
  --text-muted: #999999;
  --border: #e8dcd4;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 20px rgba(0,0,0,0.1);
  --shadow-lg: 0 8px 40px rgba(0,0,0,0.14);
  --radius: 16px;
  --radius-sm: 10px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

body {
  font-family: 'DM Sans', 'Helvetica Neue', sans-serif;
  background: var(--cream);
  color: var(--text);
  line-height: 1.65;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
  line-height: 1.15;
  color: var(--black);
  letter-spacing: -0.3px;
}

a { color: var(--pink-deep); text-decoration: none; transition: color 0.2s; }
a:hover { color: var(--pink); }
img { max-width: 100%; display: block; }

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');

.container { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
.container-sm { max-width: 780px; margin: 0 auto; padding: 0 24px; }

.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 32px; border-radius: 50px;
  font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
  letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.3s; border: none;
}
.btn-pink { background: var(--pink); color: #fff; }
.btn-pink:hover { background: var(--pink-deep); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,45,111,0.3); }
.btn-ghost { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.4); }
.btn-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.1); }

.section-label { display: flex; align-items: center; gap: 10px; font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: var(--gold); margin-bottom: 14px; }
.section-label::before, .section-label::after { content: ''; flex: 0 0 24px; height: 1.5px; background: var(--gold); }
.section-title { font-size: clamp(28px, 4vw, 48px); margin-bottom: 12px; }
.section-sub { font-size: 17px; color: var(--text-warm); max-width: 540px; font-family: 'Cormorant Garamond', serif; font-style: italic; }

/* NAV */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  background: rgba(13,13,13,0.95); backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.nav-inner { max-width: 1180px; margin: 0 auto; padding: 0 24px; height: 72px; display: flex; align-items: center; justify-content: space-between; }
.nav-logo { display: flex; align-items: center; font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; font-style: italic; color: var(--pink-light) !important; }
.nav-logo img { height: 48px; width: auto; border-radius: 8px; }
.nav-links { display: flex; gap: 32px; align-items: center; }
.nav-links a { font-size: 13px; font-weight: 500; letter-spacing: 0.8px; text-transform: uppercase; color: rgba(255,255,255,0.55); }
.nav-links a:hover, .nav-links a.active { color: #fff; }
.nav-cta { background: var(--pink) !important; color: #fff !important; padding: 8px 20px; border-radius: 50px; font-weight: 600 !important; }
.nav-cta:hover { background: var(--pink-deep) !important; }
.menu-toggle { display: none; background: none; border: none; font-size: 26px; cursor: pointer; color: #fff; }

/* HERO — DARK where logo belongs */
.hero {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
  background: var(--black);
  padding: 100px 24px 80px;
}
.hero-bg {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(circle at 20% 30%, rgba(255,45,111,0.12) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(201,146,42,0.08) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(255,45,111,0.04) 0%, transparent 70%);
}
.hero-vignette {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%);
  pointer-events: none;
}
.hero-content { position: relative; z-index: 2; text-align: center; max-width: 780px; }
.hero-logo { height: 200px; width: auto; margin: 0 auto 28px; animation: fadeIn 1s ease; }
.hero-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 5px; text-transform: uppercase; color: var(--gold); margin-bottom: 20px; animation: fadeIn 0.8s ease 0.2s both; }
.hero h1 { font-size: clamp(48px, 8vw, 88px); color: #fff; margin-bottom: 20px; font-style: italic; animation: fadeIn 0.8s ease 0.3s both; }
.hero h1 span { color: var(--pink); }
.hero-sub { font-family: 'Cormorant Garamond', serif; font-size: clamp(16px, 2vw, 22px); font-style: italic; color: rgba(255,255,255,0.6); margin-bottom: 40px; animation: fadeIn 0.8s ease 0.4s both; }
.hero-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; animation: fadeIn 0.8s ease 0.5s both; }
.hero-scroll { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 8px; color: rgba(255,255,255,0.3); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; animation: bounce 2s infinite; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(6px)} }

/* INTRO STRIP */
.intro-strip { background: var(--white); border-top: 2px solid var(--border); border-bottom: 2px solid var(--border); padding: 28px 0; }
.intro-strip-inner { display: flex; justify-content: center; gap: 48px; flex-wrap: wrap; max-width: 800px; margin: 0 auto; }
.intro-strip-item { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 500; color: var(--text-warm); }

/* SERVICES */
.services { padding: 100px 0; background: var(--cream); }
.services-header { text-align: center; margin-bottom: 60px; }
.services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
.service-card { background: var(--white); border: 2px solid var(--border); border-radius: var(--radius); padding: 32px; transition: all 0.3s; position: relative; overflow: hidden; }
.service-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, var(--pink-deep), var(--pink)); transform: scaleX(0); transition: transform 0.3s; }
.service-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--pink-light); }
.service-card:hover::before { transform: scaleX(1); }
.service-name { font-family: 'Playfair Display', serif; font-size: 20px; margin-bottom: 10px; }
.service-desc { font-size: 14px; color: var(--text-warm); margin-bottom: 20px; line-height: 1.6; }
.service-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.service-price { font-size: 28px; font-weight: 700; color: var(--pink-deep); }
.service-duration { font-size: 12px; color: var(--text-muted); background: var(--cream-warm); padding: 4px 10px; border-radius: 50px; }
.service-book { width: 100%; justify-content: center; padding: 12px; background: var(--cream-warm); color: var(--pink-deep); border: 2px solid var(--pink-light); font-size: 12px; border-radius: 50px; }
.service-book:hover { background: var(--pink); color: #fff; border-color: var(--pink); }

/* WHY US */
.why-us { padding: 100px 0; background: var(--white); }
.why-us-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; }
.why-card { text-align: center; padding: 36px 24px; border: 2px solid var(--border); border-radius: var(--radius); transition: all 0.3s; background: var(--cream); }
.why-card:hover { border-color: var(--gold); transform: translateY(-2px); }
.why-icon { font-size: 36px; margin-bottom: 14px; }
.why-card h3 { font-size: 18px; margin-bottom: 8px; }
.why-card p { font-size: 14px; color: var(--text-warm); line-height: 1.6; }

/* TESTIMONIALS */
.testimonials { padding: 100px 0; background: var(--cream); }
.testimonials-header { text-align: center; margin-bottom: 48px; }
.testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
.testimonial-card { background: var(--white); border: 2px solid var(--border); border-radius: var(--radius); padding: 32px; }
.testimonial-stars { color: var(--gold); font-size: 14px; margin-bottom: 14px; letter-spacing: 2px; }
.testimonial-text { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-style: italic; color: var(--text); margin-bottom: 16px; line-height: 1.6; }
.testimonial-author { font-size: 13px; font-weight: 600; color: var(--pink-deep); }

/* BOOKING CTA */
.booking-cta { padding: 100px 0; background: var(--pink-deep); text-align: center; position: relative; overflow: hidden; }
.booking-cta::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(255,255,255,0.08), transparent 70%); }
.booking-cta h2 { font-size: clamp(28px, 4vw, 48px); color: #fff; margin-bottom: 12px; position: relative; }
.booking-cta p { font-size: 17px; color: rgba(255,255,255,0.8); margin-bottom: 36px; font-family: 'Cormorant Garamond', serif; font-style: italic; position: relative; }
.booking-cta .btn { background: #fff; color: var(--pink-deep); position: relative; }
.booking-cta .btn:hover { background: var(--gold-light); transform: translateY(-2px); }

/* FORMS */
.form-group { margin-bottom: 20px; }
.form-label { display: block; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--text-warm); margin-bottom: 8px; }
.form-input, .form-select, .form-textarea { width: 100%; padding: 14px 18px; background: var(--white); border: 2px solid var(--border); border-radius: var(--radius-sm); color: var(--text); font-size: 15px; font-family: 'DM Sans', sans-serif; transition: border-color 0.2s; box-sizing: border-box; }
.form-input:focus, .form-select:focus, .form-textarea:focus { outline: none; border-color: var(--pink); }
.form-select { appearance: none; cursor: pointer; }
.form-textarea { resize: vertical; min-height: 120px; }
.form-checkbox { display: flex; align-items: flex-start; gap: 12px; cursor: pointer; }
.form-checkbox input { width: 18px; height: 18px; accent-color: var(--pink); flex-shrink: 0; margin-top: 2px; }
.form-checkbox span { font-size: 13px; color: var(--text-warm); line-height: 1.5; }

/* FOOTER */
footer { background: var(--black); color: rgba(255,255,255,0.5); padding: 64px 0 32px; }
.footer-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
.footer-brand-name { font-family: 'Playfair Display', serif; font-size: 22px; font-style: italic; color: var(--pink-light); margin-bottom: 10px; }
.footer-tagline { font-size: 14px; margin-bottom: 16px; }
.footer-social { display: flex; gap: 12px; }
.footer-social a { color: rgba(255,255,255,0.5); font-size: 13px; }
.footer-social a:hover { color: var(--gold-light); }
.footer-heading { font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; }
.footer-links { display: flex; flex-direction: column; gap: 8px; }
.footer-links a { font-size: 14px; color: rgba(255,255,255,0.5); }
.footer-links a:hover { color: var(--pink-light); }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
.footer-bottom a { color: rgba(255,255,255,0.4); }
.footer-bottom a:hover { color: var(--pink-light); }

/* PAGE HEADERS */
.page-header { padding: 130px 0 60px; background: var(--black); text-align: center; }
.page-header h1 { font-size: clamp(28px, 5vw, 52px); color: #fff; margin-bottom: 10px; }
.page-header p { color: rgba(255,255,255,0.5); font-family: 'Cormorant Garamond', serif; font-size: 18px; font-style: italic; }

/* ABOUT */
.about-content { max-width: 720px; margin: 0 auto; }
.about-content p { font-size: 17px; color: var(--text-warm); margin-bottom: 20px; line-height: 1.8; }
.values-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-top: 48px; }
.value-card { background: var(--white); border: 2px solid var(--border); border-radius: var(--radius); padding: 28px; }
.value-card h3 { font-size: 18px; margin-bottom: 8px; color: var(--pink-deep); }
.value-card p { font-size: 14px; color: var(--text-warm); line-height: 1.6; }

/* POLICIES */
.policy-block { background: var(--white); border: 2px solid var(--border); border-radius: var(--radius); padding: 32px; margin-bottom: 20px; }
.policy-block h3 { font-size: 18px; color: var(--pink-deep); margin-bottom: 12px; }
.policy-block p { font-size: 15px; color: var(--text-warm); line-height: 1.7; }

/* GALLERY */
.gallery { padding: 100px 0; background: var(--cream); }
.gallery-header { text-align: center; margin-bottom: 48px; }
.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.gallery-item { border-radius: var(--radius-sm); overflow: hidden; position: relative; aspect-ratio: 4/3; background: var(--cream-dark); }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.gallery-item:hover img { transform: scale(1.05); }
.gallery-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.6), transparent); opacity: 0; transition: opacity 0.3s; display: flex; align-items: flex-end; padding: 16px; }
.gallery-item:hover .gallery-overlay { opacity: 1; }
.gallery-caption { font-size: 13px; color: #fff; }

/* MOBILE */
@media(max-width: 768px) {
  .nav-links { display: none; flex-direction: column; position: absolute; top: 72px; left: 0; right: 0; background: rgba(13,13,13,0.98); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 20px 24px; gap: 12px; }
  .nav-links.open { display: flex; }
  .menu-toggle { display: block; }
  .hero { min-height: 85vh; }
  .hero-actions { flex-direction: column; align-items: center; }
  .hero-actions .btn { width: 100%; max-width: 280px; justify-content: center; }
  .intro-strip-inner { gap: 20px; }
  .services-grid, .gallery-grid, .testimonials-grid, .why-us-grid { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr; gap: 32px; }
  .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
}

/* ADMIN */
.admin-body { background: #f5f0ec; color: #333; }
.admin-sidebar { width: 240px; background: var(--black); position: fixed; top: 0; left: 0; bottom: 0; padding: 24px 0; }
.admin-sidebar .logo { font-family: 'Playfair Display', serif; font-size: 18px; font-style: italic; color: var(--pink-light); padding: 0 24px 24px; display: block; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 16px; }
.admin-nav-item { display: block; padding: 12px 24px; font-size: 13px; color: rgba(255,255,255,0.5); text-decoration: none; transition: all 0.2s; }
.admin-nav-item:hover, .admin-nav-item.active { background: rgba(255,45,111,0.15); color: var(--pink-light); }
.admin-main { margin-left: 240px; padding: 32px; min-height: 100vh; }
.admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
.admin-header h2 { font-size: 24px; font-family: 'Playfair Display', serif; }
.admin-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 32px; }
.admin-stat { background: #fff; border: 2px solid var(--border); border-radius: 12px; padding: 20px; }
.admin-stat .num { font-size: 32px; font-weight: 700; color: var(--pink-deep); }
.admin-stat .label { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th { text-align: left; padding: 12px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); border-bottom: 2px solid var(--border); }
.admin-table td { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid var(--border); color: var(--text-warm); }
.admin-table tr:hover td { background: var(--pink-light); }
.status-badge { display: inline-block; padding: 3px 10px; border-radius: 50px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.status-new { background: var(--pink-light); color: var(--pink-deep); }
.status-confirmed { background: #fef9e4; color: var(--gold); }
.status-completed { background: #e8f5e9; color: #2e7d32; }
.status-cancelled { background: #ffebee; color: #c62828; }
.login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--cream); }
.login-box { background: #fff; border: 2px solid var(--border); border-radius: 20px; padding: 48px; width: 400px; text-align: center; }
.login-box h1 { font-family: 'Playfair Display', serif; font-size: 28px; font-style: italic; color: var(--pink-deep); margin-bottom: 32px; }
.login-box input { width: 100%; padding: 14px 18px; background: var(--cream); border: 2px solid var(--border); border-radius: 10px; color: var(--text); font-size: 15px; margin-bottom: 16px; box-sizing: border-box; }
.login-box input:focus { outline: none; border-color: var(--pink); }
.login-box button { width: 100%; padding: 14px; background: var(--pink); color: #fff; border: none; border-radius: 50px; font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; }
.login-box button:hover { background: var(--pink-deep); }
.login-error { color: #c62828; font-size: 13px; margin-top: 12px; }
.admin-card { background: #fff; border: 2px solid var(--border); border-radius: 12px; padding: 24px; margin-bottom: 20px; }
.admin-card h3 { font-size: 16px; margin-bottom: 16px; }
.settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media(max-width: 900px) { .admin-sidebar { width: 200px; } .admin-main { margin-left: 200px; } }
@media(max-width: 600px) { .admin-sidebar { display: none; } .admin-main { margin-left: 0; padding: 16px; } .settings-grid { grid-template-columns: 1fr; } .login-box { width: auto; margin: 0 16px; } }

.fade-in { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease, transform 0.6s ease; }
.fade-in.visible { opacity: 1; transform: translateY(0); }
'''

HOME = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Beauty Lashes — Premium Lash Extensions in Edmonton</title>
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
        <a href="/services" class="btn btn-ghost">View Services</a>
      </div>
    </div>
    <div class="hero-scroll"><span>Discover</span></div>
  </section>

  <div class="intro-strip">
    <div class="intro-strip-inner">
      <div class="intro-strip-item">📍 Edmonton, Alberta</div>
      <div class="intro-strip-item">📅 Tue – Sat</div>
      <div class="intro-strip-item">⭐ 5-Star Rated</div>
      <div class="intro-strip-item">✨ Premium Lashes</div>
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
        <h2 class="section-title">The Difference</h2>
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
      <div class="section-label" style="color:#fff">Ready?</div>
      <h2>Book Your Appointment Today</h2>
      <p>Slots fill up quickly — reserve yours now and get ready to flutter.</p>
      <a href="/booking" class="btn" style="position:relative">Book Now →</a>
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
            <a href="/">Home</a><a href="/services">Services</a><a href="/gallery">Gallery</a>
            <a href="/about">About</a><a href="/booking">Book Now</a>
          </div>
        </div>
        <div>
          <div class="footer-heading">Contact</div>
          <div class="footer-links">
            <a href="tel:<%= site.business.phone %>"><%= site.business.phone %></a>
            <a href="mailto:<%= site.business.email %>"><%= site.business.email %></a>
            <span style="font-size:14px"><%= site.business.hours %></span>
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

def w(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

w(f'{BASE}/public/css/style.css', CSS)
w(f'{BASE}/views/pages/home.ejs', HOME)
print('Done - dark hero, cream body, logo on black where it belongs')