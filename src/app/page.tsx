import { db } from '@/lib/db';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Calendar, Users, TrendingUp, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { LessonStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

// Get upcoming lessons (next 7 days)
async function getUpcomingLessons() {
  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const lessons = await db.lesson.findMany({
    where: {
      startTime: {
        gte: now,
        lte: weekFromNow,
      },
      status: {
        not: 'cancelled',
      },
    },
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
    take: 10,
  });

  return lessons;
}

// Get dashboard statistics
async function getDashboardStats() {
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
  const remainingUnpaid = expectedIncome - paidAmount;

  return {
    totalStudents: students,
    totalLessons: lessons.length,
    completedLessons,
    pendingLessons,
    expectedIncome,
    paidAmount,
    remainingUnpaid,
  };
}

export default async function HomePage() {
  const [stats, upcomingLessons] = await Promise.all([
    getDashboardStats(),
    getUpcomingLessons(),
  ]);

  return (
    <div className="container" style={{ maxWidth: '1400px' }}>
      <div className="slide-up">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
            Добро пожаловать! 👋
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
            Вот краткий обзор вашего менторства
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-4" style={{ marginBottom: '32px' }}>
          <StatCard
            icon={<DollarSign size={24} />}
            label="Ожидаемый доход"
            value={formatCurrency(stats.expectedIncome)}
            color="var(--success)"
          />
          <StatCard
            icon={<TrendingUp size={24} />}
            label="Получено"
            value={formatCurrency(stats.paidAmount)}
            color="var(--info)"
          />
          <StatCard
            icon={<Clock size={24} />}
            label="Осталось к оплате"
            value={formatCurrency(stats.remainingUnpaid)}
            color="var(--warning)"
          />
          <StatCard
            icon={<Users size={24} />}
            label="Всего учеников"
            value={stats.totalStudents}
            color="var(--secondary)"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-3" style={{ marginBottom: '32px' }}>
          <QuickStatCard
            label="Всего уроков"
            value={stats.totalLessons}
            icon={<Calendar size={20} />}
          />
          <QuickStatCard
            label="Завершено"
            value={stats.completedLessons}
            icon={<CheckCircle2 size={20} />}
          />
          <QuickStatCard
            label="Ожидает"
            value={stats.pendingLessons}
            icon={<AlertCircle size={20} />}
          />
        </div>

        {/* Upcoming Lessons */}
        <div className="card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Ближайшие уроки</h2>
            <Link
              href="/calendar"
              className="btn btn-secondary"
              style={{ fontSize: '14px', padding: '8px 16px' }}
            >
              Открыть календарь
            </Link>
          </div>

          {upcomingLessons.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                color: 'var(--text-muted)',
              }}
            >
              <Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p>Нет запланированных уроков</p>
              <Link href="/calendar" className="btn btn-primary" style={{ marginTop: '16px' }}>
                Добавить урок
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcomingLessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      className="card"
      style={{
        background: `linear-gradient(135deg, var(--bg-card) 0%, ${color}10 100%)`,
        borderColor: `${color}30`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-sm)',
            background: `${color}20`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
        <div>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginBottom: '4px',
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'var(--text-primary)',
            }}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function QuickStatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="card" style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ color: 'var(--primary)' }}>{icon}</div>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{label}</p>
          <p style={{ fontSize: '18px', fontWeight: '600' }}>{value}</p>
        </div>
      </div>
    </div>
  );
}

function LessonCard({
  lesson,
}: {
  lesson: {
    id: string;
    startTime: Date;
    endTime: Date;
    status: string;
    student: { id: string; name: string };
  };
}) {
  const startTime = new Date(lesson.startTime);
  const durationHours = (new Date(lesson.endTime).getTime() - startTime.getTime()) / (1000 * 60 * 60);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--primary)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
          }}
        >
          <div style={{ fontWeight: '700', fontSize: '16px' }}>{startTime.getDate()}</div>
          <div>{formatDate(startTime, 'MMM')}</div>
        </div>
        <div>
          <p style={{ fontWeight: '600', marginBottom: '4px' }}>{lesson.student.name}</p>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            {formatDate(startTime, 'HH:mm')} • {durationHours} {durationHours === 1 ? 'час' : 'часа'}
          </p>
        </div>
      </div>
      <div
        className={`badge ${
          lesson.status === LessonStatus.Done
            ? 'badge-success'
            : lesson.status === 'cancelled'
              ? 'badge-error'
              : 'badge-info'
        }`}
      >
        {lesson.status === LessonStatus.Done
          ? 'Завершен'
          : lesson.status === 'cancelled'
            ? 'Отменен'
            : 'Запланирован'}
      </div>
    </div>
  );
}
