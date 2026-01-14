import {
    Student,
    Group,
    Lesson,
    Payment,
    PaymentSchedule,
    FinancialStats,
    EntityType,
    LessonStatus,
    PaymentStatus,
} from './types';
import { isThisWeek, isThisMonth } from './utils';

// Ключи для LocalStorage
const STORAGE_KEYS = {
    STUDENTS: 'mentorship_students',
    GROUPS: 'mentorship_groups',
    LESSONS: 'mentorship_lessons',
    PAYMENTS: 'mentorship_payments',
    SCHEDULES: 'mentorship_schedules',
};

// Базовые безопасные операции с LocalStorage
const safeRead = <T>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') return fallback;
    try {
        const raw = window.localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
};

const safeWrite = <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // проглатываем, т.к. это клиентский helper
    }
};

// CRUD операции для студентов
export const studentsDB = {
    getAll: (): Student[] => {
        return safeRead<Student[]>(STORAGE_KEYS.STUDENTS, []);
    },

    getById: (id: string): Student | null => {
        const students = studentsDB.getAll();
        return students.find(s => s.id === id) || null;
    },

    create: (student: Omit<Student, 'id' | 'createdAt'>): Student => {
        const newStudent: Student = {
            ...student,
            id: `student-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        const students = studentsDB.getAll();
        const next = [...students, newStudent];
        safeWrite(STORAGE_KEYS.STUDENTS, next);
        return newStudent;
    },

    update: (id: string, updates: Partial<Student>): Student | null => {
        const students = studentsDB.getAll();
        const index = students.findIndex(s => s.id === id);
        if (index === -1) return null;
        const updated: Student = { ...students[index], ...updates };
        const next = [...students];
        next[index] = updated;
        safeWrite(STORAGE_KEYS.STUDENTS, next);
        return updated;
    },

    delete: (id: string): boolean => {
        const students = studentsDB.getAll();
        const filtered = students.filter(s => s.id !== id);
        if (filtered.length === students.length) return false;
        safeWrite(STORAGE_KEYS.STUDENTS, filtered);
        return true;
    },
};

// CRUD операции для групп
export const groupsDB = {
    getAll: (): Group[] => {
        return safeRead<Group[]>(STORAGE_KEYS.GROUPS, []);
    },

    getById: (id: string): Group | null => {
        const groups = groupsDB.getAll();
        return groups.find(g => g.id === id) || null;
    },

    create: (group: Omit<Group, 'id' | 'createdAt'>): Group => {
        const newGroup: Group = {
            ...group,
            id: `group-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        const groups = groupsDB.getAll();
        const next = [...groups, newGroup];
        safeWrite(STORAGE_KEYS.GROUPS, next);
        return newGroup;
    },

    update: (id: string, updates: Partial<Group>): Group | null => {
        const groups = groupsDB.getAll();
        const index = groups.findIndex(g => g.id === id);
        if (index === -1) return null;
        const updated: Group = { ...groups[index], ...updates };
        const next = [...groups];
        next[index] = updated;
        safeWrite(STORAGE_KEYS.GROUPS, next);
        return updated;
    },

    delete: (id: string): boolean => {
        const groups = groupsDB.getAll();
        const filtered = groups.filter(g => g.id !== id);
        if (filtered.length === groups.length) return false;
        safeWrite(STORAGE_KEYS.GROUPS, filtered);
        return true;
    },
};

// CRUD операции для уроков
export const lessonsDB = {
    getAll: (): Lesson[] => {
        return safeRead<Lesson[]>(STORAGE_KEYS.LESSONS, []);
    },

    getById: (id: string): Lesson | null => {
        const lessons = lessonsDB.getAll();
        return lessons.find(l => l.id === id) || null;
    },

    create: (lesson: Omit<Lesson, 'id' | 'createdAt'>): Lesson => {
        const newLesson: Lesson = {
            ...lesson,
            id: `lesson-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        const lessons = lessonsDB.getAll();
        const next = [...lessons, newLesson];
        safeWrite(STORAGE_KEYS.LESSONS, next);
        return newLesson;
    },

    update: (id: string, updates: Partial<Lesson>): Lesson | null => {
        const lessons = lessonsDB.getAll();
        const index = lessons.findIndex(l => l.id === id);
        if (index === -1) return null;
        const updated: Lesson = { ...lessons[index], ...updates };
        const next = [...lessons];
        next[index] = updated;
        safeWrite(STORAGE_KEYS.LESSONS, next);
        return updated;
    },

    delete: (id: string): boolean => {
        const lessons = lessonsDB.getAll();
        const filtered = lessons.filter(l => l.id !== id);
        if (filtered.length === lessons.length) return false;
        safeWrite(STORAGE_KEYS.LESSONS, filtered);
        return true;
    },

    getByDateRange: (start: Date, end: Date): Lesson[] => {
        const lessons = lessonsDB.getAll();
        return lessons.filter(lesson => {
            const lessonDate = new Date(lesson.startTime);
            return lessonDate >= start && lessonDate <= end;
        });
    },
};

// CRUD операции для оплат
export const paymentsDB = {
    getAll: (): Payment[] => {
        return safeRead<Payment[]>(STORAGE_KEYS.PAYMENTS, []);
    },

    create: (payment: Omit<Payment, 'id' | 'createdAt'>): Payment => {
        const newPayment: Payment = {
            ...payment,
            id: `payment-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        const payments = paymentsDB.getAll();
        const next = [...payments, newPayment];
        safeWrite(STORAGE_KEYS.PAYMENTS, next);
        return newPayment;
    },

    update: (id: string, updates: Partial<Payment>): Payment | null => {
        const payments = paymentsDB.getAll();
        const index = payments.findIndex(p => p.id === id);
        if (index === -1) return null;
        const updated: Payment = { ...payments[index], ...updates };
        const next = [...payments];
        next[index] = updated;
        safeWrite(STORAGE_KEYS.PAYMENTS, next);
        return updated;
    },

    delete: (id: string): boolean => {
        const payments = paymentsDB.getAll();
        const filtered = payments.filter(p => p.id !== id);
        if (filtered.length === payments.length) return false;
        safeWrite(STORAGE_KEYS.PAYMENTS, filtered);
        return true;
    },
};

// Вычисление статистики
export const getStatistics = (): FinancialStats => {
    const students = studentsDB.getAll().filter(s => s.isActive);
    const groups = groupsDB.getAll().filter(g => g.isActive);
    const lessons = lessonsDB.getAll();
    const payments = paymentsDB.getAll();

    // Подсчет заработка
    const completedLessons = lessons.filter(l => l.status === LessonStatus.Completed);
    const totalEarnings = completedLessons.reduce((sum, lesson) => {
        if (lesson.type === EntityType.Student && lesson.studentId) {
            const student = studentsDB.getById(lesson.studentId);
            return sum + (student ? student.ratePerHour * lesson.duration : 0);
        } else if (lesson.type === EntityType.Group && lesson.groupId) {
            const group = groupsDB.getById(lesson.groupId);
            return sum + (group ? group.ratePerHour * lesson.duration : 0);
        }
        return sum;
    }, 0);

    const totalReceived = payments
        .filter(p => p.status === PaymentStatus.Paid)
        .reduce((sum, payment) => sum + payment.amount, 0);

    const totalPending = totalEarnings - totalReceived;

    // Уроки на этой неделе
    const lessonsThisWeek = lessons.filter(lesson => isThisWeek(lesson.startTime)).length;
    const lessonsThisMonth = lessons.filter(lesson => isThisMonth(lesson.startTime)).length;

    // Ожидаемый доход на неделю
    const scheduledThisWeek = lessons.filter(
        lesson => lesson.status === LessonStatus.Scheduled && isThisWeek(lesson.startTime)
    );
    const weeklyExpected = scheduledThisWeek.reduce((sum, lesson) => {
        if (lesson.type === EntityType.Student && lesson.studentId) {
            const student = studentsDB.getById(lesson.studentId);
            return sum + (student ? student.ratePerHour * lesson.duration : 0);
        } else if (lesson.type === EntityType.Group && lesson.groupId) {
            const group = groupsDB.getById(lesson.groupId);
            return sum + (group ? group.ratePerHour * lesson.duration : 0);
        }
        return sum;
    }, 0);

    return {
        totalEarnings,
        totalReceived,
        totalPending,
        weeklyExpected,
        activeStudents: students.length,
        activeGroups: groups.length,
        lessonsThisWeek,
        lessonsThisMonth,
    };
};

// Экспорт всех данных
export const exportData = () => {
    return {
        students: studentsDB.getAll(),
        groups: groupsDB.getAll(),
        lessons: lessonsDB.getAll(),
        payments: paymentsDB.getAll(),
        exportDate: new Date().toISOString(),
    };
};

// Импорт данных
export const importData = (data: ReturnType<typeof exportData>) => {
    if (data.students) safeWrite(STORAGE_KEYS.STUDENTS, data.students);
    if (data.groups) safeWrite(STORAGE_KEYS.GROUPS, data.groups);
    if (data.lessons) safeWrite(STORAGE_KEYS.LESSONS, data.lessons);
    if (data.payments) safeWrite(STORAGE_KEYS.PAYMENTS, data.payments);
};
