# SupportForge — Quick Reference Card

_Shortcuts and key info for power users_

---

## 🔑 Key URLs

| Purpose | URL |
|---------|-----|
| App | https://supporthq.live |
| Widget Script | https://supporthq.live/widget.js |
| API Base | https://supporthq.live/api |

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Send message | `Enter` |
| New line in message | `Shift + Enter` |
| Canned response | `/` then type shortcut |
| Close conversation | `Esc` |

---

## 🏷️ Canned Response Variables

Coming soon:
- `{{customer_name}}` — customer's name
- `{{agent_name}}` — your name
- `{{workspace_name}}` — your workspace name
- `{{date}}` — current date

---

## 🔗 API Endpoints (for developers)

### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/invite
GET  /api/auth/team
```

### Conversations
```
GET  /api/conversations
GET  /api/conversations/:id
POST /api/conversations
POST /api/conversations/:id/messages
PATCH /api/conversations/:id
```

### Billing
```
GET  /api/billing
POST /api/billing/checkout
POST /api/billing/portal
GET  /api/billing/invoices
POST /api/billing/cancel
```

### Widget Config
```
GET /api/settings/widget/:workspaceId
```

---

## 📊 Plan States

| State | Meaning |
|-------|---------|
| `trial` | 14-day free trial, full access |
| `paid` | Active subscription, $49/mo |
| `past_due` | Payment failed, check billing |
| `canceled` | Subscription canceled, access until period ends |
| `active` | General active status |

---

## 🆘 Status Messages

| Message | Cause |
|---------|-------|
| `Authentication required` | No/invalid token — log in again |
| `Invalid or expired invitation` | Invitation link is >7 days old |
| `No billing account found` | Haven't started Stripe checkout yet |
| `Email already registered` | Account exists, try logging in |

---

## 📋 Widget Configuration Options

```html
<script>
  window.SupportForge = {
    workspaceId: 'your-workspace-id',
    color: '#6366f1',        // Your brand color
    position: 'right',        // 'right' or 'left'
    welcome: 'Hi there!'      // Custom welcome message (optional)
  };
</script>
<script src="https://supporthq.live/widget.js" async></script>
```

---

## 🔄 WebSocket Events

### Client → Server
```json
{ "type": "auth", "token": "jwt_token" }
{ "type": "join_workspace", "workspaceId": "..." }
{ "type": "send_message", "conversationId": "...", "content": "..." }
```

### Server → Client
```json
{ "type": "auth_success" }
{ "type": "conversation_created", "conversationId": "..." }
{ "type": "new_message", "conversationId": "...", "message": {...} }
{ "type": "conversation_update", "conversationId": "...", "status": "..." }
```
