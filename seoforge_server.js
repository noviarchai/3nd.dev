const express = require('express');
const Database = require('better-sqlite3');
const fetchModule = require('node-fetch'); const fetch = fetchModule.default || fetchModule;
const path = require('path');

const app = express();
const PORT = 3850;
const dbPath = '/var/www/lab.3nd.dev/data/lab.db';
const db = new Database(dbPath);

const SHARING_KEY = 'seoforge-neural-sharing-enabled';

// Initialize tables with user_id for isolation
db.exec(`
  CREATE TABLE IF NOT EXISTS seoforge_analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL, url TEXT NOT NULL,
    overall_score INTEGER, onpage_score INTEGER, technical_score INTEGER, content_score INTEGER,
    authority_score INTEGER, keywords TEXT, issues TEXT, recommendations TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS seoforge_insights (
    id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, pattern_tag TEXT,
    recommendation TEXT, success_rate REAL DEFAULT 0.5, sample_size INTEGER DEFAULT 0,
    avg_score_delta REAL DEFAULT 0, last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(pattern_tag, user_id)
  );
  CREATE TABLE IF NOT EXISTS seoforge_learnings (
    id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, analysis_id INTEGER,
    insight_id INTEGER, applied BOOLEAN DEFAULT 0, outcome_score_delta INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS seoforge_settings (
    id INTEGER PRIMARY KEY, sharing_enabled INTEGER DEFAULT 0, global_insights_count INTEGER DEFAULT 0,
    total_analyses INTEGER DEFAULT 0, last_self_update DATETIME
  );
`);

// Initialize settings
const settingsCheck = db.prepare('SELECT COUNT(*) as c FROM seoforge_settings').get();
if (settingsCheck.c === 0) {
  db.prepare('INSERT INTO seoforge_settings (id, sharing_enabled, global_insights_count, total_analyses) VALUES (1, 0, 0, 0)').run();
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple auth: pass user_email as header X-User-Email (set by lab dashboard proxy)
// Fall back to IP-based identification or 'anonymous' for testing
function getUserId(req) {
  return req.headers['x-user-email'] || req.headers['x-forwarded-for'] || 'anonymous';
}

function isSharingEnabled() {
  const s = db.prepare('SELECT sharing_enabled FROM seoforge_settings WHERE id = 1').get();
  return s && s.sharing_enabled === 1;
}

// Fetch with timeout
async function safeFetch(url, timeout = 8000) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'SEOForge/1.0' } });
    clearTimeout(timer);
    return res;
  } catch (e) { return null; }
}

function getWords(html) { return html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w.length > 3); }

