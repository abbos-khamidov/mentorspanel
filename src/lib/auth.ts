import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return null;
    }

    // TODO: В продакшене проверяйте токен в таблице сессий
    // Пока что возвращаем null, чтобы всегда требовалась аутентификация
    // Это упрощенная версия для демо

    return null;
  } catch (error) {
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
