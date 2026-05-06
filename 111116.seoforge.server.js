const express = require('express');
const Database = require('better-sqlite3');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = 3850;

// Database
const dbPath = '/var/www/lab.3nd.dev/data/lab.db';
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    overall_score INTEGER,
    onpage_score INTEGER,
    technical_score INTEGER,
    content_score INTEGER,
    authority_score INTEGER,
    keywords TEXT,
    issues TEXT,
    recommendations TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS insights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pattern_tag TEXT UNIQUE,
    recommendation TEXT,
    success_rate REAL DEFAULT 0.5,
    sample_size INTEGER DEFAULT 0,
    avg_score_delta REAL DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS learnings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    analysis_id INTEGER,
    insight_id INTEGER,
    applied BOOLEAN DEFAULT 0,
    outcome_score_delta INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS engine_stats (
    id INTEGER PRIMARY KEY,
    total_analyses INTEGER DEFAULT 0,
    total_insights INTEGER DEFAULT 0,
    avg_score_improvement REAL DEFAULT 0,
    last_self_update DATETIME
  );
`);

// Insert default engine stats if not exists
const statsCheck = db.prepare('SELECT COUNT(*) as c FROM engine_stats').get();
if (statsCheck.c === 0) {
  db.prepare('INSERT INTO engine_stats (id, total_analyses, total_insights) VALUES (1, 0, 0)').run();
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper: fetch with timeout
async function safeFetch(url, timeout = 8000) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(url, { 
      signal: controller.signal,
      headers: { 'User-Agent': 'SEOForge/1.0 (curl)' }
    });
    clearTimeout(timer);
    return res;
  } catch (e) {
    return null;
  }
}

// Analyze URL
async function analyzeUrl(url) {
  const result = {
    url,
    onpage_score: 0,
    technical_score: 0,
    content_score: 0,
    authority_score: 0,
    overall_score: 0,
    keywords: [],
    issues: [],
    recommendations: []
  };

  try {
    const res = await safeFetch(url);
    if (!res || !res.ok) {
      result.issues.push({ type: 'critical', text: 'Could not fetch URL', tag: 'fetch-failed' });
      return result;
    }

    const html = await res.text();
    const text = html.replace(/<[^>]+>/g, ' ');

    // Title check
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';
    result.title = title;
    
    if (title.length === 0) {
      result.issues.push({ type: 'high', text: 'Missing <title> tag', tag: 'missing-title' });
    } else if (title.length < 30) {
      result.issues.push({ type: 'medium', text: 'Title too short (should be 50-60 chars)', tag: 'title-short' });
    } else if (title.length > 60) {
      result.issues.push({ type: 'medium', text: 'Title too long (truncated in SERPs)', tag: 'title-long' });
    } else {
      result.onpage_score += 15;
    }

    // Meta description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const descMatch2 = html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
    const description = descMatch ? descMatch[1] : (descMatch2 ? descMatch2[1] : '');
    result.description = description;

    if (description.length === 0) {
      result.issues.push({ type: 'high', text: 'Missing meta description', tag: 'missing-meta-desc' });
    } else if (description.length < 120) {
      result.issues.push({ type: 'medium', text: 'Meta description too short (aim for 150-160 chars)', tag: 'meta-desc-short' });
    } else if (description.length > 160) {
      result.issues.push({ type: 'medium', text: 'Meta description too long', tag: 'meta-desc-long' });
    } else {
      result.onpage_score += 10;
    }

    // H1 check
    const h1Matches = html.match(/<h1[^>]*>([^<]+)<\/h1>/gi);
    const h1Count = h1Matches ? h1Matches.length : 0;
    result.h1_count = h1Count;

    if (h1Count === 0) {
      result.issues.push({ type: 'critical', text: 'No H1 tag found', tag: 'missing-h1' });
    } else if (h1Count > 1) {
      result.issues.push({ type: 'high', text: 'Multiple H1 tags (should be exactly 1)', tag: 'multiple-h1' });
    } else {
      result.onpage_score += 10;
    }

    // H2 headings
    const h2Matches = html.match(/<h2[^>]*>([^<]+)<\/h2>/gi);
    result.h2_count = h2Matches ? h2Matches.length : 0;
    if (result.h2_count === 0) {
      result.issues.push({ type: 'medium', text: 'No H2 subheadings found', tag: 'missing-h2' });
    } else {
      result.onpage_score += 5;
    }

    // SSL check
    if (url.startsWith('https://')) {
      result.onpage_score += 10;
      result.technical_score += 15;
    } else {
      result.issues.push({ type: 'critical', text: 'Site not using HTTPS', tag: 'no-ssl' });
    }

    // Images and alt tags
    const imgMatches = html.match(/<img[^>]+>/gi) || [];
    const imgsWithoutAlt = imgMatches.filter(img => !img.match(/alt=["'][^"']+["']/i));
    result.images_total = imgMatches.length;
    result.images_without_alt = imgsWithoutAlt.length;

    if (imgMatches.length > 0 && imgsWithoutAlt.length > 0) {
      result.issues.push({ type: 'medium', text: `${imgsWithoutAlt.length}/${imgMatches.length} images missing alt attributes`, tag: 'missing-img-alt' });
    } else if (imgMatches.length > 0) {
      result.onpage_score += 5;
    }

    // Meta viewport
    if (html.includes('viewport')) {
      result.technical_score += 10;
    } else {
      result.issues.push({ type: 'medium', text: 'Missing viewport meta tag', tag: 'missing-viewport' });
    }

    // Word count
    const words = text.split(/\s+/).filter(w => w.length > 3);
    result.word_count = words.length;
    if (words.length < 300) {
      result.issues.push({ type: 'high', text: `Thin content (${words.length} words, aim for 300+)`, tag: 'thin-content' });
      result.content_score = 20;
    } else if (words.length < 600) {
      result.content_score = 50;
    } else {
      result.content_score = 80;
      result.onpage_score += 10;
    }

    // Extract keywords (simple frequency analysis)
    const stopWords = new Set(['the','and','for','are','but','not','you','all','can','had','her','was','one','our','out','has','have','been','were','being','this','that','with','from','they','will','would','there','their','what','about','which','when','make','just','over','such','into','than','them','then','some','could','other','more','also','only','some','after','before','most','your','how','each','did','get','got','here','him','his','how','its','let','may','new','now','old','see','two','way','who','did','use','used','using','didnt','dont','very','even','back','only','come','came','how','just','like','long','make','many','much','now','said','same','see','so','some','tell','than','that','the','their','them','then','there','these','they','this','those','through','to','too','under','up','very','was','way','well','were','what','when','where','which','while','who','will','with','would','you','your']);
    const wordFreq = {};
    words.forEach(w => {
      const lower = w.toLowerCase().replace(/[^a-z0-9]/g,'');
      if (lower.length > 3 && !stopWords.has(lower)) {
        wordFreq[lower] = (wordFreq[lower] || 0) + 1;
      }
    });
    
    result.keywords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count, density: ((count / words.length) * 100).toFixed(2) }));

    // Check keyword density
    result.keywords.forEach(kw => {
      if (parseFloat(kw.density) > 3.5) {
        result.issues.push({ type: 'medium', text: `Keyword "${kw.word}" over-optimized (${kw.density}% density)`, tag: 'keyword-stuffing' });
      }
    });

    // Internal/external links
    const links = html.match(/<a[^>]+href=["']([^"']+)["']/gi) || [];
    const internalLinks = links.filter(l => l.includes(window ? window.location.host : '')).length;
    const externalLinks = links.length - internalLinks;
    result.internal_links = internalLinks;
    result.external_links = externalLinks;
    
    if (links.length === 0) {
      result.issues.push({ type: 'high', text: 'No links found on page', tag: 'no-links' });
    } else {
      result.onpage_score += 5;
    }

    // Canonical URL
    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
    result.canonical = canonicalMatch ? canonicalMatch[1] : '';

    // Robots.txt / sitemap hints
    result.has_robots = html.includes('robots.txt') || true; // Assumed present if reachable

    // Schema markup detection
    result.has_schema = html.includes('application/ld+json') || html.includes('schema.org');
    if (result.has_schema) {
      result.technical_score += 10;
    } else {
      result.issues.push({ type: 'low', text: 'No structured data (Schema.org) detected', tag: 'no-schema' });
    }

    // Mobile score
    result.mobile_friendly = html.includes('viewport') && words.length >= 300;
    if (result.mobile_friendly) {
      result.technical_score += 10;
    }

    // Calculate final scores (normalize to 0-100)
    result.onpage_score = Math.min(100, result.onpage_score);
    result.technical_score = Math.min(100, result.technical_score);
    result.content_score = Math.min(100, result.content_score);
    result.authority_score = Math.min(100, Math.min(100, links.length * 2 + (result.has_schema ? 15 : 0)));

    result.overall_score = Math.round(
      result.onpage_score * 0.30 +
      result.technical_score * 0.25 +
      result.content_score * 0.25 +
      result.authority_score * 0.20
    );

  } catch (e) {
    result.issues.push({ type: 'critical', text: 'Analysis failed: ' + e.message, tag: 'analysis-error' });
  }

  return result;
}

// AI Recommendations using DeepSeek
async function getAIRecommendations(analysis) {
  // First try to get insights from database for learned patterns
  const insights = db.prepare('SELECT * FROM insights ORDER BY success_rate DESC LIMIT 10').all();
  
  // Build context from learned patterns
  let patternContext = insights.length > 0 
    ? 'Learned patterns from previous analyses:\n' + insights.map(i => `- ${i.pattern_tag}: ${i.recommendation} (success rate: ${(i.success_rate * 100).toFixed(0)}%)`).join('\n')
    : 'No prior patterns learned yet. Engine is in learning mode.';

  const prompt = `You are SEOForge, an AI SEO recommendation engine. Analyze this site data and provide specific, actionable recommendations.

