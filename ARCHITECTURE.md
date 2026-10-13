# VALORA architecture

```mermaid
flowchart TD
    U[Customer in browser] --> UI[Next.js React UI]
    UI --> P[Editable Financial Twin]
    P --> LS[(Browser localStorage - demo only)]
    P --> R[Eligibility + Rewards Engine]
    D[(Fictional demo card data)] --> R
    R --> O[Card ranking / Compare / Simulator / Wallet]
    O --> E[Evidence Ledger]
    O --> A[POST /api/ask with validated summary]
    A --> Z{Server API key configured?}
    Z -->|No| M[Deterministic explanation]
    Z -->|Yes| AI[OpenAI response - explanations only]
    AI --> UI
    M --> UI
```

The authoritative quantitative path is `lib/engine.ts`. The language model cannot change numeric results; it receives only an already-calculated, Zod-validated context summary. Demo mode is 100% fictional and uses browser persistence, not a production financial data store. For a real launch, add a verified issuer ingestion process, auditable term versions, secure authentication and PostgreSQL persistence, monitoring, card-specific redemption schedules, richer interest models and compliance review.
