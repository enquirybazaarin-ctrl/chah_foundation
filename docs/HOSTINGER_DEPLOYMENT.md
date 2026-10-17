# Hostinger Production Deployment Guide — CHAH Foundation

This guide provides the exact steps to connect this GitHub repository (`enquirybazaarin-ctrl/chah_foundation`) with Hostinger and deploy all three applications:
1. `api.chahfoundation.com` (Backend)
2. `admin.chahfoundation.com` (Admin Portal)
3. `chahfoundation.com` (Public Website)

---

## 1. Architecture on Hostinger

| Subdomain | App Path | Runtime / Command | Port |
| :--- | :--- | :--- | :--- |
| **`api.chahfoundation.com`** | `backend/` | `node dist/server.js` | `5000` |
| **`admin.chahfoundation.com`** | `admin/` | `next start -p 3001` | `3001` |
| **`chahfoundation.com`** | `website/` | `next start -p 3000` | `3000` |

---

## 2. GitHub Secrets Setup (For Automated CI/CD)

Go to your GitHub Repository:
👉 **Settings** -> **Secrets and variables** -> **Actions** -> Click **"New repository secret"**

Add the following secrets from your Hostinger **Dev tools -> SSH Access**:

| Secret Name | Value Example | Description |
| :--- | :--- | :--- |
| `HOSTINGER_SSH_HOST` | `185.xxx.xxx.xxx` | Hostinger Server IP / Hostname |
| `HOSTINGER_SSH_USER` | `u123456789` | SSH Username from Hostinger |
| `HOSTINGER_SSH_PORT` | `65002` | Hostinger SSH Port (Default: 65002) |
| `HOSTINGER_SSH_PASSWORD` | `your_ssh_password` | Hostinger SSH Password (or use SSH Key) |

> Once these secrets are saved, every `git push origin main` will automatically run build checks and trigger deployment to Hostinger!

---

## 3. Hostinger Environment Variables (`.env`)

On the Hostinger server, create the `.env` file in `chah_foundation/backend/.env`:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL="mysql://<db_user>:<db_password>@127.0.0.1:3306/<db_name>"
FRONTEND_URL="https://chahfoundation.com"
ADMIN_CORS_ORIGIN="https://admin.chahfoundation.com"
JWT_SECRET="<your_secure_32_character_random_jwt_secret>"
RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="xxxxxxxxxxxxxxxxxxxx"
RAZORPAY_WEBHOOK_SECRET="xxxxxxxxxxxxxxxxxxxx"
MSG91_API_KEY="xxxxxxxxxxxxxxxxxxxx"
MSG91_80G_TEMPLATE_ID="donation_80g_chahfoundation_com"
MSG91_FROM_EMAIL="info@chahfoundation.com"
MSG91_FROM_NAME="CHILDREN'S HELP & HELPAGE FOUNDATION"
```

In `chah_foundation/website/.env`:
```env
NEXT_PUBLIC_API_URL="https://api.chahfoundation.com"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxx"
```

In `chah_foundation/admin/.env`:
```env
NEXT_PUBLIC_API_URL="https://api.chahfoundation.com"
```

---

## 4. First-Time Setup on Hostinger (via Hostinger SSH Terminal)

Open Hostinger Web Terminal or SSH client:

```bash
# 1. Clone repository
git clone https://github.com/enquirybazaarin-ctrl/chah_foundation.git
cd chah_foundation

# 2. Setup Backend & Run DB Migration
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
cd ..

# 3. Setup Website
cd website
npm install
npm run build
cd ..

# 4. Setup Admin
cd admin
npm install
npm run build
cd ..

# 5. Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 5. Reverse Proxy / Subdomain Routing on Hostinger

Under Hostinger hPanel **Dev tools -> Node.js** (or .htaccess / NGINX):
- Ensure `api.chahfoundation.com` routes to port `5000`.
- Ensure `admin.chahfoundation.com` routes to port `3001`.
- Ensure `chahfoundation.com` routes to port `3000`.
- Enable **SSL (Let's Encrypt)** for all 3 subdomains from the **Security -> SSL** panel.