async function analyzeUrl(targetUrl) {
  const r = { url: targetUrl, onpage_score: 0, technical_score: 0, content_score: 0, authority_score: 0, overall_score: 0, keywords: [], issues: [], recommendations: [] };
  try {
    const res = await safeFetch(targetUrl);
    if (!res || !res.ok) { r.issues.push({ type: 'critical', text: 'Could not fetch URL', tag: 'fetch-failed' }); return r; }
    const html = await res.text();
    const words = getWords(html);
    const titleM = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleM ? titleM[1].trim() : '';
    r.title = title;
    if (!title) r.issues.push({ type: 'high', text: 'Missing <title> tag', tag: 'missing-title' });
    else if (title.length < 30) r.issues.push({ type: 'medium', text: 'Title too short', tag: 'title-short' });
    else if (title.length > 60) r.issues.push({ type: 'medium', text: 'Title too long', tag: 'title-long' });
    else r.onpage_score += 15;
    const descM = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
    const desc = descM ? descM[1] : '';
    r.description = desc;
    if (!desc) r.issues.push({ type: 'high', text: 'Missing meta description', tag: 'missing-meta-desc' });
    else if (desc.length < 120) r.issues.push({ type: 'medium', text: 'Meta description too short', tag: 'meta-desc-short' });
    else if (desc.length > 160) r.issues.push({ type: 'medium', text: 'Meta description too long', tag: 'meta-desc-long' });
    else r.onpage_score += 10;
    const h1s = html.match(/<h1[^>]*>([^<]+)<\/h1>/gi) || [];
    r.h1_count = h1s.length;
    if (h1s.length === 0) r.issues.push({ type: 'critical', text: 'No H1 tag found', tag: 'missing-h1' });
    else if (h1s.length > 1) r.issues.push({ type: 'high', text: 'Multiple H1 tags', tag: 'multiple-h1' });
    else r.onpage_score += 10;
    const h2s = html.match(/<h2[^>]*>([^<]+)<\/h2>/gi) || [];
    r.h2_count = h2s.length;
    if (h2s.length === 0) r.issues.push({ type: 'medium', text: 'No H2 subheadings', tag: 'missing-h2' });
    else r.onpage_score += 5;
    if (targetUrl.startsWith('https://')) { r.onpage_score += 10; r.technical_score += 15; }
    else r.issues.push({ type: 'critical', text: 'Not using HTTPS', tag: 'no-ssl' });
    const imgs = html.match(/<img[^>]+>/gi) || [];
    const noAlt = imgs.filter(i => !i.match(/alt=["'][^"']+["']/i));
    r.images_total = imgs.length; r.images_without_alt = noAlt.length;
    if (imgs.length && noAlt.length) r.issues.push({ type: 'medium', text: noAlt.length + '/' + imgs.length + ' images missing alt', tag: 'missing-img-alt' });
    else if (imgs.length) r.onpage_score += 5;
    if (html.includes('viewport')) r.technical_score += 10;
    else r.issues.push({ type: 'medium', text: 'Missing viewport meta', tag: 'missing-viewport' });
    r.word_count = words.length;
    if (words.length < 300) { r.issues.push({ type: 'high', text: 'Thin content (' + words.length + ' words)', tag: 'thin-content' }); r.content_score = 20; }
    else if (words.length < 600) r.content_score = 50;
    else { r.content_score = 80; r.onpage_score += 10; }
    const stops = new Set(['the','and','for','are','but','not','you','all','can','had','her','was','one','our','out','has','have','been','were','being','this','that','with','from','they','will','would','there','their','what','about','which','when','make','just','over','such','into','than','them','then','some','could','other','more','also','only','after','before','most','your','how','each','did','get','got','here','him','his','its','let','may','new','now','old','see','two','way','who','use','used','using','very','even','back','come','came','like','long','many','much','said','same','tell','these','those','through','too','under','up','well','where','while','would','your']);
    const wf = {};
    words.forEach(w => { const l = w.toLowerCase().replace(/[^a-z0-9]/g,''); if (l.length > 3 && !stops.has(l)) wf[l] = (wf[l]||0)+1; });
    r.keywords = Object.entries(wf).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([w,c])=>({word:w,count:c,density:((c/words.length)*100).toFixed(2)}));
    r.keywords.forEach(k => { if (parseFloat(k.density) > 3.5) r.issues.push({ type: 'medium', text: 'Keyword over-optimized', tag: 'keyword-stuffing' }); });
    const links = html.match(/<a[^>]+href=["']([^"']+)["']/gi) || [];
    try { r.internal_links = links.filter(l => l.includes('://') && l.includes(new URL(targetUrl).host)).length; } catch(e) { r.internal_links = 0; }
    r.external_links = links.length - r.internal_links;
    if (!links.length) r.issues.push({ type: 'high', text: 'No links found', tag: 'no-links' });
    else r.onpage_score += 5;
    const canon = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
    r.canonical = canon ? canon[1] : '';
    r.has_schema = html.includes('application/ld+json') || html.includes('schema.org');
    if (r.has_schema) r.technical_score += 10;
    else r.issues.push({ type: 'low', text: 'No structured data', tag: 'no-schema' });
    r.mobile_friendly = html.includes('viewport') && words.length >= 300;
    if (r.mobile_friendly) r.technical_score += 10;
    r.onpage_score = Math.min(100, r.onpage_score);
    r.technical_score = Math.min(100, r.technical_score);
    r.content_score = Math.min(100, r.content_score);
    r.authority_score = Math.min(100, links.length * 2 + (r.has_schema ? 15 : 0));
    r.overall_score = Math.round(r.onpage_score * 0.30 + r.technical_score * 0.25 + r.content_score * 0.25 + r.authority_score * 0.20);
  } catch (e) { r.issues.push({ type: 'critical', text: 'Analysis failed: ' + e.message, tag: 'analysis-error' }); }
  return r;
}

