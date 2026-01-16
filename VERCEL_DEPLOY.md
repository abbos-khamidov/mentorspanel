# 🚀 Деплой на Vercel - Быстрая инструкция

## 📝 Шаг 1: Push в GitHub

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

## 🗄️ Шаг 2: Создать базу данных на Vercel

1. Зайдите на https://vercel.com
2. **Dashboard** → **Storage** → **Create Database**
3. Выберите **Postgres**
4. Выберите план (Hobby - бесплатно)
5. Скопируйте **Connection String** (не Pooling URL!)

## 🔧 Шаг 3: Создать проект

1. В Vercel Dashboard → **Add New Project**
2. Импортируйте ваш GitHub репозиторий
3. Vercel автоматически определит Next.js

## ⚙️ Шаг 4: Настроить Environment Variables

В настройках проекта:
- **Settings** → **Environment Variables**
- Добавьте:
  - `DATABASE_URL` = ваш Connection String из шага 2

## 🗃️ Шаг 5: Применить миграции БД

**Вариант A: Через Vercel CLI (рекомендуется)**
```bash
npm i -g vercel
vercel login
vercel link
npx prisma migrate deploy
```

**Вариант B: Через SQL Editor**
1. Vercel Dashboard → ваш Postgres → **Data** → **SQL Editor**
2. Откройте файл `DEPLOY_SQL.sql`
3. Скопируйте и выполните все SQL команды по порядку

## ✅ Шаг 6: Деплой

Vercel автоматически задеплоит после:
- Push в main ветку
- Или вручную в Dashboard → **Deployments** → **Redeploy**

## 🎯 После деплоя

1. Откройте URL который покажет Vercel
2. Зарегистрируйтесь
3. Войдите в систему
4. Проверьте что все работает

## 🔍 Troubleshooting

**Ошибка: "Cannot connect to database"**
- Проверьте что `DATABASE_URL` правильно добавлен
- Используйте Connection String, не Pooling URL

**Ошибка: "Table does not exist"**
- Примените миграции (шаг 5)

**Ошибка: "Prisma Client not generated"**
- Проверьте что `package.json` содержит `postinstall: "prisma generate"`

**Build fails**
- Проверьте логи в Vercel Dashboard → Deployments
- Убедитесь что все зависимости в `package.json`

## 📦 Зависимости для деплоя

Все зависимости должны быть в `package.json`:
- `@prisma/client`
- `@prisma/adapter-pg`
- `pg`
- `bcryptjs`
- `framer-motion`
- `@tsparticles/react`
- И другие...

Убедитесь что они добавлены перед деплоем!
