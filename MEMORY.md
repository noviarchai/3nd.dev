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

---

_Last updated: 2026-03-31_
