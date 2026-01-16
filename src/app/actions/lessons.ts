'use server';

import { db } from '@/lib/db';
import { CreateLessonSchema, UpdateLessonSchema } from '@/lib/validations';
import type { ActionResult } from './types';

// Helper to get month string from date (YYYY-MM format)
function getMonthString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

// Calculate duration in hours
function calculateDurationHours(startTime: Date, endTime: Date): number {
  return (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
}

export async function createLesson(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const validated = CreateLessonSchema.parse(input);
    const { studentId, startTime, endTime, notes } = validated;

    // Calculate duration
    const durationHours = calculateDurationHours(startTime, endTime);

    // Check for time conflicts with ALL existing lessons
    const overlappingLesson = await db.lesson.findFirst({
      where: {
        AND: [
          { startTime: { lt: endTime } },
          { endTime: { gt: startTime } },
        ],
      },
      include: {
        student: {
          select: { name: true },
        },
      },
    });

    if (overlappingLesson) {
      const startTimeStr = new Date(overlappingLesson.startTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      const endTimeStr = new Date(overlappingLesson.endTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      return {
        success: false,
        error: `You are busy at this time. Student: ${overlappingLesson.student.name}, Time: ${startTimeStr}-${endTimeStr}`,
      };
    }

    // Get or create monthly plan for this student and month
    const month = getMonthString(startTime);
    let monthlyPlan = await db.monthlyPlan.findUnique({
      where: {
        studentId_month: {
          studentId,
          month,
        },
      },
    });

    if (!monthlyPlan) {
      // Create a default plan if it doesn't exist (you may want to adjust this logic)
      return {
        success: false,
        error: `Monthly plan not found for ${month}. Please record payment first.`,
      };
    }

    // Check monthly lesson limit
    if (monthlyPlan.usedLessons >= monthlyPlan.totalLessons) {
      return {
        success: false,
        error: `Monthly lesson limit reached (${monthlyPlan.usedLessons}/${monthlyPlan.totalLessons} used)`,
      };
    }

    // Create lesson in transaction
    const lesson = await db.lesson.create({
      data: {
        studentId,
        startTime,
        endTime,
        durationHours,
        status: 'pending',
        notes: notes || null,
      },
      select: { id: true },
    });

    return { success: true, data: lesson };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to create lesson' };
  }
}

export async function updateLesson(
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  try {
    const validated = UpdateLessonSchema.parse(input);
    const { id, startTime, endTime, status, notes } = validated;

    const updateData: {
      startTime?: Date;
      endTime?: Date;
      durationHours?: number;
      status?: string;
      notes?: string | null;
    } = {};

    if (startTime !== undefined) updateData.startTime = startTime;
    if (endTime !== undefined) updateData.endTime = endTime;
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes || null;

    // Recalculate duration if times are updated
    if (updateData.startTime && updateData.endTime) {
      updateData.durationHours = calculateDurationHours(updateData.startTime, updateData.endTime);
    } else if (startTime !== undefined || endTime !== undefined) {
      // Need to fetch current lesson to calculate duration
      const currentLesson = await db.lesson.findUnique({
        where: { id },
        select: { startTime: true, endTime: true },
      });
      if (currentLesson) {
        const newStartTime = updateData.startTime || currentLesson.startTime;
        const newEndTime = updateData.endTime || currentLesson.endTime;
        updateData.durationHours = calculateDurationHours(newStartTime, newEndTime);
      }
    }

    // Check for conflicts if times are being updated
    if (updateData.startTime || updateData.endTime) {
      const currentLesson = await db.lesson.findUnique({
        where: { id },
        select: { startTime: true, endTime: true },
      });
      if (currentLesson) {
        const checkStartTime = updateData.startTime || currentLesson.startTime;
        const checkEndTime = updateData.endTime || currentLesson.endTime;

        const overlappingLesson = await db.lesson.findFirst({
          where: {
            AND: [
              { id: { not: id } }, // Exclude current lesson
              { startTime: { lt: checkEndTime } },
              { endTime: { gt: checkStartTime } },
            ],
          },
          include: {
            student: {
              select: { name: true },
            },
          },
        });

        if (overlappingLesson) {
          const startTimeStr = new Date(overlappingLesson.startTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
          const endTimeStr = new Date(overlappingLesson.endTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
          return {
            success: false,
            error: `You are busy at this time. Student: ${overlappingLesson.student.name}, Time: ${startTimeStr}-${endTimeStr}`,
          };
        }
      }
    }

    const lesson = await db.lesson.update({
      where: { id },
      data: updateData,
      select: { id: true },
    });

    return { success: true, data: lesson };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to update lesson' };
  }
}

export async function markLessonDone(
  lessonId: string
): Promise<ActionResult<void>> {
  try {
    // Use transaction to ensure atomicity
    await db.$transaction(async (tx) => {
      // Get lesson with student info
      const lesson = await tx.lesson.findUnique({
        where: { id: lessonId },
        select: {
          id: true,
          studentId: true,
          startTime: true,
          status: true,
        },
      });

      if (!lesson) {
        throw new Error('Lesson not found');
      }

      if (lesson.status === 'done') {
        // Already done, nothing to do
        return;
      }

      // Update lesson status
      await tx.lesson.update({
        where: { id: lessonId },
        data: { status: 'done' },
      });

      // Get month string
      const month = getMonthString(lesson.startTime);

      // Increment usedLessons in MonthlyPlan
      await tx.monthlyPlan.updateMany({
        where: {
          studentId: lesson.studentId,
          month,
        },
        data: {
          usedLessons: {
            increment: 1,
          },
        },
      });
    });

    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to mark lesson as done' };
  }
}

export async function deleteLesson(id: string): Promise<ActionResult<void>> {
  try {
    await db.lesson.delete({
      where: { id },
    });

    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to delete lesson' };
  }
}
