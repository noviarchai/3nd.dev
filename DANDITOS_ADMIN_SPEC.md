DANDITO'S SPECIAL SAUS — ADMIN SYSTEM (UPDATED)


------------------------------------------------------------
1. ACCOUNT STRUCTURE (ROLES & PERMISSIONS)
------------------------------------------------------------


ROLE: OWNER / MANAGER / ADMIN
- Full access to all settings, financials, and system controls
- Can add, edit, disable, or delete users
- Can override orders, pricing, and inventory
- Can access analytics and reports
- Can manage integrations
- Can create manual orders
- Can mark manual orders as CASH
- Can issue refunds and cancellations
- Can access shipping setup and carrier settings


ROLE: EMPLOYEE (STAFF)
- Limited dashboard view
- Can:
 - View orders
 - Pack and fulfill orders
 - Update order status
 - Add tracking numbers
 - Print packing slips
 - Manage inventory only if enabled by admin
- Cannot:
 - Access financial reports
 - Change pricing
 - Change global settings
 - Manage users
 - Use cash as a payment type
 - Edit payment integrations
 - Access sensitive shipping/account settings


SETTINGS PAGE: USER MANAGEMENT
- Create new user
- Assign role (Admin or Employee)
- Optional custom permission toggles
- View activity logs
- Force password reset
- Disable account
- Limit inventory access per employee if needed


------------------------------------------------------------
2. DASHBOARD
------------------------------------------------------------


WHAT IT DOES:
- Gives the owner and staff a fast overview of store activity


SHOW:
- Orders today / week / month
- Revenue snapshot
- Pending orders
- Paid but unfulfilled orders
- Low stock alerts
- Recent admin/staff activity


QUICK ACTIONS:
- Create Manual Order
- View Orders
- Add Product
- Print Labels
- View Inventory


------------------------------------------------------------
3. ORDERS MANAGEMENT
------------------------------------------------------------


WHAT IT DOES:
- Manages all customer and manual orders


FEATURES:
- Order list with filters:
 - Pending
 - Paid
 - Awaiting fulfillment
 - Fulfilled
 - Cancelled
 - Refunded
 - Manual orders


ORDER DETAILS PAGE:
- Customer info
- Shipping address
- Billing details
- Product list
- Payment type
- Payment status
- Shipping status
- Tracking number
- Internal notes
- Timeline/history of changes


ACTIONS:
- Mark as fulfilled
- Add tracking number
- Print packing slip
- Print shipping label
- Refund order
- Cancel order
- Add internal notes


MANUAL ORDER FEATURE:
- Admin can create orders for:
 - Local pickup
 - In-person sales
 - Phone/text orders
 - Event sales
- Payment options for manual orders:
 - Stripe
 - Cash (ADMIN ONLY)
- Cash payment option must never appear for employee accounts


------------------------------------------------------------
4. PAYMENTS SYSTEM
------------------------------------------------------------


PRIMARY PAYMENT METHOD:
- Stripe


WHAT IT DOES:
- Handles online payments securely
- Tracks payment status on each order
- Supports refunds and payment logs


SETTINGS PAGE: STRIPE
- Connect Stripe account
- Test mode / live mode switch
- Webhook status
- Currency setting
- Payment success/failure handling
- Refund settings
- Saved logs/errors for failed transactions


PAYMENT RULES:
- All public customer checkout payments use Stripe
- Employees cannot create or mark orders as cash
- Cash is only available inside admin manual order flow
- Cash orders should be clearly labeled as:
 - Manual Cash Order
 - Paid In Person
 - No online payment collected


FEATURES:
- Payment status tracking
- Full refunds
- Partial refunds
- Failed payment logs
- Manual payment notes


------------------------------------------------------------
5. SHIPPING SYSTEM
------------------------------------------------------------


PRIMARY SHIPPING CARRIER:
- Canada Post API


GOAL:
- Use Canada Post first, but keep the system modular so more carriers can be added later without rebuilding shipping


WHAT IT DOES:
- Calculates shipping
- Generates rates
- Creates shipments
- Pulls tracking info
- Prints labels


SETTINGS PAGE: SHIPPING OVERVIEW
- Enable/disable carriers
- Set default shipping carrier
- Set fallback shipping method
- Choose live rates or flat rates
- Set handling time
- Set shipping origin address


SETTINGS PAGE: CARRIERS
DEFAULT ACTIVE CARRIER:
- Canada Post API


FUTURE CARRIERS TO ADD EASILY:
- UPS
- Purolator
- FedEx
- Local delivery
- Flat-rate custom carrier


CARRIER STRUCTURE SHOULD SUPPORT:
- Carrier name
- API credentials
- Enabled/disabled toggle
- Domestic/international support toggle
- Service list mapping
- Packaging rules
- Label support
- Tracking support


SETTINGS PAGE: CANADA POST API
- API username / key fields
- Test mode / live mode
- Contract/shipping account details
- Origin postal code
- Default package type
- Supported services selection
- Tracking sync toggle
- Label format setting


SETTINGS PAGE: SHIPPING ZONES
- Canada
- Local Pickup
- Optional future USA zone


FOR EACH ZONE:
- Allowed carriers
- Allowed shipping methods
- Flat rate override if needed
- Free shipping threshold
- Pickup option toggle
- Delivery notes shown at checkout


