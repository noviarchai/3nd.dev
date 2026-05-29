# CNDYBOSS — Agent Instructions

**Project:** CNDYBOSS — Wellness Booking Backend + CRM  
**Domain:** cndyboss.cndy.page  
**VPS:** 142.44.162.68 | ubuntu / 2zs4Kw8IY50PdMjkH1  
**Repo:** Clone from `https://github.com/noviarchai/cndyboss` (or push new)

---

## Stack

- **Backend:** Node.js 22, Express, PostgreSQL 14, Redis 6
- **Database ORM:** Knex.js (migrations in `src/core/db/migrations/`)
- **Admin:** Next.js 14 (Pages Router) in `/admin`
- **Port:** 3000 (backend), Next.js dev on 3001

## Quick Start

```bash
# SSH onto VPS
ssh ubuntu@142.44.162.68

# Navigate to project
cd /home/ubuntu/cndyboss

# Start backend (already running via PM2)
pm2 logs cndyboss-api
pm2 restart cndyboss-api

# Run migrations
npm run migrate

# Seed default data
npm run seed

# Restart backend
pm2 restart cndyboss-api
```

## Default Login

```
Email:    admin@cndyboss.com
Password: cndyboss_admin_2026
```

---

## Architecture Overview

```
cndyboss/
├── src/
│   ├── app.js                    # Express app entry
│   ├── config/index.js           # All config from .env
│   ├── core/
│   │   ├── db/
│   │   │   ├── connection.js     # Knex PG connection
│   │   │   └── migrations/       # All DB migrations
│   │   └── auth/jwt.js          # JWT sign/verify + middleware
│   └── api/
│       ├── routes/             # All API route files
│       ├── middleware/          # Error handlers, etc.
│       └── services/           # Business logic (future)
└── admin/                       # Next.js admin panel
    ├── pages/                  # All admin pages
    ├── components/             # Reusable UI components
    └── lib/                   # API client + theme
```

## API Base

All API calls go through `/api/v1/`

Example:
```bash
curl -X POST https://cndyboss.cndy.page/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cndyboss.com","password":"cndyboss_admin_2026"}'
```

---

## API Authentication

All protected endpoints require `Authorization: Bearer <token>` header.

Get token via `POST /auth/login`.

## API Endpoints Reference

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | /auth/login | Login, returns access + refresh tokens |
| POST | /auth/refresh | Refresh access token |
| POST | /auth/logout | Invalidate session |

### Clients (CRM)
| Method | Path | Description |
|--------|------|-------------|
| GET | /clients | List clients (with search, pagination) |
| GET | /clients/:id | Get client with tags + booking history |
| POST | /clients | Create client |
| PUT | /clients/:id | Update client |
| DELETE | /clients/:id | Delete client |
| POST | /clients/:id/tags | Add tag to client |
| DELETE | /clients/:id/tags/:tagId | Remove tag |

### Services
| Method | Path | Description |
|--------|------|-------------|
| GET | /services | List services (filter by category) |
| GET | /services/:id | Get service |
| POST | /services | Create service |
| PUT | /services/:id | Update service |
| DELETE | /services/:id | Delete service |
| GET | /services/categories | List categories |
| POST | /services/categories | Create category |
| PUT | /services/categories/:id | Update category |
| DELETE | /services/categories/:id | Delete category |

### Bookings
| Method | Path | Description |
|--------|------|-------------|
| GET | /bookings | List bookings (filter by provider, date, status) |
| GET | /bookings/:id | Get booking |
| POST | /bookings | Create booking |
| PUT | /bookings/:id | Update booking |
| POST | /bookings/:id/cancel | Cancel booking |
| POST | /bookings/:id/complete | Mark completed |
| POST | /bookings/:id/no-show | Mark no-show |

### Calendar
| Method | Path | Description |
|--------|------|-------------|
| GET | /calendar/availability | Get available slots for provider+service+date |
| GET | /calendar/events | Get events for date range |

### Staff
| Method | Path | Description |
|--------|------|-------------|
| GET | /users | List staff members |
| GET | /users/:id | Get staff details |
| POST | /users | Create staff (admin+) |
| PUT | /users/:id | Update staff |
| DELETE | /users/:id | Delete staff |

