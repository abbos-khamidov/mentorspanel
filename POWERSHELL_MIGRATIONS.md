# Команды для PowerShell (Windows)

## ❌ Неправильный синтаксис (для bash/Unix):
```bash
DATABASE_URL="..." npm run migrate:apply
```

## ✅ Правильный синтаксис для PowerShell:

### Вариант 1: Установить переменную и запустить команду (рекомендуется)

```powershell
$env:DATABASE_URL="postgresql://postgres:JoJAXeQeosBTGsAEjfQzdKicLeJcOsaJ@tramway.proxy.rlwy.net:46825/railway"; npm run migrate:apply
```

### Вариант 2: Установить переменную на отдельной строке

```powershell
$env:DATABASE_URL="postgresql://postgres:JoJAXeQeosBTGsAEjfQzdKicLeJcOsaJ@tramway.proxy.rlwy.net:46825/railway"
npm run migrate:apply
```

### Вариант 3: Использовать Prisma напрямую

```powershell
$env:DATABASE_URL="postgresql://postgres:JoJAXeQeosBTGsAEjfQzdKicLeJcOsaJ@tramway.proxy.rlwy.net:46825/railway"
npx prisma migrate deploy
```

### Вариант 4: Временно добавить в .env файл (самый простой)

1. Откройте файл `.env` в корне проекта
2. Добавьте/замените строку:
   ```
   DATABASE_URL="postgresql://postgres:JoJAXeQeosBTGsAEjfQzdKicLeJcOsaJ@tramway.proxy.rlwy.net:46825/railway"
   ```
3. Сохраните файл
4. Запустите:
   ```powershell
   npm run migrate:apply
   ```

---

## 🔧 Разница между PowerShell и bash:

| Bash/Unix | PowerShell |
|-----------|------------|
| `VARIABLE="value" command` | `$env:VARIABLE="value"; command` |
| `export VARIABLE="value"` | `$env:VARIABLE="value"` |

---

## 💡 Рекомендация для Windows/PowerShell:

**Используйте Вариант 1** (одна команда) или **Вариант 4** (временно в .env) - они самые простые!
