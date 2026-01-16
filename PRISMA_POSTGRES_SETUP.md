# 🚀 Настройка Prisma Postgres для Vercel

## 📋 Быстрая инструкция

### Шаг 1: Создать базу данных Prisma Postgres

1. Зайдите на https://vercel.com
2. **Dashboard** → **Storage** → **Create Database**
3. В модальном окне найдите и выберите **Prisma Postgres** (Instant Serverless Postgres)
4. Нажмите **Continue**
5. Следуйте инструкциям для создания базы данных
6. После создания скопируйте **Connection String**

### Шаг 2: Добавить Connection String в Vercel

1. В Vercel Dashboard → ваш проект → **Settings** → **Environment Variables**
2. Добавьте новую переменную:
   - **Key:** `DATABASE_URL`
   - **Value:** ваш Connection String из Prisma Postgres
   - **Environment:** выберите все (Production, Preview, Development) или нужные
3. Нажмите **Save**

### Шаг 3: Применить миграции

**Вариант A: Через Vercel CLI (рекомендуется)**

```bash
# Установите Vercel CLI (если еще не установлен)
npm install -g vercel

# Войдите в аккаунт
vercel login

# Подключитесь к проекту
vercel link

# Примените миграции
DATABASE_URL="your_prisma_postgres_connection_string" npx prisma migrate deploy
```

**Вариант B: Через Prisma Studio**

```bash
# Установите переменную окружения локально
# Windows PowerShell:
$env:DATABASE_URL="your_prisma_postgres_connection_string"

# Затем откройте Prisma Studio
npx prisma studio

# Или примените миграции напрямую
npx prisma migrate deploy
```

**Вариант C: Через SQL Editor Prisma**

1. Откройте панель управления Prisma Postgres
2. Найдите SQL Editor или Database Console
3. Откройте файл `DEPLOY_SQL.sql` из репозитория
4. Скопируйте и выполните все SQL команды по порядку

### Шаг 4: Проверить подключение

После применения миграций проверьте что всё работает:

```bash
# Проверить схему
npx prisma db pull

# Или открыть Prisma Studio
DATABASE_URL="your_connection_string" npx prisma studio
```

---

## 🔧 Формат Connection String

Connection String от Prisma Postgres выглядит примерно так:

```
postgresql://prisma_user:password@prisma-host.com:5432/database_name?sslmode=require
```

или

```
postgres://user:password@host:5432/database?sslmode=require
```

**Важно:** Убедитесь что используете полный Connection String, включая параметры SSL если они требуются.

---

## ✅ После настройки

1. Убедитесь что `DATABASE_URL` добавлен в Vercel Environment Variables
2. Примените миграции (см. выше)
3. Деплойте проект на Vercel
4. Проверьте что приложение работает

---

## 🔍 Troubleshooting

### Ошибка: "Cannot connect to database"

**Решения:**
- Проверьте что Connection String правильно скопирован
- Убедитесь что `DATABASE_URL` добавлен в Environment Variables
- Проверьте что база данных активна в панели Prisma
- Убедитесь что используете правильный Connection String (не Pooling URL если он есть)

### Ошибка: "Table does not exist"

**Решение:**
- Примените миграции: `npx prisma migrate deploy`
- Или выполните SQL из `DEPLOY_SQL.sql` вручную

### Ошибка: "SSL connection required"

**Решение:**
- Добавьте `?sslmode=require` в конец Connection String
- Или используйте Connection String с уже включенным SSL

### Ошибка: "Prisma Client not generated"

**Решение:**
- Запустите: `npx prisma generate`
- Убедитесь что `package.json` содержит `postinstall: "prisma generate"`

---

## 📝 Пример полной настройки

```bash
# 1. Создать БД в Vercel (через веб-интерфейс)
# 2. Скопировать Connection String
# 3. Добавить в Vercel Environment Variables

# 4. Локально применить миграции
DATABASE_URL="postgresql://user:pass@host:5432/db" npx prisma migrate deploy

# 5. Проверить
DATABASE_URL="postgresql://user:pass@host:5432/db" npx prisma studio

# 6. Закоммитить и запушить
git add .
git commit -m "Configure Prisma Postgres"
git push origin main

# 7. Vercel автоматически задеплоит
```

---

## 🎯 Преимущества Prisma Postgres

- ✅ **Instant Setup** - быстрая настройка
- ✅ **Serverless** - автоматическое масштабирование
- ✅ **Интеграция с Prisma** - оптимальная работа с Prisma ORM
- ✅ **Vercel Integration** - прямое подключение из Vercel Dashboard

---

## 📚 Дополнительные ресурсы

- [Prisma Postgres Documentation](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
