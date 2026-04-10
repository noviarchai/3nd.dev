# WordPress Theme Production Swarm

A coordinated multi-agent system for building complete, premium WordPress themes.

## What This Is

The WordPress Theme Production Swarm is a purpose-built multi-agent orchestration system for designing, building, testing, optimizing, and delivering WordPress themes as installable `.zip` packages.

It coordinates 15 specialized agents through a 9-stage pipeline:

```
INTAKE → CONCEPT → STRATEGY → UX/DESIGN → ARCHITECTURE → BUILD → INTEGRATION → POLISH → QA → PACKAGING
```

## Quick Start

### Run a Full Theme Build

Provide a theme brief to the orchestrator:
```
Build me a luxury fashion boutique WordPress theme with WooCommerce support.
Target: affluent women 25-45. Style: editorial, minimal, high-end.
Key pages: homepage with hero, shop, product gallery, lookbook, blog.
```

The swarm will:
1. Create a project workspace
2. Generate concept → strategy → design → architecture
3. Build all template files
4. Integrate WordPress + WooCommerce
5. Run responsive/accessibility/performance audits
6. QA the complete theme
7. Package as `.zip`

### Output Location
```
/home/pi/.openclaw/workspace/theme-builds/{project-name}/{theme-slug}.zip
```

## Agents

| # | Agent | Pipeline Stage |
|---|-------|---------------|
| 1 | Orchestrator | All (lead) |
| 2 | Concept & Direction | Intake |
| 3 | WP Strategist | Strategy |
| 4 | WooCommerce Experience | Strategy |
| 5 | UX Flow | UX/Design |
| 6 | Visual Design System | UX/Design |
| 7 | Homepage & Landing | UX/Design |
| 8 | Internal Template Architecture | Architecture |
| 9 | Frontend Engineering | Build |
| 10 | WordPress Core Integration | Integration |
| 11 | WooCommerce Template Integration | Integration |
| 12 | Responsiveness & Accessibility | Polish |
| 13 | Performance & Optimization | Polish |
| 14 | QA & Compatibility | QA |
| 15 | Packaging & Delivery | Delivery |

## Workflows

- `workflow-full-build.md` — Complete theme pipeline (brief → .zip)
- `workflow-woocommerce-only.md` — WooCommerce template focus
- `workflow-update-existing.md` — Update an existing build

## References

- `wordPress-theme-file-reference.md` — Complete WP theme file guide
- `woocommerce-template-reference.md` — WooCommerce template override reference
- `style.css-header-template.md` — style.css header + starter CSS

## Requirements

Every theme produced must:
- ✅ Install as a valid WordPress theme
- ✅ Support WooCommerce fully
- ✅ Be responsive on mobile, tablet, desktop
- ✅ Meet accessibility standards (WCAG 2.1 AA)
- ✅ Be performance-conscious
- ✅ Feel premium / award-winning (not generic)
- ✅ Package as a clean `.zip` deliverable

## Agent Definitions

Each agent is defined in `/agents/` with full scope, inputs, outputs, and escalation rules. No agent oversteps its defined boundaries.
