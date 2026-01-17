# Настройка DATABASE_URL для Railway

## Как получить правильный DATABASE_URL

### Шаг 1: Найдите PostgreSQL сервис в Railway

1. Откройте ваш проект в Railway Dashboard: https://railway.app
2. Найдите сервис **PostgreSQL** (не `mentorspanel`, а отдельный PostgreSQL сервис)
3. Если его нет - создайте:
   - Нажмите **"+ New"**
   - Выберите **"Database"** → **"Add PostgreSQL"**

### Шаг 2: Скопируйте DATABASE_URL

1. Откройте PostgreSQL сервис
2. Перейдите на вкладку **"Variables"**
3. Найдите переменную **`DATABASE_URL`** или **`PGDATABASE`**
4. Скопируйте значение - оно будет выглядеть примерно так:
   ```
   postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
   ```
   **НЕ** `localhost`! URL должен содержать домен Railway, например `containers-us-west-xxx.railway.app`

### Шаг 3: Добавьте DATABASE_URL в сервис приложения

1. Вернитесь к проекту
2. Откройте сервис **`mentorspanel`** (ваше приложение)
3. Перейдите на вкладку **"Variables"**
4. Нажмите **"+ New Variable"**
5. Укажите:
   - **Name:** `DATABASE_URL`
   - **Value:** вставьте скопированный URL из шага 2

### Шаг 4: Перезапустите приложение

После добавления переменной Railway автоматически перезапустит приложение, или нажмите **"Redeploy"** вручную.

## Проверка

После перезапуска проверьте:
1. Логи в Railway Dashboard → Logs (не должно быть ошибок про DATABASE_URL)
2. Попробуйте зарегистрироваться/войти в приложении

---

**Важно:** 
- Локальный `.env` файл с `localhost:5432` используется только для локальной разработки
- На Railway нужен URL от Railway PostgreSQL сервиса
