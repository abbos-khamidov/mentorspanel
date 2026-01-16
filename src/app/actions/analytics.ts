'use server';

import { db } from '@/lib/db';
import { unstable_cache } from 'next/cache';

// Helper to get month string
function getMonthString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export interface MonthlyStats {
  month: string;
  expectedIncome: number;
  paidAmount: number;
  remainingUnpaid: number;
  totalPlans: number;
  paidPlans: number;
}

export interface StudentPaymentInfo {
  studentId: string;
  studentName: string;
  month: string;
  priceTotal: number;
  paidAmount: number;
  isPaid: boolean;
  usedLessons: number;
  totalLessons: number;
}

export interface LessonStats {
  studentId: string;
  studentName: string;
  completedLessons: number;
  pendingLessons: number;
  cancelledLessons: number;
}

export async function getMonthlyStats(
  month?: string
): Promise<MonthlyStats[]> {
  const targetMonth = month || getMonthString(new Date());

  const plans = await db.monthlyPlan.findMany({
    where: month ? { month } : undefined,
    select: {
      month: true,
      priceTotal: true,
      paidAmount: true,
      isPaid: true,
    },
  });

  // Group by month
  const statsByMonth = new Map<string, MonthlyStats>();

  for (const plan of plans) {
    const existing = statsByMonth.get(plan.month) || {
      month: plan.month,
      expectedIncome: 0,
      paidAmount: 0,
      remainingUnpaid: 0,
      totalPlans: 0,
      paidPlans: 0,
    };

    existing.expectedIncome += plan.priceTotal;
    existing.paidAmount += plan.paidAmount;
    existing.remainingUnpaid += plan.priceTotal - plan.paidAmount;
    existing.totalPlans += 1;
    if (plan.isPaid) existing.paidPlans += 1;

    statsByMonth.set(plan.month, existing);
  }

  return Array.from(statsByMonth.values()).sort((a, b) =>
    a.month.localeCompare(b.month)
  );
}

export async function getStudentPaymentList(
  month?: string
): Promise<StudentPaymentInfo[]> {
  const plans = await db.monthlyPlan.findMany({
    where: month ? { month } : undefined,
    include: {
      student: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [
      { month: 'desc' },
      { student: { name: 'asc' } },
    ],
  });

  return plans.map((plan) => ({
    studentId: plan.student.id,
    studentName: plan.student.name,
    month: plan.month,
    priceTotal: plan.priceTotal,
    paidAmount: plan.paidAmount,
    isPaid: plan.isPaid,
    usedLessons: plan.usedLessons,
    totalLessons: plan.totalLessons,
  }));
}

export async function getLessonStats(): Promise<LessonStats[]> {
  const lessons = await db.lesson.findMany({
    include: {
      student: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const statsByStudent = new Map<string, LessonStats>();

  for (const lesson of lessons) {
    const existing = statsByStudent.get(lesson.studentId) || {
      studentId: lesson.student.id,
      studentName: lesson.student.name,
      completedLessons: 0,
      pendingLessons: 0,
      cancelledLessons: 0,
    };

    if (lesson.status === 'done') {
      existing.completedLessons += 1;
    } else if (lesson.status === 'cancelled') {
      existing.cancelledLessons += 1;
    } else {
      existing.pendingLessons += 1;
    }

    statsByStudent.set(lesson.studentId, existing);
  }

  return Array.from(statsByStudent.values()).sort((a, b) =>
    a.studentName.localeCompare(b.studentName)
  );
}

// Cached version for dashboard (revalidates every 60 seconds)
export const getCachedMonthlyStats = unstable_cache(
  getMonthlyStats,
  ['monthly-stats'],
  {
    revalidate: 60,
  }
);
