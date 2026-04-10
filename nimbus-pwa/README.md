# 🛍️ Nimbus PWA Storefront

A full-stack **offline-first Progressive Web App** storefront built with React + Vite (frontend) and Node.js + Express + MongoDB (backend). Supports offline cart, background sync, JWT authentication, and Docker deployment.

---

## 📸 Features

- 🛒 **Product Catalog** — Browse Shoes, Cricket, Football & Clothing
- 🔐 **Auth** — Login & Signup with JWT
- 📦 **Cart** — Persistent cart using IndexedDB (survives offline & refresh)
- 📍 **Checkout** — Address form + payment method selection
- 📶 **Offline-First** — Service Worker caches pages, products & images
- 🔄 **Background Sync** — Orders queued offline, replayed when back online
- 🐳 **Docker** — MongoDB + API containerized with Docker Compose
- 🔒 **HTTPS** — Local HTTPS via mkcert for PWA compliance
- 📱 **Installable** — Works as a native app on mobile & desktop

---

## 🗂️ Project Structure

```
nimbus-pwa/
├── docker-compose.yml         # MongoDB + API containers
├── localhost.pem              # mkcert SSL certificate
├── localhost-key.pem          # mkcert SSL key
├── package.json               # Root scripts
└── packages/
    ├── api/                   # Backend — Express + MongoDB
    │   ├── Dockerfile
    │   ├── .env
    │   ├── package.json
    │   └── src/
    │       ├── server.js      # Express app entry point
    │       ├── db.js          # MongoDB connection
    │       ├── seed.js        # Database seed script
    │       ├── middleware/
    │       │   ├── auth.js          # JWT auth middleware
    │       │   ├── idempotency.js   # Duplicate order prevention
    │       │   └── errorHandler.js  # Global error handler
    │       ├── models/
    │       │   ├── User.js
    │       │   ├── Product.js
    │       │   ├── Category.js
    │       │   ├── Order.js
    │       │   └── IdempotencyKey.js
    │       └── routes/
    │           ├── auth.js      # /api/auth — login, signup
    │           ├── products.js  # /api/products
    │           ├── categories.js
    │           ├── orders.js
    │           └── cart.js
    └── web/                   # Frontend — React + Vite
        ├── public/
        │   ├── sw.js                  # Service Worker (Workbox)
        │   ├── manifest.webmanifest   # PWA manifest
        │   └── icons/
        │       ├── icon-192.png
        │       └── icon-512.png
        ├── src/
        │   ├── contexts/
        │   │   ├── AuthContext.tsx    # Login/Signup state
        │   │   └── CartContext.tsx    # Cart state + IndexedDB
        │   ├── hooks/
        │   │   └── useConnectivity.ts # Online/offline detector
        │   ├── lib/
        │   │   ├── db.ts              # IndexedDB (idb)
        │   │   └── api.ts             # API calls + offline queue
        │   ├── pages/
        │   │   ├── LoginPage.tsx
        │   │   ├── SignupPage.tsx
        │   │   ├── CheckoutPage.tsx
        │   │   └── OrderSuccessPage.tsx
        │   ├── App.tsx               # Store + routing
        │   └── main.tsx              # Entry point + SW registration
        ├── index.html
        ├── vite.config.js
        └── package.json
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Inline CSS (no framework) |
| Offline Storage | IndexedDB via `idb` |
| Service Worker | Workbox 6 |
| Backend | Node.js, Express |
| Database | MongoDB 7 via Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Containers | Docker + Docker Compose |
| Local HTTPS | mkcert |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

| Tool | Version |
|---|---|
| Node.js | ≥ 18 |
| Docker Desktop | Latest |
| Git | Latest |
| mkcert | v1.4.4+ |

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/yourusername/nimbus-pwa.git
cd nimbus-pwa
```

---

### Step 2 — Setup local HTTPS (mkcert)

```bash
mkcert -install
mkcert localhost
```

This creates `localhost.pem` and `localhost-key.pem` at the project root.

---

### Step 3 — Start Docker (MongoDB + API)

```bash
docker compose up -d
```

Verify containers are running:

```bash
docker ps
```