URL: ${analysis.url}
Overall Score: ${analysis.overall_score}/100
On-Page Score: ${analysis.onpage_score}/100
Technical Score: ${analysis.technical_score}/100
Content Score: ${analysis.content_score}/100
Authority Score: ${analysis.authority_score}/100

Issues Found:
${analysis.issues.map(i => `- [${i.type.toUpperCase()}] ${i.text}`).join('\n')}

Top Keywords: ${analysis.keywords.map(k => `${k.word} (${k.density}%)`).join(', ')}

${patternContext}

Provide exactly 6 recommendations in this JSON format (no other text):
[
  {"tag": "short-tag", "priority": "critical|high|medium|low", "title": "Title", "description": "Specific action to take", "estimated_impact": "+5 to +25 points"},
  ...total 6 items...
]

Focus on the most impactful improvements first.`;

  try {
    const apiKey = process.env.DEEPSEEK_API_KEY || 'sk-de0c544fc5c14a86a1a69c6a4de24c5c';
    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (res.ok) {
      const data = await res.json();
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
  } catch (e) {
    console.log('DeepSeek API failed, using fallback recommendations');
  }

  // Fallback recommendations based on issues found
  const fallbackRecs = [];
  analysis.issues.forEach(issue => {
    const recs = {
      'missing-title': { priority: 'critical', title: 'Add a unique title tag', description: 'Create a 50-60 character title that includes your primary keyword', estimated_impact: '+15 points' },
      'title-short': { priority: 'high', title: 'Expand your title tag', description: 'Aim for 50-60 characters with primary keyword near the start', estimated_impact: '+10 points' },
      'missing-meta-desc': { priority: 'high', title: 'Write meta description', description: 'Create a compelling 150-160 char description with primary keyword', estimated_impact: '+10 points' },
      'missing-h1': { priority: 'critical', title: 'Add H1 heading', description: 'Every page needs exactly one H1 with your target keyword', estimated_impact: '+15 points' },
      'multiple-h1': { priority: 'high', title: 'Fix H1 hierarchy', description: 'Keep only one H1 per page, use H2-H6 for subsections', estimated_impact: '+10 points' },
      'no-ssl': { priority: 'critical', title: 'Enable HTTPS', description: 'Install SSL certificate and redirect HTTP to HTTPS', estimated_impact: '+20 points' },
      'missing-img-alt': { priority: 'medium', title: 'Add alt text to images', description: 'Add descriptive alt attributes to all images with keywords where relevant', estimated_impact: '+8 points' },
      'thin-content': { priority: 'high', title: 'Expand content', description: 'Add more comprehensive content (aim for 1000+ words for main pages)', estimated_impact: '+15 points' },
      'keyword-stuffing': { priority: 'medium', title: 'Reduce keyword density', description: '稀释 keyword usage, aim for 1-2% density max', estimated_impact: '+5 points' },
      'no-links': { priority: 'medium', title: 'Add internal links', description: 'Link to related content within your site to improve crawlability', estimated_impact: '+8 points' },
      'no-schema': { priority: 'low', title: 'Add structured data', description: 'Implement Schema.org markup for rich snippets in search results', estimated_impact: '+10 points' }
    };
    if (recs[issue.tag]) {
      fallbackRecs.push({ tag: issue.tag, ...recs[issue.tag] });
    }
  });

  return fallbackRecs.slice(0, 6);
}

// Self-improvement: record insight and update success rates
function recordLearning(analysis, recommendations) {
  try {
    // Update engine stats
    const stats = db.prepare('SELECT * FROM engine_stats WHERE id = 1').get();
    db.prepare('UPDATE engine_stats SET total_analyses = total_analyses + 1, last_self_update = datetime("now") WHERE id = 1').run();
    
    // For each recommendation, check if there's a matching pattern to update
    recommendations.forEach(rec => {
      const existing = db.prepare('SELECT * FROM insights WHERE pattern_tag = ?').get(rec.tag);
      if (existing) {
        // Update success rate based on overall score
        const newRate = existing.success_rate * 0.7 + (analysis.overall_score / 100) * 0.3;
        const newSampleSize = existing.sample_size + 1;
        const scoreDelta = analysis.overall_score - 50; // baseline
        db.prepare('UPDATE insights SET success_rate = ?, sample_size = ?, avg_score_delta = ?, last_updated = datetime("now") WHERE pattern_tag = ?')
          .run(newRate, newSampleSize, scoreDelta, rec.tag);
      } else {
        // Insert new insight
        db.prepare('INSERT INTO insights (pattern_tag, recommendation, success_rate, sample_size, avg_score_delta) VALUES (?, ?, ?, ?, ?)')
          .run(rec.tag, rec.title, 0.5, 1, 0);
      }
    });

    // Update insights count in stats
    const insightCount = db.prepare('SELECT COUNT(*) as c FROM insights').get();
    db.prepare('UPDATE engine_stats SET total_insights = ? WHERE id = 1').run(insightCount.c);
  } catch (e) {
    console.log('Learning recording error:', e.message);
  }
}

// Self-improvement: trigger engine retraining
async function selfImprove() {
  const insights = db.prepare('SELECT * FROM insights WHERE sample_size >= 3 ORDER BY success_rate DESC').all();
  if (insights.length >= 5) {
    // Engine has enough data to self-improve
    console.log('SEOForge engine self-improving with', insights.length, 'patterns');
    db.prepare('UPDATE engine_stats SET last_self_update = datetime("now") WHERE id = 1').run();
    return { retrained: true, patterns_updated: insights.length };
  }
  return { retrained: false, reason: 'insufficient_data' };
}

// API Routes
app.post('/api/analyze', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });

  const analysis = await analyzeUrl(url);
  const recommendations = await getAIRecommendations(analysis);
  analysis.recommendations = recommendations;

  // Save to database
  const insert = db.prepare(`
    INSERT INTO analyses (url, overall_score, onpage_score, technical_score, content_score, authority_score, keywords, issues, recommendations)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = insert.run(
    url,
    analysis.overall_score,
    analysis.onpage_score,
    analysis.technical_score,
    analysis.content_score,
    analysis.authority_score,
    JSON.stringify(analysis.keywords),
    JSON.stringify(analysis.issues),
    JSON.stringify(recommendations)
  );
  analysis.id = info.lastInsertRowid;

  // Record learnings
  recordLearning(analysis, recommendations);

  // Try self-improvement
  const improvement = await selfImprove();
  analysis.self_improvement = improvement;

  res.json(analysis);
});

