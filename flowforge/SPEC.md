# FlowForge - No-Code Automation Bridge SaaS

## Product Overview

**Name:** FlowForge  
**Domain:** automation.beta.nex.monster  
**Tagline:** "Connect any tool. Automate any workflow. No code required."  
**Target:** No-code users, solo founders, small ops teams using multiple SaaS tools

## Core Value Proposition

FlowForge bridges the gap between disconnected SaaS tools. Connect Airtable to Slack, Notion to email, Twitter to Discord — drag, drop, done. No developers needed.

---

## Vision & Strategy

### Target Audience
- Solo founders (35%) - automate ops without hiring devs
- Small ops teams 2-10 (40%) - connect their existing tool stack  
- No-code enthusiasts (25%) - build complex automations visually

### Workflow Templates (Pre-built)
1. **Airtable → Slack** - New record triggers Slack notification
2. **Notion → Invoice** - Page created triggers invoice generation via Gmail
3. **Twitter → Discord** - New follower triggers Discord welcome message
4. **Gmail → Notion** - Email with attachment creates Notion page
5. **Discord → Airtable** - Command triggers Airtable record creation
6. **Custom Webhook → Anywhere** - Custom triggers for any API

### Pricing Tiers

| Plan | Price | Workflows | Executions/mo | Integrations | Support |
|------|-------|-----------|---------------|--------------|---------|
| **Free** | $0 | 3 | 500 | 5 apps | Community |
| **Starter** | $19/mo | 15 | 5,000 | Unlimited | Email |
| **Pro** | $49/mo | 50 | 25,000 | Unlimited | Priority |
| **Business** | $99/mo | Unlimited | 100,000 | Unlimited | Dedicated |

### Monetization Model
- Subscription tiers (primary)
- Usage-based execution overages ($0.002/execution beyond limit)
- Team seat add-ons ($10/seat/mo)
- Marketplace templates (10% revenue share)

---

## Technical Architecture

### Stack
- **Backend:** Node.js + Express
- **Database:** SQLite (simple, portable)
- **Frontend:** React (workflow builder, dashboard)
- **Payments:** Stripe subscriptions
- **Real-time:** Server-Sent Events (SSE)
- **Webhooks:** Custom inbound/outbound webhook system
- **Server:** VPS with nginx reverse proxy

### Database Schema

```sql
-- Users
users (
  id, email, password_hash, name, stripe_customer_id,
  plan_tier, executions_used, exec_limit, created_at, updated_at
)

-- Connected Apps (OAuth tokens)
connected_apps (
  id, user_id, app_name (airtable|notion|slack|gmail|twitter|discord),
  access_token, refresh_token, token_expires_at, metadata, created_at
)

-- Workflows
workflows (
  id, user_id, name, description, trigger_app, trigger_type,
  trigger_config JSON, actions JSON, is_active, is_test,
  total_runs, last_run_at, created_at, updated_at
)

-- Execution Logs
execution_logs (
  id, workflow_id, user_id, status (pending|success|error|skipped),
  trigger_data JSON, action_results JSON, error_message,
  execution_time_ms, created_at
)

-- Webhook Endpoints
webhook_endpoints (
  id, user_id, workflow_id, endpoint_path, secret_key,
  is_active, created_at
)
```

### API Endpoints

```
Auth:
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

Workflows:
GET    /api/workflows
POST   /api/workflows
GET    /api/workflows/:id
PUT    /api/workflows/:id
DELETE /api/workflows/:id
POST   /api/workflows/:id/test
POST   /api/workflows/:id/toggle

Connected Apps:
GET    /api/connected-apps
POST   /api/connected-apps
DELETE /api/connected-apps/:id
GET    /api/connected-apps/:id/oauth-url

Executions:
GET    /api/executions
GET    /api/executions/:id

Billing:
GET    /api/billing/plans
POST   /api/billing/subscribe
GET    /api/billing/portal
POST   /api/billing/cancel
POST   /api/stripe/webhook

Webhooks:
POST   /webhook/:endpoint_path
GET    /api/webhooks
POST   /api/webhooks
DELETE /api/webhooks/:id

Admin:
POST   /api/admin/login
GET    /api/admin/users
GET    /api/admin/workflows
GET    /api/admin/executions
GET    /api/admin/integrations
GET    /api/admin/billing
```

