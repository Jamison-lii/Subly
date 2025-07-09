# Subly – AI-Powered Subscription & Budget Manager

**Subly** is a modern SaaS web application that helps users manage their recurring expenses — subscriptions to Netflix, Spotify, mobile data bundles, cloud tools, etc. — using AI-driven insights. It works for both global (Western) users and local (African) users with support for international banking (via Plaid/TrueLayer) and local methods (SMS parsing, Mobile Money). Subly helps users:

* Automatically detect and track subscriptions
* Get AI suggestions to cancel, downgrade, or bundle services
* Set personal budgets and monitor recurring costs
* Optimize spending with detailed analytics
* Support mobile-first and offline-friendly use in low-bandwidth regions

---

## 🧱 Tech Stack (for Cursor AI awareness)

* **Frontend**: Next.js 14+, Tailwind CSS, TypeScript
* **Auth**: Supabase Auth (email login, magic link)
* **Database**: Supabase (PostgreSQL)
* **Payments**: Stripe (for Pro/Plus tiers)
* **AI Engine**: OpenAI API (insight engine, smart chat advisor)
* **Integrations**: Plaid (for US/EU), TrueLayer (UK), Mobile Money placeholder, SMS text parsing
* **Hosting**: Vercel (preferred)

---

## 🌍 Value Proposition

* All your subscriptions in one place
* Automatically detects new charges
* AI suggestions to cancel unused services
* Cancel, downgrade or optimize with one click
* Budget tracking and insights
* SMS and mobile money support for users in Africa
* Simple, elegant interface with Deep Emerald Green theme (#007A5E)

---

## 📋 MVP Features Checklist

* [x] Auth: Signup, Login, Forgot Password (via Supabase)
* [x] Dashboard with total spend, upcoming charges, AI suggestions
* [x] Subscription list (manual + Plaid integration)
* [x] SMS text parsing support (Africa)
* [x] Budget widget
* [x] AI Insights (cancel suggestion, usage warnings)
* [x] Notifications (email/SMS)
* [x] Settings page
* [x] Pricing page (Free, Pro, Plus tiers)

---

## 🗂 Suggested Folder Structure

```
/components
  /ui          # Buttons, inputs, cards
  /auth        # Login, signup, auth guard
  /dashboard   # Stats, budget widget, insights
/pages
  /dashboard
  /auth
  /subscriptions
  /settings
/styles
/lib
/utils
/public
```

---

## 📑 Pages & Flows

### 1. Landing Page

* Hero with CTA
* How it works section
* Feature breakdown (Track, Cancel, Save, Optimize)
* Pricing comparison
* Testimonials + FAQs

### 2. Auth Pages

* Login
* Signup
* Forgot Password

### 3. Dashboard 

* Overview cards (Monthly Spend, Active Subs, Upcoming Payments)
* AI Suggestions section (inactive subs, duplicates, bundling options)
* Budget health (Recurring % of monthly income)

### 4. Subscriptions Page

* List subscriptions (add/edit/delete)
* Auto-detected or manually added
* Tag as Work/Personal/Shared
* Cancel button or external guidance

### 5. Add Accounts Page

* Plaid/TrueLayer connection
* SMS input or JSON mock (Africa)
* Manual entry form

### 6. Insights Page

* AI-driven cancel/downgrade suggestions
* Duplicate subscription warnings
* Expense trend analysis
* Chat assistant (optional later phase)

### 7. Settings Page

* Region/currency selection
* Notification preferences
* Linked accounts
* Dark mode toggle
* Subscription plan settings

### 8. Pricing Page

* Free: 5 subscriptions, basic alerts
* Pro: \$3.99/month — unlimited subs, AI alerts, cancel assistance
* Plus: \$6.99/month — shared profiles, smart budget analytics, AI chat

### 9. Admin Panel (Optional Later)

* View user metrics
* Feedback review
* Manage integrations

---

## 🎨 UI Theme

* Primary: Deep Emerald Green `#007A5E`
* Accent: Mint `#D5FFE4`
* Background (light): `#F8F9FA`
* Background (dark): `#121212`
* Text: `#212121` (light) or `#FFFFFF` (dark)

---

## 🧠 AI Features

* Cancel unused subscriptions
* Detect duplicate services
* Track cost vs usage ratio
* Personalized chat insights (later phase)
* Budget smart suggestions

---

## 🪙 Local + Global Support

* Plaid / TrueLayer for US/UK/EU users
* SMS parsing for Mobile Money transaction text (Africa)
* Currency selection in settings
* Offline mode w/ sync

---

## ✅ Next Steps

* [ ] Add Supabase auth logic and session handling
* [ ] Build dashboard layout + sample cards
* [ ] Connect to Supabase DB for storing subscriptions
* [ ] Add mock SMS parser + manual entry form
* [ ] Create insights engine v1 (rule-based)
* [ ] Wire pricing tiers with Stripe logic

---

> 📘 This document is for Cursor AI to fully understand the Subly web app project and guide code generation accordingly. Use this for all context-aware prompts like: "Create the subscription list page", or "Add AI suggestions section to dashboard".
