'use client';

import { useEffect, useState } from 'react';
import { getStatistics, lessonsDB, paymentsDB, studentsDB, groupsDB } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, DollarSign, Calendar, Users } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { FinancialStats } from '@/lib/types';
import { EntityType, LessonStatus, PaymentStatus } from '@/lib/types';

interface MonthlyPoint {
    month: string;
    Заработано: number;
    Получено: number;
}

interface CategoryPoint {
    name: string;
    value: number;
    color: string;
}

export default function AnalyticsPage() {
    const [stats, setStats] = useState<FinancialStats | null>(null);
    const [monthlyData, setMonthlyData] = useState<MonthlyPoint[]>([]);
    const [categoryData, setCategoryData] = useState<CategoryPoint[]>([]);

    useEffect(() => {
        const statistics = getStatistics();
        setStats(statistics);

        // Monthly earnings data
        const allLessons = lessonsDB.getAll().filter(l => l.status === LessonStatus.Completed);
        const allPayments = paymentsDB.getAll().filter(p => p.status === PaymentStatus.Paid);

        // Group by month
        const monthlyMap = new Map<string, { earned: number; received: number }>();

        allLessons.forEach(lesson => {
            const date = new Date(lesson.startTime);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!monthlyMap.has(monthKey)) {
                monthlyMap.set(monthKey, { earned: 0, received: 0 });
            }

            const data = monthlyMap.get(monthKey)!;

            if (lesson.type === EntityType.Student && lesson.studentId) {
                const student = studentsDB.getById(lesson.studentId);
                if (student) {
                    data.earned += student.ratePerHour * lesson.duration;
                }
            } else if (lesson.type === EntityType.Group && lesson.groupId) {
                const group = groupsDB.getById(lesson.groupId);
                if (group) {
                    data.earned += group.ratePerHour * lesson.duration;
                }
            }
        });

        allPayments.forEach(payment => {
            const date = new Date(payment.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!monthlyMap.has(monthKey)) {
                monthlyMap.set(monthKey, { earned: 0, received: 0 });
            }

            const data = monthlyMap.get(monthKey)!;
            data.received += payment.amount;
        });

        const monthly = Array.from(monthlyMap.entries())
            .map(([month, data]) => ({
                month,
                Заработано: data.earned,
                Получено: data.received,
            }))
            .sort((a, b) => a.month.localeCompare(b.month))
            .slice(-6); // Last 6 months

        setMonthlyData(monthly);

        // Category data (student vs group)
        const studentLessons = allLessons.filter(l => l.type === EntityType.Student).length;
        const groupLessons = allLessons.filter(l => l.type === EntityType.Group).length;

        setCategoryData([
            { name: 'Индивидуальные', value: studentLessons, color: 'var(--primary)' },
            { name: 'Групповые', value: groupLessons, color: 'var(--secondary)' },
        ]);
    }, []);

    if (!stats) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
            </div>
        );
    }

    return (
        <div className="container slide-up">
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
                    Аналитика
                </h1>
                <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
                    Обзор доходов и статистика
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-4" style={{ marginBottom: '32px' }}>
                <KPICard
                    icon={<DollarSign size={24} />}
                    label="Всего заработано"
                    value={formatCurrency(stats.totalEarnings)}
                    color="var(--success)"
                />
                <KPICard
                    icon={<TrendingUp size={24} />}
                    label="Получено"
                    value={formatCurrency(stats.totalReceived)}
                    color="var(--info)"
                />
                <KPICard
                    icon={<DollarSign size={24} />}
                    label="Ожидается"
                    value={formatCurrency(stats.totalPending)}
                    color="var(--warning)"
                />
                <KPICard
                    icon={<Calendar size={24} />}
                    label="На этой неделе"
                    value={formatCurrency(stats.weeklyExpected)}
                    color="var(--primary)"
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-2" style={{ marginBottom: '32px' }}>
                {/* Monthly Trend */}
                <div className="card">
                    <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
                        Динамика по месяцам
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis
                                dataKey="month"
                                stroke="var(--text-muted)"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis
                                stroke="var(--text-muted)"
                                style={{ fontSize: '12px' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="Заработано"
                                stroke="var(--success)"
                                strokeWidth={2}
                                dot={{ fill: 'var(--success)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="Получено"
                                stroke="var(--info)"
                                strokeWidth={2}
                                dot={{ fill: 'var(--info)' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Distribution */}
                <div className="card">
                    <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
                        Распределение уроков
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(entry) => `${entry.name}: ${entry.value}`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-3" style={{ marginBottom: '32px' }}>
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--primary)20',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Users size={20} />
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                Активные ученики
                            </p>
                            <p style={{ fontSize: '24px', fontWeight: '700' }}>
                                {stats.activeStudents}
                            </p>
                        </div>
                    </div>
                    <div style={{
                        padding: '12px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-sm)',
                    }}>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            Активные группы: {stats.activeGroups}
                        </p>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--success)20',
                            color: 'var(--success)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Calendar size={20} />
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                Уроков на неделе
                            </p>
                            <p style={{ fontSize: '24px', fontWeight: '700' }}>
                                {stats.lessonsThisWeek}
                            </p>
                        </div>
                    </div>
                    <div style={{
                        padding: '12px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-sm)',
                    }}>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            Уроков в месяце: {stats.lessonsThisMonth}
                        </p>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--warning)20',
                            color: 'var(--warning)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                Средний доход
                            </p>
                            <p style={{ fontSize: '24px', fontWeight: '700' }}>
                                {formatCurrency(stats.totalEarnings / Math.max(stats.lessonsThisMonth, 1))}
                            </p>
                        </div>
                    </div>
                    <div style={{
                        padding: '12px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-sm)',
                    }}>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            За урок
                        </p>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="card">
                <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                    Сводка
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <SummaryRow
                        label="Всего заработано"
                        value={formatCurrency(stats.totalEarnings)}
                        color="var(--success)"
                    />
                    <SummaryRow
                        label="Получено"
                        value={formatCurrency(stats.totalReceived)}
                        color="var(--info)"
                    />
                    <SummaryRow
                        label="Осталось получить"
                        value={formatCurrency(stats.totalPending)}
                        color="var(--warning)"
                    />
                    <div style={{
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border)',
                    }}>
                        <SummaryRow
                            label="Ожидается на этой неделе"
                            value={formatCurrency(stats.weeklyExpected)}
                            color="var(--primary)"
                            large
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function KPICard({
    icon,
    label,
    value,
    color
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
}) {
    return (
        <div className="card" style={{
            background: `linear-gradient(135deg, var(--bg-card) 0%, ${color}10 100%)`,
            borderColor: `${color}30`,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-sm)',
                    background: `${color}20`,
                    color: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {icon}
                </div>
                <div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        {label}
                    </p>
                    <p style={{ fontSize: '20px', fontWeight: '700' }}>
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}

function SummaryRow({
    label,
    value,
    color,
    large = false
}: {
    label: string;
    value: string;
    color: string;
    large?: boolean;
}) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-sm)',
        }}>
            <span style={{
                fontSize: large ? '16px' : '14px',
                fontWeight: large ? '600' : '500',
            }}>
                {label}
            </span>
            <span style={{
                fontSize: large ? '24px' : '18px',
                fontWeight: '700',
                color: color,
            }}>
                {value}
            </span>
        </div>
    );
}
