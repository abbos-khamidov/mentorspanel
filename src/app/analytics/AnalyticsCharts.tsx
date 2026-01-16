'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { MonthlyStats, LessonStats } from '@/app/actions/analytics';

export default function AnalyticsCharts({
  monthlyStats,
  lessonStats,
}: {
  monthlyStats: MonthlyStats[];
  lessonStats: LessonStats[];
}) {
  // Prepare data for monthly income chart
  const monthlyIncomeData = monthlyStats.map((stat) => ({
    month: stat.month,
    'Ожидается': stat.expectedIncome,
    'Получено': stat.paidAmount,
    'Осталось': stat.remainingUnpaid,
  }));

  // Prepare data for lessons chart
  const lessonsData = lessonStats
    .filter((s) => s.completedLessons > 0 || s.pendingLessons > 0)
    .slice(0, 10)
    .map((stat) => ({
      name: stat.studentName.length > 15 ? stat.studentName.slice(0, 15) + '...' : stat.studentName,
      'Завершено': stat.completedLessons,
      'Ожидает': stat.pendingLessons,
    }));

  return (
    <div className="grid grid-2" style={{ marginBottom: '32px' }}>
      {/* Monthly Income Trend */}
      <div className="card">
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
          Месячный доход
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyIncomeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" stroke="var(--text-muted)" style={{ fontSize: '12px' }} />
            <YAxis stroke="var(--text-muted)" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="Ожидается"
              stroke="var(--success)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="Получено"
              stroke="var(--info)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="Осталось"
              stroke="var(--warning)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Lessons by Student */}
      <div className="card">
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
          Уроки по ученикам
        </h2>
        {lessonsData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            Нет данных
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={lessonsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" style={{ fontSize: '12px' }} />
              <YAxis stroke="var(--text-muted)" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                }}
              />
              <Legend />
              <Bar dataKey="Завершено" fill="var(--success)" />
              <Bar dataKey="Ожидает" fill="var(--warning)" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
