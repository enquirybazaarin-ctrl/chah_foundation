# Database Architecture

## Principles
- **Relational Integrity**: Strict foreign key constraints with explicit `RESTRICT` behavior on critical financial flows. No cascading deletes that can remove financial history.
- **Financial Precision**: All monetary fields use `DECIMAL(12,2)`. `FLOAT` and `DOUBLE` are strictly prohibited.
- **Auditing & Immutable Finance**: Strict NO-CASUAL-DELETE principle. Successful financial records (donations, payments, refunds) are never casually deleted. Corrections occur via refunds, adjustments, state transitions, and audit records.
- **Offline & Online Separation**: The schema explicitly supports online (Razorpay) and offline (Cash, Cheque) donations without requiring fake identifiers for offline operations.
- **Idempotency**: Webhook events and certificate generation are designed with strict idempotency guards.
- **Media**: Media files are stored in object storage; the database only tracks metadata and URLs.
- **Primary Keys**: Internal primary keys use `BIGINT` auto-increment. Public-facing resources should use slugs or human-readable identifiers instead of exposing internal numeric database IDs unnecessarily.

---

## Entity Relationship Overview
- `donors` (1) - (N) `donations`
- `donations` (1) - (N) `payments`
- `payments` (1) - (N) `refunds`
- `donations` (1) - (1) `certificates`
- `users` (N) - (1) `roles` (One role per user)
- `roles` (1) - (N) `permissions` via `role_permissions`
- `campaign_categories` (1) - (N) `campaigns`
- `blog_categories` (1) - (N) `blogs`
- `albums` (1) - (N) `media`

---

## Authentication Domain

### `users`
- **Purpose**: System administrators, NGO staff, and potentially user accounts.
- **PK**: `id` (BIGINT, auto-increment)
- **Fields**:
  - `first_name` (String, required)
  - `last_name` (String, required)
  - `email` (String, required, unique)
  - `password_hash` (String, required)
  - `status` (Enum: ACTIVE, INACTIVE, SUSPENDED, default: ACTIVE)
  - `role_id` (BIGINT, FK `roles`, required) - Enforces one role per user.
  - `created_at` (DateTime), `updated_at` (DateTime)
- **Delete Behavior**: Prefer user status/lifecycle management (ACTIVE/INACTIVE) over physical deletion to preserve audit history.

### `roles`
- **Purpose**: Defines RBAC roles (e.g., SUPER_ADMIN, EDITOR).
- **PK**: `id` (BIGINT, auto-increment)
- **Fields**: `name` (String, unique), `description` (String, nullable)

### `permissions`
- **Purpose**: Defines atomic actions for RBAC.
- **PK**: `id` (BIGINT, auto-increment)
- **Fields**: `action` (String), `resource` (String)

### `role_permissions`
- **Purpose**: Maps roles to permissions (1:N from role).
- **PK**: `role_id`, `permission_id`
- **Fields**: `role_id` (FK `roles`), `permission_id` (FK `permissions`)

---

## Donor Domain

### `donors`
- **Purpose**: Stores donor profiles for tax and CRM purposes.
- **PK**: `id` (BIGINT, auto-increment)
- **Fields**:
  - `first_name` (String, required)
  - `last_name` (String, nullable)
  - `email` (String, required, unique)
  - `phone` (String, nullable)
  - `pan_number` (String, nullable) - Crucial for 80G tax exemptions in India.
  - `address`, `city`, `state`, `country`, `pincode` (Strings, nullable)
  - `status` (Enum: ACTIVE, INACTIVE, default: ACTIVE)
  - `created_at` (DateTime), `updated_at` (DateTime)
- **Delete Behavior**: Do not allow donor deletion if financial history exists. Use an active/inactive lifecycle (`status`) to retain relationships.

---

## Donation Domain

