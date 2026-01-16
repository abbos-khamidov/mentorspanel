import { db } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';
import { UserPlus, Pencil, Trash2, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import Link from 'next/link';
import StudentsClient from './StudentsClient';
import StudentActions from './StudentActions';
import MarkLessonButton from './MarkLessonButton';

export const dynamic = 'force-dynamic';

async function getStudentsWithPlans() {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

  const students = await db.student.findMany({
    include: {
      monthlyPlans: {
        where: {
          month: currentMonth,
        },
        take: 1,
      },
      _count: {
        select: {
          lessons: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return students.map((student) => ({
    id: student.id,
    name: student.name,
    email: student.email,
    phone: student.phone,
    githubLink: student.githubLink,
    createdAt: student.createdAt,
    monthlyPlan: student.monthlyPlans[0] || null,
    totalLessons: student._count.lessons,
  }));
}

export default async function StudentsPage() {
  const students = await getStudentsWithPlans();

  return (
    <div className="container slide-up">
      <div
        style={{
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Ученики</h1>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
            Управление учениками и их месячными планами
          </p>
        </div>
        <StudentsClient initialStudents={students} />
      </div>

      {students.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <UserPlus size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Нет учеников</p>
        </div>
      ) : (
        <div className="grid grid-3">
          {students.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}
    </div>
  );
}

function StudentCard({
  student,
}: {
      student: {
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        githubLink: string | null;
        monthlyPlan: {
      id: string;
      totalLessons: number;
      usedLessons: number;
      priceTotal: number;
      isPaid: boolean;
      paidAmount: number;
    } | null;
    totalLessons: number;
  };
}) {
  const progress = student.monthlyPlan
    ? (student.monthlyPlan.usedLessons / student.monthlyPlan.totalLessons) * 100
    : 0;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{student.name}</h3>
        <StudentActions studentId={student.id} />
      </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {student.email && (
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>📧 {student.email}</p>
            )}
            {student.phone && (
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>📱 {student.phone}</p>
            )}
            {student.githubLink && (
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                <a 
                  href={student.githubLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: 'var(--primary)', textDecoration: 'underline' }}
                >
                  🔗 GitHub
                </a>
              </p>
            )}

        {/* Monthly Plan Info */}
        {student.monthlyPlan ? (
          <>
            <div
              style={{
                padding: '12px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Прогресс уроков</p>
                <p style={{ fontSize: '12px', fontWeight: '600' }}>
                  {student.monthlyPlan.usedLessons} / {student.monthlyPlan.totalLessons}
                </p>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '8px',
                }}
              >
                <div
                  style={{
                    width: `${Math.min(progress, 100)}%`,
                    height: '100%',
                    background:
                      progress >= 100
                        ? 'var(--error)'
                        : progress >= 80
                          ? 'var(--warning)'
                          : 'var(--success)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              <MarkLessonButton 
                studentId={student.id} 
                currentUsed={student.monthlyPlan.usedLessons}
                totalLessons={student.monthlyPlan.totalLessons}
              />
            </div>

            <div
              style={{
                padding: '12px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Месячная плата
              </p>
              <p style={{ fontSize: '20px', fontWeight: '700', color: 'var(--success)' }}>
                {formatCurrency(student.monthlyPlan.priceTotal)} UZS
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {student.monthlyPlan.isPaid ? (
                <div className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={14} />
                  Оплачено
                </div>
              ) : (
                <div className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={14} />
                  Не оплачено
                </div>
              )}
              {student.monthlyPlan.usedLessons >= student.monthlyPlan.totalLessons && (
                <div className="badge badge-error">
                  Лимит достигнут
                </div>
              )}
            </div>
          </>
        ) : (
          <div
            style={{
              padding: '12px',
              background: 'var(--warning)10',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--warning)30',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Нет плана на текущий месяц
            </p>
            <Link
              href={`/payments?studentId=${student.id}`}
              className="btn btn-primary"
              style={{ marginTop: '8px', fontSize: '12px', padding: '6px 12px' }}
            >
              Создать план
            </Link>
          </div>
        )}

        <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
          Всего уроков: {student.totalLessons}
        </div>
      </div>
    </div>
  );
}
