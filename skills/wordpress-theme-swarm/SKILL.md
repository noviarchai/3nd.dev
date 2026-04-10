# WordPress Theme Production Swarm — SKILL.md

## Overview

The WordPress Theme Production Swarm is a coordinated multi-agent system purpose-built to design, build, test, optimize, and deliver complete premium WordPress themes as installable `.zip` packages.

This is not a generic dev swarm. Every agent has a defined specialty, and the swarm operates like an elite WordPress product studio.

---

## Swarm Architecture

### Mission
Take a theme concept (niche, brand direction, rough idea) → deliver a complete, beautiful, WooCommerce-compatible, responsive, installable WordPress `.zip` theme.

### Success Criteria
- Valid WordPress theme installable via Appearance → Themes → Add New → Upload
- WooCommerce store pages render correctly
- Responsive across mobile, tablet, desktop
- Performance-conscious asset delivery
- Premium, award-winning visual finish
- No broken templates or missing files
- Clean `.zip` packaging

### Pipeline Stages

```
1. INTAKE        → Concept & Direction Agent
2. STRATEGY      → WP Strategist + WooCommerce Experience Agent (parallel)
3. UX/DESIGN     → UX Flow + Visual Design + Homepage/Landing Agents (parallel)
4. ARCHITECTURE  → Internal Template Architecture Agent
5. BUILD         → Frontend Engineering Agent
6. INTEGRATION   → WP Core Integration + WooCommerce Template Integration (parallel)
7. POLISH        → Responsiveness/A11y + Performance/Optimization (parallel)
8. QA            → QA & Compatibility Agent
9. DELIVERY      → Packaging & Delivery Agent
```

### Agent Roster

| # | Agent | Role |
|---|-------|------|
| 1 | `orchestrator` | Lead, owns mission, routes tasks, enforces standards |
| 2 | `concept-direction` | Expands rough ideas into full theme concepts |
| 3 | `wp-strategist` | Defines WP-specific capabilities, templates, structure |
| 4 | `woocommerce-experience` | Ensures premium WooCommerce compatibility |
| 5 | `ux-flow` | Designs flows, interactions, user journey logic |
| 6 | `visual-design-system` | Defines visual language, component system, motion |
| 7 | `homepage-landing` | Crafts wow-factor homepage and landing layouts |
| 8 | `internal-template-architecture` | Plans all internal templates (blog, archive, etc.) |
| 9 | `frontend-engineering` | Builds templates, sections, interactive frontend |
| 10 | `wordpress-core-integration` | Menus, widgets, customizer, enqueue, hooks |
| 11 | `woocommerce-template-integration` | Product, shop, cart, checkout templates |
| 12 | `responsiveness-accessibility` | Mobile, tablet, semantic HTML, ARIA |
| 13 | `performance-optimization` | Asset efficiency, loading, rendering |
| 14 | `qa-compatibility` | Tests, validation, compatibility checks |
| 15 | `packaging-delivery` | Final .zip packaging, docs, screenshots |

---

## How to Run a Theme Build

### Full Swarm Run
To run a complete theme build, pass a theme brief to the orchestrator:

```
Theme Brief:
- Niche/industry: [e.g., luxury fashion boutique]
- Brand personality: [e.g., minimal, high-end, editorial]
- Key features: [e.g., full-width product galleries, lookbooks]
- Target audience: [e.g., affluent women 25-45]
- WooCommerce needs: [yes/no, specifics]
- Reference sites/styles: [optional]
```

### Parallel Execution Rules
- **Parallel-safe stages:** Strategy, UX/Design, Integration, Polish
- **Sequential required:** Architecture (after design), Build (after architecture), QA (after build), Packaging (after QA)
- The orchestrator routes tasks to agents as dependencies clear

### Output Location
All theme builds produce files under:
```
/home/pi/.openclaw/workspace/theme-builds/{project-name}/
```

Final `.zip` lands at:
```
/home/pi/.openclaw/workspace/theme-builds/{project-name}/{theme-slug}.zip
```

---

## Agent Definitions

Each agent is defined in `/agents/` with:
- Name, Role, Mission
- Scope (in/out)
- Allowed actions
- Forbidden actions
- Inputs (from whom/where)
- Outputs (what they produce)
- Escalation rules

---

## Workflows

Pre-defined execution workflows:
- `workflow-full-build` — Complete pipeline from brief to .zip
- `workflow-concept-only` — Stop after concept/design phase
- `workflow-woocommerce-only` — Focus on WooCommerce template build
- `workflow-update-existing` — Improve/extend an existing theme build

---

## Templates

Theme templates and reference structures:
- WordPress theme file reference (what files exist and why)
- WooCommerce template override reference
- Theme screenshot specs
- style.css header block template
- functions.php starter structure

---

## Quality Standards

Every theme must meet:
1. WordPress theme review standards (基本 compatibility)
2. WooCommerce template完整性
3. Mobile responsiveness at 320px / 768px / 1024px / 1440px+
4. Accessibility: WCAG 2.1 AA contrast, keyboard nav, ARIA labels
5. Performance: LCP < 2.5s, no render-blocking assets
6. Visual: Premium finish, no generic AI-looking layouts
7. Packaging: Valid .zip, no broken paths, all required files present

---

## Orchestrator Instructions

The orchestrator agent (`01-orchestrator`) is the lead for every build. It:
1. Accepts the theme brief
2. Initializes the project directory
3. Routes parallel workstreams
4. Collects outputs from specialists
5. Validates at each pipeline gate
6. Drives the swarm to final .zip delivery

The orchestrator may spawn subagents for any phase and is responsible for ensuring agents don't overstep boundaries or produce conflicting outputs.
