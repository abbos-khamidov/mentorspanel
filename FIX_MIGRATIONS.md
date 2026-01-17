# Решение проблем с миграциями

## Проблема 1: Service "Postgres" not found

### Решение: Найдите правильное имя сервиса

```powershell
# Проверить список сервисов
railway status
```

Или в Railway Dashboard посмотрите имя PostgreSQL сервиса - оно может быть:
- `Postgres` (с заглавной P)
- `postgres` (все маленькие)
- `PostgreSQL`
- Или какое-то другое имя

Попробуйте:
```powershell
railway connect <правильное-имя-сервиса>
```

---

## Проблема 2: ETIMEDOUT - не может подключиться

### Решение A: Проверить Public Network доступ

1. В Railway Dashboard → PostgreSQL сервис
2. Перейдите на вкладку **"Settings"** или **"Connect"**
3. Убедитесь что **"Public Networking"** включено
4. Если нет - включите его

### Решение B: Использовать DATABASE_PUBLIC_URL

В Railway PostgreSQL сервисе → Variables может быть `DATABASE_PUBLIC_URL` вместо `DATABASE_URL`.

Попробуйте:
```powershell
$env:DATABASE_PUBLIC_URL="postgresql://postgres:JoJAXeQeosBTGsAEjfQzdKicLeJcOsaJ@tramway.proxy.rlwy.net:46825/railway"
$env:DATABASE_URL=$env:DATABASE_PUBLIC_URL
npm run migrate:apply
```

### Решение C: Использовать psql напрямую ⭐ Самый надежный

Если у вас установлен PostgreSQL клиент:

```powershell
# Установить переменную пароля
$env:PGPASSWORD="JoJAXeQeosBTGsAEjfQzdKicLeJcOsaJ"

# Подключиться
psql -h tramway.proxy.rlwy.net -p 46825 -U postgres -d railway
```

В psql консоли:
1. Откройте файл `DEPLOY_SQL.sql` в текстовом редакторе
2. Скопируйте весь SQL (строки 5-108, без комментариев в начале)
3. Вставьте в psql консоль
4. Нажмите Enter
5. Введите `\q` для выхода

### Решение D: Применить миграции через Railway Deploy Hook

Добавьте автоматическое применение миграций после деплоя:

В `package.json`:
```json
{
  "scripts": {
    "postdeploy": "prisma migrate deploy"
  }
}
```

Затем сделайте redeploy через Railway Dashboard - миграции применятся автоматически.

---

## ✅ Рекомендация: Использовать Решение D (postdeploy hook)

Это самый простой способ:
1. Добавьте `"postdeploy": "prisma migrate deploy"` в `package.json`
2. В Railway Dashboard → ваш проект → нажмите **"Redeploy"**
3. Миграции применятся автоматически во время деплоя
4. Приложение будет работать!

---

## Альтернатива: Использовать DATABASE_PUBLIC_URL из Variables

1. В Railway Dashboard → PostgreSQL сервис → Variables
2. Найдите `DATABASE_PUBLIC_URL` (не `DATABASE_URL`)
3. Скопируйте его значение
4. Используйте его вместо `DATABASE_URL` в команде
