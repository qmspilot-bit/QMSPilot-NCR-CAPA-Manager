# QMSPilot NCR & CAPA Manager

An enterprise-style quality management workspace for controlling nonconformances from initial detection through corrective action and verified closure.

## Included workflow

- Executive dashboard with NCR, due-date, overdue, and closure metrics
- Searchable nonconformance register with priority and status filters
- Guided five-step NCR intake and CAPA workflow
- Immediate containment, risk scoring, disposition, and MRB documentation
- Standard five-Why analysis with optional additional Whys
- Corrective-action assignments, due dates, status tracking, and effectiveness checks
- Evidence uploads for photos, PDFs, documents, spreadsheets, and supporting records
- Record-level activity history and audit-ready review
- Reporting for closure rate, cycle time, cost of poor quality, and source trends
- Responsive QMSPilot interface for desktop and mobile use

## Application architecture

- React and Vinext application UI
- Cloudflare D1 for persistent NCR, causal-chain, action, attachment, and activity data
- Cloudflare R2 for private evidence files
- Server-side API routes with workspace-scoped records
- Optional ChatGPT identity headers for personalized review deployments

## Local development

```bash
npm ci
npm run dev
```

Run quality checks with:

```bash
npm run lint
npm run build
```

The deployment declares its D1 and R2 bindings in `.openai/hosting.json`. Database schema changes are defined in `db/schema.ts`; generate migrations with `npm run db:generate`.

## Current release scope

This build is prepared as a private review release. Shopify subscription provisioning is intentionally not included in this repository yet.

---

QMSPilot — Find the issue. Control the risk. Prevent recurrence.