SETTINGS PAGE: PACKAGING
- Create package presets:
 - Single bottle box
 - 2 bottle box
 - 3 bottle box
 - 5 bottle box
- Store dimensions
- Store empty box weight
- Max bottle count per box
- Default package per product/bundle


SETTINGS PAGE: LABELS & TRACKING
- Print shipping labels
- Reprint labels
- Save label history
- Auto-attach tracking to order
- Auto-email tracking to customer
- Track shipment status updates


IMPORTANT SHIPPING DESIGN RULE:
- Shipping must be built as a carrier module system
- Canada Post is the first installed carrier
- New carriers should plug into the same shipping framework later
- Orders should not need a new structure just because a new carrier is added


------------------------------------------------------------
6. PRODUCT MANAGEMENT
------------------------------------------------------------


WHAT IT DOES:
- Controls all product data, pricing, and store display info


PRODUCT PAGE FIELDS:
- Product name
- Short description
- Full description
- Price
- Compare-at price
- SKU
- Barcode optional
- Weight
- Inventory quantity
- Low stock threshold
- Shipping class
- Product status:
 - Active
 - Draft
 - Archived


VARIANTS / OPTIONS:
- Bottle size
- Bundle packs
- Limited edition versions


MEDIA:
- Main product image
- Extra gallery images
- Label image
- Heat icon image if needed


TAGS:
- Mild
- Medium
- Hot
- Extreme
- Limited Batch
- Best Seller


CATEGORIES:
- Hot Sauces
- Bundles
- Merch
- Limited Releases


ACTIONS:
- Duplicate product
- Archive product
- Bulk edit products


------------------------------------------------------------
7. INVENTORY SYSTEM
------------------------------------------------------------


WHAT IT DOES:
- Prevents overselling and tracks available stock


FEATURES:
- Live stock count
- Low stock alerts
- Manual inventory adjustment
- Adjustment history log


SETTINGS:
- Track inventory ON/OFF
- Allow overselling ON/OFF
- Low stock threshold
- Inventory alerts by email


ADVANCED FUTURE:
- Batch production tracking
- Ingredient lot tracking
- Expiry tracking if needed


------------------------------------------------------------
8. CUSTOMERS
------------------------------------------------------------


WHAT IT DOES:
- Stores customer accounts and order history


CUSTOMER PROFILE:
- Name
- Email
- Phone optional
- Order history
- Total spent
- Notes
- Tags


FEATURES:
- Search customers
- Tag customers:
 - VIP
 - Repeat buyer
 - Wholesale lead
- Export customer list
- View abandoned checkout data if enabled later


ACTIONS:
- Email customer
- Add internal notes
- View recent orders


------------------------------------------------------------
9. DISCOUNTS & PROMOS
------------------------------------------------------------


WHAT IT DOES:
- Creates offers and promo codes


FEATURES:
- Percentage discount
- Fixed discount
- Free shipping code
- Product-specific promo
- Bundle discount


SETTINGS:
- Expiry date
- Usage limit
- Minimum spend
- First-time customer only toggle
- Specific products or categories only


------------------------------------------------------------
10. ANALYTICS & REPORTS
------------------------------------------------------------


WHAT IT DOES:
- Gives owner/admin visibility into store performance


REPORTS:
- Revenue over time
- Orders over time
- Best-selling products
- Low stock products
- Refund report
- Average order value
- Repeat customer rate


FEATURES:
- Export CSV
- Date filters
- Compare periods


EMPLOYEE ACCESS:
- Off by default
- Admin can choose limited stats view if wanted


------------------------------------------------------------
11. GLOBAL STORE SETTINGS
------------------------------------------------------------


STORE SETTINGS:
- Store name
- Support email
- Order notification email
- Currency (CAD)
- Timezone (Calgary)


CHECKOUT SETTINGS:
- Require shipping address
- Enable local pickup
- Checkout notes field
- Age/legal notice if needed
- Order confirmation messaging


EMAIL SETTINGS:
- Order confirmation email
- Shipping confirmation email
- Manual order notification email
- Refund email


LEGAL SETTINGS:
- Terms of Service
- Privacy Policy
- Refund policy
- Shipping policy


------------------------------------------------------------
12. QR CODE SYSTEM
------------------------------------------------------------


WHAT IT DOES:
- Connects bottles, promos, events, and campaigns to digital pages


FEATURES:
- Generate QR codes
- Link to:
 - Product pages
 - Special promos
 - Secret landing pages
 - Event pages
- Track scans
- Track campaign performance


------------------------------------------------------------
13. LOGS & SECURITY
------------------------------------------------------------


WHAT IT DOES:
- Protects the admin and creates accountability


FEATURES:
- Login history
- User activity logs
- Order change logs
- Refund logs
- Payment action logs
- Shipping action logs


SECURITY SETTINGS:
- Force logout users
- Password reset tools
- Optional 2FA later
- Session timeout
- IP/session monitoring


------------------------------------------------------------
14. RECOMMENDED MVP BUILD ORDER
------------------------------------------------------------


BUILD FIRST:
1. User roles
2. Dashboard
3. Orders
4. Stripe payments
5. Canada Post shipping module
6. Product system
7. Inventory
8. Customer records
9. Basic reports
10. Logs/security


PHASE 2:
- More carriers
- Wholesale tools
- Sauce club/subscription box
- Advanced analytics
- Production batch tools
