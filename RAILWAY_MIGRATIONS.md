# Как применить миграции на Railway

## Проблема с `postgres.railway.internal`

Адрес `postgres.railway.internal:5432` работает только **внутри Railway сети**. Когда вы запускаете `railway run` локально, ваша машина не имеет доступа к внутренней сети Railway.

## Решения

### Вариант 1: Использовать DATABASE_PUBLIC_URL (Рекомендуется)

1. **В Railway Dashboard → PostgreSQL сервис → Variables**
   - Найдите `DATABASE_PUBLIC_URL` (внешний URL базы данных)
   - Скопируйте его значение

2. **Добавьте в сервис `mentorspanel` → Variables:**
   - **Name:** `DATABASE_PUBLIC_URL`
   - **Value:** скопированный URL

3. **Локально используйте `DATABASE_PUBLIC_URL`:**
   ```bash
   # Временно установите переменную для миграций
   railway variables
   railway run --env DATABASE_PUBLIC_URL npx prisma migrate deploy
   ```

### Вариант 2: Применить миграции через SQL Editor (Самое простое)

1. **Откройте Railway Dashboard → PostgreSQL сервис**
2. Перейдите на вкладку **"Database"** → **"Query"**
3. Скопируйте весь SQL из файла `DEPLOY_SQL.sql`
4. Вставьте и выполните SQL в Query Editor
5. Нажмите **"Run"**

Это применит все миграции сразу!

### Вариант 3: Использовать Railway Tunnel (Для продвинутых)

```bash
# Создать туннель к PostgreSQL
railway connect postgres

# В другом терминале выполнить миграции
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

### Вариант 4: Применить миграции через Railway Deploy Hook

Добавьте в `package.json`:
```json
{
  "scripts": {
    "postdeploy": "prisma migrate deploy"
  }
}
```

Это автоматически применит миграции после каждого деплоя.

## Рекомендуемый подход для первого раза

**Используйте Вариант 2 (SQL Editor)** - это самый быстрый и надежный способ:
- ✅ Не требует настройки туннелей
- ✅ Работает сразу
- ✅ Можно увидеть результат SQL запросов

После первого применения миграций, для будущих миграций используйте Вариант 4 (postdeploy hook).
