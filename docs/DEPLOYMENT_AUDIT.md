# Pre-Deployment Audit Checklist

This document tracks all development-specific hacks, temporary bypasses, and hardcoded values that were implemented during local development to unblock UI/UX progress. 

**CRITICAL: All items in this checklist MUST be reverted and properly audited before any code is deployed to a staging or production environment.**

## Authentication & Security Bypasses (Frontend)

During the development of the Admin Panel UI, the backend API integration for authentication was causing infinite redirect loops and hangs due to local CORS/Cookie SameSite issues. The following files were modified to completely bypass authentication when `process.env.NODE_ENV !== 'production'`:

- [x] `admin/src/components/providers/AuthProvider.tsx`
  - **Hack**: The initial `useState` for `user` is hardcoded to a mock `SUPER_ADMIN` object.
  - **Hack**: The `fetchSession` callback immediately returns the mock user and bypasses the `/api/v1/auth/me` network request entirely.
  - **Action Required**: Revert `useState` to initialize as `null`, and remove the `NODE_ENV` bypass block in `fetchSession` so it actually hits the backend.

- [x] `admin/src/app/login/page.tsx`
  - **Hack**: Added a `if (process.env.NODE_ENV !== 'production')` block in the login `try` block that forcefully navigates the user to `/dashboard` without verifying credentials against the API.
  - **Hack**: Added a temporary "🚀 Bypass Login (Dev Mode)" button in the UI.
  - **Action Required**: Remove the bypass block from the `handleLogin` function and delete the bypass button from the JSX.

- [x] `admin/src/lib/api.ts`
  - **Hack**: Modified the Axios response interceptor to skip executing `window.location.href = '/login'` when encountering a 401 Unauthorized error in development mode.
  - **Action Required**: Remove the `NODE_ENV` check so that unauthorized API requests globally force a redirect to the login page as intended.

## Backend CORS Modifications

- [ ] `backend/src/app.ts`
  - **Hack**: Added `http://127.0.0.1:3000` and `http://127.0.0.1:3001` to the `devOrigins` array. 
  - **Action Required**: While not strictly a security risk in development, verify that `allowedOrigins` in production strictly only contains the verified frontend domain.
