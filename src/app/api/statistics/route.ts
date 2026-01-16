import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [students, lessons, monthlyPlans] = await Promise.all([
      db.student.count(),
      db.lesson.findMany({
        select: {
          status: true,
        },
      }),
      db.monthlyPlan.findMany({
        select: {
          priceTotal: true,
          paidAmount: true,
          isPaid: true,
        },
      }),
    ]);

    const completedLessons = lessons.filter((l) => l.status === 'done').length;
    const pendingLessons = lessons.filter((l) => l.status === 'pending').length;

    const expectedIncome = monthlyPlans.reduce((sum, plan) => sum + plan.priceTotal, 0);
    const paidAmount = monthlyPlans.reduce((sum, plan) => sum + plan.paidAmount, 0);
    const totalPending = expectedIncome - paidAmount;

    // Calculate weekly expected (simplified)
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingLessons = lessons.filter(
      (l) => l.status === 'pending' // simplified check
    );
    const weeklyExpected = (upcomingLessons.length / lessons.length) * expectedIncome || 0;

    const stats = {
      totalEarnings: expectedIncome,
      totalReceived: paidAmount,
      totalPending,
      weeklyExpected,
      activeStudents: students,
      activeGroups: 0,
      lessonsThisWeek: upcomingLessons.length,
      lessonsThisMonth: lessons.length,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
