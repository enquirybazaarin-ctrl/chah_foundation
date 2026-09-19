# Security Documentation

## Overview
- **Data Protection**: Never expose database credentials, Razorpay secret, MSG91 API key, storage secrets, or authentication secrets to frontend code. Secrets must remain entirely server-side.
- **Validation**: All external input must be validated before processing.

## Implementation Details
- **Authentication & Authorization**: Implemented with strict controls.
- **Role-Based Access Control (RBAC)**: Users and admins have distinct roles and permissions.
- **Web Protections**: Use rate limiting, CORS configurations, and secure headers on all endpoints.
- **Webhooks**: Razorpay webhooks must undergo signature verification and be processed idempotently.
- **Passwords & Logs**: Secure password hashing is required. Audit logging must track critical actions.
- **File Uploads**: Never trust user-provided filenames or paths. Validate MIME type, extension, file size, filename, and dimensions where appropriate. Files are stored in object storage, not in the database.
