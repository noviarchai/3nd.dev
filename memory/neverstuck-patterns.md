# NeverStuck — Pattern Memory

Persistent memory of barriers encountered and solutions found.

## Format
```
## [site/domain] — [date]
**Barrier:** [what blocked us]
**Solved via:** [what path/technique worked]
**Connector:** [what was built]
**Pattern:** [what to do next time]
```

---

## Sites / Barriers Solved

*(None yet — add entries as barriers are encountered)*

---

## Reusable Patterns Discovered

### General
- **Rate limits** → exponential backoff, switch user-agent, use mobile endpoint
- **Cloudflare Turnstile** → stealth browser with fingerprint spoofing
- **reCAPTCHA** → CapSolver API (most reliable), fallback to 2Captcha
- **Login walls** → use stealth browser to login once, save session cookie
- **403 on API** → add proper headers (User-Agent, Accept, Origin)
- **Redirect loops** → check for meta refresh traps, use direct URL

### Site-Specific
*(Add as discovered)*

---

## Failed Approaches (Don't Retry)

*(Track what DOESN'T work so we don't waste time)*

---

## Connector Templates

### Login Flow Template
```
Site: [name]
URL: [login URL]
Method: [OAuth/API/Form]
Credentials: [where stored]
Session: [cookie/token storage location]
Valid for: [duration]
Last used: [date]
```

### CAPTCHA Solver Template
```
Site: [name]
Challenge type: [reCAPTCHA v2/v3/Turnstile/hCaptcha/image]
Solver used: [service]
API key: [where stored]
Success rate: [%]
Last used: [date]
```

---

_Last updated: 2026-03-30_
