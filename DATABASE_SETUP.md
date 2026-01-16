# 🗄️ Настройка базы данных для Vercel

## Варианты провайдеров Postgres

Vercel больше не предоставляет встроенный Postgres. Используйте одного из провайдеров из Marketplace.

## 1. Neon (Рекомендуется) ⭐

**Преимущества:**
- ✅ Бесплатный план с 0.5 GB хранилища
- ✅ Serverless Postgres
- ✅ Автоматическое масштабирование
- ✅ Быстрая интеграция с Vercel
- ✅ Хорошая документация

**Как создать:**

1. В Vercel Dashboard → **Storage** → **Create Database**
2. Выберите **Neon** → **Continue**
3. Зарегистрируйтесь на https://neon.tech (если нужно)
4. Подключите аккаунт Neon к Vercel
5. Создайте новый проект в Neon
6. Скопируйте **Connection String** (выглядит как `postgres://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb`)

**Применение миграций:**

```bash
# Через Neon CLI
npm install -g neonctl
neonctl connection-string --project-name your-project-name

# Или через веб-интерфейс
# Neon Dashboard → SQL Editor → выполните DEPLOY_SQL.sql
```

**URL формата:**
```
postgres://user:password@ep-xxx.region.aws.neon.tech/dbname
```

---

## 2. Supabase

**Преимущества:**
- ✅ Бесплатный план с 500 MB хранилища
- ✅ Postgres + дополнительные функции (Auth, Storage, Realtime)
- ✅ Отличная документация
- ✅ Встроенный SQL Editor

**Как создать:**

1. В Vercel Dashboard → **Storage** → **Create Database**
2. Выберите **Supabase** → **Continue**
3. Зарегистрируйтесь на https://supabase.com (если нужно)
4. Подключите аккаунт Supabase
5. Создайте новый проект
6. В Settings → Database → Connection string → URI скопируйте Connection String

**Применение миграций:**

```bash
# Через Supabase CLI
npm install -g supabase
supabase db push

# Или через веб-интерфейс
# Supabase Dashboard → SQL Editor → выполните DEPLOY_SQL.sql
```

**URL формата:**
```
postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
```

---

## 3. Prisma Postgres

**Преимущества:**
- ✅ Instant Serverless Postgres
- ✅ Прямая интеграция с Prisma
- ✅ Простая настройка

**Как создать:**

1. В Vercel Dashboard → **Storage** → **Create Database**
2. Выберите **Prisma Postgres** → **Continue**
3. Следуйте инструкциям для создания БД
4. Скопируйте Connection String

**URL формата:**
```
postgresql://user:password@host:5432/database
```

---

## 4. AWS RDS / PostgreSQL (Для production)

**Когда использовать:**
- Production приложения с высокими нагрузками
- Когда нужен полный контроль над базой данных
- Когда требуется соблюдение определенных compliance требований

**Настройка:**
1. Создайте RDS PostgreSQL instance в AWS
2. Получите Connection String
3. Добавьте в Vercel Environment Variables

---

## 5. Другие варианты

- **Turso** - Serverless SQLite (не подходит, нужен Postgres)
- **Upstash** - Redis (не подходит, нужен Postgres)
- **MongoDB Atlas** - MongoDB (не подходит, нужен Postgres)

---

## 🔧 Добавление Connection String в Vercel

После получения Connection String:

1. В Vercel Dashboard → ваш проект → **Settings** → **Environment Variables**
2. Добавьте:
   - **Key:** `DATABASE_URL`
   - **Value:** ваш Connection String
   - **Environment:** Production, Preview, Development (или все)

3. Сохраните

---

## ✅ Применение миграций

После настройки базы данных примените миграции:

**Вариант 1: Через Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel link
DATABASE_URL="your_connection_string" npx prisma migrate deploy
```

**Вариант 2: Через SQL Editor провайдера**
1. Откройте SQL Editor вашего провайдера
2. Откройте файл `DEPLOY_SQL.sql` из репозитория
3. Скопируйте и выполните все SQL команды по порядку

**Вариант 3: Через Prisma Studio**
```bash
DATABASE_URL="your_connection_string" npx prisma studio
```

---

## 🎯 Рекомендация

Для начала используйте **Neon** - это самый простой и бесплатный вариант с хорошей интеграцией Vercel.

---

## 📝 Примеры Connection Strings

**Neon:**
```
postgres://user:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Supabase:**
```
postgresql://postgres.xxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Prisma Postgres:**
```
postgresql://prisma_user:password@prisma-host.com:5432/database
```

---

## 🔍 Troubleshooting

**Ошибка подключения:**
- Проверьте что Connection String правильный
- Убедитесь что база данных активна
- Проверьте что IP адреса не заблокированы (для некоторых провайдеров)

**SSL ошибки:**
- Добавьте `?sslmode=require` в конец Connection String

**Timeout ошибки:**
- Некоторые провайдеры требуют Connection Pooling URL вместо прямого подключения
- Проверьте документацию вашего провайдера
