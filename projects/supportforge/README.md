# SupportForge - Flat-Rate Customer Support SaaS

**The customer support tool that doesn't punish you for growing.**

💰 **$49 flat/month** • Unlimited agents • No per-seat fees

## Features

- **Real-time WebSocket Chat** - Instant messaging between customers and support agents
- **Embeddable Chat Widget** - Drop-in code for any website
- **Agent Dashboard** - Full conversation management, assignment, and status tracking
- **Admin Panel** - Team management, settings, analytics
- **Canned Responses** - Quick-reply templates with shortcuts
- **Stripe Billing** - Subscription management, invoices, billing portal
- **Unlimited Seats** - Add your whole team, pricing never scales

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# Server runs on port 3847
# Access at http://localhost:3847
```

## Demo Credentials

- **Email:** admin@supportforge.demo
- **Password:** admin123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new workspace
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/invite` - Invite team member
- `GET /api/auth/team` - Get team members

### Conversations
- `GET /api/conversations` - List conversations
- `GET /api/conversations/:id` - Get conversation with messages
- `POST /api/conversations` - Create new conversation
- `POST /api/conversations/:id/messages` - Add message
- `PATCH /api/conversations/:id` - Update status/priority/assignee
- `GET /api/conversations/stats/dashboard` - Get stats

### Billing
- `GET /api/billing` - Get billing status
- `POST /api/billing/checkout` - Create Stripe checkout
- `POST /api/billing/portal` - Create billing portal session
- `GET /api/billing/invoices` - List invoices

### Settings
- `GET /api/settings` - Get workspace settings
- `PUT /api/settings` - Update settings
- `GET /api/settings/widget/:id` - Get public widget config
- `GET /api/settings/canned-responses` - List canned responses
- `POST /api/settings/canned-responses` - Create canned response
- `DELETE /api/settings/canned-responses/:id` - Delete canned response

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** SQLite (sql.js - pure JavaScript)
- **Real-time:** WebSocket (ws)
- **Billing:** Stripe
- **Auth:** JWT

## Project Structure

```
supportforge/
├── public/              # Frontend static files
│   ├── css/
│   ├── js/
│   └── widget.js        # Customer chat widget
├── src/
│   ├── server.js        # Express server
│   ├── models/
│   │   └── db.js        # SQLite database
│   ├── routes/
│   │   ├── auth.js
│   │   ├── conversations.js
│   │   ├── billing.js
│   │   ├── settings.js
│   │   └── webhook.js
│   ├── services/
│   │   ├── websocket.js
│   │   └── stripe.js
│   └── middleware/
│       └── auth.js
├── data/                # SQLite database files
├── package.json
├── nginx-supportforge.conf
└── README.md
```

## Widget Installation

Add this to your website's `<head>`:

```html
<script>
  window.SupportForge = {
    workspaceId: 'YOUR_WORKSPACE_ID',
    color: '#6366f1',
    position: 'right'
  };
</script>
<script src="https://support.beta.nex.monster/widget.js" async></script>
```

## License

Proprietary - All rights reserved
