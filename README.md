# AutoMart – Next.js Fullstack

Projekti i plotë **100% Next.js** — frontend + backend API Routes + databazë Prisma, pa nevojë për server tjetër.

```
automart/
├── app/
│   ├── (public)/          ← Faqet publike (Home, Cars, About, Contact, Inquiry)
│   ├── admin/             ← Panel admin (Login, Dashboard, Inquiries, Cars)
│   └── api/               ← Backend API Routes
│       ├── auth/          ← NextAuth (login/logout)
│       ├── cars/          ← GET/POST/PUT/DELETE makinat
│       ├── car-images/    ← GET/POST/DELETE imazhet
│       └── bookings/      ← GET/POST/PATCH/DELETE inquiries
├── components/            ← Navigation, Footer, UI components
├── lib/
│   ├── db.ts              ← Prisma singleton
│   ├── auth.ts            ← NextAuth config
│   ├── api-client.ts      ← Fetch helpers (frontend → API)
│   ├── translations.ts    ← EN + SQ
│   └── useLang.ts         ← Language hook
├── prisma/
│   ├── schema.prisma      ← Database schema (Car, CarImage, Booking, Admin)
│   └── seed.ts            ← Krijon admin-in e parë
└── types/index.ts
```

---

## 🚀 Setup (5 minuta)

### 1. Instalo dependencies
```bash
npm install
```

### 2. Konfiguro environment
```bash
cp .env.example .env.local
```

Hap `.env.local` dhe ndrysho:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="vendos-nje-string-random-te-gjate-ketu"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@automart.al"
ADMIN_PASSWORD="Admin@1234"
```

> Gjenero secret: `openssl rand -base64 32`

### 3. Krijo databazën
```bash
npm run db:push       # krijon tabelat
npm run db:seed       # krijon admin-in
```

### 4. Nis serverin
```bash
npm run dev
# http://localhost:3000
```

---

## 🔐 Admin Panel

URL: `http://localhost:3000/admin/login`

| Email | Password |
|-------|----------|
| admin@automart.al | Admin@1234 |

---

## 📡 API Endpoints

| Method | Route | Auth | Përshkrim |
|--------|-------|------|-----------|
| `POST` | `/api/auth/[...nextauth]` | ❌ | Login / Logout |
| `GET` | `/api/cars` | ❌ | Të gjitha makinat |
| `POST` | `/api/cars` | ✅ | Shto makinë |
| `GET` | `/api/cars/[carId]` | ❌ | Makinë specifike |
| `PUT` | `/api/cars/[carId]` | ✅ | Ndrysho makinë |
| `DELETE` | `/api/cars/[carId]` | ✅ | Fshi makinë |
| `GET` | `/api/car-images?carId=1` | ❌ | Imazhet e makinës |
| `POST` | `/api/car-images` | ✅ | Shto imazh |
| `DELETE` | `/api/car-images/[imageId]` | ✅ | Fshi imazh |
| `GET` | `/api/bookings` | ✅ | Të gjitha inquiries |
| `POST` | `/api/bookings` | ❌ | Klient dërgon inquiry |
| `PATCH` | `/api/bookings/[bookingId]` | ✅ | Konfirmo inquiry |
| `DELETE` | `/api/bookings/[bookingId]` | ✅ | Fshi inquiry |

✅ = kërkon sesion NextAuth &nbsp;&nbsp; ❌ = publik

---

## 🌐 Deploy në Vercel (falas)

```bash
# 1. Shko në vercel.com dhe lidhe repo-n
# 2. Shto environment variables:
#    DATABASE_URL  →  postgresql://...  (Neon.tech falas)
#    NEXTAUTH_SECRET  →  string random
#    NEXTAUTH_URL  →  https://domain-yt.vercel.app

# 3. Ndrysho prisma/schema.prisma:
#    provider = "postgresql"   (jo sqlite)

# 4. Shto në package.json → scripts:
#    "postinstall": "prisma generate"
```

### Databazë falas në Neon.tech:
1. Shko tek [neon.tech](https://neon.tech) → Create project
2. Kopjo `DATABASE_URL` nga dashboard
3. Ndrysho `.env.local` dhe `prisma/schema.prisma` provider në `postgresql`
4. `npm run db:push && npm run db:seed`

---

## 🔒 Siguria

- **NextAuth JWT** sesione — `NEXTAUTH_SECRET` enkriptim i plotë
- **Zod validation** në çdo API route — inputi i papastruar refuzohet
- **HTTP security headers** — `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`
- **`robots.txt`** bllokon `/admin/` dhe `/api/` nga indeksimi
- Admin routes verifikojnë sesionin me `getServerSession` server-side

---

## ⚠️ Përpara production

1. Ndrysho `NEXTAUTH_SECRET` me një vlerë random të gjatë
2. Ndrysho fjalëkalimin admin pas login-it të parë
3. Ndrysho `DATABASE_URL` në PostgreSQL (jo SQLite)
4. Ndrysho `NEXTAUTH_URL` me domain-in real
5. Aktivizo HTTPS (Vercel e bën automatikisht)
