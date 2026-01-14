'use client';

import { useEffect, useState } from 'react';
import { paymentsDB, lessonsDB, studentsDB, groupsDB } from '@/lib/db';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Wallet, Plus, Check, X, Clock } from 'lucide-react';
import type { Lesson, Payment } from '@/lib/types';
import { EntityType, LessonStatus, PaymentStatus } from '@/lib/types';

interface EntityBalance {
    id: string;
    name: string;
    type: EntityType;
    ratePerHour: number;
    completedLessons: Lesson[];
    totalEarned: number;
    totalPaid: number;
    balance: number;
    lastPaymentDate?: string;
}

export default function PaymentsPage() {
    const [balances, setBalances] = useState<EntityBalance[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEntity, setSelectedEntity] = useState<EntityBalance | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const allLessons = lessonsDB.getAll();
        const allPayments = paymentsDB.getAll();
        const students = studentsDB.getAll().filter(s => s.isActive);
        const groups = groupsDB.getAll().filter(g => g.isActive);

        const entityBalances: EntityBalance[] = [];

        // Calculate for students
        students.forEach(student => {
            const lessons = allLessons.filter(
                l =>
                    l.type === EntityType.Student &&
                    l.studentId === student.id &&
                    l.status === LessonStatus.Completed,
            );
            const studentPayments = allPayments.filter(
                p => p.type === EntityType.Student && p.studentId === student.id,
            );

            const totalEarned = lessons.reduce((sum, l) => sum + (student.ratePerHour * l.duration), 0);
            const totalPaid = studentPayments
                .filter(p => p.status === PaymentStatus.Paid)
                .reduce((sum, p) => sum + p.amount, 0);

            const lastPayment = studentPayments.sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )[0];

            entityBalances.push({
                id: student.id,
                name: student.name,
                type: EntityType.Student,
                ratePerHour: student.ratePerHour,
                completedLessons: lessons,
                totalEarned,
                totalPaid,
                balance: totalEarned - totalPaid,
                lastPaymentDate: lastPayment?.date,
            });
        });

        // Calculate for groups
        groups.forEach(group => {
            const lessons = allLessons.filter(
                l =>
                    l.type === EntityType.Group &&
                    l.groupId === group.id &&
                    l.status === LessonStatus.Completed,
            );
            const groupPayments = allPayments.filter(
                p => p.type === EntityType.Group && p.groupId === group.id,
            );

            const totalEarned = lessons.reduce((sum, l) => sum + (group.ratePerHour * l.duration), 0);
            const totalPaid = groupPayments
                .filter(p => p.status === PaymentStatus.Paid)
                .reduce((sum, p) => sum + p.amount, 0);

            const lastPayment = groupPayments.sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )[0];

            entityBalances.push({
                id: group.id,
                name: group.name,
                type: EntityType.Group,
                ratePerHour: group.ratePerHour,
                completedLessons: lessons,
                totalEarned,
                totalPaid,
                balance: totalEarned - totalPaid,
                lastPaymentDate: lastPayment?.date,
            });
        });

        setBalances(entityBalances);
        setPayments(allPayments.sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
    };

    const totalBalance = balances.reduce((sum, b) => sum + b.balance, 0);
    const totalPaid = balances.reduce((sum, b) => sum + b.totalPaid, 0);
    const totalEarned = balances.reduce((sum, b) => sum + b.totalEarned, 0);

    return (
        <div className="container slide-up">
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
                    Оплаты
                </h1>
                <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
                    Отслеживание оплат и задолженностей
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-3" style={{ marginBottom: '32px' }}>
                <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-card), var(--success)15)' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        Всего заработано
                    </p>
                    <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--success)' }}>
                        {formatCurrency(totalEarned)}
                    </p>
                </div>
                <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-card), var(--info)15)' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        Получено
                    </p>
                    <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--info)' }}>
                        {formatCurrency(totalPaid)}
                    </p>
                </div>
                <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-card), var(--warning)15)' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        К получению
                    </p>
                    <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--warning)' }}>
                        {formatCurrency(totalBalance)}
                    </p>
                </div>
            </div>

            {/* Balances */}
            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
                    Балансы
                </h2>
                <div className="grid grid-2">
                    {balances.map(balance => (
                        <BalanceCard
                            key={balance.id}
                            balance={balance}
                            onAddPayment={() => {
                                setSelectedEntity(balance);
                                setShowModal(true);
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Payment History */}
            <div className="card">
                <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
                    История оплат
                </h2>
                {payments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        <Wallet size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                        <p>Нет записей об оплатах</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {payments.slice(0, 20).map(payment => (
                            <PaymentHistoryItem key={payment.id} payment={payment} onUpdate={loadData} />
                        ))}
                    </div>
                )}
            </div>

            {/* Payment Modal */}
            {showModal && selectedEntity && (
                <PaymentModal
                    entity={selectedEntity}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedEntity(null);
                    }}
                    onSave={() => {
                        loadData();
                        setShowModal(false);
                        setSelectedEntity(null);
                    }}
                />
            )}
        </div>
    );
}

