# Skills Registry

Living registry of all OpenClaw skills.

## Format
```
## skill-name
- **Version:** X.Y
- **Status:** active|deprecated|experimental|under-repair
- **Quality:** 1-10
- **Best for:** use case 1, use case 2
- **Limitations:** known issues, edge cases
- **Last updated:** YYYY-MM-DD
```

---

## skillforge
- **Version:** 1.0
- **Status:** active
- **Quality:** 9
- **Best for:** Creating new skills, improving existing skills, skill gap detection, skill auditing
- **Limitations:** Does not auto-detect gaps (requires trigger); verification requires human judgment for subjective quality
- **Last updated:** 2026-03-30

---

## neverstuck
- **Version:** 1.0
- **Status:** active
- **Quality:** 9
- **Best for:** Any task that hits a wall — captchas, bot protection, login walls, rate limits, broken flows, access barriers. Multi-path routing + connector building + pattern memory.
- **Limitations:** Still requires API keys for captcha solvers (capmonster, capsolver, 2captcha); some barriers may need human step once
- **Last updated:** 2026-03-30

---

## dancore
- **Version:** 1.0
- **Status:** active
- **Quality:** 9
- **Best for:** Master command center — interprets Dan's messy input, amplifies intent, routes to correct skills/agents/swarms. Contains and coordinates DanSync + IntentAmplifier internally. Use for any Dan request that needs interpretation, routing, or execution preparation.
- **Limitations:** Execution still routes to other skills; DanCore is the interpreter/amplifier/router, not the executor
- **Last updated:** 2026-03-30

---

## intentamplifier
- **Version:** 1.0
- **Status:** active
- **Quality:** 8
- **Best for:** Expanding DanSync's structured intent into complete, god-tier, execution-ready form; adding missing components; elevating quality
- **Limitations:** Requires DanSync output as input; not an execution skill itself
- **Last updated:** 2026-03-30

---

## dansync
- **Version:** 1.0
- **Status:** active
- **Quality:** 9
- **Best for:** Understanding Dan's messy/fast input, intent translation, filling implied requirements, routing to correct skills, ensuring god-tier output expectations
- **Limitations:** Not an execution skill — prepares intent for other skills
- **Last updated:** 2026-03-30

---

## orchestratorforge
- **Version:** 1.0
- **Status:** active
- **Quality:** 9
- **Best for:** Coordinating all product-foundry skills (visionforge, buildforge, experienceforge, adminforge, userforge, revenueforge, integrationforge, evolutionforge, shipforge) as one unified build organization
- **Limitations:** Active only when a project requires full skill coordination; for simple tasks, individual skills can be used directly
- **Last updated:** 2026-03-30

## visionforge
- **Version:** 1.0
- **Status:** active
- **Quality:** 8
- **Best for:** Refining raw ideas, expanding features, defining monetization, identifying target audience and differentiation
- **Limitations:** Outputs are recommendations; requires other skills for actual implementation
- **Last updated:** 2026-03-30

## buildforge
- **Version:** 1.0
- **Status:** active
- **Quality:** 8
- **Best for:** Creating technical architecture, system maps, page/feature maps, data models for any digital product
- **Limitations:** Outputs architecture plans; actual code implementation requires execution
- **Last updated:** 2026-03-30

## experienceforge
- **Version:** 1.0
- **Status:** active
- **Quality:** 8
- **Best for:** UX improvements, onboarding design, friction reduction, trust signals, premium polish
- **Limitations:** Provides recommendations; implementation depends on buildforge
- **Last updated:** 2026-03-30

## adminforge
- **Version:** 1.0
- **Status:** active
- **Quality:** 8
- **Best for:** Building complete admin panels with user management, billing controls, Stripe test/live mode, feature toggles, analytics
- **Limitations:** Design focus; requires buildforge for implementation
- **Last updated:** 2026-03-30

## userforge
- **Version:** 1.0
- **Status:** active
- **Quality:** 8
- **Best for:** Building user dashboards, account management, billing portals, onboarding flows, plan-based feature access
- **Limitations:** Design focus; requires buildforge for implementation
- **Last updated:** 2026-03-30

## revenueforge
- **Version:** 1.0
- **Status:** active
- **Quality:** 8
- **Best for:** Monetization strategy, pricing models, Stripe integration architecture, ad/affiliate systems
- **Limitations:** Strategy and architecture; requires buildforge for implementation
- **Last updated:** 2026-03-30

## integrationforge
- **Version:** 1.0
- **Status:** active
- **Quality:** 8
- **Best for:** System coherence validation, finding orphaned features, broken connections, cross-system logic verification
- **Limitations:** Audit focus; requires implementation fixes from buildforge/evolutionforge
- **Last updated:** 2026-03-30

## evolutionforge
- **Version:** 1.0
- **Status:** active
- **Quality:** 8
- **Best for:** Safely adding features to existing products, redesigns, tech stack upgrades, dependency-aware changes
- **Limitations:** Process focus; actual implementation requires execution
- **Last updated:** 2026-03-30

## shipforge
- **Version:** 1.0
- **Status:** active
- **Quality:** 8
- **Best for:** Pre-launch QA, audit, hardening, release-readiness review, identifying missing pieces
- **Limitations:** Audit focus; fixes require work by other skills
- **Last updated:** 2026-03-30

## product-foundry
- **Version:** 1.0
- **Status:** active
- **Quality:** 9
- **Best for:** Building complete products/systems from raw ideas — websites, SaaS, web apps, admin systems, games, platforms, digital companies. Orchestrates 9 swarms for vision, build, UX, admin, user area, monetization, integration, evolution, QA.
- **Limitations:** Overkill for simple tasks; requires substantial project scope to justify 9-swarm orchestration; depends on SwarmForge being available
- **Last updated:** 2026-03-30

---

## profitmind
- **Version:** 1.0
- **Status:** active
- **Quality:** 8
- **Best for:** Revenue optimization, pricing decisions, business model analysis, kill/pivot decisions, opportunity detection, resource allocation toward high-ROI tasks
- **Limitations:** No live data feeds; recommendations require human context for final decisions; assumes alignment with user's actual business goals
- **Last updated:** 2026-03-30

---

## swarmforge
- **Version:** 1.0
- **Status:** active
- **Quality:** 9
- **Best for:** Large multi-domain projects, SaaS/company building, parallel workstreams, multi-agent coordination, complex goal decomposition
- **Limitations:** Swarm overhead is justified only for complex tasks; coordination adds latency; agent count should match actual need
- **Last updated:** 2026-03-30

---

## skill-creator
- **Version:** 1.0
- **Status:** active
- **Quality:** 8
- **Best for:** Creating new skills from scratch, editing existing skills, validating skill structure
- **Limitations:** Template-focused; doesn't handle complex multi-skill workflows
- **Last updated:** 2026-03-30
