#!/usr/bin/env python3
"""Build script for BeautyLashes.ca — deploy to lashes.3nd.dev"""
import os

BASE = '/var/www/lashes.3nd.dev'

SITE_JSON = r'''{
  "business": {
    "name": "Beauty Lashes",
    "phone": "+1 (780) 555-0100",
    "email": "hello@beautylashes.ca",
    "address": "Edmonton, Alberta",
    "hours": "Tue–Sat: 9am – 6pm",
    "notice": "Appointments fill up fast — book in advance to secure your preferred time!",
    "social": {
      "instagram": "https://instagram.com/beautylashes",
      "facebook": "https://facebook.com/beautylashes",
      "tiktok": "https://tiktok.com/@beautylashes"
    }
  },
  "services": [
    {"id": 1, "name": "Classic Lash Extensions", "description": "Timeless elegance. One extension per natural lash for a natural, refined look.", "duration": "90 min", "price": 65, "enabled": true, "category": "extensions"},
    {"id": 2, "name": "Hybrid Lash Extensions", "description": "The perfect mix of classic and volume. Texture, depth, and a soft glam finish.", "duration": "90 min", "price": 75, "enabled": true, "category": "extensions"},
    {"id": 3, "name": "Volume Lash Extensions", "description": "Lightweight fans of 2–5 lashes per natural lash. Dramatic fullness, fluttery effect.", "duration": "120 min", "price": 90, "enabled": true, "category": "extensions"},
    {"id": 4, "name": "Mega Volume Lash Extensions", "description": "Ultra-dense fan clusters for maximum drama. Full, bold, show-stopping glam.", "duration": "150 min", "price": 110, "enabled": true, "category": "extensions"},
    {"id": 5, "name": "Lash Fill", "description": "Maintenance fill to keep your lashes full and fresh between full sets.", "duration": "45 min", "price": 40, "enabled": true, "category": "maintenance"},
    {"id": 6, "name": "Lash Lift", "description": "Perm your natural lashes for a gorgeous curl that lasts 6–8 weeks. No extensions needed.", "duration": "60 min", "price": 55, "enabled": true, "category": "maintenance"},
    {"id": 7, "name": "Lash Tint", "description": "Darken your natural lashes for added definition — perfect for those who skip mascara.", "duration": "30 min", "price": 25, "enabled": true, "category": "maintenance"},
    {"id": 8, "name": "Brow Wax + Tint Add-on", "description": "Shape and tint your brows to frame your face perfectly. Only available as an add-on to lash services.", "duration": "15 min", "price": 15, "enabled": true, "category": "addon"}
  ],
  "policies": {
    "booking": "A deposit may be required to confirm your appointment. You will receive a confirmation within 24 hours.",
    "cancellation": "Please provide at least 24 hours notice for any cancellations. Late cancellations may forfeit your deposit.",
    "late": "We kindly ask that you arrive on time. A grace period of 10 minutes may be extended — beyond that, your service time may be reduced.",
    "deposit": "Deposits are non-refundable but may be applied to a future booking within 30 days.",
    "aftercare": "Avoid getting your lashes wet for 24 hours after application. Do not use oil-based products near your eyes. Gently brush lashes daily with a spoolie.",
    "allergy": "Though rare, some clients may experience irritation or allergic reactions to lash adhesive. A patch test is available upon request."
  },
  "testimonials": [
    {"id": 1, "name": "Megan R.", "text": "Best lashes I've ever had! So natural looking and they lasted forever. Will never go anywhere else.", "rating": 5, "visible": true},
    {"id": 2, "name": "Jess T.", "text": "The hybrid set was exactly what I wanted — glamorous but not over the top. Love my tech!", "rating": 5, "visible": true},
    {"id": 3, "name": "Amanda K.", "text": "Finally a place that does volume lashes that don't feel heavy. So comfortable!", "rating": 5, "visible": true}
  ],
  "whyUs": [
    {"icon": "✨", "title": "Premium Products", "text": "We only use medical-grade adhesive and ethically sourced lash fibers."},
    {"icon": "💎", "title": "Impeccable Hygiene", "text": "Every tool is sanitized between clients. Your safety is non-negotiable."},
    {"icon": "🌸", "title": "Relaxed Studio", "text": "A calm, clean space designed to help you unwind during your appointment."},
    {"icon": "💖", "title": "Personalized Service", "text": "Every set is tailored to your eye shape, lifestyle, and desired level of drama."}
  ]
}'''

