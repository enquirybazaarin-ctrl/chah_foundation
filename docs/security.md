# Security Documentation

## Overview
- **Data Protection**: Never expose database credentials, Razorpay secret, MSG91 API key, storage secrets, or authentication secrets to frontend code. Secrets must remain entirely server-side.
- **Validation**: All external input must be validated before processing.

## Implementation Details
- **Authentication & Authorization**: JWT-based auth via `HttpOnly`, `Secure` cookies. Token signature, expiration, and user status (`ACTIVE`, `INACTIVE`, `SUSPENDED`) are validated on every authenticated request.
- **Role-Based Access Control (RBAC)**: Permission-based authorization (`action:resource`, e.g., `read:donations`). One role per user (`role_id` on user). Missing/invalid auth returns HTTP 401; missing permissions return HTTP 403.
- **Passwords**: Hashed using Argon2id (if compatible with dependency policy). Minimum 8 characters, at least one uppercase, one number, and one special character. Generic failure messages ("Invalid email or password") prevent account enumeration.
- **Web Protections**: Use in-memory rate limiting for login endpoints to protect against brute-force (no Redis in Phase 1). CORS configurations and secure headers on all endpoints.
- **Audit Logging**: Existing `audit_logs` table records successful logins, failed logins, and logouts. No plaintext passwords or JWTs are logged.
- **Webhooks**: Razorpay webhooks must undergo signature verification and be processed idempotently.
- **File Uploads**: Never trust user-provided filenames or paths. Validate MIME type, extension, file size, filename, and dimensions where appropriate. Files are stored in object storage, not in the database.
