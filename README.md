# Practice Sheet — SaaS starter

A deployable Next.js app: account signup, a free trial (no card required), and
Stripe-billed monthly/yearly subscriptions gating a math worksheet generator
(grades 1–8, self-checking answer keys, print/PDF/share).

This is a real, runnable codebase — but it hasn't been installed or run yet.
Follow the steps below in order; each one only takes a few minutes.

## 1. Install dependencies

```bash
npm install
```

## 2. Set up a database (free)

Pick one:
- **[neon.tech](https://neon.tech)** — free Postgres, easiest to start with
- **[supabase.com](https://supabase.com)** — also free, includes a dashboard
- Any Postgres you already run

Copy the connection string it gives you.

## 3. Set up Stripe (free to create, only charges real cards in live mode)

1. Create an account at [stripe.com](https://stripe.com)
2. Stay in **Test mode** while you build
3. Go to **Product catalog** → create one product ("Practice Sheet Pro") with
   two recurring **Prices**: one monthly, one yearly. Copy both Price IDs
   (they look like `price_1Abc...`)
4. Go to **Developers → API keys** → copy the **Secret key**
5. You'll add the webhook secret in step 6

## 4. Configure environment variables

```bash
cp .env.example .env
```

Fill in every value in `.env`:
- `DATABASE_URL` — from step 2
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
- `STRIPE_SECRET_KEY`, `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_YEARLY` — from step 3
- `STRIPE_WEBHOOK_SECRET` — from step 6, add it after deploying
- `NEXTAUTH_URL` / `NEXT_PUBLIC_APP_URL` — `http://localhost:3000` while testing locally

## 5. Create the database tables

```bash
npm run db:push
```

## 6. Run it locally

```bash
npm run dev
```

Visit `http://localhost:3000`, sign up, and confirm the dashboard loads with
the worksheet generator (you're on the free trial automatically — no card
needed).

To test billing locally, install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
and run:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
This prints a webhook signing secret — put it in `STRIPE_WEBHOOK_SECRET`.

## 7. Deploy

**Recommended: [Vercel](https://vercel.com)** (built by the makers of Next.js, free tier is plenty to start):
1. Push this project to a GitHub repo
2. Import it in Vercel
3. Add all the same environment variables from your `.env` in Vercel's project settings
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your real domain
5. Deploy

Any other Node.js host (Railway, Render, your own server) works too — the
app has no Vercel-specific code.

## 8. Point your domain at it

In Vercel (or your host), add your domain (e.g. `aethelsystems.com`) under
project settings → Domains, and update your DNS records as instructed.

## 9. Go live with Stripe

Once everything works in Stripe **test mode**, flip Stripe to **live mode**,
create the same product/prices again (live and test are separate), and swap
in the live API keys. Also add a **live webhook endpoint** in Stripe pointing
to `https://your-domain.com/api/stripe/webhook`, and copy its signing secret
into `STRIPE_WEBHOOK_SECRET` on your live deployment.

---

## What's in here

| Piece | Where |
|---|---|
| Worksheet generation logic (same as the standalone HTML tool) | `lib/generators.ts` |
| Sign up / free trial creation | `app/api/signup/route.ts` |
| Login/session handling | `lib/auth.ts`, `app/api/auth/[...nextauth]` |
| Trial + subscription access check | `lib/access.ts` |
| Stripe checkout (start a subscription) | `app/api/stripe/checkout/route.ts` |
| Stripe webhook (keeps DB in sync with billing) | `app/api/stripe/webhook/route.ts` |
| Billing portal (customers manage/cancel their own plan) | `app/api/stripe/portal/route.ts` |
| Gated dashboard | `app/dashboard/page.tsx` |
| The actual generator UI | `components/WorksheetGenerator.tsx` |

## What's intentionally left simple, on purpose

- **Styling** is clean Tailwind, not a pixel-perfect recreation of the
  chalkboard theme from the standalone HTML version — restyling this is much
  easier than the auth/billing plumbing was, and can come next.
- **Only Math, grades 1–8** — same content scope as before; more subjects/
  grades are additions to `lib/generators.ts`, not architecture changes.
- **Password reset / email verification** aren't included yet — worth adding
  before a real public launch so people aren't locked out of accounts.
- **The "describe what you need" box** is still a keyword parser, not a live
  AI model, same as the standalone version.
