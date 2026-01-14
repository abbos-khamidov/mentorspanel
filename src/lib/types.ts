// Типы данных и enum'ы для приложения менторства

export enum EntityType {
    Student = 'student',
    Group = 'group',
}

export enum LessonStatus {
    Scheduled = 'scheduled',
    Completed = 'completed',
    Cancelled = 'cancelled',
}

export enum PaymentStatus {
    Pending = 'pending',
    Paid = 'paid',
}

export interface Student {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    ratePerHour: number; // ставка за час в вашей валюте
    isActive: boolean;
    createdAt: string; // ISO
}

export interface Group {
    id: string;
    name: string;
    ratePerHour: number; // ставка за час для группы
    studentCount: number;
    isActive: boolean;
    createdAt: string; // ISO
}

export interface Lesson {
    id: string;
    type: EntityType;
    studentId?: string; // если индивидуальный урок
    groupId?: string; // если групповой урок
    startTime: string; // ISO date string
    duration: 1 | 2; // часы
    status: LessonStatus;
    notes?: string;
    createdAt: string; // ISO
}

export interface Payment {
    id: string;
    type: EntityType;
    studentId?: string;
    groupId?: string;
    amount: number;
    date: string; // ISO date string
    status: PaymentStatus;
    lessonsCount: number; // количество уроков, за которые была оплата
    notes?: string;
    createdAt: string; // ISO
}

export interface PaymentSchedule {
    id: string;
    type: EntityType;
    studentId?: string;
    groupId?: string;
    dayOfMonth: number; // день месяца для оплаты (1-31)
    expectedAmount: number;
    isActive: boolean;
}

// Финансовая статистика
export interface FinancialStats {
    totalEarnings: number; // общий заработок (все уроки)
    totalReceived: number; // получено
    totalPending: number; // ожидается
    weeklyExpected: number; // ожидается на этой неделе
    activeStudents: number;
    activeGroups: number;
    lessonsThisWeek: number;
    lessonsThisMonth: number;
}

// Для обратной совместимости имени
export type Statistics = FinancialStats;

// Объединенный тип для отображения в UI
export type StudentOrGroup = (Student | Group) & {
    entityType: EntityType;
};
