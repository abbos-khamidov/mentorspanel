'use server';

import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { z } from 'zod';
import { registerSchema, loginSchema } from '@/app/validations/auth';
import type { ActionResult } from './types';

export async function registerUser(
  input: unknown
): Promise<ActionResult<{ message: string }>> {
  try {
    // Валидация через Zod
    const validated = registerSchema.parse(input);
    const { name, email, password } = validated;
    
    console.log('RegisterUser: Validated email:', email);

    // Проверка существования пользователя
    // Используем прямой доступ к модели User через Prisma Client
    let existingUser = null;
    try {
      existingUser = await (db as any).user?.findUnique({
        where: { email },
      });
    } catch (err) {
      console.error('RegisterUser: Error checking user:', err);
      // Пробуем через $queryRaw как fallback
      const result = await db.$queryRaw`
        SELECT * FROM users WHERE email = ${email} LIMIT 1
      ` as any[];
      existingUser = result[0] || null;
    }

    if (existingUser) {
      console.log('RegisterUser: User already exists:', email);
      return { success: false, error: 'Пользователь с таким email уже существует' };
    }

    // Хеширование пароля
    const passwordHash = await bcrypt.hash(password, 12);

    // Создание пользователя
    // Используем прямой доступ к модели User через Prisma Client
    let newUser = null;
    try {
      newUser = await (db as any).user?.create({
        data: {
          name,
          email,
          passwordHash,
        },
      });
    } catch (err: any) {
      console.error('RegisterUser: Error creating user:', err);
      // Пробуем через $executeRaw как fallback
      // Генерируем ID в формате, похожем на cuid
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 15);
      const userId = `cl${timestamp}${random}`.substring(0, 25);
      try {
        await db.$executeRaw`
          INSERT INTO users (id, email, "passwordHash", name, "createdAt", "updatedAt")
          VALUES (${userId}, ${email}, ${passwordHash}, ${name || null}, NOW(), NOW())
        `;
        // Получаем созданного пользователя
        const result = await db.$queryRaw`
          SELECT * FROM users WHERE id = ${userId} LIMIT 1
        ` as any[];
        newUser = result[0];
      } catch (sqlErr: any) {
        console.error('RegisterUser: SQL error:', sqlErr);
        // Если пользователь уже существует
        if (sqlErr?.code === '23505' || sqlErr?.message?.includes('unique')) {
          return { success: false, error: 'Пользователь с таким email уже существует' };
        }
        return { success: false, error: `Ошибка при создании пользователя: ${sqlErr?.message || 'Неизвестная ошибка'}` };
      }
    }
    
    if (!newUser) {
      console.error('RegisterUser: Failed to create user');
      return { success: false, error: 'Ошибка при создании пользователя' };
    }

    console.log('RegisterUser: User created:', newUser.email);

    return {
      success: true,
      data: { message: 'Регистрация успешна! Теперь вы можете войти.' },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('RegisterUser: Zod validation error:', error.errors);
      const firstError = error.errors[0];
      return { success: false, error: firstError.message };
    }
    console.error('Registration error:', error);
    return { success: false, error: 'Ошибка при регистрации. Попробуйте снова.' };
  }
}

export async function loginUser(
  input: unknown
): Promise<ActionResult<{ token: string; user: { id: string; email: string; name: string | null } }>> {
  try {
    // Валидация через Zod
    const validated = loginSchema.parse(input);
    const { email, password } = validated;
    
    console.log('LoginUser: Validated email:', email);

    // Поиск пользователя
    // Используем прямой доступ к модели User через Prisma Client
    let user = null;
    try {
      user = await (db as any).user?.findUnique({
        where: { email },
      });
    } catch (err) {
      console.error('LoginUser: Error finding user:', err);
      // Пробуем через $queryRaw как fallback
      const result = await db.$queryRaw`
        SELECT * FROM users WHERE email = ${email} LIMIT 1
      ` as any[];
      user = result[0] || null;
    }

    if (!user) {
      console.log('LoginUser: User not found for email:', email);
      return { success: false, error: 'Неверный email или пароль' };
    }

    console.log('LoginUser: User found:', user.email);

    // Проверка пароля
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      console.log('LoginUser: Invalid password for user:', email);
      return { success: false, error: 'Неверный email или пароль' };
    }

    console.log('LoginUser: Password valid, generating token');

    // Генерация токена (в продакшене используйте JWT)
    const token = randomBytes(32).toString('hex');

    return {
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('LoginUser: Zod validation error:', error.errors);
      const firstError = error.errors[0];
      return { success: false, error: firstError.message };
    }
    console.error('Login error:', error);
    return { success: false, error: 'Ошибка при входе. Попробуйте снова.' };
  }
}