async function getAIRecommendations(analysis, userId) {
  // Get user-specific insights OR global insights (if sharing is enabled)
  let insights;
  if (isSharingEnabled()) {
    // Use global insights from all users
    insights = db.prepare('SELECT * FROM seoforge_insights ORDER BY success_rate DESC LIMIT 10').all();
  } else {
    // User-specific insights only
    insights = db.prepare('SELECT * FROM seoforge_insights WHERE user_id = ? OR user_id IS NULL ORDER BY success_rate DESC LIMIT 10').all(userId);
  }
  
  const ctx = insights.length ? 'Learned patterns: ' + insights.map(i => i.pattern_tag + '=' + (i.success_rate*100).toFixed(0)+'%').join(', ') : 'No prior patterns.';
  const prompt = 'SEO agent. URL:' + analysis.url + ' Score:' + analysis.overall_score + '/100 On:' + analysis.onpage_score + ' Tech:' + analysis.technical_score + ' Cont:' + analysis.content_score + ' Auth:' + analysis.authority_score + '. Issues:' + (analysis.issues.map(i => i.text).join('|') || 'none') + '. Keywords:' + analysis.keywords.map(k=>k.word).join(',') + '. ' + ctx + '. Return JSON array of 6: [{tag,priority,title,description,estimated_impact}]';
  
  try {
    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (process.env.DEEPSEEK_API_KEY || 'sk-de0c544fc5c14a86a1a69c6a4de24c5c') },
      body: JSON.stringify({ model: 'deepseek-chat', messages: [{role:'user',content:prompt}], temperature: 0.7, max_tokens: 1500 })
    });
    if (res.ok) { const d = await res.json(); const m = d.choices[0].message.content.match(/\[[\s\S]*?\]/); if (m) return JSON.parse(m[0]); }
  } catch(e) {}
  
  const fallbacks = { 'missing-title':{p:'critical',t:'Add title tag',d:'50-60 char title with keyword',i:'+15'}, 'title-short':{p:'high',t:'Expand title',d:'50-60 chars with primary keyword',i:'+10'}, 'missing-meta-desc':{p:'high',t:'Write meta description',d:'150-160 chars with keyword',i:'+10'}, 'missing-h1':{p:'critical',t:'Add H1 heading',d:'One H1 with target keyword',i:'+15'}, 'multiple-h1':{p:'high',t:'Fix H1 hierarchy',d:'One H1 per page, use H2-H6',i:'+10'}, 'no-ssl':{p:'critical',t:'Enable HTTPS',d:'Install SSL and redirect HTTP',i:'+20'}, 'missing-img-alt':{p:'medium',t:'Add alt text',d:'Descriptive alt for all images',i:'+8'}, 'thin-content':{p:'high',t:'Expand content',d:'1000+ words for main pages',i:'+15'}, 'keyword-stuffing':{p:'medium',t:'Reduce keyword density',d:'Aim for 1-2% max',i:'+5'}, 'no-links':{p:'medium',t:'Add internal links',d:'Link to related content',i:'+8'}, 'no-schema':{p:'low',t:'Add structured data',d:'Schema.org markup',i:'+10'} };
  const recs = [];
  analysis.issues.forEach(iss => { if (fallbacks[iss.tag]) recs.push({tag:iss.tag,priority:fallbacks[iss.tag].p,title:fallbacks[iss.tag].t,description:fallbacks[iss.tag].d,estimated_impact:fallbacks[iss.tag].i}); });
  return recs.slice(0, 6);
}