### Settings
| Method | Path | Description |
|--------|------|-------------|
| GET | /settings | Get all settings |
| PUT | /settings | Update settings (bulk) |

### Tenant
| Method | Path | Description |
|--------|------|-------------|
| GET | /tenant | Get tenant info |
| PUT | /tenant | Update tenant (branding, name) |

### Analytics
| Method | Path | Description |
|--------|------|-------------|
| GET | /analytics/dashboard | Dashboard stats |

### Automations
| Method | Path | Description |
|--------|------|-------------|
| GET | /automations | List automations |
| POST | /automations | Create automation |
| PUT | /automations/:id | Update automation |
| DELETE | /automations/:id | Delete automation |

### Notifications
| Method | Path | Description |
|--------|------|-------------|
| GET | /notifications | Get notification log |

### Forms
| Method | Path | Description |
|--------|------|-------------|
| GET | /forms | List intake forms |
| POST | /forms | Create intake form |
| PUT | /forms/:id | Update form |
| DELETE | /forms/:id | Delete form |
| POST | /forms/:id/submit | Submit form answers |

### Memberships & Packages
| Method | Path | Description |
|--------|------|-------------|
| GET | /memberships | List memberships |
| POST | /memberships | Create membership |
| PUT | /memberships/:id | Update |
| DELETE | /memberships/:id | Delete |
| GET | /packages | List packages |
| POST | /packages | Create package |
| PUT | /packages/:id | Update |
| DELETE | /packages/:id | Delete |

### API Keys
| Method | Path | Description |
|--------|------|-------------|
| GET | /api-keys | List API keys (masked) |
| POST | /api-keys | Create new API key |
| DELETE | /api-keys/:id | Revoke key |

### Webhooks
| Method | Path | Description |
|--------|------|-------------|
| GET | /webhooks | List webhooks |
| POST | /webhooks | Create webhook |
| DELETE | /webhooks/:id | Delete webhook |

---

## Embed / Public API (no auth required)

For frontend clients to connect:

### Get available slots
```
GET /api/v1/embed/availability?tenant_slug=cndyboss&provider_id=...&service_id=...&date=YYYY-MM-DD
```

### List services published
```
GET /api/v1/embed/services?tenant_slug=cndyboss
```

### List providers
```
GET /api/v1/embed/providers?tenant_slug=cndyboss
```

### Create booking (public)
```
POST /api/v1/embed/book
Body: { tenant_slug, service_id, provider_id, client_name, client_email, client_phone, start_time, notes }
```

---

## Database Migrations

```bash
# Run migrations
npm run migrate

# Create new migration
npx knex migrate:make migration_name --env development

# Rollback
npx knex migrate:rollback --env development
```

Migrations live in `src/core/db/migrations/`

## Adding New Modules

1. Create migration in `src/core/db/migrations/`
2. Run `npm run migrate`
3. Create route file in `src/api/routes/`
4. Add route to `src/app.js`
5. For admin panel: add page in `admin/pages/` + component

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| NODE_ENV | development | environment |
| PORT | 3000 | server port |
| DB_HOST | localhost | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | cndyboss | database name |
| DB_USER | cndyboss | database user |
| DB_PASSWORD | * | database password |
| JWT_SECRET | * | JWT signing secret (CHANGE!) |
| REDIS_HOST | localhost | Redis host |
| REDIS_PORT | 6379 | Redis port |

## PM2 Commands

```bash
pm2 logs cndyboss-api           # View logs
pm2 restart cndyboss-api       # Restart
pm2 stop cndyboss-api          # Stop
pm2 delete cndyboss-api        # Remove from PM2
pm2 startup                    # Setup auto-start on boot
pm2 save                       # Save current process list
```

## For New Client Installs

When cloning for a new LandingCandy client:

1. Clone the repo
2. Copy `.env.example` to `.env`
3. Run `npm install`
4. Set up PostgreSQL + Redis
5. Run `npm run migrate`
6. Run `npm run seed` (creates tenant + admin)
7. Set tenant slug/namespace for the client
8. Deploy and configure subdomain

---

## User Roles

| Role | Permissions |
|------|-------------|
| owner | Full access, can manage billing/settings |
| admin | Everything except user deletion of owner |
| reception | Read/write bookings, clients |
| provider | Read own schedule + bookings |
| assistant | Read access |

---

*Last updated: 2026-05-27*
