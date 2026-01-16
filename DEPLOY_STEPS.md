# 📋 Быстрая инструкция для деплоя

## Шаг 1: Push в GitHub

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

## Шаг 2: Создать проект в Vercel

1. Зайдите на https://vercel.com
2. **Add New Project**
3. Импортируйте GitHub репозиторий
4. Vercel автоматически определит Next.js

## Шаг 3: Создать базу данных

1. В Vercel Dashboard → **Storage**
2. **Create Database** → **Postgres**
3. Выберите план (Hobby бесплатно)
4. Скопируйте **Connection String**

## Шаг 4: Добавить Environment Variables

В настройках проекта:
- **Settings** → **Environment Variables**
- Добавьте: `DATABASE_URL` = ваш Connection String

## Шаг 5: Применить миграции

После первого деплоя выполните:

```bash
# Установите Vercel CLI (один раз)
npm i -g vercel

# Войдите и подключитесь
vercel login
vercel link

# Примените миграции
npx prisma migrate deploy
```

Или через Vercel Dashboard → Postgres → SQL Editor, выполните SQL из:
- `prisma/migrations/20260116110039_init/migration.sql`
- `prisma/migrations/20260116122117_add_user_auth/migration.sql`  
- `prisma/migrations/20250116130000_add_github_link/migration.sql`

## Шаг 6: Готово! 🎉

Приложение будет доступно по адресу, который покажет Vercel.