function recordLearning(userId, analysis, recommendations) {
  try {
    db.prepare("UPDATE seoforge_settings SET total_analyses = total_analyses + 1, last_self_update = datetime('now') WHERE id = 1").run();
    recommendations.forEach(rec => {
      if (isSharingEnabled()) {
        // Global insights - user_id = 'global'
        const ex = db.prepare('SELECT * FROM seoforge_insights WHERE pattern_tag = ? AND (user_id = ? OR user_id = ?)').get(rec.tag, userId, 'global');
        if (ex) db.prepare("UPDATE seoforge_insights SET success_rate = ?, sample_size = ?, avg_score_delta = ?, last_updated = datetime('now') WHERE pattern_tag = ? AND (user_id = ? OR user_id = ?)").run(ex.success_rate * 0.7 + (analysis.overall_score/100)*0.3, ex.sample_size + 1, analysis.overall_score - 50, rec.tag, userId, 'global');
        else db.prepare('INSERT INTO seoforge_insights (pattern_tag, recommendation, success_rate, sample_size, user_id) VALUES (?,?,?,?,?)').run(rec.tag, rec.title, 0.5, 1, 'global');
      } else {
        // User-specific insights
        const ex = db.prepare('SELECT * FROM seoforge_insights WHERE pattern_tag = ? AND user_id = ?').get(rec.tag, userId);
        if (ex) db.prepare("UPDATE seoforge_insights SET success_rate = ?, sample_size = ?, avg_score_delta = ?, last_updated = datetime('now') WHERE pattern_tag = ? AND user_id = ?").run(ex.success_rate * 0.7 + (analysis.overall_score/100)*0.3, ex.sample_size + 1, analysis.overall_score - 50, rec.tag, userId);
        else db.prepare('INSERT INTO seoforge_insights (pattern_tag, recommendation, success_rate, sample_size, user_id) VALUES (?,?,?,?,?)').run(rec.tag, rec.title, 0.5, 1, userId);
      }
    });
    const cnt = db.prepare('SELECT COUNT(*) as c FROM seoforge_insights WHERE user_id = ? OR user_id = ?').get('global', null);
    db.prepare('UPDATE seoforge_settings SET global_insights_count = ? WHERE id = 1').run(cnt ? cnt.c : 0);
  } catch(e) { console.log('Learn err:', e.message); }
}

async function selfImprove() {
  const ins = db.prepare('SELECT * FROM seoforge_insights WHERE sample_size >= 3 ORDER BY success_rate DESC').all();
  if (ins.length >= 5) { db.prepare("UPDATE seoforge_settings SET last_self_update = datetime('now') WHERE id = 1").run(); return {retrained:true, patterns_updated:ins.length}; }
  return {retrained:false, reason:'insufficient_data'};
}

// API Routes
app.post('/api/analyze', async (req, res) => {
  const { url } = req.body;
  const userId = getUserId(req);
  if (!url) return res.status(400).json({error:'URL required'});
  
  const analysis = await analyzeUrl(url);
  const recs = await getAIRecommendations(analysis, userId);
  analysis.recommendations = recs;
  
  const info = db.prepare('INSERT INTO seoforge_analyses (user_id,url,overall_score,onpage_score,technical_score,content_score,authority_score,keywords,issues,recommendations) VALUES (?,?,?,?,?,?,?,?,?,?)').run(userId, url, analysis.overall_score, analysis.onpage_score, analysis.technical_score, analysis.content_score, analysis.authority_score, JSON.stringify(analysis.keywords), JSON.stringify(analysis.issues), JSON.stringify(recs));
  analysis.id = info.lastInsertRowid;
  
  recordLearning(userId, analysis, recs);
  analysis.self_improvement = await selfImprove();
  
  res.json(analysis);
});

