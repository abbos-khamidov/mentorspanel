import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Wallet, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import PaymentsClient from './PaymentsClient';

async function getMonthlyPlans() {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  const plans = await db.monthlyPlan.findMany({
    where: {
      month: currentMonth,
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: {
      student: {
        name: 'asc',
      },
    },
  });

  return plans;
}

async function getSummary() {
  const plans = await db.monthlyPlan.findMany({
    select: {
      priceTotal: true,
      paidAmount: true,
      isPaid: true,
    },
  });

  const expectedIncome = plans.reduce((sum, p) => sum + p.priceTotal, 0);
  const paidAmount = plans.reduce((sum, p) => sum + p.paidAmount, 0);
  const remainingUnpaid = expectedIncome - paidAmount;

  return {
    expectedIncome,
    paidAmount,
    remainingUnpaid,
  };
}

export default async function PaymentsPage() {
  const [plans, summary] = await Promise.all([getMonthlyPlans(), getSummary()]);

  return (
    <div className="container slide-up">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Оплаты</h1>
        <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
          Управление месячными планами и оплатами
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-3" style={{ marginBottom: '32px' }}>
        <div
          className="card"
          style={{ background: 'linear-gradient(135deg, var(--bg-card), var(--success)15)' }}
        >
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Ожидаемый доход
          </p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--success)' }}>
            {formatCurrency(summary.expectedIncome)} UZS
          </p>
        </div>
        <div
          className="card"
          style={{ background: 'linear-gradient(135deg, var(--bg-card), var(--info)15)' }}
        >
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Получено
          </p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--info)' }}>
            {formatCurrency(summary.paidAmount)} UZS
          </p>
        </div>
        <div
          className="card"
          style={{ background: 'linear-gradient(135deg, var(--bg-card), var(--warning)15)' }}
        >
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Осталось получить
          </p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--warning)' }}>
            {formatCurrency(summary.remainingUnpaid)} UZS
          </p>
        </div>
      </div>

      {/* Monthly Plans Table */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Месячные планы</h2>
          <PaymentsClient />
        </div>

        {plans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <Wallet size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p>Нет планов на текущий месяц</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: 'var(--text-muted)' }}>
                    Ученик
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', color: 'var(--text-muted)' }}>
                    Месяц
                  </th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: 'var(--text-muted)' }}>
                    Цена
                  </th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: 'var(--text-muted)' }}>
                    Оплачено
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
                    Уроки
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px' }}>
                      <div>
                        <p style={{ fontWeight: '600' }}>{plan.student.name}</p>
                        {plan.student.email && (
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {plan.student.email}
                          </p>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>{plan.month}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      {formatCurrency(plan.priceTotal)} UZS
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      {formatCurrency(plan.paidAmount)} UZS
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {plan.usedLessons} / {plan.totalLessons}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {plan.isPaid ? (
                        <div
                          className="badge badge-success"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}
                        >
                          <CheckCircle2 size={14} />
                          Оплачено
                        </div>
                      ) : (
                        <div
                          className="badge badge-warning"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}
                        >
                          <AlertCircle size={14} />
                          Не оплачено
                        </div>
                      )}
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
