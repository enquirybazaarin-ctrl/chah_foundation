# Database Documentation

## Database Engine
- **Database**: MySQL
- **ORM**: Prisma
- **Financial Rule**: Financial amounts must use DECIMAL type. Never use FLOAT or DOUBLE for money.

## Domains

### authentication
- Secure password hashing, tracking auth status.

### users/roles/permissions
- RBAC support, role assignments.

### donors
- Donor profiles, tax IDs (PAN), contact info.

### donations
- Tracks successful and offline donations (CASH, CHEQUE, BANK_TRANSFER, OTHER).
- **Protection**: Successful financial records must not be casually deleted. They should be preserved and corrected through appropriate business operations, refunds, adjustments, audit records, or status changes rather than casual deletion.
- **Identifiers**: Offline donations must not require Razorpay payment IDs. Razorpay-specific identifiers must be nullable for offline donations. Offline donations must not receive fake Razorpay identifiers. Payment method/type must distinguish online and offline payment flows.

### payments
- Payment intent, gateway responses, status tracking. Frontend confirmation is not authoritative.
- **Protection**: Successful financial records must not be casually deleted. They should be preserved and corrected through appropriate business operations, refunds, adjustments, audit records, or status changes rather than casual deletion.

### payment webhook events
- Idempotency tracking for Razorpay webhooks.

### refunds
- Refund status, Razorpay refund IDs.
- **Protection**: Successful financial records must not be casually deleted. They should be preserved and corrected through appropriate business operations, refunds, adjustments, audit records, or status changes rather than casual deletion.

### certificates
- Idempotent tracking of issued certificates (one per donation).

### email logs
- Tracking delivery status separately from certificates via MSG91.

### campaigns
- Title, descriptions, target goals, status.

### blogs
- SEO metadata, content, author, published status.

### projects
- Project details, status, funding.

### activities
- Timelines, descriptions of NGO activities.

### impact
- Metrics, statistics, success stories.

### testimonials
- Quotes, author names, roles.

### FAQs
- Questions, answers, categories.

### gallery/media
- URL/path, MIME type, metadata (files are in object storage, not DB).

### enquiries
- Contact form submissions, statuses.

### notifications
- In-app alerts, read status.

### audit logs
- Track critical CRUD operations.

### settings
- System configurations.

*Note: These tables are proposed and not yet implemented. All tables must use appropriate constraints, indexes, timestamps, and referential integrity.*
