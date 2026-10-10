# VeldoraMC Website

React + Vite website foundation for a Minecraft Lifesteal server.

## Included
- Premium dark violet/lavender landing page with smooth scrolling, responsive layouts, animated details, and reduced-motion support.
- Routes for Home, Profiles, Leaderboard, Community, Staff, Support, Store, News, Vote, and Cart.
- Server IP remains "Coming Soon".
- Xbox/Microsoft sign-in is deliberately NOT enabled or simulated. Configure official Microsoft OAuth and a secure server-side session before enabling account linking.
- Profile and leaderboard pages are front-end placeholders ready for later plugin/API integration.
- Community and Discord links are placeholders until the official invite is supplied.
- VeldoraMC favicon included.

## Run locally
Use Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173). The ZIP itself is source code, not a live website; it must be run locally or deployed to a web host to view it in a browser.

## Build for production
```bash
npm run build
npm run preview
```

## Deployment configuration
The sitemap uses `https://veldoramc.example` as a safe placeholder. Before publishing, set `SITE_URL` to your real website domain while building, for example:

```bash
SITE_URL=https://your-domain.example npm run build
```

## Before launch
1. Add the official Discord invite.
2. Configure Microsoft OAuth using the official Microsoft identity flow; never collect Microsoft passwords directly.
3. Connect server stats through a trusted plugin/API for profiles and leaderboards.
4. Configure real store products, checkout, and purchase fulfilment before accepting payments.
5. Set the production domain and update SEO metadata as needed.

## Bundles & payment integration

A new `/bundles` page is included with sample Lifesteal ranks/bundles, currency display options (INR, PKR, USD), INR equivalents, and a checkout form that submits to `POST /api/checkout`.

**Payments are intentionally not active by default.** The frontend requires a trusted backend endpoint that creates a hosted checkout session and returns `{ "checkoutUrl": "https://..." }`. Before launch:

1. Choose a gateway that supports the countries/currencies you intend to accept (for example, Razorpay for eligible India transactions; use a separate eligible provider for international/Pakistan payments if needed).
2. Validate bundle IDs, price, currency, Minecraft username and email on the server. Never accept the client-submitted price as authoritative.
3. Verify the payment provider's webhook signature on the server and make fulfillment idempotent.
4. Generate a receipt/order record and email it only after confirmed payment.
5. Deliver the rank through a server-side console/RCON/plugin API only after verified payment; log failures and retry safely.
6. Replace the example currency conversion factors in `src/pages/Bundles.jsx` with trusted live/server-side exchange rates. The current displayed rates are estimates and are not suitable for charging customers.

No payment credentials or Minecraft server secrets belong in frontend code. The page displays a clear unavailable message until `/api/checkout` is implemented.
