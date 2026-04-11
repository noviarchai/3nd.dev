# DANDITO'S ADMIN SYSTEM — GAP ANALYSIS vs UPDATED SPEC
**Date:** 2026-04-10
**Source:** Updated Admin Spec (DANDITOS_ADMIN_SPEC.md)

---

## ✅ ALREADY BUILT

| Feature | Status | Location |
|---------|--------|----------|
| Admin login/auth | ✅ Basic | `/app/admin/login` |
| Dashboard | ✅ Basic stats | `/app/admin/page.tsx` |
| Orders list + filters | ✅ Working | `/app/admin/orders/page.tsx` |
| Order status updates | ✅ | API: `/api/orders` |
| Products CRUD | ✅ Working | `/app/admin/products/page.tsx` |
| Product API | ✅ Working | `/api/admin/products` |
| Stripe checkout | ✅ Test mode | `/app/api/stripe-webhook` |
| Stripe settings | ✅ Keys stored | Settings page |
| Basic Canada Post rates | ✅ Working | `/app/api/shipping-rates` |
| Email/password auth | ✅ | `lib/db.ts` |

---

## ❌ MISSING / GAPS

### 1. USER ROLES & PERMISSIONS — HIGH PRIORITY
**Spec:** Admin + Employee roles with different capabilities
**Current:** Single auth level for all admin users
**Missing:**
- No `users` table or user management
- No role assignment (admin vs employee)
- No employee permission toggles
- No force-password-reset or account disable
- Cash payment toggle for manual orders only accessible to admin

### 2. MANUAL ORDERS (CASH PAYMENT) — HIGH PRIORITY
**Spec:** Admin creates orders for local pickup, phone orders, events
**Current:** Orders only come from Stripe checkout
**Missing:**
- Admin manual order creation flow
- Cash payment type (admin only — never show for employees)
- Manual order labeling: "Manual Cash Order / Paid In Person"
- Order source tracking (online vs manual)

### 3. SHIPPING — MEDIUM GAP
**Spec:** Full carrier module system, label printing, tracking sync
**Current:** Basic shipping rate calculation only
**Missing:**
- Label generation (CreateShipment API)
- Label printing + history
- Tracking number auto-attachment to orders
- Auto email tracking to customer
- Tracking status sync/webhook
- Carrier module abstraction (UPS, Purolator, FedEx planned)
- Shipping zones UI (Canada, Local Pickup, USA)
- Packaging presets (single/2/3/5 bottle boxes)
- Free shipping threshold setting
- Canada Post contract account details in settings

### 4. INVENTORY SYSTEM — MEDIUM PRIORITY
**Spec:** Live stock, low alerts, adjustment logs, oversell toggle
**Current:** Basic `stock` column on products
**Missing:**
- Low stock alerts (dashboard + email)
- Inventory adjustment history log
- `allow_overselling` toggle
- `track_inventory` global toggle
- Manual inventory adjustment from admin
- Inventory email alerts

### 5. CUSTOMERS — MEDIUM PRIORITY
**Spec:** Customer profiles, order history, tags, export
**Current:** No customer management page
**Missing:**
- Customers page (`/admin/customers`)
- Customer profiles (name, email, phone, notes, tags)
- Customer tags: VIP, Repeat Buyer, Wholesale Lead
- Customer search
- Order history per customer
- Customer export (CSV)

### 6. DISCOUNTS & PROMOS — MEDIUM PRIORITY
**Spec:** Promo codes, percentage/fixed discounts, usage limits
**Current:** No discount system
**Missing:**
- `discounts` or `promos` table
- Promo code creation UI
- Discount types: percentage, fixed, free shipping
- Expiry date, minimum spend, usage limit
- First-time customer only toggle
- Checkout integration with promo codes

