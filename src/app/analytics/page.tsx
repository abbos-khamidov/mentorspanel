import { getMonthlyStats, getStudentPaymentList, getLessonStats } from '@/app/actions/analytics';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, DollarSign, Calendar, Users } from 'lucide-react';
import AnalyticsCharts from './AnalyticsCharts';

export default async function AnalyticsPage() {
  const [monthlyStats, studentPayments, lessonStats] = await Promise.all([
    getMonthlyStats(),
    getStudentPaymentList(),
    getLessonStats(),
  ]);

  // Calculate totals
  const totalExpected = monthlyStats.reduce((sum, s) => sum + s.expectedIncome, 0);
  const totalPaid = monthlyStats.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalRemaining = monthlyStats.reduce((sum, s) => sum + s.remainingUnpaid, 0);

  const totalCompleted = lessonStats.reduce((sum, s) => sum + s.completedLessons, 0);
  const totalPending = lessonStats.reduce((sum, s) => sum + s.pendingLessons, 0);

  return (
    <div className="container slide-up">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Аналитика</h1>
        <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
          Обзор доходов и статистика
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-4" style={{ marginBottom: '32px' }}>
        <KPICard
          icon={<DollarSign size={24} />}
          label="Ожидаемый доход"
          value={formatCurrency(totalExpected)}
          color="var(--success)"
        />
        <KPICard
          icon={<TrendingUp size={24} />}
          label="Получено"
          value={formatCurrency(totalPaid)}
          color="var(--info)"
        />
        <KPICard
          icon={<DollarSign size={24} />}
          label="Осталось получить"
          value={formatCurrency(totalRemaining)}
          color="var(--warning)"
        />
        <KPICard
          icon={<Calendar size={24} />}
          label="Завершено уроков"
          value={totalCompleted}
          color="var(--primary)"
        />
      </div>

      {/* Charts */}
      <AnalyticsCharts monthlyStats={monthlyStats} lessonStats={lessonStats} />

      {/* Student Payment List */}
      <div className="card" style={{ marginTop: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
          Оплаты по ученикам
        </h2>
        {studentPayments.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
            Нет данных об оплатах
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Ученик</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Месяц</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Цена</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Оплачено</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Статус</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Уроки</th>
                </tr>
              </thead>
              <tbody>
                {studentPayments.map((payment, idx) => (
                  <tr key={`${payment.studentId}-${payment.month}`} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px' }}>{payment.studentName}</td>
                    <td style={{ padding: '12px' }}>{payment.month}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      {formatCurrency(payment.priceTotal)} UZS
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      {formatCurrency(payment.paidAmount)} UZS
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {payment.isPaid ? (
                        <span className="badge badge-success">Оплачено</span>
                      ) : (
                        <span className="badge badge-warning">Не оплачено</span>
                      )}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {payment.usedLessons} / {payment.totalLessons}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function KPICard({
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            {label}
          </p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
