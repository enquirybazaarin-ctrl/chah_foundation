# Requirements

## Overview
The CHAH Foundation project is a production-grade NGO website rebuild consisting of a website, an admin portal, and a backend service.

## Functional Requirements
- **Donation System**: Support online donations (via Razorpay) and offline donations (CASH, CHEQUE, BANK_TRANSFER, OTHER).
- **Payment Handling**: Handle payment failures, retries, and refunds.
- **Certificates**: Generate 80G/donation certificates idempotently (one per successful donation).
- **Email Delivery**: Send transactional emails and track delivery status (via MSG91).
- **Content Management**: Manage domains such as campaigns, blogs, projects, activities, impact, testimonials, FAQs, gallery, and enquiries.
- **Role-Based Access Control**: Admins and users have specific permissions (RBAC).

## Non-Functional Requirements
- **Type Safety**: Strict TypeScript must be used. Avoid `any`.
- **Database Integrity**: MySQL via Prisma with strict relational rules. Financials must use DECIMAL, never FLOAT/DOUBLE.
- **Security**: Never expose secrets. All inputs validated. Use rate limiting, CORS, and secure headers.
- **SEO**: Indexable pages need titles, meta descriptions, canonical URLs, Open Graph metadata, semantic HTML, and structured data. Do not arbitrarily change existing public URLs. Existing public URLs must be verified before changing routing. If a URL must change, the migration strategy must include an appropriate redirect and verification process.
- **File Uploads**: Files stored externally in object storage, not in DB. Strict validation on all uploads.
