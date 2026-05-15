const express = require("express");
const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");
const session = require("express-session");

const app = express();
const PORT = 3842;
const BASE = "/var/www/lashes.3nd.dev";
const DB_PATH = path.join(BASE, "data", "beautylashes.db");
const SITE_JSON = path.join(BASE, "data", "site.json");

[path.join(BASE,"data"), path.join(BASE,"public","images","uploads")].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

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

const adminExists = db.prepare("SELECT id FROM admin LIMIT 1").get();
if (!adminExists) {
  const hash = require("bcryptjs").hashSync("BeautyLashes2024!", 10);
  db.prepare("INSERT INTO admin (username, password, name) VALUES (?, ?, ?)").run("admin", hash, "Beauty Lashes Admin");
}

const defaultSettings = { name: "Beauty Lashes", phone: "+1 (780) 555-0100", email: "hello@beautylashes.ca", address: "Edmonton, Alberta", hours: "Tue-Sat: 9am - 6pm" };
Object.entries(defaultSettings).forEach(([k,v]) => {
  db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)").run(k, v);
});

let siteData = { business: {}, services: [], testimonials: [], whyUs: [], policies: {} };
try {
  siteData = JSON.parse(fs.readFileSync(SITE_JSON, "utf8"));
  const rows = db.prepare("SELECT * FROM settings").all();
  rows.forEach(r => { siteData.business[r.key] = r.value; });
} catch(e) {}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "beauty-lashes-secret-2024", resave: false, saveUninitialized: false, cookie: { maxAge: 86400000 } }));
app.use(express.static(path.join(BASE, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(BASE, "views"));

function requireAdmin(req, res, next) {
  if (req.session && req.session.admin) return next();
  res.redirect("/admin/login");
}

app.get("/", (req, res) => res.render("pages/home", { site: siteData, page: "home" }));
app.get("/services", (req, res) => res.render("pages/services", { site: siteData, page: "services" }));
app.get("/booking", (req, res) => res.render("pages/booking", { site: siteData, page: "booking" }));
app.get("/gallery", (req, res) => {
  const gallery = db.prepare("SELECT * FROM gallery ORDER BY sort_order ASC").all();
  res.render("pages/gallery", { site: siteData, gallery, page: "gallery" });
});
app.get("/about", (req, res) => res.render("pages/about", { site: siteData, page: "about" }));
app.get("/contact", (req, res) => res.render("pages/contact", { site: siteData, page: "contact" }));
app.get("/policies", (req, res) => res.render("pages/policies", { site: siteData, page: "policies" }));

app.post("/booking", (req, res) => {
  const { name, phone, email, service, date, time, notes } = req.body;
  if (!name || !phone || !email || !service) return res.json({ error: "Required fields missing." });
  db.prepare("INSERT INTO appointments (name, phone, email, service, date, time, notes, status) VALUES (?,?,?,?,?,?,?,'new')").run(name, phone, email, service, date||"", time||"", notes||"");
  res.json({ success: true, message: "Booking request received! We'll confirm shortly." });
});

app.post("/contact", (req, res) => {
  const { name, phone, email, message } = req.body;
  db.prepare("INSERT INTO leads (name, phone, email, message) VALUES (?,?,?,?)").run(name||"", phone||"", email||"", message||"");
  res.json({ success: true, message: "Thanks for reaching out! We'll get back to you soon." });
});

app.get("/admin/login", (req, res) => res.render("admin/login", { error: null }));
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare("SELECT * FROM admin WHERE username = ?").get(username);
  if (user && require("bcryptjs").compareSync(password, user.password)) {
    req.session.admin = { id: user.id, name: user.name };
    return res.redirect("/admin");
  }
  res.render("admin/login", { error: "Invalid credentials" });
});
app.get("/admin/logout", (req, res) => { req.session.destroy(); res.redirect("/admin/login"); });

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

app.get("/admin/clients", (req, res) => {
  const clients = db.prepare("SELECT * FROM clients ORDER BY created_at DESC").all();
  res.render("admin/clients", { site: siteData, clients, page: "clients" });
});

