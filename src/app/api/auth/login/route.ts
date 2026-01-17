import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Некорректный email адрес'),
  password: z.string().min(1, 'Пароль обязателен'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Валидация
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    const emailLower = email.toLowerCase().trim();

    // Поиск пользователя
    const users = await db.$queryRaw<Array<{
      id: string;
      email: string;
      passwordHash: string;
      name: string | null;
    }>>`
      SELECT id, email, "passwordHash", name FROM users WHERE email = ${emailLower} LIMIT 1
    `;

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Проверка пароля
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    // Генерация токена
    const token = randomBytes(32).toString('hex');

    // Установка cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      path: '/',
    });

    return NextResponse.json({
      success: true,
      message: 'Вход выполнен успешно',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      name: error?.name,
      stack: error?.stack,
    });

    // Проверка на отсутствие таблицы (миграции не применены)
    if (error?.code === '42P01' || error?.message?.includes('does not exist') || error?.message?.includes('relation') && error?.message?.includes('users')) {
      console.error('❌ Table "users" does not exist! Migrations may not be applied.');
      return NextResponse.json(
        { error: 'Ошибка базы данных. Миграции не применены.' },
        { status: 500 }
      );
    }

    // Проверка на ошибку подключения
    if (error?.code === 'ECONNREFUSED' || error?.message?.includes('connect') || error?.message?.includes('connection')) {
      console.error('❌ Database connection error!');
      return NextResponse.json(
        { error: 'Ошибка подключения к базе данных.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Ошибка при входе. Попробуйте снова.' },
      { status: 500 }
    );
  }
}
