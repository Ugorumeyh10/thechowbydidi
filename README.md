# Chowby Didi Haus — Website

**chowbydidihaus.com** · Built with Next.js · Deployed on Vercel

## Setup

1. Copy `.env.example` to `.env.local` and fill in your keys.
2. `npm install`
3. `npm run dev` → http://localhost:3000

> With **no** `DATABASE_URL` set, form submissions are saved to local JSON files
> under `.data/` so you can develop with zero signup. Production needs a database
> (see below) because serverless filesystems don't persist.

## Free database (no payment until you scale)

1. Create a free Postgres at [neon.tech](https://neon.tech) or [supabase.com](https://supabase.com) — no credit card.
2. Copy the connection string into `DATABASE_URL` (locally in `.env.local`, in prod in Vercel env vars).
3. Tables (`enquiries`, `receipts`, `subscribers`) are created automatically on first use.

## Deploy

```bash
vercel --prod
```

Set the environment variables below in the Vercel dashboard.

## Environment variables

| Key | Required | Description |
|-----|----------|-------------|
| `DATABASE_URL` | prod | Postgres connection string (Neon/Supabase free tier). Blank = local-file fallback. |
| `ADMIN_TOKEN` | yes | Guards `/admin` and `/api/admin/*`. Use a long random string. |
| `RESEND_API_KEY` | rec. | Email via [resend.com](https://resend.com). **Verify your sending domain (SPF+DKIM)** or mail bounces. |
| `DIDI_EMAIL` | rec. | Where enquiry/receipt notifications are sent. |
| `NEXT_PUBLIC_BANK_NAME` / `_ACCOUNT_NAME` / `_ACCOUNT_NUMBER` | yes | Bank-transfer details shown on the site. |
| `WHATSAPP_NUMBER` | rec. | Powers click-to-chat (wa.me) links + floating button. |
| `WHATSAPP_TOKEN` / `WHATSAPP_PHONE_ID` / `WHATSAPP_TO` | opt. | WhatsApp Cloud API team notifications (free tier). |
| `SLACK_WEBHOOK_URL` | opt. | Slack alerts on new enquiry/receipt/subscriber. |
| `NEXT_PUBLIC_SITE_URL` | rec. | Canonical URL (used by sitemap + `<link rel=canonical>`). |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | opt. | Enables privacy-friendly [Plausible](https://plausible.io) analytics. |

Card payments (Paystack) are **disabled** for now — customers pay by bank transfer
and upload a receipt. Re-enable later via the commented keys in `.env.example`.

## Admin dashboard

`/admin` — log in with `ADMIN_TOKEN`. Tabs for **Enquiries**, **Receipts**
(with file view + verify/reject), and **Subscribers**. Search, status filters,
pagination, and CSV export. Receipts are auto-linked to enquiries by reference.

## API endpoints

Public:
- `POST /api/enquiry` — bookings, academy enrolments, voucher requests (`type` field)
- `POST /api/receipt` — bank-transfer receipt upload (validated by magic bytes)
- `POST /api/newsletter` — mailing-list signup
- `GET  /api/contact` — contact details

Admin (bearer token):
- `GET/PATCH /api/admin/enquiries` — list / update status (`contacted`/`booked`/`closed`)
- `GET/PATCH /api/admin/receipts` — list, stream file (`?id=`), update status (`verified`/`rejected`)
- `GET /api/admin/subscribers` — list subscribers
- `GET /api/admin/export?type=enquiries|receipts|subscribers` — CSV download

All public forms have honeypot + per-IP rate limiting.
