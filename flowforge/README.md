# FlowForge - No-Code Automation Bridge

Connect any tool. Automate any workflow. No code required.

## Quick Start

```bash
# Install dependencies
npm install

# Install client dependencies and build
cd client && npm install && npm run build && cd ..

# Start the server
npm start
```

The app will be available at http://localhost:3847

## Deployment

### Prerequisites
- Node.js 18+
- SQLite3
- nginx
- PM2 (optional, for process management)

### Steps

1. Copy files to server:
```bash
scp -r . root@your-server:/var/www/automation.beta.nex.monster/html
```

2. Install dependencies:
```bash
cd /var/www/automation.beta.nex.monster/html
npm install --production
cd client && npm install && npm run build && cd ..
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your settings
```

4. Set up nginx:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/automation.beta.nex.monster
sudo ln -s /etc/nginx/sites-available/automation.beta.nex.monster /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

5. Start with PM2:
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Workflows
- `GET /api/workflows` - List workflows
- `POST /api/workflows` - Create workflow
- `GET /api/workflows/:id` - Get workflow
- `PUT /api/workflows/:id` - Update workflow
- `DELETE /api/workflows/:id` - Delete workflow
- `POST /api/workflows/:id/toggle` - Toggle active status
- `POST /api/workflows/:id/test` - Test workflow

### Connected Apps
- `GET /api/connected-apps` - List connected apps
- `POST /api/connected-apps` - Connect app
- `DELETE /api/connected-apps/:id` - Disconnect app

### Executions
- `GET /api/executions` - List executions
- `GET /api/executions/:id` - Get execution details
- `POST /api/executions/:id/retry` - Retry failed execution

### Billing
- `GET /api/billing/plans` - List available plans
- `GET /api/billing/subscription` - Get current subscription
- `POST /api/billing/subscribe` - Subscribe to plan
- `GET /api/billing/portal` - Get Stripe billing portal
- `POST /api/billing/cancel` - Cancel subscription

### Webhooks
- `POST /webhook/:endpoint_path` - Inbound webhook
- `POST /api/webhooks` - Create webhook endpoint
- `GET /api/webhooks` - List webhook endpoints
- `DELETE /api/webhooks/:id` - Delete webhook

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/users` - List all users
- `GET /api/admin/workflows` - List all workflows
- `GET /api/admin/executions` - List all executions
- `GET /api/admin/integrations` - Integration health
- `GET /api/admin/billing` - Billing overview

## Integrations

### Supported Apps
- Airtable
- Notion
- Slack
- Gmail
- Twitter/X
- Discord
- Webhooks (inbound & outbound)

### Authentication
- OAuth 2.0 for Notion, Slack, Gmail, Twitter, Discord
- Personal Access Token (PAT) for Airtable

## Database Schema

The app uses SQLite with the following tables:
- `users` - User accounts and subscriptions
- `connected_apps` - OAuth tokens and API keys
- `workflows` - Workflow definitions
- `execution_logs` - Execution history
- `webhook_endpoints` - Custom webhook URLs

## License

Proprietary - All rights reserved
