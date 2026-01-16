import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  email: z.string().email('Некорректный email адрес'),
  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Валидация
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;
    const emailLower = email.toLowerCase().trim();

    // Проверка существования пользователя
    const existing = await db.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM users WHERE email = ${emailLower} LIMIT 1
    `;

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      );
    }

    // Хеширование пароля
    const passwordHash = await bcrypt.hash(password, 12);

    // Генерация ID
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    const id = `cl${timestamp}${random}`.substring(0, 25);

    // Создание пользователя
    await db.$executeRaw`
      INSERT INTO users (id, email, "passwordHash", name, "createdAt", "updatedAt")
      VALUES (${id}, ${emailLower}, ${passwordHash}, ${name}, NOW(), NOW())
    `;

    return NextResponse.json({
      success: true,
      message: 'Регистрация успешна! Теперь вы можете войти.',
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Проверка на дубликат
    if (error?.code === '23505' || error?.message?.includes('unique')) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Ошибка при регистрации. Попробуйте снова.' },
      { status: 500 }
    );
  }
}
