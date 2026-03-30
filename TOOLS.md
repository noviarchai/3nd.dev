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
