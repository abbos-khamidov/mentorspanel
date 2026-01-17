# Mentorship Dashboard 🎓

Production-ready Next.js 14 mentorship platform with PostgreSQL integration.

## ✨ Features

- **📊 Dashboard** - Overview of key metrics and upcoming lessons
- **👥 Student Management** - Manage students with monthly subscription plans
- **📅 Calendar** - Schedule lessons with automatic conflict detection
- **💰 Payment Tracking** - Monthly subscription plans and payment management
- **📈 Analytics** - Income trends, lesson statistics, and student performance charts
- **🔐 Authentication** - Secure user authentication system

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Data Fetching:** Server Actions + Route Handlers
- **Styling:** Custom CSS + Framer Motion
- **Charts:** Recharts

## 📋 Prerequisites

- Node.js 18 or higher
- PostgreSQL database (local or cloud)
- npm or yarn

## 🛠️ Local Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mentorship_db?schema=public"
```

### 3. Database Setup

Generate Prisma Client:
```bash
npx prisma generate
```

Run database migrations:
```bash
npx prisma migrate dev --name init
```

(Optional) Open Prisma Studio to view/manage data:
```bash
npx prisma studio
```

### 4. Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment on Railway

Railway automatically detects Next.js projects and configures the build process.

### Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account and select this repository

### Step 2: Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically create a PostgreSQL database
4. Railway automatically provides `DATABASE_URL` environment variable

### Step 3: Apply Database Migrations

After the first deployment, run migrations:

**Option A: Via Railway CLI (Recommended)**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Apply migrations
railway run npx prisma migrate deploy
```

**Option B: Via Railway Dashboard**

1. Go to your project on Railway
2. Click on your PostgreSQL service
3. Open "Query" tab
4. Copy and execute SQL from migration files:
   - `prisma/migrations/20260116110039_init/migration.sql`
   - `prisma/migrations/20260116122117_add_user_auth/migration.sql`
   - `prisma/migrations/20250116130000_add_github_link/migration.sql`

### Step 4: Deploy

Railway will automatically:
- Install dependencies (`npm install`)
- Run `prisma generate` (via postinstall script)
- Build the application (`npm run build`)
- Start the application (`npm start`)

Your app will be live at the Railway-generated URL!

## 🔧 Build Configuration

Railway automatically detects:
- **Build Command:** `npm run build` (which includes `prisma generate && next build`)
- **Start Command:** `npm start`
- **Node Version:** Detected from `package.json` or `.nvmrc`

## 📁 Project Structure

```
dashboard-of-lessons/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── app/
│   │   ├── actions/           # Server actions
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── analytics/         # Analytics page
│   │   ├── calendar/          # Calendar page
│   │   ├── payments/          # Payments page
│   │   └── students/          # Students page
│   ├── components/            # React components
│   ├── lib/                   # Utility functions
│   └── hooks/                 # React hooks
├── package.json
├── prisma.config.ts           # Prisma configuration
└── README.md
```

## 🔑 Key Features Explained

### Monthly Subscription Model

- Each student has a monthly plan (`MonthlyPlan`)
- Fixed monthly price (not hourly)
- Lesson duration does NOT affect payment
- Plan tracks: `totalLessons`, `usedLessons`, `priceTotal`, `isPaid`

### Time Conflict Detection

- Before creating a lesson, system checks for overlaps
- Compares against ALL existing lessons (any student)
- Shows error: "You are busy at this time. Student: {name}, Time: {HH:MM}-{HH:MM}"

### Monthly Lesson Limits

- When lesson status → `"done"`: `usedLessons += 1`
- If `usedLessons >= totalLessons`: Blocks new lessons
- Error: "Monthly lesson limit reached (X/Y used)"

### Payment Management

- Record payments creates/updates `MonthlyPlan`
- Each month is isolated (separate plan records)
- Tracks `isPaid`, `paidAmount`, `priceTotal`

## 🧪 Testing Scenarios

- ✅ Create overlapping lessons → should fail with conflict error
- ✅ Mark lesson as done → should increment `usedLessons`
- ✅ Exceed monthly limit → should block new lessons
- ✅ Record payment → should update plan status
- ✅ View analytics → should show accurate numbers

## 🔧 Development

### Database Migrations

Create a new migration:
```bash
npx prisma migrate dev --name migration_name
```

Reset database (⚠️ destroys all data):
```bash
npx prisma migrate reset
```

### Prisma Studio

Visual database browser:
```bash
npx prisma studio
```

## 🐛 Troubleshooting

### Build fails on Railway

- Make sure `DATABASE_URL` is set (Railway provides it automatically for PostgreSQL services)
- Check build logs in Railway dashboard
- Verify `npm run build` works locally

### Database connection errors

- Ensure PostgreSQL service is running in Railway
- Check that `DATABASE_URL` environment variable is correct
- Verify migrations are applied: `railway run npx prisma migrate deploy`

### Prisma Client not generated

- Railway runs `prisma generate` automatically via `postinstall` script
- Check build logs for Prisma generation errors
- Ensure `prisma.config.ts` is properly configured

## 📝 License

MIT

## 🤝 Support

For issues or questions, please create an issue in the repository.

---

Created with ❤️ for mentors
