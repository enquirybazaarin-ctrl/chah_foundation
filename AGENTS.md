# CHAH Foundation — Engineering Rules

## Project

CHAH Foundation is a production-grade NGO website rebuild.

The system consists of three applications:

- website
- admin
- backend

## Approved Stack

### Website
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

### Admin
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Node.js
- Express
- TypeScript
- Prisma

### Database
- MySQL

### External Services
- Razorpay for payments
- MSG91 for email

### Current Infrastructure

Redis and BullMQ are NOT part of the current implementation.

Do not introduce Redis, BullMQ, or another queue system unless explicitly approved.

---

# Architecture

Use feature-based modular architecture.

Backend business domains must be separated into modules.

Each module should keep responsibilities separated between:

- routes
- controllers
- services
- repositories
- validation
- types

Controllers must remain thin.

Business logic belongs in services.

Database access belongs in repositories.

---

# TypeScript

Use strict TypeScript.

Avoid `any`.

Do not disable TypeScript errors simply to make the build pass.

Prefer explicit types and safe type narrowing.

---

# Database

Use Prisma with MySQL.

Use:

- foreign keys
- indexes
- unique constraints
- transactions
- appropriate enums
- timestamps
- referential integrity

Financial amounts must use DECIMAL.

Never use FLOAT or DOUBLE for money.

Successful financial records must not be casually deleted.

---

# Donations

The donation system is financially sensitive.

Support:

- online donations
- offline donations
- payment failures
- payment retries
- refunds
- certificates
- email delivery

Frontend payment success must never be treated as authoritative.

Payment confirmation must be verified through the backend/payment provider.

Razorpay webhooks must be signature verified and idempotent.

Repeated webhook events must not create duplicate payments, donations, certificates or emails.

---

# Offline Donations

Offline donations may use:

- CASH
- CHEQUE
- BANK_TRANSFER
- OTHER

Never create fake Razorpay payment IDs for offline donations.

---

# Certificates

A successful donation normally receives one certificate.

Certificate generation must be idempotent.

If a certificate already exists, retrying email must not generate another certificate.

Certificate and email status must be tracked separately.

---

# Security

Never expose:

- database credentials
- Razorpay secret
- MSG91 API key
- storage secrets
- authentication secrets

to frontend code.

Secrets must remain server-side.

Validate all external input.

Use:

- authentication
- authorization
- RBAC
- rate limiting
- CORS
- secure headers
- input validation
- webhook signature verification
- secure password hashing
- audit logging

---

# Frontend

Use Next.js Server Components by default.

Use Client Components only when required.

Do not add `"use client"` unnecessarily.

Avoid giant components.

Keep reusable UI components separate from domain-specific features.

---

# SEO

The public website is SEO-critical.

Indexable pages should have:

- title
- meta description
- canonical URL where required
- Open Graph metadata
- semantic HTML
- correct heading hierarchy
- descriptive alt text
- structured data where appropriate
- sitemap
- robots.txt

Do not arbitrarily change existing public URLs.

---

# File Uploads

Do not store image binaries in MySQL.

Store media files in file/object storage.

Store only metadata and file URL/path in the database.

Validate:

- MIME type
- extension
- file size
- filename
- dimensions where appropriate

Never trust user-provided filenames or paths.

---

# Dependencies

Do not add a dependency unless it is necessary.

Before adding a package:

1. Check whether existing dependencies solve the problem.
2. Prefer established maintained libraries.
3. Explain why the package is required.

---

# AI Development Rules

Before implementing a feature:

1. Read AGENTS.md.
2. Read relevant documentation.
3. Inspect the existing implementation.
4. Identify affected modules.
5. Create an implementation plan.
6. Implement only the requested scope.
7. Run type checking.
8. Run linting.
9. Run relevant tests.
10. Review security implications.
11. Review database implications.
12. Report exactly what changed.

Do not modify unrelated files.

Do not rewrite existing working code without a reason.

Do not silently change architecture.

Do not invent business requirements.

Do not create fake production data or fake NGO claims.

---

# Uncertainty Rule

If a decision could materially affect:

- database schema
- payments
- authentication
- security
- SEO URLs
- financial records

and the requirement is unclear:

STOP and ask for clarification.

Do not invent a requirement.

For low-risk implementation details, use the simplest conventional solution and document the assumption.

---

# Testing

A feature is not complete merely because the code compiles.

Relevant tests must be added for important business logic.

Critical flows include:

- authentication
- authorization
- donations
- payments
- Razorpay webhooks
- certificates
- email
- critical CRUD operations

---

# Definition of Done

A feature is complete only when:

- implementation is complete
- TypeScript passes
- lint passes
- relevant tests pass
- errors are handled
- loading/empty/error states are handled where applicable
- security has been considered
- database migrations are created where required
- API changes are documented where appropriate

Never claim a feature is complete without verification.

---

# Stop Rule

Do not automatically continue to the next feature.

After completing the requested task:

1. Report files created.
2. Report files modified.
3. Report dependencies added.
4. Report database changes.
5. Report tests run.
6. Report test results.
7. Report assumptions.
8. Report remaining issues.

Then STOP.