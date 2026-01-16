'use server';

import { db } from '@/lib/db';
import { RecordPaymentSchema, CreateMonthlyPlanSchema } from '@/lib/validations';
import type { ActionResult } from './types';

export async function recordPayment(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const validated = RecordPaymentSchema.parse(input);
    const { studentId, month, paidAmount, priceTotal, totalLessons } = validated;

    // Upsert MonthlyPlan (create or update)
    const monthlyPlan = await db.monthlyPlan.upsert({
      where: {
        studentId_month: {
          studentId,
          month,
        },
      },
      create: {
        studentId,
        month,
        totalLessons,
        usedLessons: 0,
        priceTotal,
        isPaid: paidAmount >= priceTotal,
        paidAmount,
      },
      update: {
        totalLessons,
        priceTotal,
        paidAmount,
        isPaid: paidAmount >= priceTotal,
        // Don't reset usedLessons on payment update
      },
      select: { id: true },
    });

    return { success: true, data: monthlyPlan };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to record payment' };
  }
}

export async function createMonthlyPlan(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const validated = CreateMonthlyPlanSchema.parse(input);
    const { studentId, month, totalLessons, priceTotal } = validated;

    const monthlyPlan = await db.monthlyPlan.create({
      data: {
        studentId,
        month,
        totalLessons,
        usedLessons: 0,
        priceTotal,
        isPaid: false,
        paidAmount: 0,
      },
      select: { id: true },
    });

    return { success: true, data: monthlyPlan };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to create monthly plan' };
  }
}

export async function updateMonthlyPlan(
  id: string,
  updates: {
    totalLessons?: number;
    priceTotal?: number;
    paidAmount?: number;
    isPaid?: boolean;
  }
): Promise<ActionResult<{ id: string }>> {
  try {
    const monthlyPlan = await db.monthlyPlan.update({
      where: { id },
      data: updates,
      select: { id: true },
    });

    return { success: true, data: monthlyPlan };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to update monthly plan' };
  }
}
