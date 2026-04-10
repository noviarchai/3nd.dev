# Workflow: Full Build — Theme Brief to .zip

**Workflow ID:** `workflow-full-build`
**Purpose:** Complete WordPress theme production pipeline from concept to delivery
**Approximate Stages:** 9 (can run in fewer with parallel agents)

---

## Entry Point

User provides a theme brief:
```
- Niche/industry: [e.g., luxury fashion boutique]
- Brand personality: [e.g., minimal, high-end, editorial]
- Key features: [e.g., full-width product galleries, lookbooks]
- Target audience: [e.g., affluent women 25-45]
- WooCommerce needs: [yes/no, specifics]
- Reference sites/styles: [optional]
```

---

## Pipeline Stage 1: INTAKE

**Agents:** `orchestrator`

**Actions:**
1. Receive/interpret theme brief
2. Determine project name and theme slug
3. Create project directory: `/theme-builds/{project-name}/`
4. Create subdirectories: `concept/`, `strategy/`, `design/`, `architecture/`, `build/`, `qa/`
5. Create `MANIFEST.md` (see orchestrator agent)
6. Spawn `concept-direction` with brief

**Output:** Initialized project workspace with MANIFEST.md

---

## Pipeline Stage 2: CONCEPT EXPANSION

**Agents:** `concept-direction`

**Actions:**
1. Expand theme brief into full Theme Concept Document
2. Identify WooCommerce requirement (yes/no) and flag to orchestrator
3. Save to `concept/THEME-CONCEPT.md`
4. Report completion to orchestrator

**Output:** `/theme-builds/{project-name}/concept/THEME-CONCEPT.md`

---

## Pipeline Stage 3: STRATEGY PLANNING

**Parallel agents:** `wp-strategist` + `woocommerce-experience` (if e-commerce)

**Trigger:** concept-direction complete

**Actions:**
- `wp-strategist`: Create WP Strategy Blueprint → `strategy/WP-STRATEGY.md`
- `woocommerce-experience`: Create WooCommerce Experience Blueprint → `strategy/WOOCOMMERCE-EXPERIENCE.md`

**Orchestrator:** Validate both outputs, merge into project understanding

---

## Pipeline Stage 4: UX & DESIGN

**Parallel agents:** `ux-flow` + `visual-design-system` + `homepage-landing`

**Trigger:** Strategy phase complete

**Actions:**
- `ux-flow`: Create UX Flow & Interaction Document → `design/UX-FLOW.md`
- `visual-design-system`: Create Visual Design System → `design/VISUAL-DESIGN-SYSTEM.md`
- `homepage-landing`: Create Homepage & Landing Design → `design/HOMEPAGE-LANDING.md`

**Orchestrator:** Validate all three outputs

---

## Pipeline Stage 5: ARCHITECTURE

**Agents:** `internal-template-architecture`

**Trigger:** Design phase complete

**Actions:**
1. Consume: concept, strategy, design outputs
2. Create Template Architecture Document → `architecture/TEMPLATE-ARCHITECTURE.md`
3. Include complete file manifest for all template files

**Orchestrator:** Validate architecture against concept requirements

---

## Pipeline Stage 6: BUILD

**Agents:** `frontend-engineering`

**Trigger:** Architecture complete

**Actions:**
1. Create complete WordPress theme file set in `build/{theme-slug}/`
2. All PHP templates, style.css, JS, template-parts, assets
3. Report file list to orchestrator

**Orchestrator:** Validate file structure against architecture manifest

---

## Pipeline Stage 7: INTEGRATION

**Parallel agents:** `wordpress-core-integration` + `woocommerce-template-integration` (if e-commerce)

**Trigger:** Build complete

**Actions:**
- `wordpress-core-integration`: Create/update `functions.php`, `inc/customizer.php`, `inc/template-functions.php`, `inc/template-tags.php`
- `woocommerce-template-integration`: Create all WooCommerce overrides in `woocommerce/` folder

**Orchestrator:** Validate all integration files are present and error-free

---

## Pipeline Stage 8: POLISH

**Parallel agents:** `responsiveness-accessibility` + `performance-optimization`

**Trigger:** Integration complete

**Actions:**
- `responsiveness-accessibility`: Audit and fix responsive/CSS issues + a11y issues → `qa/RESPONSIVENESS-ACCESSIBILITY-REPORT.md`
- `performance-optimization`: Audit and optimize assets, fonts, loading → `qa/PERFORMANCE-OPTIMIZATION-REPORT.md`

**Orchestrator:** Review reports, route critical fixes back to responsible agent

---

## Pipeline Stage 9: QA

**Agents:** `qa-compatibility`

**Trigger:** Polish complete

**Actions:**
1. Full QA audit against `qa/QA-REPORT.md`
2. Test installation, WooCommerce flow, templates, customizer
3. Issue severity classification (critical / major / minor)
4. Final verdict: PASS / CONDITIONAL PASS / FAIL

**If FAIL or unresolved criticals:**
- Return to orchestrator → route to responsible agent → repeat QA

**If CONDITIONAL PASS:**
- Report to orchestrator → orchestrator asks user approval to proceed

---

## Pipeline Stage 10: PACKAGING & DELIVERY

**Agents:** `packaging-delivery`

**Trigger:** QA PASS or user-approved CONDITIONAL PASS

**Actions:**
1. Create README.md with accurate documentation
2. Verify/create screenshot.png (1200x900)
3. Verify style.css header block completeness
4. Clean folder structure (remove dev artifacts)
5. Package to `.zip` via: `cd {build-dir} && zip -r {slug}.zip {slug}/`
6. Deliver: `/theme-builds/{project-name}/{theme-slug}.zip`

---

## Complete File Map

```
/theme-builds/{project-name}/
├── MANIFEST.md                          # Orchestrator's single source of truth
├── concept/
│   └── THEME-CONCEPT.md                 # concept-direction output
├── strategy/
│   ├── WP-STRATEGY.md                   # wp-strategist output
│   └── WOOCOMMERCE-EXPERIENCE.md        # woocommerce-experience output
├── design/
│   ├── UX-FLOW.md                       # ux-flow output
│   ├── VISUAL-DESIGN-SYSTEM.md          # visual-design-system output
│   └── HOMEPAGE-LANDING.md              # homepage-landing output
├── architecture/
│   └── TEMPLATE-ARCHITECTURE.md         # internal-template-architecture output
├── build/
│   └── {theme-slug}/                    # frontend-engineering + integration output
│       ├── style.css
│       ├── functions.php
│       ├── header.php
│       ├── footer.php
│       ├── front-page.php
│       ├── home.php
│       ├── single.php
│       ├── page.php
│       ├── archive.php
│       ├── search.php
│       ├── 404.php
│       ├── sidebar.php
│       ├── comments.php
│       ├── index.php
│       ├── screenshot.png
│       ├── template-parts/
│       │   ├── content-{type}.php
│       │   └── ...
│       ├── assets/
│       │   ├── css/style.css
│       │   ├── js/main.js
│       │   └── images/
│       ├── inc/
│       │   ├── customizer.php
│       │   ├── template-functions.php
│       │   └── template-tags.php
│       ├── woocommerce/                 # (if e-commerce)
│       │   ├── archive-product.php
│       │   ├── single-product.php
│       │   └── ...
│       └── README.md
└── qa/
    ├── RESPONSIVENESS-ACCESSIBILITY-REPORT.md
    ├── PERFORMANCE-OPTIMIZATION-REPORT.md
    └── QA-REPORT.md

Final deliverable:
/theme-builds/{project-name}/{theme-slug}.zip
```