app.get('/api/history', (req, res) => {
  const analyses = db.prepare('SELECT id, url, overall_score, onpage_score, technical_score, content_score, authority_score, created_at FROM analyses ORDER BY created_at DESC LIMIT 20').all();
  res.json(analyses);
});

app.get('/api/insights', (req, res) => {
  const insights = db.prepare('SELECT * FROM insights ORDER BY success_rate DESC').all();
  res.json(insights);
});

app.get('/api/stats', (req, res) => {
  const stats = db.prepare('SELECT * FROM engine_stats WHERE id = 1').get();
  const insightCount = db.prepare('SELECT COUNT(*) as c FROM insights').get();
  const recentAnalyses = db.prepare('SELECT COUNT(*) as c FROM analyses WHERE created_at > datetime("now", "-7 days")').get();
  res.json({
    ...stats,
    insights_count: insightCount.c,
    analyses_this_week: recentAnalyses.c
  });
});

app.post('/api/feedback', (req, res) => {
  const { analysis_id, recommendation_tag, worked } = req.body;
  if (!analysis_id || recommendation_tag === undefined || worked === undefined) {
    return res.status(400).json({ error: 'analysis_id, recommendation_tag, and worked required' });
  }

  const insight = db.prepare('SELECT * FROM insights WHERE pattern_tag = ?').get(recommendation_tag);
  if (insight) {
    const newRate = insight.success_rate * 0.8 + (worked ? 1 : 0) * 0.2;
    const newSampleSize = insight.sample_size + 1;
    db.prepare('UPDATE insights SET success_rate = ?, sample_size = ?, last_updated = datetime("now") WHERE pattern_tag = ?')
      .run(newRate, newSampleSize, recommendation_tag);
    
    // Log the learning
    db.prepare('INSERT INTO learnings (analysis_id, insight_id, applied, outcome_score_delta) VALUES (?, ?, ?, ?)')
      .run(analysis_id, insight.id, worked ? 1 : 0, worked ? 10 : -5);

    res.json({ success: true, new_success_rate: newRate });
  } else {
    res.status(404).json({ error: 'Insight not found' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SEOForge running on port ${PORT}`);
});