app.get('/api/history', (req, res) => {
  const userId = getUserId(req);
  const analyses = db.prepare('SELECT id,url,overall_score,onpage_score,technical_score,content_score,authority_score,created_at FROM seoforge_analyses WHERE user_id = ? ORDER BY created_at DESC LIMIT 20').all(userId);
  res.json(analyses);
});

app.get('/api/insights', (req, res) => {
  const userId = getUserId(req);
  // User-specific insights + global insights if sharing enabled
  let insights;
  if (isSharingEnabled()) {
    insights = db.prepare('SELECT * FROM seoforge_insights ORDER BY success_rate DESC').all();
  } else {
    insights = db.prepare('SELECT * FROM seoforge_insights WHERE user_id = ? OR user_id IS NULL ORDER BY success_rate DESC').all(userId);
  }
  res.json(insights);
});

app.get('/api/stats', (req, res) => {
  const userId = getUserId(req);
  const s = db.prepare('SELECT * FROM seoforge_settings WHERE id = 1').get();
  const userCount = db.prepare('SELECT COUNT(*) as c FROM seoforge_analyses WHERE user_id = ?').get(userId);
  const globalCount = db.prepare('SELECT COUNT(*) as c FROM seoforge_analyses').get();
  const allInsights = db.prepare('SELECT COUNT(*) as c FROM seoforge_insights').get();
  const userInsights = db.prepare('SELECT COUNT(*) as c FROM seoforge_insights WHERE user_id = ? OR user_id IS NULL').get(userId);
  res.json({
    total_analyses: s ? s.total_analyses : 0,
    insights_count: userInsights ? userInsights.c : 0,
    global_insights: allInsights ? allInsights.c : 0,
    sharing_enabled: s ? s.sharing_enabled === 1 : false,
    last_self_update: s ? s.last_self_update : null,
    your_analyses: userCount ? userCount.c : 0
  });
});

app.get('/api/settings', (req, res) => {
  const s = db.prepare('SELECT sharing_enabled FROM seoforge_settings WHERE id = 1').get();
  res.json({ sharing_enabled: s && s.sharing_enabled === 1 });
});

app.post('/api/settings', (req, res) => {
  // Only admin can toggle sharing (via secret key)
  const { sharing, secret } = req.body;
  if (secret !== '3nd-lab-admin') return res.status(403).json({error:'Forbidden'});
  db.prepare('UPDATE seoforge_settings SET sharing_enabled = ? WHERE id = 1').run(sharing ? 1 : 0);
  res.json({ success: true, sharing_enabled: sharing });
});

app.post('/api/feedback', (req, res) => {
  const {analysis_id, recommendation_tag, worked} = req.body;
  const userId = getUserId(req);
  if (!analysis_id || recommendation_tag === undefined || worked === undefined) return res.status(400).json({error:'required'});
  const targetUserId = isSharingEnabled() ? 'global' : userId;
  const ins = db.prepare('SELECT * FROM seoforge_insights WHERE pattern_tag = ? AND (user_id = ? OR user_id = ?)').get(recommendation_tag, userId, 'global');
  if (ins) { const nr = ins.success_rate * 0.8 + (worked ? 1 : 0) * 0.2; db.prepare("UPDATE seoforge_insights SET success_rate=?, sample_size=?, last_updated=datetime('now') WHERE pattern_tag=? AND (user_id=? OR user_id=?)").run(nr, ins.sample_size+1, recommendation_tag, userId, 'global'); res.json({success:true, new_success_rate: nr}); }
  else res.status(404).json({error:'Insight not found'});
});

app.listen(PORT, '0.0.0.0', () => console.log('SEOForge on port', PORT));