APP_JS = r'''const express = require("express");
const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");
const session = require("express-session");

const app = express();
const PORT = 3842;
const DB_PATH = path.join(__dirname, "data", "beautylashes.db");
const SITE_JSON = path.join(__dirname, "data", "site.json");

// Ensure directories
[path.join(__dirname,"data"), path.join(__dirname,"public","images","uploads")].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Init DB
const db = new Database(DB_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS admin (id INTEGER PRIMARY KEY, username TEXT, password TEXT, name TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS clients (id INTEGER PRIMARY KEY, name TEXT, phone TEXT, email TEXT, birthday TEXT, notes TEXT, tags TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS appointments (id INTEGER PRIMARY KEY, client_id INTEGER, name TEXT, phone TEXT, email TEXT, service TEXT, service_id INTEGER, date TEXT, time TEXT, notes TEXT, status TEXT DEFAULT 'new', admin_notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS leads (id INTEGER PRIMARY KEY, name TEXT, phone TEXT, email TEXT, message TEXT, status TEXT DEFAULT 'new', created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS gallery (id INTEGER PRIMARY KEY, caption TEXT, image TEXT, category TEXT, sort_order INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS services (id INTEGER PRIMARY KEY, name TEXT, description TEXT, duration TEXT, price REAL, enabled INTEGER DEFAULT 1, category TEXT);
  CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
`);

// Seed admin if not exists
const admin = db.prepare("SELECT * FROM admin LIMIT 1").get();
if (!admin) {
  const hash = require("bcryptjs").hashSync("BeautyLashes2024!", 10);
  db.prepare("INSERT INTO admin (username, password, name) VALUES (?, ?, ?)").run("admin", hash, "Beauty Lashes Admin");
}

// Seed settings
const biz = { name: "Beauty Lashes", phone: "+1 (780) 555-0100", email: "hello@beautylashes.ca", address: "Edmonton, Alberta", hours: "Tue-Sat: 9am - 6pm" };
Object.entries(biz).forEach(([k,v]) => {
  db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)").run(k, v);
});

// Load site JSON
let siteData = { business: {}, services: [], testimonials: [], whyUs: [], policies: {} };
try {
  const raw = fs.readFileSync(SITE_JSON, "utf8");
  siteData = JSON.parse(raw);
} catch(e) {}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "beauty-lashes-secret-2024", resave: false, saveUninitialized: false, cookie: { maxAge: 86400000 } }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Auth middleware
function requireAdmin(req, res, next) {
  if (req.session && req.session.admin) return next();
  res.redirect("/admin/login");
}

// ===== PUBLIC ROUTES =====

// Home
app.get("/", (req, res) => {
  res.render("pages/home", { site: siteData, page: "home" });
});

// Services
app.get("/services", (req, res) => {
  res.render("pages/services", { site: siteData, page: "services" });
});

// Booking
app.get("/booking", (req, res) => {
  res.render("pages/booking", { site: siteData, page: "booking" });
});

app.post("/booking", (req, res) => {
  const { name, phone, email, service, date, time, notes } = req.body;
  if (!name || !phone || !email || !service) {
    return res.json({ error: "Please fill in all required fields." });
  }
  db.prepare("INSERT INTO appointments (name, phone, email, service, date, time, notes, status) VALUES (?,?,?,?,?,?,?,'new')")
    .run(name, phone, email, service, date || "", time || "", notes || "");
  res.json({ success: true, message: "Your booking request has been received! We'll confirm shortly." });
});

// Gallery
app.get("/gallery", (req, res) => {
  const gallery = db.prepare("SELECT * FROM gallery ORDER BY sort_order ASC").all();
  res.render("pages/gallery", { site: siteData, gallery, page: "gallery" });
});

// About
app.get("/about", (req, res) => {
  res.render("pages/about", { site: siteData, page: "about" });
});

// Contact
app.get("/contact", (req, res) => {
  res.render("pages/contact", { site: siteData, page: "contact" });
});

app.post("/contact", (req, res) => {
  const { name, phone, email, message } = req.body;
  db.prepare("INSERT INTO leads (name, phone, email, message) VALUES (?,?,?,?)").run(name||"", phone||"", email||"", message||"");
  res.json({ success: true, message: "Thanks for reaching out! We'll get back to you soon." });
});

// Policies
app.get("/policies", (req, res) => {
  res.render("pages/policies", { site: siteData, page: "policies" });
});

// Admin login
app.get("/admin/login", (req, res) => {
  res.render("admin/login", { error: null });
});

app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare("SELECT * FROM admin WHERE username = ?").get(username);
  if (user && require("bcryptjs").compareSync(password, user.password)) {
    req.session.admin = { id: user.id, name: user.name };
    return res.redirect("/admin");
  }
  res.render("admin/login", { error: "Invalid credentials" });
});

app.get("/admin/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
});

// ===== ADMIN ROUTES =====
app.use("/admin", requireAdmin);

app.get("/admin", (req, res) => {
  const appointments = db.prepare("SELECT * FROM appointments ORDER BY created_at DESC LIMIT 10").all();
  const clients = db.prepare("SELECT * FROM clients ORDER BY created_at DESC LIMIT 5").all();
  const leads = db.prepare("SELECT * FROM leads WHERE status='new' ORDER BY created_at DESC").all();
  const stats = {
    today: appointments.filter(a => a.date === new Date().toISOString().split("T")[0]).length,
    pending: db.prepare("SELECT COUNT(*) as c FROM appointments WHERE status='new'").get().c,
    clients: db.prepare("SELECT COUNT(*) as c FROM clients").get().c,
    revenue: 0
  };
  res.render("admin/dashboard", { site: siteData, appointments, clients, leads, stats, page: "dashboard" });
});

// Clients
app.get("/admin/clients", (req, res) => {
  const clients = db.prepare("SELECT * FROM clients ORDER BY created_at DESC").all();
  res.render("admin/clients", { site: siteData, clients, page: "clients" });
});

app.post("/admin/clients", (req, res) => {
  const { name, phone, email, birthday, notes, tags } = req.body;
  db.prepare("INSERT INTO clients (name, phone, email, birthday, notes, tags) VALUES (?,?,?,?,?,?)")
    .run(name, phone, email, birthday||"", notes||"", tags||"");
  res.redirect("/admin/clients");
});

app.post("/admin/clients/:id/delete", (req, res) => {
  db.prepare("DELETE FROM clients WHERE id = ?").run(req.params.id);
  res.redirect("/admin/clients");
});

app.post("/admin/clients/:id/edit", (req, res) => {
  const { name, phone, email, birthday, notes, tags } = req.body;
  db.prepare("UPDATE clients SET name=?,phone=?,email=?,birthday=?,notes=?,tags=? WHERE id=?")
    .run(name, phone, email, birthday||"", notes||"", tags||"", req.params.id);
  res.redirect("/admin/clients");
});

// Appointments
app.get("/admin/appointments", (req, res) => {
  const appointments = db.prepare("SELECT * FROM appointments ORDER BY date ASC").all();
  res.render("admin/appointments", { site: siteData, appointments, page: "appointments" });
});

app.post("/admin/appointments/:id/status", (req, res) => {
  const { status, admin_notes } = req.body;
  db.prepare("UPDATE appointments SET status=?, admin_notes=? WHERE id=?")
    .run(status, admin_notes||"", req.params.id);
  res.redirect("/admin/appointments");
});

// Leads
app.get("/admin/leads", (req, res) => {
  const leads = db.prepare("SELECT * FROM leads ORDER BY created_at DESC").all();
  res.render("admin/leads", { site: siteData, leads, page: "leads" });
});

app.post("/admin/leads/:id/status", (req, res) => {
  db.prepare("UPDATE leads SET status=? WHERE id=?").run(req.body.status, req.params.id);
  res.redirect("/admin/leads");
});

// Gallery admin
app.get("/admin/gallery", (req, res) => {
  const gallery = db.prepare("SELECT * FROM gallery ORDER BY sort_order ASC").all();
  res.render("admin/gallery", { site: siteData, gallery, page: "gallery" });
});

app.post("/admin/gallery/delete/:id", (req, res) => {
  const img = db.prepare("SELECT image FROM gallery WHERE id=?").get(req.params.id);
  if (img) {
    try { fs.unlinkSync(path.join(__dirname,"public","images","uploads",img.image)); } catch(e) {}
    db.prepare("DELETE FROM gallery WHERE id=?").run(req.params.id);
  }
  res.redirect("/admin/gallery");
});

// Services admin
app.get("/admin/services", (req, res) => {
  const services = db.prepare("SELECT * FROM services ORDER BY id ASC").all();
  res.render("admin/services", { site: siteData, services, page: "services" });
});

app.post("/admin/services/:id/toggle", (req, res) => {
  const svc = db.prepare("SELECT enabled FROM services WHERE id=?").get(req.params.id);
  db.prepare("UPDATE services SET enabled=? WHERE id=?").run(svc.enabled ? 0 : 1, req.params.id);
  res.redirect("/admin/services");
});

app.post("/admin/services/:id/edit", (req, res) => {
  const { name, description, duration, price } = req.body;
  db.prepare("UPDATE services SET name=?,description=?,duration=?,price=? WHERE id=?")
    .run(name, description||"", duration||"", parseFloat(price)||0, req.params.id);
  res.redirect("/admin/services");
});

app.post("/admin/services/add", (req, res) => {
  const { name, description, duration, price } = req.body;
  db.prepare("INSERT INTO services (name, description, duration, price) VALUES (?,?,?,?)")
    .run(name, description||"", duration||"", parseFloat(price)||0);
  res.redirect("/admin/services");
});

// Settings
app.get("/admin/settings", (req, res) => {
  const rows = db.prepare("SELECT * FROM settings").all();
  const settings = {};
  rows.forEach(r => { settings[r.key] = r.value; });
  res.render("admin/settings", { site: siteData, settings, page: "settings" });
});

app.post("/admin/settings", (req, res) => {
  const entries = Object.entries(req.body);
  entries.forEach(([k,v]) => {
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run(k, v);
  });
  // Reload site data
  try {
    siteData = JSON.parse(fs.readFileSync(SITE_JSON, "utf8"));
  } catch(e) {}
  res.redirect("/admin/settings");
});

// Gallery upload (simple — needs multer)
const multer = require("multer");
const uploadDir = path.join(__dirname, "public", "images", "uploads");
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) return cb(null, true);
    cb(new Error("Images only"));
  }
});

app.post("/admin/gallery/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.redirect("/admin/gallery");
  const caption = req.body.caption || "";
  const category = req.body.category || "general";
  db.prepare("INSERT INTO gallery (caption, image, category) VALUES (?,?,?)")
    .run(caption, req.file.filename, category);
  res.redirect("/admin/gallery");
});

app.listen(PORT, () => {
  console.log("BeautyLashes running on port " + PORT);
});
'''

print("Build script ready — will write all files on server")
print(f"Base: {BASE}")