# MEMORY.md — Long-Term Memory

## Infrastructure

- **VPS Provider:** Namecheap
- **VPS IP:** 203.161.55.37
- **SSH:** Key-based (pi@2ndpi's key added), password: GOxFyf25os81KhHT09
- **Domain:** nex.monster (registered on Namecheap)
- **SSL:** Let's Encrypt via certbot (auto-renews)
- **Ports open:** 22 (SSH), 80 (HTTP), 443 (HTTPS)
- **Website files:** /var/www/nex.monster/html/index.html
- **Original site source:** http://10.0.0.7:3000 (Dan's Pi)

## Operating Rules (IMPORTANT)

1. **NEVER take on a client without talking to Dan first** at dstevenson@noviarch.com
2. **Most products are owned and run by nex.monster** — not client work
3. **Sound like a human** — not a corporate bot
4. **Email:** mai.hairuki@nex.monster (Mai handles nex.monster operations)
5. **All contact forms** → hello@nex.monster
6. **Dan:** dstevenson@noviarch.com — always keep him updated
7. When managing email/operations, Mai Hairuki is the point of contact
8. Only escalate to Dan if it needs his approval or decision

## VPS Stack (Fresh Install 2026-03-30)

- **OS:** Ubuntu 22.04.5 LTS
- **Node.js:** v22.22.2
- **PM2:** Installed, auto-start on boot configured
- **PostgreSQL:** 14 (enabled, running)
- **Redis:** 6.x (enabled, running)
- **nginx:** 1.18.0 with HTTP/2 + SSL
- **Certbot:** SSL auto-renewal enabled

## Website Directory Structure

- `/var/www/nex.monster/html/` — nex.monster web root

## Project Ideas

- **Lottominer / ESP32 crypto mining** — User has a Lottominer (ESP32-based BTC/DigiByte miner). Kept on back burner for future exploration.
- **MetricMind** — Metric tracking SaaS idea (mentioned once)
- **ForgeStack** — Mentioned once, details TBD

## DanCore (2026-03-30)
Master user-alignment skill already implemented at `~/.openclaw/skills/dancore/SKILL.md`
Central command center — interprets Dan's intent, amplifies requests, routes to correct systems.
Contains DanSync + IntentAmplifier layers internally.

## God-Tier Product Foundry (2026-03-30)
Dan uploaded a comprehensive 9-swarm build system. Full docs: `/home/pi/.openclaw/workspace/GOD_TIER_PRODUCT_FOUNDRY.md`
Saved to: `/home/pi/.openclaw/workspace/GOD_TIER_PRODUCT_FOUNDRY.md`

**The 9 Swarms:**
1. Vision/Strategy/Value Expansion — refine concepts, design monetization
2. Architecture/Systems/Build — full-stack implementation
3. UX/UI/Experience — polish, trust, delight
4. Admin/Operations/Control — full operator backend
5. User Area/Customer Experience — logged-in area
6. Monetization/Revenue — Stripe, ads, affiliates
7. Integration/System Coherence — cross-system audit
8. Safe Change/Evolution — upgrades without breaking
9. QA/Ship-Readiness/Hardening — release quality check

**Key Mandate:** Never deliver half-baked, generic, or disconnected systems.

## 2026 SaaS Research (2026-03-30)
Research output: `/home/pi/.openclaw/workspace/saas_market_research_2026.md`

**Top Picks for Autonomous Building:**
1. **ReplyBot** (9/10) — SMB AI support agent, massive underserved market
2. **PriceWolf** (8.5/10) — E-commerce price tracker, mid-market gap wide open
3. **ContentChief** (7.5/10) — Social media autopilot, must niche vertically

**Wildcards:**
- **ComplianceBot** — GDPR/CCPA for SMBs (30M+ need this)
- **FounderFuel** — AI due diligence for angel investors
- **LeaseShield** — Commercial lease negotiation AI

---

_Last updated: 2026-03-31_
