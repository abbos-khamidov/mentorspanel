import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { createLesson } from '@/app/actions/lessons';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const lessons = await db.lesson.findMany({
      include: {
        student: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // Transform to match old format
    const formattedLessons = lessons.map((lesson) => ({
      id: lesson.id,
      type: 'student' as const,
      studentId: lesson.studentId,
      studentName: lesson.student.name,
      startTime: lesson.startTime.toISOString(),
      duration: Math.round(lesson.durationHours) as 1 | 2,
      status: lesson.status === 'done' ? 'completed' : lesson.status === 'cancelled' ? 'cancelled' : 'scheduled',
      notes: lesson.notes,
      createdAt: lesson.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedLessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createLesson(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}
