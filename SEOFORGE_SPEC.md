# SEOForge — AI-Powered Self-Evolving SEO Intelligence

## Concept & Vision

SEOForge is not a static SEO tool — it's a living SEO intelligence that learns from every site it analyzes and gets smarter over time. It combines traditional SEO auditing with AI-powered insights, then uses feedback loops to continuously refine its own recommendation engine. Think "RankBrain for SEO tools" — the more you use it, the sharper it gets.

The vibe: dark, data-driven, almost ominous in how fast it responds. Founder-lab cyberpunk. Not a SaaS dashboard — a weapon.

## Design Language

- **Aesthetic:** Dark terminal/command center hybrid. Data streams, pulsing indicators, matrix-inspired accents.
- **Colors:**
  - Background: `#0a0a0f` (near black)
  - Surface: `#12121a` (dark card)
  - Primary: `#9D4EDD` (neon purple)
  - Accent: `#00FF88` (matrix green for "good"), `#FF3366` (red-pink for "bad"), `#00D4FF` (cyan for AI)
  - Text: `#E0E0E0` primary, `#888` secondary
- **Typography:** `JetBrains Mono` for data/metrics, `Inter` for UI text
- **Motion:** Fast, snappy — 150ms transitions. Pulse animations on live data. Scan-line effects on loading.
- **Cards:** Rounded 12px, subtle glow on hover (`box-shadow: 0 0 20px rgba(157,78,221,0.3)`)

## Layout

- **Dashboard:** Single-page app with widget-based layout
- **Header:** Logo + tool name + "Neural Engine: [X] learnings" counter + status indicator
- **Sections:**
  1. Site Analyzer (URL input + scan button)
  2. AI SEO Score (big circular score with breakdown)
  3. Keyword Intelligence (table with difficulty scores)
  4. Technical Issues (list of problems found)
  5. AI Recommendations (ranked list with severity)
  6. Learning Log (what the engine learned this session)
  7. Self-Improvement Panel (shows engine self-updating)

## Features

### Core Features

1. **Site Analyzer**
   - Input any URL
   - Crawls page, extracts: title, meta, headings, links, images, content structure
   - Calculates: word count, keyword density, readability score, internal/external links
   - Checks: SSL, mobile-friendliness (viewport), robots.txt, sitemap

2. **AI SEO Score (0-100)**
   - Calculated from 50+ factors
   - Breakdown by category: On-Page (30%), Technical (25%), Content (25%), Authority (20%)
   - Color-coded ring indicator

3. **AI Recommendations Engine**
   - GPT-powered suggestions based on analyzed content
   - Each recommendation tagged: `critical`, `high`, `medium`, `low`
   - Includes estimated impact score
   - **Self-improving:** after recommendations are generated, engine logs which patterns work (based on future rank changes tracked manually or via API)

4. **Keyword Intelligence**
   - Extract top keywords from content
   - Show search volume proxy (based on internal data), difficulty, density
   - Suggest related long-tail keywords

5. **Technical Audit**
   - Missing alt tags, broken links, slow resources
   - H1/H2 hierarchy check
   - Canonical URL detection
   - Schema markup detection

6. **Self-Improvement System (THE KEY FEATURE)**
   - After each analysis, engine updates internal "insights database"
   - Tracks which recommendation patterns correlate with score improvements
   - Every 10 analyses, auto-retrains priority weights
   - Shows "Neural growth: +X insights" counter
   - Stores learnings in SQLite: `insights` table with pattern, success_rate, sample_size, last_updated

### Database Schema

```sql
CREATE TABLE analyses (
  id INTEGER PRIMARY KEY,
  url TEXT,
  overall_score INTEGER,
  onpage_score INTEGER,
  technical_score INTEGER,
  content_score INTEGER,
  authority_score INTEGER,
  keywords TEXT, -- JSON
  issues TEXT, -- JSON
  recommendations TEXT, -- JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE insights (
  id INTEGER PRIMARY KEY,
  pattern_tag TEXT, -- e.g. 'meta-description-length', 'keyword-density'
  recommendation TEXT,
  success_rate REAL, -- 0-1
  sample_size INTEGER,
  avg_score_delta REAL, -- how much following this recommendation improves score
  last_updated DATETIME
);

CREATE TABLE learnings (
  id INTEGER PRIMARY KEY,
  analysis_id INTEGER,
  insight_id INTEGER,
  applied BOOLEAN,
  outcome_score_delta INTEGER,
  created_at DATETIME
);
```

### API Endpoints

- `POST /analyze` — body: `{ url }` → triggers full analysis + AI recommendations
- `GET /history` — recent analyses
- `GET /insights` — current engine learnings
- `POST /feedback` — body: `{ analysis_id, recommendation, worked }` → updates insight success rates
- `GET /stats` — engine stats (total analyses, insights count, avg score improvement)

### Self-Improvement Loop

1. Analysis runs → generates recommendations
2. User can mark recommendations as "applied" via feedback endpoint
3. Engine compares applied recommendations' outcomes across analyses
4. Patterns with >60% success rate get weighted higher in future recommendations
5. Every N analyses, engine recalculates recommendation priority scores
6. Dashboard shows "Engine evolving..." animation during retraining

## Technical

- **Port:** Check available (avoid 3000, 3847, 3848, 3849, etc.)
- **Stack:** Node.js + Express, single page app (vanilla JS + CSS), SQLite via better-sqlite3
- **AI:** Uses `deepseek-chat` via API for recommendations (with fallback to rule-based if API fails)
- **Self-update:** Background process that runs after each analysis, updates insight weights

## Status

- tool_number: 111116
- subdomain: 111116.lab.3nd.dev
- status: building