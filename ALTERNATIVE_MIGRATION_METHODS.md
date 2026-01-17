# Альтернативные способы применения миграций

## Проблема: ETIMEDOUT при подключении

Если получаете ошибку `ETIMEDOUT`, это может быть из-за:
- Файрвола/блокировки порта
- Проблем с SSL
- Блокировки сети

## Решение 1: Использовать Railway CLI `connect` (Туннель) ⭐ Рекомендуется

Это создаст безопасный туннель к базе данных:

### Шаг 1: Создать туннель

В **первом терминале**:
```powershell
railway connect Postgres
```

Дождитесь сообщения типа:
```
Connected to Postgres database on port 5432
```

### Шаг 2: Применить миграции

В **втором терминале** (новое окно PowerShell):
```powershell
$env:DATABASE_URL="postgresql://postgres:JoJAXeQeosBTGsAEjfQzdKicLeJcOsaJ@localhost:5432/railway"
npm run migrate:apply
```

---

## Решение 2: Использовать psql напрямую

### Шаг 1: Установите PostgreSQL клиент (если нет)

Скачайте с https://www.postgresql.org/download/windows/

### Шаг 2: Выполните SQL через psql

```powershell
# Используйте команду из Railway Dashboard → Connect → Raw psql command
$env:PGPASSWORD="JoJAXeQeosBTGsAEjfQzdKicLeJcOsaJ"
psql -h tramway.proxy.rlwy.net -p 46825 -U postgres -d railway
```

В psql консоли:
1. Скопируйте весь SQL из `DEPLOY_SQL.sql`
2. Вставьте в консоль
3. Нажмите Enter
4. Введите `\q` для выхода

---

## Решение 3: Использовать онлайн SQL Editor

1. Откройте Railway Dashboard → PostgreSQL сервис
2. Найдите вкладку **"Database"** или **"Connect"**
3. Попробуйте найти **"Query"** или **"SQL Editor"**
4. Скопируйте SQL из `DEPLOY_SQL.sql`
5. Вставьте и выполните

---

## Решение 4: Добавить SSL параметры в URL

Попробуйте добавить `?sslmode=require` в конец URL:

```powershell
$env:DATABASE_URL="postgresql://postgres:JoJAXeQeosBTGsAEjfQzdKicLeJcOsaJ@tramway.proxy.rlwy.net:46825/railway?sslmode=require"
npm run migrate:apply
```

---

## ✅ Рекомендация

**Используйте Решение 1 (Railway CLI connect)** - это самый надежный способ:
- ✅ Создает безопасный туннель
- ✅ Обходит проблемы с файрволом
- ✅ Не требует настройки SSL

После применения миграций через туннель, приложение на Railway будет работать с внутренним адресом (что правильно).