### `donations`
- **Purpose**: The core financial intent record.
- **PK**: `id` (BIGINT, auto-increment)
- **Fields**:
  - `donation_number` (String, unique) - Human-readable (e.g., `DON-YYYY-XXXXXX`). Concurrency-safe generation logic required (not naive count()+1, implemented in Prisma/backend phase).
  - `donor_id` (BIGINT, FK `donors`, required)
  - `campaign_id` (BIGINT, FK `campaigns`, nullable)
  - `amount` (DECIMAL(12,2), required)
  - `currency` (String, default: 'INR')
  - `payment_type` (Enum: ONLINE, CASH, CHEQUE, BANK_TRANSFER, OTHER, required)
  - `status` (Enum: PENDING, SUCCESS, FAILED, REFUNDED, default: PENDING)
  - `notes` (String, nullable)
  - `created_at` (DateTime), `updated_at` (DateTime)
- **Relationships**: `RESTRICT` deletion of `donors` and `campaigns` if tied to a donation. Strict NO-CASUAL-DELETE policy.

---

## Payment Domain

### `payments`
- **Purpose**: Tracks actual transaction attempts against a donation (1:N allowing multiple payment attempts).
- **PK**: `id` (BIGINT, auto-increment)
- **Fields**:
  - `donation_id` (BIGINT, FK `donations`, required)
  - `amount` (DECIMAL(12,2), required)
  - `provider` (Enum: RAZORPAY, MANUAL, required)
  - `provider_order_id` (String, nullable) - Razorpay order ID.
  - `provider_payment_id` (String, nullable, unique) - Razorpay payment ID. Must be null for offline donations.
  - `status` (Enum: CREATED, AUTHORIZED, CAPTURED, FAILED, default: CREATED) - FAILED represents an actual failed attempt, not a generic correction mechanism.
  - `method` (String, nullable) - e.g., CARD, UPI. Null for offline.
  - `error_message` (String, nullable)
  - `created_at` (DateTime), `updated_at` (DateTime)
- **Delete Behavior**: Strict NO-CASUAL-DELETE policy. 

### `payment_webhook_events`
- **Purpose**: Idempotent processing of provider webhooks.
- **PK**: `id` (BIGINT, auto-increment)
- **Fields**:
  - `provider` (String, default: 'RAZORPAY')
  - `provider_event_id` (String, unique, required) - Prevents duplicate processing.
  - `event_type` (String, required)
  - `payload` (JSON, required)
  - `signature_valid` (Boolean, required)
  - `processing_state` (Enum: PENDING, PROCESSED, FAILED, default: PENDING)
  - `error_message` (String, nullable)
  - `received_at` (DateTime, required)
  - `processed_at` (DateTime, nullable)

---

## Refund Domain

### `refunds`
- **Purpose**: Tracks partial or full refunds against captured payments.
- **PK**: `id` (BIGINT, auto-increment)
- **Fields**:
  - `payment_id` (BIGINT, FK `payments`, required)
  - `amount` (DECIMAL(12,2), required)
  - `provider_refund_id` (String, nullable, unique)
  - `reason` (String, nullable)
  - `status` (Enum: PENDING, PROCESSED, FAILED)
  - `created_at` (DateTime), `updated_at` (DateTime)
- **Delete Behavior**: Strict NO-CASUAL-DELETE policy.

---

## Certificate Domain

### `certificates`
- **Purpose**: Manages 80G tax exemption certificates. One successful donation normally has one certificate.
- **PK**: `id` (BIGINT, auto-increment)
- **Fields**:
  - `donation_id` (BIGINT, FK `donations`, required, unique) - 1:1 relationship ensures idempotency.
  - `certificate_number` (String, unique) - Human-readable (e.g., `CHAH-YYYY-XXXXXX`). Concurrency-safe generation required.
  - `pdf_url` (String, nullable) - External object storage reference.
  - `status` (Enum: GENERATING, GENERATED, FAILED)
  - `generated_at` (DateTime, nullable)
  - `created_at` (DateTime), `updated_at` (DateTime)

---

## Email Domain

### `email_logs`
- **Purpose**: Tracks transactional emails (completely independent of certificate generation).
- **PK**: `id` (BIGINT, auto-increment)
- **Fields**:
  - `recipient_email` (String, required)
  - `provider` (String, default: 'MSG91')
  - `template_id` (String, required)
  - `provider_message_id` (String, nullable)
  - `delivery_status` (Enum: PENDING, DELIVERED, FAILED)
  - `failure_reason` (String, nullable)
  - `related_entity_type` (String, nullable) - e.g., 'CERTIFICATE', 'DONATION'.
  - `related_entity_id` (BIGINT, nullable)
  - `sent_at` (DateTime, nullable)
  - `created_at` (DateTime), `updated_at` (DateTime)
