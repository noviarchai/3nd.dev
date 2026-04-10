# SupportForge — Getting Started Guide

_Welcome to SupportForge! This guide will walk you through everything you need to set up your customer support workspace and start helping customers._

---

## 🚀 Quick Start (TL;DR)

1. **Sign up** at [support.beta.nex.monster](https://support.beta.nex.monster) — 14-day free trial, no credit card
2. **Add your team** — invite agents from the Team Settings
3. **Get your chat widget** — copy the embed code from Settings → Widget
4. **Paste the widget** into your website's `<head>`
5. **Start chatting** with customers in the dashboard

---

## 📋 Step 1: Create Your Workspace

### Signing Up

1. Go to [support.beta.nex.monster](https://support.beta.nex.monster)
2. Click **"Get Started"** or **"Start Free Trial"**
3. Fill in your details:
   - **Your Name** — how you'll appear to customers
   - **Email** — your login email
   - **Password** — at least 6 characters
   - **Workspace Name** — your company or team name
4. Click **Create Account**
5. You'll be logged in automatically — no email verification needed for the demo

### Demo Account (Already Set Up)

If you just want to explore:
- **Email:** `admin@supportforge.demo`
- **Password:** `admin123`

---

## 👥 Step 2: Add Your Team

### Inviting Agents

1. In the dashboard, click **Settings** (⚙️ icon) in the sidebar
2. Go to **Team** tab
3. Click **Invite Member**
4. Enter their email and select their role:
   - **Admin** — full access including billing and settings
   - **Agent** — can handle conversations, use canned responses

5. Click **Send Invitation**
6. They'l receive a link to create their account

### Roles Explained

| Role | Dashboard | Conversations | Team | Settings | Billing |
|------|-----------|---------------|------|----------|---------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |
| Agent | ✅ | ✅ (assigned only) | ❌ | ❌ | ❌ |

---

## 💬 Step 3: Add the Chat Widget to Your Website

### Getting Your Widget Code

1. Go to **Settings → Widget**
2. Customize your widget:
   - **Widget Color** — pick a color that matches your brand
   - **Position** — bottom-right or bottom-left
   - **Welcome Message** — what customers see when they first chat
3. Copy the generated code

### Installing the Widget

Paste this code into your website's `<head>` section:

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

**Replace `YOUR_WORKSPACE_ID`** with your actual workspace ID from Settings → Widget.

### Testing the Widget

1. Open your website with the widget installed
2. You should see the chat bubble in the corner
3. Click it to open the chat
4. Try sending a message — it should appear in your dashboard!

---

## 🎯 Step 4: Managing Conversations

### The Conversation List

When customers send messages, they appear in the **Conversations** tab:

- **Open** — active conversations waiting for a response
- **Pending** — conversations you've replied to but customer hasn't responded
- **Resolved** — closed conversations

### Replying to Customers

1. Click a conversation from the list
2. Type your reply in the message box
3. Press **Enter** or click **Send**
4. The customer sees it instantly via WebSocket

### Assigning Conversations

1. Click the **Assignee** dropdown in a conversation
2. Select an agent or leave as "Unassigned"
3. Agents only see conversations assigned to them

### Closing Conversations

1. Click the **checkmark** icon in the conversation
2. The conversation moves to "Resolved"
3. You can reopen it anytime by clicking **Reopen**

---

## ⚡ Step 5: Canned Responses (Quick Replies)

Canned responses let you save templated answers with shortcuts.

### Creating a Canned Response

1. Go to **Settings → Canned Responses**
2. Click **New Response**
3. Fill in:
   - **Title** — internal name (e.g., "Welcome Greeting")
   - **Shortcut** — the trigger word (e.g., `!welcome`)
   - **Message** — the actual response text
4. Click **Save**

### Using Canned Responses

In the chat, type `/` followed by your shortcut:

```
!welcome
```

A dropdown appears with matching responses — select one to insert it.

---

## 💳 Step 6: Upgrading to Paid

### The Free Trial

Your workspace starts with a **14-day free trial** — no credit card required.

### Upgrading

1. Go to **Settings → Billing**
2. You'll see your current plan and pricing ($49/month)
3. Click **Upgrade to Pro**
4. You'll be redirected to **Stripe Checkout**
5. Enter your payment details
6. Done! Your subscription is now active

### Managing Billing

From **Settings → Billing**, you can:
- View your **current plan**
- See **invoices**
- Open the **Stripe Billing Portal** for payment methods, cancellation, etc.

### Canceling

1. Go to **Settings → Billing**
2. Click **Manage Billing**
3. In Stripe's portal, click **Cancel Subscription**
4. Your subscription stays active until the end of the billing period

---

## 🔧 Troubleshooting

### "Workspace ID" Not Found

1. Go to **Settings → Widget**
2. Your Workspace ID is shown at the top
3. Make sure you copied it correctly into the widget code

### Chat Widget Not Appearing

1. Check the browser console for errors
2. Make sure the script tag is in the `<head>`, not `<body>`
3. Try clearing your cache
4. Confirm your Workspace ID is correct

### Messages Not Sending

1. Make sure you're logged in
2. Check your internet connection
3. Try refreshing the page
4. If using a custom integration, check the API logs

### Can't Log In

1. Double-check your email and password
2. Use **"Forgot Password"** if available (coming soon)
3. Contact support if your account was created by an invitation

---

## 📞 Need Help?

- **Email:** hello@nex.monster
- **Documentation:** [support.beta.nex.monster/docs](https://support.beta.nex.monster/docs) (coming soon)

---

## 🆕 What's Coming Next

- Email integration (customers can email you, it becomes a ticket)
- Chatbot/auto-responder
- Mobile app
- Advanced analytics
- Dark mode 🌙

---

_Built with ❤️ by the SupportForge team_
