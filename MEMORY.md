# MEMORY.md — Long-Term Memory

## Project Folder Structure

All projects live in `/home/pi/.openclaw/workspace/projects/`

Each project gets its own folder:
```
projects/
├── lottominer/           # ESP32 crypto mining project
│   ├── README.md        # Project overview, goals, status
│   ├── NOTES.md         # Decisions, ideas, progress logs
│   ├── CONFIG/          # Config files, credentials, keys
│   └── OUTPUTS/         # Generated files, builds, results
├── example-project/
│   └── ...
```

**Rule:** Everything about a project stays in its folder. Don't scatter info across memory/ files.

---

## Project Ideas

- **Lottominer / ESP32 crypto mining** — User has a Lottominer (ESP32-based BTC/DigiByte miner). Kept on back burner for future exploration. Alternatives considered: different coins (XMR/RandomX, ALPH/Alephium), custom firmware, stratum proxy, different pool.
  - Folder: `projects/lottominer/` (create when active)

---

## Skills Created (2026-03-30)

All saved in `/home/pi/.openclaw/skills/`:

**Meta Skills:**
- `skillforge` — Self-expanding skill factory
- `swarmforge` — Multi-agent swarm orchestration
- `profitmind` — Revenue optimization & business decisions

**Product Foundry (coordinated suite):**
- `orchestratorforge` — Coordinates all foundry skills
- `visionforge` — Idea refinement & strategy
- `buildforge` — Technical architecture
- `experienceforge` — UX/UI polish
- `adminforge` — Admin panel design
- `userforge` — User area design
- `revenueforge` — Monetization systems
- `integrationforge` — System coherence
- `evolutionforge` — Safe product evolution
- `shipforge` — QA & ship-readiness
- `product-foundry` — Bundles all 9 into one skill

---

_Last updated: 2026-03-30_