You should see:
```
nimbus-mongo    — MongoDB on port 27017
project-api-1   — Express API on port 5000
```

---

### Step 4 — Seed the database

```bash
docker exec project-api-1 node src/seed.js
```

Expected output:
```
Mongo connected
✅ Database seeded with real products and prices!
```

---

### Step 5 — Install frontend dependencies

```bash
cd packages/web
npm install
```

---

### Step 6 — Start the frontend

```bash
npm run dev
```

Open in browser:
```
http://localhost:5173
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user info |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List all products (supports `?q=`, `?category=`, `?page=`, `?limit=`) |
| GET | `/api/products/:slug` | Get single product by slug |

### Categories
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/categories` | List all categories |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Create new order (idempotent) |

### Cart
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/cart/price-check` | Verify prices and stock before checkout |

---

## 🛍️ Product Categories & Prices

| Category | Products | Price Range |
|---|---|---|
| 👟 Shoes | Nike Air Max 270, Adidas Ultraboost 23, Puma RS-X | ₹8,999 – ₹16,999 |
| 🏏 Cricket | SS Ton Bat, SG Kit, MRF Genius, Kookaburra Ball | ₹1,299 – ₹19,999 |
| ⚽ Football | Nike Strike Ball, Adidas Predator Boots, Jersey | ₹2,499 – ₹11,999 |
| 👕 Clothing | T-Shirts, Cargo Pants, Jeans, Tracksuit, Cap | ₹1,799 – ₹5,999 |

---

## 📶 Offline Features

| Feature | How it works |
|---|---|
| Browse products offline | Cached by Service Worker (StaleWhileRevalidate) |
| Cart persists offline | Stored in IndexedDB |
| Checkout offline | Order saved to queue in IndexedDB |
| Auto-replay on reconnect | `replayQueue()` fires when browser goes online |
| Duplicate order prevention | Idempotency-Key header + MongoDB TTL store |

---

## 🔐 Environment Variables

### `packages/api/.env`

```env
PORT=5000
MONGO_URI=mongodb://mongo:27017/nimbus
JWT_SECRET=supersecret_change_me
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### `packages/web/.env`

```env
VITE_API_BASE=http://localhost:5000
```

---

## 🐳 Docker Commands

```bash
# Start containers
docker compose up -d

# Stop containers
docker compose down

# Rebuild after code changes
docker compose up --build -d

# View API logs
docker logs project-api-1

# Run seed script
docker exec project-api-1 node src/seed.js
```

---

## 🧪 Testing

### Test API directly
```
http://localhost:5000/api/products
http://localhost:5000/api/categories
```

### Test offline mode
1. Open `http://localhost:5173` in browser
2. Press `F12` → Network tab → Select **Offline**
3. Refresh — app should still load
4. Red banner shows: `⚠️ You are offline`

### Test cart persistence
1. Add items to cart
2. Go offline (F12 → Network → Offline)
3. Refresh page
4. Cart items should still be there ✅

### Test PWA install
1. Open `http://localhost:5173` in Chrome/Edge
2. Look for install icon in address bar
3. Click → Install
4. App opens like a native app

---

## 🔧 Common Issues & Fixes

| Issue | Fix |
|---|---|
| `getaddrinfo ENOTFOUND mongo` | Docker is not running. Run `docker compose up -d` |
| `Failed to fetch` | Open `http://localhost:5000` in browser and allow connection |
| `Out of stock` error | Old cart data. Run `indexedDB.deleteDatabase('nimbus')` in browser console |
| `service not running` | Check container name with `docker ps` then use `docker exec <name>` |
| Port already in use | Run `docker compose down` then `docker compose up -d` |
| Products not showing | Run seed command again |
| YAML error in docker-compose | Use spaces not tabs for indentation |

---

## 📋 Run Checklist

Every time you start the project:

```bash
# 1. Start Docker
docker compose up -d

# 2. Start frontend (in packages/web folder)
npm run dev

# 3. Open browser
# http://localhost:5173
```

> ✅ No need to seed again after first time — data stays in Docker volume!

---

## 👥 Authors

Built by **Rishabh** and team as a full-stack PWA project.

---

## 📄 License

MIT License — free to use and modify.