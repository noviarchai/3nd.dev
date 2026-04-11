# DANDITO'S SPECIAL SAUS — CUSTOMER AREA SYSTEM

## 1. CUSTOMER ACCOUNT STRUCTURE
- Standard customer account (one per customer)
- Login: email + password
- Connects to admin: order history, shipping sync, tracking, addresses, account activity, support

## 2. CUSTOMER DASHBOARD
- Recent orders, current statuses, tracking updates
- Saved addresses, account details
- Quick reorder options, featured products
- Quick actions: View Orders, Track Order, Reorder, Edit Address, Edit Account

## 3. MY ORDERS PAGE
- Order list: number, date, total, payment status, fulfillment, shipping, tracking
- Order detail: items, images, qty, price, address, billing, payment, tracking, timeline
- Actions: view receipt, reorder, contact support, download invoice, cancel (if allowed)
- Reduces "where is my order" messages

## 4. ORDER TRACKING PAGE
- Carrier, tracking number, status, estimated delivery, date shipped, items
- Auto-pull from Canada Post (and future carriers via same layout)
- Customer doesn't see carrier complexity

## 5. REORDER SYSTEM
- Reorder full past order or selected items
- Show unavailable/out-of-stock clearly
- Suggest bundle alternatives if item unavailable
- Pulls from live inventory

## 6. ACCOUNT DETAILS PAGE
- Full name, email, phone (optional), password change
- Preferred contact method
- Email verification, security alerts

## 7. ADDRESS BOOK
- Add/edit/delete addresses
- Default shipping + default billing
- Labels: Home, Work, Gift, Other
- Syncs to checkout
- Local pickup option if admin enabled

## 8. PAYMENT AREA
- Stripe-only for public orders
- NEVER show cash (admin-only)
- Show: payment status per order, refund status, receipt access
- Failed payment retry if allowed

## 9. WISHLIST / SAVE FOR LATER
- Add/remove wishlist
- Move to cart
- Notify if back in stock (future)

## 10. CUSTOMER SUPPORT AREA
- Contact form
- Order-specific support request
- FAQ/help section (future)
- Connects to admin support view

## 11. PROMOS / OFFERS AREA (MVP Omit)
- View active codes, first-time offers, bundle recommendations
- Keep clean, not spammy

## 12. LOYALTY / SAUCE CLUB (FUTURE)
- Points, perks, early access, VIP offers, referrals

## 13. SUBSCRIPTIONS / SAUCE CLUB (FUTURE)
- Pause/skip/skip, update address, change plan, cancel

## 14. NOTIFICATIONS AREA
- Order placed, shipped, tracking updated, refund, account changes
- Email toggle for promos (transactional always on)

## 15. PRODUCT REVIEWS (FUTURE)
- Rating + written review + photos
- Verified purchaser only

## 16. QR CODE / BOTTLE EXPERIENCE
- Customer scans QR from bottle → lands on product/promo/special page
- Logged-in: reorder, bundle offer, leave review, learn about sauce
- Anonymous: mailing list signup, limited edition alerts

## 17. SECURITY PAGE
- Change password, recent login activity, logout other sessions, 2FA later

## 18. PRIVACY / DATA PAGE
- View saved data summary, request deletion, download data, marketing preferences

## 19. MENU STRUCTURE
Main: Dashboard, Orders, Track Order, Reorder, Wishlist, Addresses, Account Details, Notifications, Support, Security
Future: Reviews, Loyalty, Subscriptions, Offers, Privacy

## 20. RELATIONSHIP RULES
1. Customer sees only own data
2. Cash NEVER appears in customer area (Stripe only)
3. Tracking layout stays same regardless of carrier backend
4. Customer changes to name/email/phone/address sync to admin
5. Support requests connect to account + order
6. Reorders pull from live inventory
7. Notifications reflect real events automatically

## 21. MVP BUILD ORDER
1. Customer login/account system
2. Dashboard
3. Orders
4. Tracking
5. Account details
6. Address book
7. Payment/order receipts
8. Reorder
9. Support form
10. Security basics

Phase 2: Wishlist, Reviews, Offers, Loyalty, QR-enhanced, Subscriptions