---

## Page Structure

### Public Pages
- `/` - Landing page with value prop & pricing
- `/login` - Login form
- `/register` - Registration form
- `/pricing` - Detailed pricing page

### User Dashboard (`/dashboard`)
- Workflow list with status indicators
- Quick-create workflow button
- Usage meter (executions used/limit)
- Recent activity feed

### Workflow Builder (`/workflows/new`, `/workflows/:id/edit`)
- Visual flow builder (drag-drop)
- Left panel: Integration triggers/actions
- Center: Canvas with flow visualization
- Right panel: Configuration for selected node
- Test/Live toggle

### Connected Apps (`/dashboard/apps`)
- Grid of connected integrations
- Connect new app button
- OAuth connection flow
- Disconnect/reconnect options

### Execution History (`/dashboard/history`)
- Searchable/filterable log table
- Status badges (success/error/pending)
- Execution detail modal
- Retry failed executions

### Billing (`/dashboard/billing`)
- Current plan display
- Usage breakdown
- Upgrade/downgrade buttons
- Stripe billing portal link
- Invoice history

### Admin Panel (`/admin`)
- User management table
- Workflow monitoring
- Integration health dashboard
- Execution logs explorer
- Revenue metrics

---

## Integration Specifications

### Airtable Integration
- **Triggers:** New record, Record updated, Record deleted
- **Actions:** Create record, Update record, Delete record
- **Auth:** Personal Access Token (PAT)

### Notion Integration  
- **Triggers:** Page created, Page updated, Database item created
- **Actions:** Create page, Update page, Add database row
- **Auth:** OAuth 2.0

### Slack Integration
- **Triggers:** New message in channel (via events API)
- **Actions:** Send message, Create channel, Add reaction
- **Auth:** OAuth 2.0 Bot Token

### Gmail Integration
- **Triggers:** New email, New email with attachment, Label applied
- **Actions:** Send email, Apply label, Archive
- **Auth:** OAuth 2.0

### Twitter/X Integration
- **Triggers:** New follower, New tweet (own), Mention, DM received
- **Actions:** Post tweet, Send DM, Retweet, Like
- **Auth:** OAuth 2.0

### Discord Integration
- **Triggers:** New message, Member joined, Reaction added
- **Actions:** Send message, Create channel, Manage role
- **Auth:** Bot Token

### Webhook Integration
- **Triggers:** Incoming webhook received
- **Actions:** HTTP request (GET/POST/PUT/DELETE)
- **Auth:** API key header or custom headers

---

## Execution Engine

### Flow
1. Trigger event detected (webhook/polling/schedule)
2. Validate user subscription & execution limit
3. Load workflow configuration
4. Execute trigger handler → extract data
5. Transform data per workflow mapping
6. Execute action handlers sequentially
7. Record execution log
8. Return success/failure status

### Error Handling
- Retry failed actions 3x with exponential backoff
- Log all errors with full context
- Notify user on permanent failures (email/Slack)
- Partial success handling (continue other actions)

---

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens for API auth (24h expiry)
- CSRF protection on forms
- Rate limiting on all endpoints
- Webhook secrets for inbound validation
- Encrypted token storage (AES-256 for refresh tokens)

---

## Deployment

- **Path:** /var/www/automation.beta.nex.monster/html/
- **Server:** Node.js app on port 3847
- **nginx:** Reverse proxy from port 80/443
- **SSL:** Let's Encrypt via certbot
- **Process:** PM2 for process management

---

## Success Metrics

- First workflow created in < 5 minutes
- 95%+ execution success rate
- < 2 second average execution time
- Zero data loss on failures
- Stripe integration 100% reliable