- **Note**: Email retry uses this log separate from certificates. A certificate that already exists is reused; an email retry NEVER generates another certificate.

---

## Campaign Domain

### `campaign_categories`
- **PK**: `id` (BIGINT, auto-increment)
- **Fields**: `name` (String), `slug` (String, unique), `description` (String, nullable), timestamps.

### `campaigns`
- **PK**: `id` (BIGINT, auto-increment)
- **Fields**:
  - `category_id` (BIGINT, FK `campaign_categories`, required)
  - `title` (String, required), `slug` (String, unique, required)
  - `target_amount` (DECIMAL(12,2), nullable)
  - `raised_amount` (DECIMAL(12,2), default: 0)
    - **Purpose/Classification**: This is a derived/cached aggregate to optimize public frontend queries.
    - **Source of Truth**: Successful `donations` records strictly remain the authoritative financial source.
    - **Included States**: Only donations with a `SUCCESS` status contribute to this value.
    - **Refund Treatment**: Refunds must be accounted for according to the financial model (e.g., deducted from this aggregate upon successful refund).
    - **Manual Editing**: STRICTLY PROHIBITED. Campaign progress must never depend on arbitrary manual edits.
  - `status` (Enum: ACTIVE, COMPLETED, CANCELLED)
  - `start_date` (DateTime, nullable), `end_date` (DateTime, nullable)
  - `content` (Text/LongString)
  - `featured_image_id` (BIGINT, FK `media`, nullable)
  - timestamps.

---

## CMS Domain

### `blog_categories`
- **PK**: `id` (BIGINT, auto-increment)
- **Fields**: `name` (String), `slug` (String, unique), timestamps.

### `tags`
- **PK**: `id` (BIGINT, auto-increment)
- **Fields**: `name` (String), `slug` (String, unique)

### `blogs`
- **PK**: `id` (BIGINT, auto-increment)
- **Fields**:
  - `category_id` (BIGINT, FK `blog_categories`, required)
  - `author_id` (BIGINT, FK `users`, required)
  - `title` (String), `slug` (String, unique)
  - `excerpt` (String, nullable), `content` (Text/LongString)
  - `featured_image_id` (BIGINT, FK `media`, nullable)
  - `status` (Enum: DRAFT, PUBLISHED, ARCHIVED)
  - `published_at` (DateTime, nullable)
  - timestamps.

### `blog_tags`
- **Fields**: `blog_id` (FK `blogs`), `tag_id` (FK `tags`). Composite PK.

---

## NGO Content Domain

### `projects`
- **Fields**: `id`, `title`, `slug` (unique), `description`, `status`, `start_date`, `end_date`, `featured_image_id` (FK `media`), timestamps.

### `activities`
- **Fields**: `id`, `project_id` (FK `projects`), `title`, `date`, `description`, timestamps.

### `impact_metrics`
- **Fields**: `id`, `metric_name`, `metric_value`, `icon`, timestamps.

### `testimonials`
- **Fields**: `id`, `author_name`, `author_role`, `content`, `avatar_image_id` (FK `media`), `is_published` (Boolean), timestamps.

### `faqs`
- **Fields**: `id`, `question`, `answer`, `category`, `is_published` (Boolean), timestamps.

---

## Media Domain

### `albums`
- **Fields**: `id`, `name`, `description`, timestamps.

### `media`
- **Purpose**: References to external object storage. No BLOBs.
- **Fields**:
  - `id` (BIGINT, auto-increment)
  - `album_id` (BIGINT, FK `albums`, nullable)
  - `filename` (String, required)
  - `url` (String, required)
  - `mime_type` (String, required)
  - `file_size` (Int, required)
  - `width` (Int, nullable)
  - `height` (Int, nullable)
  - `alt_text` (String, nullable)
  - `caption` (String, nullable)
  - timestamps.

---

## Operations Domain

### `contact_enquiries`
- **Fields**: `id`, `name`, `email`, `phone`, `subject`, `message`, `status` (Enum: UNREAD, READ, RESOLVED), timestamps.

