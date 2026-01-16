// Types matching Prisma models
import type { Student, Lesson, MonthlyPlan } from '@/generated/prisma/client';

export type { Student, Lesson, MonthlyPlan };

// Extended types with relations
export type StudentWithRelations = Student & {
  lessons?: Lesson[];
  monthlyPlans?: MonthlyPlan[];
};

export type LessonWithStudent = Lesson & {
  student: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  };
};

export type MonthlyPlanWithStudent = MonthlyPlan & {
  student: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  };
};

// Dashboard statistics
export interface DashboardStats {
  totalStudents: number;
  totalLessons: number;
  completedLessons: number;
  pendingLessons: number;
  expectedIncome: number;
  paidAmount: number;
  remainingUnpaid: number;
}

export interface FinancialStats {
  expectedIncome: number;
  paidAmount: number;
  remainingUnpaid: number;
}

// Lesson status enum
export enum LessonStatus {
  Pending = 'pending',
  Done = 'done',
  Cancelled = 'cancelled',
}