function BalanceCard({
    balance,
    onAddPayment
}: {
    balance: EntityBalance;
    onAddPayment: () => void;
}) {
    const hasDebt = balance.balance > 0;

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                        {balance.name}
                    </h3>
                    <span className={`badge ${balance.type === EntityType.Student ? 'badge-info' : 'badge-warning'}`}>
                        {balance.type === EntityType.Student ? 'Индивидуальный' : 'Группа'}
                    </span>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={onAddPayment}
                    style={{ padding: '8px 16px', fontSize: '14px' }}
                >
                    <Plus size={16} />
                    Оплата
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    padding: '12px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-sm)',
                }}>
                    <div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Заработано</p>
                        <p style={{ fontSize: '16px', fontWeight: '600' }}>{formatCurrency(balance.totalEarned)}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Оплачено</p>
                        <p style={{ fontSize: '16px', fontWeight: '600' }}>{formatCurrency(balance.totalPaid)}</p>
                    </div>
                </div>

                <div style={{
                    padding: '16px',
                    background: hasDebt ? 'var(--warning)15' : 'var(--success)15',
                    border: `1px solid ${hasDebt ? 'var(--warning)' : 'var(--success)'}`,
                    borderRadius: 'var(--radius-sm)',
                }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        {hasDebt ? 'Задолженность' : 'Баланс'}
                    </p>
                    <p style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: hasDebt ? 'var(--warning)' : 'var(--success)'
                    }}>
                        {formatCurrency(balance.balance)}
                    </p>
                </div>

                <div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Проведено уроков: {balance.completedLessons.length}
                    </p>
                    {balance.lastPaymentDate && (
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            Последняя оплата: {formatDate(balance.lastPaymentDate)}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function PaymentHistoryItem({ payment, onUpdate }: { payment: Payment; onUpdate: () => void }) {
    const entity = payment.type === EntityType.Student
        ? studentsDB.getById(payment.studentId!)
        : groupsDB.getById(payment.groupId!);

    const togglePaid = () => {
        const nextStatus =
            payment.status === PaymentStatus.Paid ? PaymentStatus.Pending : PaymentStatus.Paid;
        paymentsDB.update(payment.id, { status: nextStatus });
        onUpdate();
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
        }}>
            <div style={{ flex: 1 }}>
                <p style={{ fontWeight: '600', marginBottom: '4px' }}>
                    {entity?.name || 'Неизвестно'}
                </p>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    {formatDate(payment.date)} • {payment.lessonsCount} {payment.lessonsCount === 1 ? 'урок' : 'уроков'}
                </p>
                {payment.notes && (
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {payment.notes}
                    </p>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <p style={{ fontSize: '20px', fontWeight: '700' }}>
                    {formatCurrency(payment.amount)}
                </p>
                <button
                    onClick={togglePaid}
                    className={`badge ${payment.status === PaymentStatus.Paid ? 'badge-success' : 'badge-warning'}`}
                    style={{ cursor: 'pointer', padding: '8px 16px' }}
                >
                    {payment.status === PaymentStatus.Paid ? (
                        <>
                            <Check size={14} style={{ marginRight: '4px', display: 'inline' }} />
                            Оплачено
                        </>
                    ) : (
                        <>
                            <Clock size={14} style={{ marginRight: '4px', display: 'inline' }} />
                            Ожидается
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

function PaymentModal({
    entity,
    onClose,
    onSave
}: {
    entity: EntityBalance;
    onClose: () => void;
    onSave: () => void;
}) {
    const [formData, setFormData] = useState({
        amount: entity.balance,
        date: new Date().toISOString().slice(0, 10),
        lessonsCount: entity.completedLessons.length,
        status: PaymentStatus.Paid as PaymentStatus,
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        paymentsDB.create({
            type: entity.type,
            studentId: entity.type === EntityType.Student ? entity.id : undefined,
            groupId: entity.type === EntityType.Group ? entity.id : undefined,
            amount: formData.amount,
            date: new Date(formData.date).toISOString(),
            lessonsCount: formData.lessonsCount,
            status: formData.status,
            notes: formData.notes,
        });

        onSave();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        Добавить оплату - {entity.name}
                    </h2>
                    <button onClick={onClose} style={{ padding: '4px' }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">Сумма *</label>
                            <input
                                type="number"
                                className="form-input"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                                required
                                min="0"
                            />
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                Текущая задолженность: {formatCurrency(entity.balance)}
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Дата *</label>
                            <input
                                type="date"
                                className="form-input"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Количество уроков *</label>
                            <input
                                type="number"
                                className="form-input"
                                value={formData.lessonsCount}
                                onChange={(e) => setFormData({ ...formData, lessonsCount: Number(e.target.value) })}
                                required
                                min="1"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Статус</label>
                            <select
                                className="form-select"
                                value={formData.status}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        status: e.target.value as PaymentStatus,
                                    })
                                }
                            >
                                <option value={PaymentStatus.Paid}>Оплачено</option>
                                <option value={PaymentStatus.Pending}>Ожидается</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Примечания</label>
                            <textarea
                                className="form-textarea"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Добавить оплату
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