### 7. ANALYTICS & REPORTS — MEDIUM PRIORITY
**Spec:** Revenue trends, best sellers, CSV export, date filters
**Current:** Basic `today_orders`, `today_revenue`, `total_orders`
**Missing:**
- Revenue over time chart
- Orders over time chart
- Best-selling products report
- Refund report
- Average order value
- Repeat customer rate
- CSV export
- Date range filters
- Compare periods

### 8. PRODUCT VARIANTS — LOW-MEDIUM PRIORITY
**Spec:** Bottle sizes, bundles, limited editions
**Current:** Simple product records
**Missing:**
- Product variants table (size, bundle)
- Variant pricing
- Bundle product grouping

### 9. PRODUCT MEDIA — LOW PRIORITY
**Spec:** Main image, gallery, label image, heat icon
**Current:** Single `image_url`
**Missing:**
- Extra gallery images
- Label image
- Heat icon image

### 10. PRODUCT CATEGORIES — LOW PRIORITY
**Spec:** Hot Sauces, Bundles, Merch, Limited Releases
**Current:** Only heat_level tags
**Missing:**
- `categories` table
- Category assignment per product
- Category-based filtering

### 11. ANALYTICS — REPORTS — LOW PRIORITY
**Spec:** All reports + CSV export
**Current:** Basic stats
**Missing:** (same as #7 above)

### 12. QR CODE SYSTEM — LOW PRIORITY
**Spec:** QR codes for bottles, promos, events
**Current:** Not built at all
**Missing:**
- QR code generation page
- Link to product/promo/event pages
- Scan tracking
- Campaign performance

### 13. LOGS & SECURITY — MEDIUM PRIORITY
**Spec:** Login history, activity logs, refund logs, session monitoring
**Current:** No logging system
**Missing:**
- `activity_logs` table
- Login history
- Order change logs
- Refund logs
- Payment action logs
- Shipping action logs
- Force logout
- Session timeout
- 2FA (future)

### 14. LEGAL PAGES — LOW PRIORITY
**Spec:** ToS, Privacy Policy, Refund Policy, Shipping Policy
**Current:** Not built
**Missing:**
- `/pages/terms`
- `/pages/privacy`
- `/pages/refunds`
- `/pages/shipping`

### 15. EMAIL NOTIFICATIONS — MEDIUM PRIORITY
**Spec:** Order confirmation, shipping confirmation, refund emails
**Current:** Basic (likely none or minimal)
**Missing:**
- Order confirmation email (triggered by Stripe/payment)
- Shipping confirmation email (with tracking)
- Manual order notification email
- Refund email
- Email template management

---

## MVP BUILD ORDER (from spec, cross-referenced with gaps)

| Priority | Item | Status | Notes |
|----------|------|--------|-------|
| 1 | User roles (admin/employee) | ❌ | HIGH — needed before manual orders |
| 2 | Manual orders + cash payment | ❌ | HIGH — core business requirement |
| 3 | Enhanced dashboard | ⚠️ | Basic stats OK, add low stock + activity |
| 4 | Orders management | ✅ | Mostly done, add internal notes |
| 5 | Stripe payments | ✅ | Test mode works, need live mode + webhook logs |
| 6 | Canada Post shipping | ⚠️ | Rates work, labels + tracking missing |
| 7 | Product system | ⚠️ | CRUD done, variants/categories missing |
| 8 | Inventory | ❌ | Basic only |
| 9 | Customer records | ❌ | Not built |
| 10 | Basic reports | ⚠️ | Stats exist, reports need work |
| 11 | Logs/security | ❌ | Not built |
| 12 | Discounts/promos | ❌ | Not built |
| 13 | QR codes | ❌ | Low priority |
| 14 | Legal pages | ❌ | Low priority |
| 15 | Email notifications | ❌ | Not built |

---

## NOTES
- Stripe is in TEST mode — needs LIVE keys + webhook migration before launch
- Canada Post is sandbox — needs live API keys
- DB user `danditos` / pass `danditos_pass_2024` (from lib/db.ts)
- No auth roles table — current admin login is single-user
