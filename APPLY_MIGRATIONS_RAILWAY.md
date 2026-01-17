# Как применить миграции на Railway (без SQL Editor)

## Вариант 1: Использовать Railway CLI `connect` (Рекомендуется)

### Шаг 1: Подключиться к PostgreSQL через Railway туннель

```bash
railway connect Postgres
```

Эта команда создаст туннель к вашей базе данных. После подключения терминал покажет что-то вроде:
```
Connected to Postgres database on port 5432
```

### Шаг 2: В ДРУГОМ терминале выполните миграции

Откройте **новый терминальный окно** и выполните:

```bash
# Установите DATABASE_URL для локального подключения
export DATABASE_URL="postgresql://postgres:JoJAXeQeosBTGsAEjfQzdKicLeJcOsaJ@localhost:5432/railway"

# Примените миграции
npx prisma migrate deploy
```

Или используйте скрипт для применения SQL напрямую:
```bash
DATABASE_URL="postgresql://postgres:JoJAXeQeosBTGsAEjfQzdKicLeJcOsaJ@localhost:5432/railway" npm run migrate:apply
```

---

## Вариант 2: Использовать Public Network Connection URL напрямую

### Шаг 1: Скопируйте Connection URL из модального окна

В модальном окне "Connect to Postgres" → вкладка **"Public Network"**:
- Нажмите кнопку **"show"** рядом с "Connection URL"
- Скопируйте полный URL (с паролем)
- Он будет выглядеть так: `postgresql://postgres:JoJAXeQeosBTGsAEjfQzdKicLeJcOsaJ@tramway.proxy.rlwy.net:46825/railway`

### Шаг 2: Примените миграции с этим URL

```bash
# Используйте скопированный URL
DATABASE_URL="postgresql://postgres:JoJAXeQeosBTGsAEjfQzdKicLeJcOsaJ@tramway.proxy.rlwy.net:46825/railway" npx prisma migrate deploy
```

Или через скрипт:
```bash
DATABASE_URL="postgresql://postgres:JoJAXeQeosBTGsAEjfQzdKicLeJcOsaJ@tramway.proxy.rlwy.net:46825/railway" npm run migrate:apply
```

---

## Вариант 3: Использовать psql напрямую (Продвинутый)

### Шаг 1: Скопируйте Raw `psql` команду

В модальном окне скопируйте команду из секции **"Raw `psql` command"**.

### Шаг 2: Скопируйте SQL из DEPLOY_SQL.sql

Откройте файл `DEPLOY_SQL.sql` и скопируйте весь SQL (строки 1-108).

### Шаг 3: Выполните SQL

```bash
# Выполните скопированную psql команду
PGPASSWORD=JoJAXeQeosBTGsAEjfQzdKicLeJcOsaJ psql -h tramway.proxy.rlwy.net -U postgres -d railway

# В psql консоли вставьте SQL из DEPLOY_SQL.sql
# После выполнения введите \q для выхода
```

---

## Рекомендация: Используйте Вариант 2

**Вариант 2 (Public Network Connection URL)** - самый простой:
- ✅ Не требует запуска туннеля
- ✅ Работает сразу
- ✅ Можно использовать один раз для применения миграций

**После применения миграций:**
1. Убедитесь что переменная `DATABASE_URL` в Railway сервисе `mentorspanel` указывает на внутренний адрес `postgres.railway.internal` (это правильно для runtime)
2. Перезапустите приложение
3. Попробуйте зарегистрироваться/войти

---

## Важно!

- **Public Network** - для локального доступа (миграции, администрирование)
- **Private Network** (`postgres.railway.internal`) - для runtime приложения на Railway (уже настроено правильно!)

После применения миграций через Public Network, приложение на Railway продолжит использовать Private Network для подключения (что правильно и безопасно).
