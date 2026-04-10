# SupportForge — Test Plan

_Run through these tests manually. Check each item as you go._

---

## 🌐 URLs

| Purpose | URL |
|---------|-----|
| **Live App** | https://support.beta.nex.monster |
| **Widget Script** | https://support.beta.nex.monster/widget.js |
| **Demo Account** | admin@supportforge.demo / admin123 |
| **Test Account** | dan.test@nex.monster / test123 |

---

## ✅ Test Checklist

### 1. Registration & Login
- [ ] Go to https://support.beta.nex.monster
- [ ] Click "Get Started" / "Start Free Trial"
- [ ] Fill in: Name, Email, Password, Workspace Name
- [ ] Click Create Account
- [ ] Should land in the dashboard
- [ ] Log out
- [ ] Log back in with credentials
- [ ] ✓ Pass / ✗ Fail: _______________

### 2. Dashboard
- [ ] Sidebar shows: Conversations, Team, Settings, Billing
- [ ] Stats cards visible (conversations, open, resolved)
- [ ] ✓ Pass / ✗ Fail: _______________

### 3. Team Invitation
- [ ] Go to Settings → Team
- [ ] Click "Invite Member"
- [ ] Enter a test email + select role (Agent)
- [ ] Click Send Invitation
- [ ] Should get an invitation link
- [ ] ✓ Pass / ✗ Fail: _______________

### 4. Widget Setup
- [ ] Go to Settings → Widget
- [ ] Copy the embed code (or use the code below)
- [ ] Create a simple HTML file on your computer:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Test Widget Site</title>
</head>
<body>
  <h1>My Test Site</h1>
  <p>Chat with us!</p>
  
  <script>
    window.SupportForge = {
      workspaceId: 'YOUR_WORKSPACE_ID_FROM_SETTINGS',
      color: '#6366f1',
      position: 'right'
    };
  </script>
  <script src="https://support.beta.nex.monster/widget.js" async></script>
</body>
</html>
```

- [ ] Open the HTML file in a browser
- [ ] Chat bubble appears in bottom-right
- [ ] Click it → see welcome message
- [ ] Send a message
- [ ] ✓ Pass / ✗ Fail: _______________

### 5. Agent Dashboard (receive message)
- [ ] As Admin, check the Conversations tab
- [ ] See the message sent from the widget
- [ ] Click to open the conversation
- [ ] Type a reply
- [ ] Customer sees it instantly
- [ ] ✓ Pass / ✗ Fail: _______________

### 6. Canned Responses
- [ ] Go to Settings → Canned Responses
- [ ] Click "New Response"
- [ ] Shortcut: `!hello`
- [ ] Content: `Hi! Thanks for reaching out.`
- [ ] Save
- [ ] In a conversation, type `/!hello`
- [ ] Should see dropdown with your response
- [ ] ✓ Pass / ✗ Fail: _______________

### 7. Billing (Stripe) ⚠️ REQUIRES STRIPE KEYS
- [ ] Go to Settings → Billing
- [ ] See "Trial" plan, $49/mo
- [ ] Click "Upgrade to Pro" (or "Start Free Trial")
- [ ] Should redirect to Stripe Checkout
- [ ] Use Stripe test card: `4242 4242 4242 4242`
- [ ] Any future expiry date, any 3-digit CVC
- [ ] Should succeed and return to dashboard
- [ ] ✓ Pass / ✗ Fail: _______________

### 8. Billing Portal
- [ ] After subscribing, go to Settings → Billing
- [ ] Click "Manage Billing"
- [ ] Should open Stripe Billing Portal
- [ ] Can see invoices, update payment method
- [ ] ✓ Pass / ✗ Fail: _______________

### 9. Cancel Subscription
- [ ] In Stripe Billing Portal
- [ ] Click Cancel Subscription
- [ ] Confirm cancellation
- [ ] Should stay active until period end
- [ ] ✓ Pass / ✗ Fail: _______________

---

## 🐛 Bugs Found

| # | Bug Description | Severity | Notes |
|---|----------------|----------|-------|
| 1 | | | |
| 2 | | | |
| 3 | | | |

---

## 💡 Suggestions / Improvements

| # | Suggestion |
|---|------------|
| 1 | |
| 2 | |

---

_Use ✗ for fail, ✓ for pass. Add notes for anything weird._
