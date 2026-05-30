# Chowby Didi Haus — Website

**chowbydidihaus.com** · Built with Next.js · Deployed on Vercel

## Setup

1. Copy `.env.example` to `.env.local` and fill in your keys
2. `npm install`
3. `npm run dev` → http://localhost:3000

## Deploy

```bash
vercel --prod
```

## Environment Variables (set in Vercel dashboard)

| Key | Description |
|-----|-------------|
| `RESEND_API_KEY` | Email API — free at resend.com |
| `DIDI_EMAIL` | Where booking notifications go |
| `WHATSAPP_NUMBER` | WhatsApp contact number |
| `NEXT_PUBLIC_PAYSTACK_KEY` | Paystack public key |
| `PAYSTACK_SECRET_KEY` | Paystack secret key |

## API Endpoints

- `POST /api/enquiry` — booking form submissions
- `GET /api/contact` — contact details
