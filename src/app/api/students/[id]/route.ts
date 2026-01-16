import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

    const student = await db.student.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        githubLink: true,
        monthlyPlans: {
          where: {
            month: currentMonth,
          },
          take: 1,
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: student.id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      githubLink: student.githubLink,
      monthlyPlan: student.monthlyPlans[0] || null,
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
