# ✧ VALORA
### Every payment has potential. Make yours count.

**VALORA** is an explainable financial intelligence portfolio MVP. It recommends fictional Canadian credit card strategies using deterministic rewards economics, counterfactual analysis and an optional AI explanation layer.

> ⚠️ All 12 cards, institutions, fee structures and welcome bonuses in this demo are **fictional**. This is educational decision support, not a live credit-card comparison service, personalized financial advice, credit approval assessment, or offer of credit.

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

No API key or database is required. Your profile is stored in localStorage for convenience. To enable natural-language explanations, set `OPENAI_API_KEY` server-side in `.env.local`, optionally set `OPENAI_MODEL`, then restart.

## Tech stack

Next.js App Router, React 19, TypeScript, custom responsive CSS, Recharts, Lucide icons, Zod, OpenAI SDK, Vitest, Playwright. See [ARCHITECTURE.md](ARCHITECTURE.md).

## Working pages

Dashboard, Discover Cards, My Financial Twin, Compare (up to four), Simulator, My Wallet, Travel & Loyalty, Ask VALORA, Evidence Ledger and Settings. All have functioning interactive controls and deterministic recalculation. Three seeded example personas are included; cards are invented.

## Calculation methodology

For each spending category: `min(annual_spend, cap) × multiplier × base_reward_value + max(0, annual_spend − cap) × base_reward_value`. The card's ongoing net is `gross rewards − annual fee − FX cost − modeled interest + eligible benefit value`. First-year net adds only eligible welcome bonus. Interest is a simplified annual-average-balance model; it is **not** an issuer-accurate statement estimate. FX spending is already included in category spending and is not double-counted as rewards. Benefits are constrained by entered travel and lounge usage. Points valuation scenario amounts in Travel & Loyalty are illustrative only. Card eligibility checks the selected consumer/business type and annual fee tolerance, **not** underwriting.

**Recommendations:** Sorted by ongoing CAD net value, never by an AI-generated score or issuer revenue. Bonus value is separate. If you carry a balance, the dashboard warns about interest costs. Wallet purchase estimates account for a simplified category cap usage proxy, not real transaction history.

## Project layout

- `app/` — App Router entry, API and styles
- `components/ValoraApp.tsx` — all interactive application pages
- `data/cards.ts` — 12 fictional cards, clearly distinguished from issuer information
- `lib/engine.ts` — authoritative calculation and ranking
- `lib/types.ts` — typed profile / card / evaluation data
- `lib/validation.ts` — AI API payload validation
- `tests/` — unit tests (Vitest)
- `e2e/` — browser smoke path (Playwright)
- `ARCHITECTURE.md` — system architecture diagram
- `DEMO_SCRIPT.md` — 90-second product demonstration
- `GTM.md` — positioning and go-to-market strategy

## Tests

```bash
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Tests are included but must be run after installing dependencies; do not assume a clean run without executing them. Browser tests need the Playwright browser installed. A real financial catalog would need extensive independent test vectors, error and bounds checking, integration tests and expert compliance review.

## Deploy to Vercel

Import this repo into Vercel, set framework to Next.js, and deploy. `OPENAI_API_KEY` is optional and must be entered as a server-side environment variable; never use `NEXT_PUBLIC_` for it. User data in the demo is local to the browser. Vercel preview builds work without a database or AI credential.

## Privacy and limitations

No signup, banking credentials, full card numbers, IDs, or credit scores. Financial assumptions stay in localStorage until removed from Settings. Optional AI requests share only a summary of calculations and the user's question with the configured LLM API. The demo has no server-side authentication, encryption of localStorage, live issuer feeds, bank API connectivity, validated approval model, reward expirations, real award redemption engine, current interest compounding or audited legal disclosures. There is no claim that its invented cards are available for application.

## Path to production

1. Verified and versioned issuer disclosures; reliable source URLs and last-check timestamps.
2. Robust card-specific reward tiers, merchant codes, caps, qualification, point expiry and benefits.
3. Real privacy/compliance architecture, audited entitlements, eligibility and source freshness alerts.
4. Opt-in consent-based secure data integrations and encrypted Postgres storage.
5. Independent mathematical and regulatory review, scenario sensitivity and accessible E2E tests.
6. Only then consider adding real credit-card products or consumer-facing recommendations.
