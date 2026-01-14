import { format, startOfWeek, endOfWeek, isWithinInterval, addDays, startOfMonth, endOfMonth } from 'date-fns';
import { ru } from 'date-fns/locale';

// Форматирование даты
export const formatDate = (date: Date | string, formatStr: string = 'dd.MM.yyyy') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatStr, { locale: ru });
};

export const formatDateTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'dd.MM.yyyy HH:mm', { locale: ru });
};

// Проверка, находится ли дата в текущей неделе
export const isThisWeek = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    return isWithinInterval(dateObj, {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 })
    });
};

// Проверка, находится ли дата в текущем месяце
export const isThisMonth = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    return isWithinInterval(dateObj, {
        start: startOfMonth(now),
        end: endOfMonth(now)
    });
};

// Генерация уникального ID
export const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Форматирование валюты
export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount);
};

// Получение диапазона дат для недели
export const getWeekRange = (date: Date = new Date()) => {
    return {
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 })
    };
};

// Получение диапазона дат для месяца
export const getMonthRange = (date: Date = new Date()) => {
    return {
        start: startOfMonth(date),
        end: endOfMonth(date)
    };
};

// Вычисление окончания урока
export const getLessonEndTime = (startTime: string, duration: 1 | 2): Date => {
    const start = new Date(startTime);
    return addDays(start, duration / 24); // добавляем часы как дробные дни
};

// Проверка пересечения уроков
export const doLessonsOverlap = (
    lesson1Start: string,
    lesson1Duration: 1 | 2,
    lesson2Start: string,
    lesson2Duration: 1 | 2
): boolean => {
    const start1 = new Date(lesson1Start);
    const end1 = getLessonEndTime(lesson1Start, lesson1Duration);
    const start2 = new Date(lesson2Start);
    const end2 = getLessonEndTime(lesson2Start, lesson2Duration);

    return start1 < end2 && start2 < end1;
};
