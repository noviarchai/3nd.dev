# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

## Email — nex.monster

**VPS:** root@203.161.55.37
**Credentials on VPS:** /opt/nex.monster/mail/.credentials

### Accounts
| Email | Purpose | Password |
|-------|---------|---------|
| hello@nex.monster | General inquiries | S41XGiTfqXF47x |
| mai.hairuki@nex.monster | Mai's company email | S41XGiTfqXF47x |

### Server
| Setting | Value |
|---------|-------|
| IMAP | premium340.web-hosting.com:993 |
| SMTP | premium340.web-hosting.com:465 (TLS) |

### Send Email (from VPS)
```bash
# Using msmtp directly
echo "Body text" | msmtp --file=/etc/msmtp/msmtp.conf --account=nex.monster --from=hello@nex.monster -- recipient@email.com

# Or use nexmail script
nexmail -t recipient@email.com -s "Subject" -b "Body" -f hello@nex.monster
```

### Check Email
```bash
mutt -f imaps://mai.hairuki@premium340.web-hosting.com:993
```

---

## Stripe — nex.monster (PRIMARY)

**All SaaS products use this single Stripe account — NEVER use another account unless Dan says so.**

### Live Keys
| Key | Value |
|-----|-------|
| `STRIPE_SECRET_KEY` | `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` |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_51TIKoCRo9FTS8oe7a0rX4xipZGzLWTedYWThEh3sOme1JmxHB70QBEkJ8JGqCq907ypHh5IVj7Ibe2Es3z9ED0w800rvTU9D9I` |

### Sandbox Keys
| Key | Value |
|-----|-------|
| `STRIPE_SECRET_KEY` | `sk_test_51TIKod2Mtt33YPo1OzlFna8i1WQtistKeDiPfURp3NjOzO1WALy0gAKo3KijiwJ4lxhBlG0d7oAxFQCXJ8FZAFFo00zsEryhEA` |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_51TIKod2Mtt33YPo1OZkIbwjNWaCPsAWs5SAcIS4NQM9slNF1YDaPtRiyjkKXd4IwEa9x5aC0hAciajzuBpmT5RrV00GrPKEqge` |

### Stripe Webhook Secret
| Environment | Secret |
|-------------|--------|
| Live | `whsec_live_...` — get from Stripe Dashboard → Developers → Webhooks |
| Test | `whsec_test_...` — get from Stripe Dashboard → Developers → Webhooks |

### Products & Price IDs (Live)
| SaaS | Product Name | Price ID | Price |
|------|-------------|----------|-------|
| SupportForge | SupportForge - Customer Support Chat | `price_1TILOkRo9FTS8oe7QCYratji` | $49/mo |
| MetricPulse | MetricPulse - Business Analytics | Starter: `price_1TILOkRo9FTS8oe7K2M6Pl9x` ($29) | TBD |
| MetricPulse | MetricPulse - Business Analytics | Pro: `price_1TILOkRo9FTS8oe7xqEx1SZX` ($89) | TBD |
| MetricPulse | MetricPulse - Business Analytics | Enterprise: `price_1TILOlRo9FTS8oe7ijD3yUvJ` ($199) | TBD |
| FlowBridge | FlowBridge - Workflow Automation | Starter: `price_1TILOkRo9FTS8oe7nhESZ4nv` ($19) | TBD |
| FlowBridge | FlowBridge - Workflow Automation | Pro: `price_1TILOkRo9FTS8oe7JWsL7QKH` ($59) | TBD |
| FlowBridge | FlowBridge - Workflow Automation | Business: `price_1TILOlRo9FTS8oe7Qo0NfHyC` ($149) | TBD |

### Products & Price IDs (Sandbox/Test)
| SaaS | Product Name | Price ID | Price |
|------|-------------|----------|-------|
| SupportForge | SupportForge - Customer Support Chat | `price_1TILN22Mtt33YPo1ULcA0Etd` | $49/mo |
| MetricPulse | MetricPulse - Business Analytics | Starter: `price_1TILN32Mtt33YPo10UYyPr50` ($29) | TBD |
| MetricPulse | MetricPulse - Business Analytics | Pro: `price_1TILN92Mtt33YPo1yNcv9mjI` ($89) | TBD |
| MetricPulse | MetricPulse - Business Analytics | Enterprise: `price_1TILNF2Mtt33YPo1gwP1NW8n` ($199) | TBD |
| FlowBridge | FlowBridge - Workflow Automation | Starter: `price_1TILN72Mtt33YPo13wMVkPXi` ($19) | TBD |
| FlowBridge | FlowBridge - Workflow Automation | Pro: `price_1TILN72Mtt33YPo17sUCcms5` ($59) | TBD |
| FlowBridge | FlowBridge - Workflow Automation | Business: `price_1TILN72Mtt33YPo1M2FUeEGi` ($149) | TBD |

---

## SaaS Products (Active)

| Product | Domain | Port | Pricing | Stripe Keys |
|---------|--------|------|---------|-------------|
| SupportForge | support.beta.nex.monster | 3848 | $49/mo flat | ✅ TEST only (updating) |
| FlowBridge | flowbridge.live | 3847 | $19/$59/$149/mo | ✅ TEST only (updating) |
| MetricPulse | metricpulse.live | 3849 | $29/$89/$199/mo | ✅ TEST only (updating) |

### How to Add a New SaaS
1. Create Product + Price in Stripe Dashboard (live AND test mode)
2. Update this file with the new `STRIPE_PRICE_ID`
3. Update the SaaS `.env` with Stripe keys + price ID
4. Restart the service
5. Done — billing works
