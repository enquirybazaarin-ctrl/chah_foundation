# API Documentation

## Overview
- **Architecture**: Node.js, Express REST API
- **Language**: strict TypeScript
- **Design Pattern**: Feature-based modular architecture separating routes, controllers, services, repositories, validation, and types.
- Controllers remain thin. Business logic belongs in services. Database access in repositories.

## API Boundaries & Constraints
- All external input must be validated.
- Webhook endpoints (e.g., Razorpay) must have signature verification and act idempotently.

## Modules / Endpoints
*(Proposed based on domains)*
- Authentication
- Users/Roles
- Donations & Payments
- Certificates
- Campaigns, Blogs, Projects, etc.
- Media Uploads

*[OPEN QUESTION: Specific endpoint routes and schema definitions are to be designed.]*
