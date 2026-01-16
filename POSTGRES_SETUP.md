# Настройка PostgreSQL для проекта

## Вариант 1: Использовать облачную базу данных (Рекомендуется)

### Vercel Postgres (Бесплатно)

1. Зайдите на [vercel.com](https://vercel.com) и войдите в аккаунт
2. Перейдите в Dashboard → Storage
3. Создайте новую базу данных Postgres
4. Скопируйте строку подключения (Connection String)
5. Обновите `.env.local`:
   ```env
   DATABASE_URL="postgres://default:xxxxx@ep-xxxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb"
   ```

### Альтернативы (бесплатные):
- **Supabase** (https://supabase.com) - 500MB бесплатно
- **Neon** (https://neon.tech) - бесплатный tier
- **Railway** (https://railway.app) - $5 кредита бесплатно

---

## Вариант 2: Установить PostgreSQL локально

### Windows

1. **Скачать PostgreSQL:**
   - Перейдите на https://www.postgresql.org/download/windows/
   - Скачайте установщик от EnterpriseDB

2. **Установка:**
   - Запустите установщик
   - Запомните пароль для пользователя `postgres`
   - Порт по умолчанию: `5432`
   - Установите дополнительные компоненты (включая Command Line Tools)

3. **Проверка установки:**
   ```powershell
   # Добавьте PostgreSQL в PATH (если не добавилось автоматически)
   # Путь обычно: C:\Program Files\PostgreSQL\16\bin
   
   psql --version
   ```

4. **Запуск службы:**
   ```powershell
   # Проверить статус
   Get-Service -Name postgresql*
   
   # Запустить (если остановлена)
   Start-Service postgresql-x64-16  # Замените на вашу версию
   ```

5. **Подключение через psql:**
   ```powershell
   psql -U postgres
   # Введите пароль, который указали при установке
   ```

6. **Создать базу данных для проекта:**
   ```sql
   CREATE DATABASE mentorship_db;
   \q  -- Выход из psql
   ```

7. **Обновить .env.local:**
   ```env
   DATABASE_URL="postgresql://postgres:ВАШ_ПАРОЛЬ@localhost:5432/mentorship_db?schema=public"
   ```

---

## Проверка подключения

После настройки базы данных:

```bash
# Сгенерировать Prisma Client (если еще не сделано)
npx prisma generate

# Запустить миграции
npx prisma migrate dev --name init

# Или открыть Prisma Studio (GUI для базы данных)
npx prisma studio
```

---

## Быстрая проверка

Если PostgreSQL установлен, проверить можно так:

```powershell
# Проверка версии
psql --version

# Проверка подключения (замените на ваши данные)
psql -h localhost -U postgres -d mentorship_db

# Или через Connection String
psql "postgresql://postgres:пароль@localhost:5432/mentorship_db"
```

---

## Troubleshooting

### PostgreSQL не найден в PATH
Добавьте путь к bin в переменную PATH:
```
C:\Program Files\PostgreSQL\16\bin
```

### Ошибка подключения
- Проверьте, запущен ли сервис PostgreSQL
- Проверьте правильность пароля в DATABASE_URL
- Убедитесь, что порт 5432 не занят другим приложением

### Prisma не может подключиться
- Убедитесь, что DATABASE_URL правильный в `.env.local`
- Перезапустите dev сервер после изменения `.env.local`
