# Mentorship Dashboard 🎓

Production-ready Next.js 14 mentorship platform with PostgreSQL integration.

## ✨ Features

- **📊 Dashboard** - Overview of key metrics and upcoming lessons
- **👥 Student Management** - Manage students with monthly subscription plans
- **📅 Calendar** - Schedule lessons with automatic conflict detection
- **💰 Payment Tracking** - Monthly subscription plans and payment management
- **📈 Analytics** - Income trends, lesson statistics, and student performance charts

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Data Fetching:** Server Actions + Route Handlers
- **Styling:** Tailwind CSS + Custom CSS Variables
- **Charts:** Recharts
- **Deployment:** Vercel-ready

## 📋 Prerequisites

- Node.js 18 or higher
- PostgreSQL database (local or cloud)
- npm or yarn

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mentorship_db?schema=public"
```

**For Vercel Postgres:**
```env
DATABASE_URL="postgres://default:password@ep-xxx.us-east-1.postgres.vercel-storage.com:5432/verceldb"
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

## 🌐 Deployment on Vercel

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create Vercel Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Add PostgreSQL Database**
   - In Vercel dashboard, go to Storage
   - Create a Postgres database
   - Copy the connection string

4. **Configure Environment Variables**
   - In project settings, add `DATABASE_URL`
   - Paste your PostgreSQL connection string

5. **Deploy**
   - Vercel will automatically detect Next.js
   - It will run `prisma generate` and migrations during build
   - Your app will be live!

## 📁 Project Structure

```
dashboard-of-lessons/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── actions/           # Server actions
│   │   │   ├── students.ts
│   │   │   ├── lessons.ts
│   │   │   ├── payments.ts
│   │   │   └── analytics.ts
│   │   ├── api/               # API routes
│   │   ├── analytics/         # Analytics page
│   │   ├── calendar/          # Calendar page
│   │   ├── payments/          # Payments page
│   │   ├── students/          # Students page
│   │   └── page.tsx           # Dashboard
│   ├── components/            # React components
│   ├── lib/
│   │   ├── db.ts              # Prisma client
│   │   ├── types.ts           # TypeScript types
│   │   ├── validations.ts     # Zod schemas
│   │   └── utils.ts           # Utility functions
│   └── hooks/                 # React hooks
├── package.json
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

## 📝 License

MIT

## 🤝 Support

For issues or questions, please create an issue in the repository.

---

Created with ❤️ for mentors
