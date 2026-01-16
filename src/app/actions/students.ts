'use server';

import { db } from '@/lib/db';
import { z } from 'zod';
import type { ActionResult } from './types';

const CreateStudentSchema = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  email: z.string().email('Некорректный email').optional().or(z.literal('')),
  phone: z.string().optional(),
  githubLink: z.string().url('Некорректная ссылка на GitHub').optional().or(z.literal('')),
});

const UpdateStudentSchema = CreateStudentSchema;

export async function createStudent(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const validated = CreateStudentSchema.parse(input);
    const { name, email, phone } = validated;

    const student = await db.student.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
      },
      select: { id: true },
    });

    return { success: true, data: student };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error('Create student error:', error);
    return { success: false, error: 'Ошибка при создании ученика' };
  }
}

export async function updateStudent(
  id: string,
  input: unknown
): Promise<ActionResult<{ id: string }>> {
      try {
        const validated = UpdateStudentSchema.parse(input);
        const { name, email, phone, githubLink } = validated;

        await db.student.update({
          where: { id },
          data: {
            name,
            email: email || null,
            phone: phone || null,
            githubLink: githubLink || null,
          },
        });

    return { success: true, data: { id } };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error('Update student error:', error);
    return { success: false, error: 'Ошибка при обновлении ученика' };
  }
}

export async function deleteStudent(id: string): Promise<ActionResult<void>> {
  try {
    await db.student.delete({
      where: { id },
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error('Delete student error:', error);
    return { success: false, error: 'Ошибка при удалении ученика' };
  }
}

const MarkLessonSchema = z.object({
  studentId: z.string(),
  count: z.number().int().min(1, 'Количество уроков должно быть больше 0'),
});

export async function markLesson(
  input: unknown
): Promise<ActionResult<void>> {
  try {
    const validated = MarkLessonSchema.parse(input);
    const { studentId, count } = validated;

    // Получаем текущий месяц
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    // Находим или создаем план на текущий месяц
    let monthlyPlan = await db.monthlyPlan.findFirst({
      where: {
        studentId,
        month: currentMonth,
      },
    });

    if (!monthlyPlan) {
      // Создаем план если его нет (по умолчанию 12 уроков)
      monthlyPlan = await db.monthlyPlan.create({
        data: {
          studentId,
          month: currentMonth,
          totalLessons: 12, // Значение по умолчанию
          usedLessons: 0,
          priceTotal: 0,
          isPaid: false,
          paidAmount: 0,
        },
      });
    }

    // Проверяем, не превышен ли лимит
    if (monthlyPlan.usedLessons + count > monthlyPlan.totalLessons) {
      return { 
        success: false, 
        error: `Нельзя превысить лимит уроков. Доступно: ${monthlyPlan.totalLessons - monthlyPlan.usedLessons} из ${monthlyPlan.totalLessons}` 
      };
    }

    // Добавляем уроки
    await db.monthlyPlan.update({
      where: { id: monthlyPlan.id },
      data: {
        usedLessons: {
          increment: count,
        },
      },
    });

    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error('Mark lesson error:', error);
    return { success: false, error: 'Ошибка при отметке урока' };
  }
}

const UpdateMonthlyPlanSchema = z.object({
  studentId: z.string(),
  totalLessons: z.number().int().min(1, 'Количество уроков должно быть больше 0'),
});

export async function updateMonthlyPlanLessons(
  input: unknown
): Promise<ActionResult<void>> {
  try {
    const validated = UpdateMonthlyPlanSchema.parse(input);
    const { studentId, totalLessons } = validated;

    // Получаем текущий месяц
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    // Сначала получаем текущий план (если есть)
    const existingPlan = await db.monthlyPlan.findFirst({
      where: {
        studentId,
        month: currentMonth,
      },
    });

    // Определяем usedLessons: если план есть и usedLessons > totalLessons, ограничиваем
    const newUsedLessons = existingPlan 
      ? Math.min(existingPlan.usedLessons, totalLessons)
      : 0;

    // Создаем или обновляем план
    await db.monthlyPlan.upsert({
      where: {
        studentId_month: {
          studentId,
          month: currentMonth,
        },
      },
      create: {
        studentId,
        month: currentMonth,
        totalLessons,
        usedLessons: 0,
        priceTotal: existingPlan?.priceTotal || 0,
        isPaid: existingPlan?.isPaid || false,
        paidAmount: existingPlan?.paidAmount || 0,
      },
      update: {
        totalLessons,
        usedLessons: newUsedLessons,
      },
    });

    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error('Update monthly plan lessons error:', error);
    return { success: false, error: 'Ошибка при обновлении количества уроков в месячном плане' };
  }
}
