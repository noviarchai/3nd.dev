#!/usr/bin/env python3
"""Beauty Lashes — Full bright fun mode, no dark sections"""
import os

BASE = '/var/www/lashes.3nd.dev'

CSS = r'''/* =============================================
   BEAUTY LASHES — Bright Fun Betty Era
   Pure light mode, fun & playful, no dark sections
   ============================================= */

:root {
  --bg: #fdf8f5;
  --bg-warm: #f9f3ec;
  --bg-pink: #fff0f5;
  --white: #ffffff;
  --black: #111111;
  --pink: #ff3d7f;
  --pink-deep: #e91a5e;
  --pink-light: #ffe4ef;
  --pink-mid: #f77faf;
  --gold: #c9922a;
  --gold-light: #fceabb;
  --peach: #f0c4a8;
  --text: #2d2d2d;
  --text-warm: #6b5f55;
  --text-muted: #9b8f87;
  --border: #f0e8e2;
  --border-pink: #fdd7e5;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 20px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 40px rgba(0,0,0,0.12);
  --radius: 20px;
  --radius-sm: 12px;
  --radius-lg: 28px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

body {
  font-family: 'DM Sans', 'Helvetica Neue', sans-serif;
  background: var(--bg);
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

/* ---- Layout ---- */
.container { max-width: 1200px; margin: 0 auto; padding: 0 28px; }
.container-sm { max-width: 800px; margin: 0 auto; padding: 0 28px; }

/* ---- Buttons ---- */
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 15px 34px; border-radius: 50px;
  font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
  letter-spacing: 0.8px; text-transform: uppercase; cursor: pointer; transition: all 0.3s; border: none;
}
.btn-pink { background: var(--pink); color: #fff; }
.btn-pink:hover { background: var(--pink-deep); transform: translateY(-3px); box-shadow: 0 8px 28px rgba(255,61,127,0.35); }
.btn-ghost-pink { background: transparent; color: var(--pink-deep); border: 2.5px solid var(--pink-light); }
.btn-ghost-pink:hover { background: var(--pink-light); border-color: var(--pink-deep); }

/* ---- Sparkle ---- */
.sparkle {
  display: inline-block;
  width: 8px; height: 8px;
  background: var(--gold);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}

/* ---- Section labels ---- */
.section-label {
  display: flex; align-items: center; gap: 10px;
  font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;
  color: var(--pink-deep); margin-bottom: 14px;
}
.section-label::before, .section-label::after { content: ''; flex: 0 0 28px; height: 2px; background: var(--pink-light); border-radius: 2px; }
.section-title { font-size: clamp(28px, 4vw, 48px); margin-bottom: 12px; }
.section-sub { font-size: 17px; color: var(--text-warm); max-width: 560px; font-family: 'Cormorant Garamond', serif; font-style: italic; }

/* ---- NAV — white with pink accents ---- */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  background: rgba(255,255,255,0.96); backdrop-filter: blur(16px);
  box-shadow: 0 1px 0 var(--border-pink);
}
.nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 28px; height: 74px; display: flex; align-items: center; justify-content: space-between; }
.nav-logo { display: flex; align-items: center; gap: 10px; font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; font-style: italic; color: var(--pink-deep) !important; }
.nav-logo img { height: 48px; width: auto; border-radius: 10px; }
.nav-links { display: flex; gap: 34px; align-items: center; }
.nav-links a { font-size: 13px; font-weight: 500; letter-spacing: 0.6px; text-transform: uppercase; color: var(--text-warm); transition: color 0.2s; }
.nav-links a:hover, .nav-links a.active { color: var(--pink-deep); }
.nav-cta { background: var(--pink) !important; color: #fff !important; padding: 9px 22px; border-radius: 50px; font-weight: 600 !important; box-shadow: 0 4px 12px rgba(255,61,127,0.25); }
.nav-cta:hover { background: var(--pink-deep) !important; transform: translateY(-1px); }
.nav-cta::after { display: none !important; }
.menu-toggle { display: none; background: none; border: none; font-size: 28px; cursor: pointer; color: var(--text); }

/* ---- HERO — bright pink gradient ---- */
.hero {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
  background: linear-gradient(160deg, #fff0f8 0%, #ffe4ef 40%, #fff5f0 100%);
  padding: 100px 28px 80px;
}
.hero-pattern {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden;
}
.hero-pattern::before {
  content: '';
  position: absolute;
  top: -50%; left: -20%;
  width: 60%; height: 200%;
  background: radial-gradient(ellipse, rgba(255,61,127,0.12) 0%, transparent 60%);
  animation: float 8s ease-in-out infinite;
}
.hero-pattern::after {
  content: '';
  position: absolute;
  bottom: -30%; right: -10%;
  width: 50%; height: 150%;
  background: radial-gradient(ellipse, rgba(201,146,42,0.08) 0%, transparent 60%);
  animation: float 10s ease-in-out infinite reverse;
}
@keyframes float { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-20px)} }

.hero-content { position: relative; z-index: 2; text-align: center; max-width: 800px; }
.hero-logo { height: 200px; width: auto; margin: 0 auto 30px; animation: heroIn 0.9s ease both; border-radius: 24px; }
.hero-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 5px; text-transform: uppercase; color: var(--gold); margin-bottom: 20px; animation: heroIn 0.8s ease 0.15s both; }
.hero h1 { font-size: clamp(46px, 8vw, 86px); color: var(--black); margin-bottom: 18px; font-style: italic; animation: heroIn 0.8s ease 0.25s both; }
.hero h1 span { color: var(--pink-deep); position: relative; display: inline-block; }
.hero-sub { font-family: 'Cormorant Garamond', serif; font-size: clamp(16px, 2vw, 22px); font-style: italic; color: var(--text-warm); margin-bottom: 42px; animation: heroIn 0.8s ease 0.35s both; }
.hero-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; animation: heroIn 0.8s ease 0.45s both; }
.hero-scroll { position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--pink-mid); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; animation: bounce 2.2s infinite; }
@keyframes heroIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }

/* ---- INTRO STRIP ---- */
.intro-strip { background: var(--white); border-top: 3px solid var(--pink-light); border-bottom: 3px solid var(--pink-light); padding: 28px 0; }
.intro-strip-inner { display: flex; justify-content: center; gap: 52px; flex-wrap: wrap; max-width: 820px; margin: 0 auto; }
.intro-strip-item { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; color: var(--text-warm); }

/* ---- SERVICES ---- */
.services { padding: 100px 0; background: var(--bg); }
.services-header { text-align: center; margin-bottom: 60px; }
.services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 22px; }
.service-card { background: var(--white); border: 2px solid var(--border-pink); border-radius: var(--radius); padding: 34px; transition: all 0.35s; position: relative; overflow: hidden; }
.service-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, var(--pink-deep), var(--pink), var(--pink-mid)); transform: scaleX(0); transition: transform 0.35s; }
.service-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: var(--pink-light); }
.service-card:hover::before { transform: scaleX(1); }
.service-name { font-family: 'Playfair Display', serif; font-size: 20px; margin-bottom: 10px; color: var(--black); }
.service-desc { font-size: 14px; color: var(--text-warm); margin-bottom: 22px; line-height: 1.65; }
.service-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; }
.service-price { font-size: 30px; font-weight: 700; color: var(--pink-deep); }
.service-duration { font-size: 12px; color: var(--text-muted); background: var(--bg-pink); padding: 5px 12px; border-radius: 50px; }
.service-book { width: 100%; justify-content: center; padding: 13px; background: var(--bg-pink); color: var(--pink-deep); border: 2px solid var(--pink-light); font-size: 12px; border-radius: 50px; letter-spacing: 0.5px; }
.service-book:hover { background: var(--pink); color: #fff; border-color: var(--pink); }

/* ---- WHY US ---- */
.why-us { padding: 100px 0; background: var(--white); }
.why-us-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 24px; }
.why-card { text-align: center; padding: 38px 26px; border: 2px solid var(--border-pink); border-radius: var(--radius); transition: all 0.3s; background: var(--bg); }
.why-card:hover { border-color: var(--gold-light); transform: translateY(-3px); box-shadow: var(--shadow-md); }
.why-icon { font-size: 40px; margin-bottom: 16px; }
.why-card h3 { font-size: 18px; margin-bottom: 8px; color: var(--black); }
.why-card p { font-size: 14px; color: var(--text-warm); line-height: 1.65; }

/* ---- TESTIMONIALS ---- */
.testimonials { padding: 100px 0; background: var(--bg-pink); }
.testimonials-header { text-align: center; margin-bottom: 52px; }
.testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 22px; }
.testimonial-card { background: var(--white); border: 2px solid var(--border-pink); border-radius: var(--radius); padding: 34px; }
.testimonial-stars { color: var(--gold); font-size: 15px; margin-bottom: 16px; letter-spacing: 3px; }
.testimonial-text { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-style: italic; color: var(--text); margin-bottom: 18px; line-height: 1.7; }
.testimonial-author { font-size: 13px; font-weight: 600; color: var(--pink-deep); }

/* ---- BOOKING CTA ---- */
.booking-cta { padding: 100px 0; background: linear-gradient(135deg, var(--pink-deep) 0%, #ff5a8a 100%); text-align: center; position: relative; overflow: hidden; }
.booking-cta::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(255,255,255,0.12), transparent 70%); }
.booking-cta h2 { font-size: clamp(28px, 4vw, 50px); color: #fff; margin-bottom: 14px; position: relative; }
.booking-cta p { font-size: 18px; color: rgba(255,255,255,0.85); margin-bottom: 38px; font-family: 'Cormorant Garamond', serif; font-style: italic; position: relative; }
.booking-cta .btn { background: #fff; color: var(--pink-deep); position: relative; }
.booking-cta .btn:hover { background: var(--gold-light); transform: translateY(-3px); }

/* ---- FORMS ---- */
.form-group { margin-bottom: 22px; }
.form-label { display: block; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-warm); margin-bottom: 8px; }
.form-input, .form-select, .form-textarea { width: 100%; padding: 14px 18px; background: var(--white); border: 2px solid var(--border-pink); border-radius: var(--radius-sm); color: var(--text); font-size: 15px; font-family: 'DM Sans', sans-serif; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; }
.form-input:focus, .form-select:focus, .form-textarea:focus { outline: none; border-color: var(--pink); box-shadow: 0 0 0 4px rgba(255,61,127,0.1); }
.form-select { appearance: none; cursor: pointer; }
.form-textarea { resize: vertical; min-height: 120px; }
.form-checkbox { display: flex; align-items: flex-start; gap: 12px; cursor: pointer; }
.form-checkbox input { width: 18px; height: 18px; accent-color: var(--pink); flex-shrink: 0; margin-top: 2px; }
.form-checkbox span { font-size: 13px; color: var(--text-warm); line-height: 1.5; }

/* ---- FOOTER — dark only here, logo contrast ---- */
footer { background: var(--black); color: rgba(255,255,255,0.55); padding: 60px 0 30px; }
.footer-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 52px; margin-bottom: 48px; }
.footer-brand-name { font-family: 'Playfair Display', serif; font-size: 22px; font-style: italic; color: var(--pink-light); margin-bottom: 10px; }
.footer-tagline { font-size: 14px; margin-bottom: 16px; }
.footer-social { display: flex; gap: 14px; }
.footer-social a { color: rgba(255,255,255,0.4); font-size: 13px; font-weight: 500; }
.footer-social a:hover { color: var(--pink-light); }
.footer-heading { font-size: 11px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; }
.footer-links { display: flex; flex-direction: column; gap: 10px; }
.footer-links a { font-size: 14px; color: rgba(255,255,255,0.5); }
.footer-links a:hover { color: var(--pink-light); }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
.footer-bottom a { color: rgba(255,255,255,0.35); }
.footer-bottom a:hover { color: var(--pink-light); }

/* ---- PAGE HEADERS ---- */
.page-header { padding: 130px 0 64px; background: var(--bg-pink); text-align: center; }
.page-header h1 { font-size: clamp(28px, 5vw, 52px); color: var(--black); margin-bottom: 10px; }
.page-header p { color: var(--text-warm); font-family: 'Cormorant Garamond', serif; font-size: 18px; font-style: italic; }

/* ---- ABOUT ---- */
.about-content { max-width: 740px; margin: 0 auto; }
.about-content p { font-size: 17px; color: var(--text-warm); margin-bottom: 22px; line-height: 1.8; }
.values-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 22px; margin-top: 52px; }
.value-card { background: var(--white); border: 2px solid var(--border-pink); border-radius: var(--radius); padding: 30px; }
.value-card h3 { font-size: 18px; margin-bottom: 8px; color: var(--pink-deep); }
.value-card p { font-size: 14px; color: var(--text-warm); line-height: 1.65; }

/* ---- POLICIES ---- */
.policy-block { background: var(--white); border: 2px solid var(--border-pink); border-radius: var(--radius); padding: 34px; margin-bottom: 22px; }
.policy-block h3 { font-size: 18px; color: var(--pink-deep); margin-bottom: 12px; }
.policy-block p { font-size: 15px; color: var(--text-warm); line-height: 1.75; }

/* ---- GALLERY ---- */
.gallery { padding: 100px 0; background: var(--bg); }
.gallery-header { text-align: center; margin-bottom: 52px; }
.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }
.gallery-item { border-radius: var(--radius-sm); overflow: hidden; position: relative; aspect-ratio: 4/3; background: var(--bg-pink); }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.gallery-item:hover img { transform: scale(1.06); }
.gallery-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(255,61,127,0.7), transparent); opacity: 0; transition: opacity 0.3s; display: flex; align-items: flex-end; padding: 18px; }
.gallery-item:hover .gallery-overlay { opacity: 1; }
.gallery-caption { font-size: 13px; color: #fff; font-weight: 500; }

/* ---- MOBILE ---- */
@media(max-width: 768px) {
  .nav-links { display: none; flex-direction: column; position: absolute; top: 74px; left: 0; right: 0; background: rgba(255,255,255,0.98); border-bottom: 2px solid var(--border-pink); padding: 20px 28px; gap: 14px; }
  .nav-links.open { display: flex; }
  .menu-toggle { display: block; }
  .hero { min-height: 88vh; padding-top: 100px; }
  .hero-logo { height: 150px; }
  .hero-actions { flex-direction: column; align-items: center; }
  .hero-actions .btn { width: 100%; max-width: 290px; justify-content: center; }
  .intro-strip-inner { gap: 22px; }
  .services-grid, .gallery-grid, .testimonials-grid, .why-us-grid { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr; gap: 32px; }
  .footer-bottom { flex-direction: column; gap: 10px; text-align: center; }
}
@media(max-width: 480px) {
  .hero-logo { height: 120px; }
  .intro-strip-inner { flex-direction: column; align-items: center; gap: 14px; }
}

/* ---- ADMIN ---- */
.admin-body { background: var(--bg); color: var(--text); }
.admin-sidebar { width: 250px; background: var(--black); position: fixed; top: 0; left: 0; bottom: 0; padding: 24px 0; }
.admin-sidebar .logo { font-family: 'Playfair Display', serif; font-size: 18px; font-style: italic; color: var(--pink-light); padding: 0 24px 24px; display: block; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 16px; }
.admin-nav-item { display: block; padding: 12px 24px; font-size: 13px; color: rgba(255,255,255,0.45); text-decoration: none; transition: all 0.2s; }
.admin-nav-item:hover, .admin-nav-item.active { background: rgba(255,61,127,0.18); color: var(--pink-light); }
.admin-main { margin-left: 250px; padding: 32px; min-height: 100vh; }
.admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
.admin-header h2 { font-size: 24px; font-family: 'Playfair Display', serif; color: var(--black); }
.admin-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 32px; }
.admin-stat { background: var(--white); border: 2px solid var(--border-pink); border-radius: 12px; padding: 20px; }
.admin-stat .num { font-size: 32px; font-weight: 700; color: var(--pink-deep); }
.admin-stat .label { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th { text-align: left; padding: 12px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-muted); border-bottom: 2px solid var(--border-pink); }
.admin-table td { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid var(--border); color: var(--text-warm); }
.admin-table tr:hover td { background: var(--bg-pink); }
.status-badge { display: inline-block; padding: 4px 12px; border-radius: 50px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.status-new { background: var(--pink-light); color: var(--pink-deep); }
.status-confirmed { background: var(--gold-light); color: var(--gold); }
.status-completed { background: #e8f5e9; color: #2e7d32; }
.status-cancelled { background: #ffebee; color: #c62828; }
.login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg-pink); }
.login-box { background: var(--white); border: 2px solid var(--border-pink); border-radius: 24px; padding: 48px; width: 420px; text-align: center; }
.login-box h1 { font-family: 'Playfair Display', serif; font-size: 28px; font-style: italic; color: var(--pink-deep); margin-bottom: 32px; }
.login-box input { width: 100%; padding: 14px 18px; background: var(--bg); border: 2px solid var(--border-pink); border-radius: 12px; color: var(--text); font-size: 15px; margin-bottom: 16px; box-sizing: border-box; }
.login-box input:focus { outline: none; border-color: var(--pink); }
.login-box button { width: 100%; padding: 15px; background: var(--pink); color: #fff; border: none; border-radius: 50px; font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; }
.login-box button:hover { background: var(--pink-deep); }
.login-error { color: #c62828; font-size: 13px; margin-top: 12px; }
.admin-card { background: var(--white); border: 2px solid var(--border-pink); border-radius: 12px; padding: 24px; margin-bottom: 20px; }
.admin-card h3 { font-size: 16px; margin-bottom: 16px; color: var(--black); }
.settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media(max-width: 900px) { .admin-sidebar { width: 200px; } .admin-main { margin-left: 200px; } }
@media(max-width: 600px) { .admin-sidebar { display: none; } .admin-main { margin-left: 0; padding: 16px; } .settings-grid { grid-template-columns: 1fr; } .login-box { width: auto; margin: 0 16px; } }

/* ---- Animations ---- */
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
      <a href="/" class="nav-logo"><img src="/images/logo.png" alt="Beauty Lashes"></a>
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
    <div class="hero-pattern"></div>
    <div class="hero-content">
      <img src="/images/logo.png" alt="Beauty Lashes" class="hero-logo">
      <div class="hero-eyebrow">Edmonton's Premier Lash Studio</div>
      <h1>Wake Up With <span>Flawless</span> Lashes</h1>
      <p class="hero-sub">Expert lash extensions tailored to your unique eye shape, lifestyle, and desired drama.</p>
      <div class="hero-actions">
        <a href="/booking" class="btn btn-pink">Book Appointment</a>
        <a href="/services" class="btn btn-ghost-pink">View Services</a>
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
      <div class="section-label" style="color:rgba(255,255,255,0.7)">Ready?</div>
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
print('Bright fun mode deployed!')'''

with open('/home/pi/.openclaw/workspace/lashes-bright.py', 'w') as f:
    f.write(CSS)

print("Script ready")