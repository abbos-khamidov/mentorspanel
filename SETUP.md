# Setup Instructions

## Prerequisites
- Node.js 18+ 
- PostgreSQL database (local or cloud like Vercel Postgres)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create `.env.local` file:
```
DATABASE_URL="postgresql://user:password@localhost:5432/mentorship_db?schema=public"
```

3. Generate Prisma Client:
```bash
npx prisma generate
```

4. Run database migrations:
```bash
npx prisma migrate dev --name init
```

5. (Optional) Open Prisma Studio to view/manage data:
```bash
npx prisma studio
```

## Development

```bash
npm run dev
```

## Deployment on Vercel

1. Push code to GitHub
2. Create new project on Vercel
3. Add PostgreSQL database (Vercel Postgres)
4. Add environment variable `DATABASE_URL` from Vercel dashboard
5. Vercel will automatically run `prisma generate` and migrations during build

## Key Features Implemented

- ✅ Monthly subscription model (not hourly)
- ✅ Time conflict detection for lessons
- ✅ Monthly lesson limit tracking
- ✅ Payment management with monthly plans
- ✅ Analytics dashboard with statistics
- ✅ Server Actions for all data mutations
- ✅ Type-safe with Zod validation
- ✅ PostgreSQL with Prisma ORM
