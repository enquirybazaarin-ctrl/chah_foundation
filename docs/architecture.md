# Architecture Documentation

## 1. Website Application
- **Framework**: Next.js (Server Components by default, Client Components only when required)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS, shadcn/ui

## 2. Admin Application
- **Framework**: Next.js
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS, shadcn/ui

## 3. Backend Application
- **Framework**: Node.js, Express
- **Language**: TypeScript (strict)
- **ORM**: Prisma
- **Architecture**: Feature-based modular architecture. Separation of responsibilities between routes, controllers, services, repositories, validation, and types. Controllers must remain thin; business logic belongs in services, and database access in repositories.

## 4. Communication Between Applications
- REST API (Express Backend serving the Next.js applications).

## 5. Authentication Boundary
- Authentication, authorization, and RBAC are implemented. Secrets must remain server-side and never be exposed to frontend code.

## 6. Database Boundary
- **Database**: MySQL via Prisma.
- **Data Integrity**: Uses foreign keys, indexes, unique constraints, transactions, appropriate enums, timestamps, and referential integrity.
- **Financial Data**: Financial amounts must use DECIMAL. Never use FLOAT or DOUBLE for money. Successful financial records must not be casually deleted.

## 7. Payment Boundary
- **Gateway**: Razorpay for payments.
- **Webhooks**: Signature verified and idempotent. Repeated events must not create duplicate records. Frontend payment success must never be treated as authoritative; verified via backend.
- **Offline Donations**: Handled without creating fake Razorpay IDs (CASH, CHEQUE, BANK_TRANSFER, OTHER).

## 8. Email Boundary
- **Service**: MSG91 for email.
- **Certificates/Email Logs**: Certificate and email status are tracked separately. Certificate generation must be idempotent. If a certificate already exists, retrying email must not generate another certificate.
  - **Separation flow**:
    1. Successful donation
    2. → certificate generation
    3. → certificate stored
    4. → email delivery
  - Email retry must operate independently from certificate generation.

## 9. Media/File-Storage Boundary
- **Storage**: File/object storage (not stored as binaries in MySQL).
- **Database**: Stores only metadata and file URL/path.
- **Validation**: Validates MIME type, extension, file size, filename, and dimensions. Never trust user-provided filenames.

## 10. Security Boundary
- Validates all external input.
- Implements: Authentication, Authorization, RBAC, Rate limiting, CORS, Secure headers, Input validation, Webhook signature verification, Secure password hashing, Audit logging.
- Secrets (DB credentials, Razorpay secret, MSG91 API key, etc.) remain entirely server-side.

## 11. Deployment Architecture
- [OPEN QUESTION: Specific hosting provider (e.g., AWS, Vercel) and CI/CD pipelines are not specified in the current rules. Needs clarification.]
- **Infrastructure Note**: Redis and BullMQ are NOT part of the current implementation. No queue system is introduced.
