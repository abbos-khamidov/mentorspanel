import { z } from 'zod';

// Student validation
export const CreateStudentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
});

export const UpdateStudentSchema = CreateStudentSchema.partial();

// Lesson validation
export const CreateLessonSchema = z.object({
  studentId: z.string().cuid('Invalid student ID'),
  startTime: z.coerce.date({
    required_error: 'Start time is required',
    invalid_type_error: 'Invalid start time format',
  }),
  endTime: z.coerce.date({
    required_error: 'End time is required',
    invalid_type_error: 'Invalid end time format',
  }),
  notes: z.string().optional(),
}).refine(
  (data) => data.endTime > data.startTime,
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  }
);

export const UpdateLessonSchema = z.object({
  id: z.string().cuid('Invalid lesson ID'),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  status: z.enum(['pending', 'done', 'cancelled']).optional(),
  notes: z.string().optional(),
}).refine(
  (data) => {
    if (data.startTime && data.endTime) {
      return data.endTime > data.startTime;
    }
    return true;
  },
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  }
);

// Monthly Plan validation
export const CreateMonthlyPlanSchema = z.object({
  studentId: z.string().cuid('Invalid student ID'),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'),
  totalLessons: z.number().int().positive('Total lessons must be positive'),
  priceTotal: z.number().int().nonnegative('Price must be non-negative'),
});

export const RecordPaymentSchema = z.object({
  studentId: z.string().cuid('Invalid student ID'),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'),
  paidAmount: z.number().int().nonnegative('Paid amount must be non-negative'),
  priceTotal: z.number().int().positive('Price total must be positive'),
  totalLessons: z.number().int().positive('Total lessons must be positive'),
});

// Month query validation
export const MonthQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format').optional(),
});

// Types inferred from schemas
export type CreateStudentInput = z.infer<typeof CreateStudentSchema>;
export type UpdateStudentInput = z.infer<typeof UpdateStudentSchema>;
export type CreateLessonInput = z.infer<typeof CreateLessonSchema>;
export type UpdateLessonInput = z.infer<typeof UpdateLessonSchema>;
export type CreateMonthlyPlanInput = z.infer<typeof CreateMonthlyPlanSchema>;
export type RecordPaymentInput = z.infer<typeof RecordPaymentSchema>;
export type MonthQueryInput = z.infer<typeof MonthQuerySchema>;
