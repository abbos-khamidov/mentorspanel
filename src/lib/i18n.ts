// Internationalization system
export type Locale = 'ru' | 'en' | 'uz';

export const defaultLocale: Locale = 'ru';

export const translations = {
  ru: {
    // Navigation
    nav: {
      dashboard: 'Дашборд',
      students: 'Ученики',
      calendar: 'Календарь',
      payments: 'Платежи',
      analytics: 'Аналитика',
      panel: 'Панель управления',
    },
    // Auth
    auth: {
      welcome: 'Добро пожаловать',
      createAccount: 'Создать аккаунт',
      login: 'Войти',
      register: 'Зарегистрироваться',
      email: 'Email',
      password: 'Пароль',
      name: 'Имя',
      confirmPassword: 'Подтвердите пароль',
      hasAccount: 'Уже есть аккаунт?',
      noAccount: 'Нет аккаунта?',
    },
    // Students
    students: {
      title: 'Ученики',
      subtitle: 'Управление учениками и их месячными планами',
      addStudent: 'Добавить ученика',
      editStudent: 'Редактировать ученика',
      deleteStudent: 'Удалить ученика',
      name: 'Имя',
      email: 'Email',
      phone: 'Телефон',
      githubLink: 'Ссылка на GitHub',
      lessonsPerMonth: 'Количество уроков в месяц',
      currentProgress: 'Текущий прогресс',
      lessons: 'уроков',
      markLesson: 'Отметить урок',
      addLessons: 'Добавить',
      cancel: 'Отмена',
      save: 'Сохранить',
      delete: 'Удалить',
      noStudents: 'Нет учеников',
    },
    // Dashboard
    dashboard: {
      title: 'Дашборд',
      totalStudents: 'Всего учеников',
      totalLessons: 'Всего уроков',
      completedLessons: 'Завершено уроков',
      expectedIncome: 'Ожидаемый доход',
    },
    // Calendar
    calendar: {
      title: 'Календарь',
      individual: 'Индивидуальный',
      group: 'Групповой',
      scheduled: 'Запланирован',
      completed: 'Завершен',
      cancelled: 'Отменен',
    },
    // Payments
    payments: {
      title: 'Платежи',
      paid: 'Оплачено',
      unpaid: 'Не оплачено',
    },
    // Analytics
    analytics: {
      title: 'Аналитика',
    },
    // Common
    common: {
      loading: 'Загрузка...',
      error: 'Ошибка',
      success: 'Успешно',
      required: 'Обязательное поле',
    },
  },
  en: {
    nav: {
      dashboard: 'Dashboard',
      students: 'Students',
      calendar: 'Calendar',
      payments: 'Payments',
      analytics: 'Analytics',
      panel: 'Control Panel',
    },
    auth: {
      welcome: 'Welcome',
      createAccount: 'Create Account',
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      confirmPassword: 'Confirm Password',
      hasAccount: 'Already have an account?',
      noAccount: "Don't have an account?",
    },
    students: {
      title: 'Students',
      subtitle: 'Manage students and their monthly plans',
      addStudent: 'Add Student',
      editStudent: 'Edit Student',
      deleteStudent: 'Delete Student',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      githubLink: 'GitHub Link',
      lessonsPerMonth: 'Lessons per Month',
      currentProgress: 'Current Progress',
      lessons: 'lessons',
      markLesson: 'Mark Lesson',
      addLessons: 'Add',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      noStudents: 'No students',
    },
    dashboard: {
      title: 'Dashboard',
      totalStudents: 'Total Students',
      totalLessons: 'Total Lessons',
      completedLessons: 'Completed Lessons',
      expectedIncome: 'Expected Income',
    },
    calendar: {
      title: 'Calendar',
      individual: 'Individual',
      group: 'Group',
      scheduled: 'Scheduled',
      completed: 'Completed',
      cancelled: 'Cancelled',
    },
    payments: {
      title: 'Payments',
      paid: 'Paid',
      unpaid: 'Unpaid',
    },
    analytics: {
      title: 'Analytics',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      required: 'Required',
    },
  },
  uz: {
    nav: {
      dashboard: 'Boshqaruv paneli',
      students: 'Talabalar',
      calendar: 'Taqvim',
      payments: 'To\'lovlar',
      analytics: 'Tahlil',
      panel: 'Boshqaruv paneli',
    },
    auth: {
      welcome: 'Xush kelibsiz',
      createAccount: 'Hisob yaratish',
      login: 'Kirish',
      register: 'Ro\'yxatdan o\'tish',
      email: 'Email',
      password: 'Parol',
      name: 'Ism',
      confirmPassword: 'Parolni tasdiqlang',
      hasAccount: 'Hisobingiz bormi?',
      noAccount: 'Hisobingiz yo\'qmi?',
    },
    students: {
      title: 'Talabalar',
      subtitle: 'Talabalar va ularning oylik rejalarini boshqarish',
      addStudent: 'Talaba qo\'shish',
      editStudent: 'Talabani tahrirlash',
      deleteStudent: 'Talabani o\'chirish',
      name: 'Ism',
      email: 'Email',
      phone: 'Telefon',
      githubLink: 'GitHub havolasi',
      lessonsPerMonth: 'Oyiga darslar soni',
      currentProgress: 'Joriy progress',
      lessons: 'dars',
      markLesson: 'Darsni belgilash',
      addLessons: 'Qo\'shish',
      cancel: 'Bekor qilish',
      save: 'Saqlash',
      delete: 'O\'chirish',
      noStudents: 'Talabalar yo\'q',
    },
    dashboard: {
      title: 'Boshqaruv paneli',
      totalStudents: 'Jami talabalar',
      totalLessons: 'Jami darslar',
      completedLessons: 'Yakunlangan darslar',
      expectedIncome: 'Kutilayotgan daromad',
    },
    calendar: {
      title: 'Taqvim',
      individual: 'Individual',
      group: 'Guruh',
      scheduled: 'Rejalashtirilgan',
      completed: 'Yakunlangan',
      cancelled: 'Bekor qilingan',
    },
    payments: {
      title: 'To\'lovlar',
      paid: 'To\'langan',
      unpaid: 'To\'lanmagan',
    },
    analytics: {
      title: 'Tahlil',
    },
    common: {
      loading: 'Yuklanmoqda...',
      error: 'Xatolik',
      success: 'Muvaffaqiyatli',
      required: 'Majburiy',
    },
  },
} as const;

export type TranslationKeys = typeof translations.ru;

export function getTranslation(locale: Locale = defaultLocale) {
  return translations[locale];
}

export function t(key: string, locale: Locale = defaultLocale): string {
  const keys = key.split('.');
  let value: any = translations[locale];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}