### `newsletter_subscribers`
- **Fields**: `id`, `email` (unique), `status` (Enum: SUBSCRIBED, UNSUBSCRIBED), timestamps.

### `notifications`
- **Fields**: `id`, `user_id` (FK `users`), `type`, `title`, `message`, `is_read` (Boolean, default: false), timestamps.

### `audit_logs`
- **Purpose**: Strict tracking of sensitive administrative and financial actions.
- **Fields**:
  - `id` (BIGINT, auto-increment)
  - `user_id` (BIGINT, FK `users`, nullable) - Nullable for system actions.
  - `action` (String, required) - e.g., 'DONATION_MODIFIED', 'REFUND_CREATED'.
  - `entity_type` (String, required)
  - `entity_id` (BIGINT, required)
  - `old_values` (JSON, nullable)
  - `new_values` (JSON, nullable)
  - `ip_address` (String, nullable)
  - `user_agent` (String, nullable)
  - `created_at` (DateTime, required)

### `settings`
- **Fields**: `id`, `setting_key` (String, unique), `setting_value` (Text), timestamps.

---

## Indexing Strategy
- **`donors.email`, `donors.phone`**: High-frequency lookups during donation flows.
- **`donations.donation_number`**: Lookups from user dashboards and receipts.
- **`donations.donor_id`**: Filtering donations by donor.
- **`payments.provider_payment_id`**: Reconciling webhooks to specific payments.
- **`payment_webhook_events.provider_event_id`**: Idempotency checks.
- **`certificates.certificate_number`, `certificates.donation_id`**: Lookups and idempotency validation.
- **`blogs.slug`, `campaigns.slug`**: SEO-friendly URL resolution (High read frequency).

---

## Delete/Archive Strategy
- **Financial Records (`donations`, `payments`, `refunds`)**: Strict NO-DELETE policy. No cascading deletes. Corrections are made via refunds or status changes. `RESTRICT` foreign keys are used.
- **Content (`blogs`, `campaigns`, `projects`)**: Uses status fields (`ARCHIVED`, `CANCELLED`) rather than deletion, to prevent breaking SEO URLs.
- **Users/Donors**: Supported via active/inactive lifecycle (`status`) to comply with business logic and preserve audit/financial history.

---

## Financial Data Integrity
- Offline payments will have `NULL` `provider_payment_id`, ensuring no fake IDs are ever generated to bypass uniqueness.
- The 1:1 relationship between `donations` and `certificates` explicitly guarantees that only one certificate can ever be issued for a single donation. Email delivery retries log separately in `email_logs`.

---

## Transaction Boundaries
- **Webhook Processing**: Must open a transaction that:
  1. Creates/Updates the `payment_webhook_events` record.
  2. Updates `payments` status.
  3. Updates `donations` status.
  4. Triggers background jobs (e.g., certificate generation) only if the transaction commits.

---

## Final Schema Decisions
- **Internal vs External IDs**: Use `BIGINT` auto-increment internal IDs strictly separated from concurrency-safe generated human-readable public identifiers (`DON-YYYY-XXXXXX`, `CHAH-YYYY-XXXXXX`). Public resources prefer slugs or these business IDs.
- **Monetary Precision**: All monetary values enforce `DECIMAL(12,2)`.
- **Simplified RBAC**: Reverted any `user_roles` linking entity in favor of a direct 1:N from roles to users (User `role_id`), ensuring exactly one role per user.
- **Payment Lifecycle**: Kept `donations` 1:N `payments` relationship. Failed attempts are preserved (no collapsing, no casual delete).
- **Certificate Lifecycle**: Kept `donations` 1:1 `certificates`. Email logs are strictly detached for safe retry behavior.

## Remaining Open Questions
- None currently based on the finalized requirements. Identifier generation logic will be detailed during the backend/Prisma implementation phase.

## Any Conflicts
- No remaining structural, financial, or integrity conflicts. The data model satisfies all NGO, 80G tax exemption, offline transaction, and Razorpay webhook idempotency requirements natively.

## Prisma Implementation Readiness
Prisma Implementation Readiness = READY