app.post("/admin/clients", (req, res) => {
  const { name, phone, email, birthday, notes, tags } = req.body;
  db.prepare("INSERT INTO clients (name, phone, email, birthday, notes, tags) VALUES (?,?,?,?,?,?)").run(name||"", phone||"", email||"", birthday||"", notes||"", tags||"");
  res.redirect("/admin/clients");
});

app.post("/admin/clients/:id/delete", (req, res) => {
  db.prepare("DELETE FROM clients WHERE id = ?").run(req.params.id);
  res.redirect("/admin/clients");
});

app.get("/admin/appointments", (req, res) => {
  const appointments = db.prepare("SELECT * FROM appointments ORDER BY date ASC").all();
  res.render("admin/appointments", { site: siteData, appointments, page: "appointments" });
});

app.post("/admin/appointments/:id/status", (req, res) => {
  const { status, admin_notes } = req.body;
  db.prepare("UPDATE appointments SET status=?, admin_notes=? WHERE id=?").run(status, admin_notes||"", req.params.id);
  res.redirect("/admin/appointments");
});

app.get("/admin/leads", (req, res) => {
  const leads = db.prepare("SELECT * FROM leads ORDER BY created_at DESC").all();
  res.render("admin/leads", { site: siteData, leads, page: "leads" });
});

app.post("/admin/leads/:id/status", (req, res) => {
  db.prepare("UPDATE leads SET status=? WHERE id=?").run(req.body.status, req.params.id);
  res.redirect("/admin/leads");
});

app.get("/admin/gallery", (req, res) => {
  const gallery = db.prepare("SELECT * FROM gallery ORDER BY sort_order ASC").all();
  res.render("admin/gallery", { site: siteData, gallery, page: "gallery" });
});

app.get("/admin/services", (req, res) => {
  const services = db.prepare("SELECT * FROM services ORDER BY id ASC").all();
  res.render("admin/services", { site: siteData, services, page: "services" });
});

app.post("/admin/services/add", (req, res) => {
  const { name, description, duration, price } = req.body;
  db.prepare("INSERT INTO services (name, description, duration, price) VALUES (?,?,?,?)").run(name||"", description||"", duration||"", parseFloat(price)||0);
  res.redirect("/admin/services");
});

app.post("/admin/services/:id/edit", (req, res) => {
  const { name, description, duration, price } = req.body;
  db.prepare("UPDATE services SET name=?,description=?,duration=?,price=? WHERE id=?").run(name||"", description||"", duration||"", parseFloat(price)||0, req.params.id);
  res.redirect("/admin/services");
});

app.post("/admin/services/:id/toggle", (req, res) => {
  const svc = db.prepare("SELECT enabled FROM services WHERE id=?").get(req.params.id);
  db.prepare("UPDATE services SET enabled=? WHERE id=?").run(svc.enabled ? 0 : 1, req.params.id);
  res.redirect("/admin/services");
});

app.get("/admin/settings", (req, res) => {
  const rows = db.prepare("SELECT * FROM settings").all();
  const settings = {};
  rows.forEach(r => { settings[r.key] = r.value; });
  res.render("admin/settings", { site: siteData, settings, page: "settings" });
});

app.post("/admin/settings", (req, res) => {
  Object.entries(req.body).forEach(([k,v]) => {
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run(k, v);
  });
  res.redirect("/admin/settings");
});

const multer = require("multer");
const upload = multer({
  dest: path.join(BASE, "public", "images", "uploads"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) return cb(null, true);
    cb(new Error("Images only"));
  }
});

app.post("/admin/gallery/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.redirect("/admin/gallery");
  db.prepare("INSERT INTO gallery (caption, image, category) VALUES (?,?,?)").run(req.body.caption||"", req.file.filename, req.body.category||"general");
  res.redirect("/admin/gallery");
});

app.post("/admin/gallery/delete/:id", (req, res) => {
  const img = db.prepare("SELECT image FROM gallery WHERE id=?").get(req.params.id);
  if (img) {
    try { fs.unlinkSync(path.join(BASE, "public", "images", "uploads", img.image)); } catch(e) {}
    db.prepare("DELETE FROM gallery WHERE id=?").run(req.params.id);
  }
  res.redirect("/admin/gallery");
});

app.listen(PORT, () => {
  console.log("BeautyLashes running on port " + PORT);
});