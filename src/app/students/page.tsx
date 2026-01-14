'use client';

import { useEffect, useState } from 'react';
import { studentsDB, groupsDB } from '@/lib/db';
import { Users, UserPlus, Pencil, Trash2, X } from 'lucide-react';
import type { Student, Group } from '@/lib/types';

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [editingGroup, setEditingGroup] = useState<Group | null>(null);

    const loadData = () => {
        setStudents(studentsDB.getAll());
        setGroups(groupsDB.getAll());
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDeleteStudent = (id: string) => {
        if (confirm('Вы уверены, что хотите удалить этого ученика?')) {
            studentsDB.delete(id);
            loadData();
        }
    };

    const handleDeleteGroup = (id: string) => {
        if (confirm('Вы уверены, что хотите удалить эту группу?')) {
            groupsDB.delete(id);
            loadData();
        }
    };

    return (
        <div className="container slide-up">
            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
                        Ученики и Группы
                    </h1>
                    <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
                        Управление учениками и группами
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setEditingStudent(null);
                            setShowStudentModal(true);
                        }}
                    >
                        <UserPlus size={18} />
                        Добавить ученика
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            setEditingGroup(null);
                            setShowGroupModal(true);
                        }}
                    >
                        <Users size={18} />
                        Добавить группу
                    </button>
                </div>
            </div>

            {/* Students Section */}
            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
                    Ученики ({students.filter(s => s.isActive).length})
                </h2>
                {students.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <Users size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                        <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                            Нет учеников
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowStudentModal(true)}
                        >
                            Добавить первого ученика
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-3">
                        {students.map(student => (
                            <StudentCard
                                key={student.id}
                                student={student}
                                onEdit={() => {
                                    setEditingStudent(student);
                                    setShowStudentModal(true);
                                }}
                                onDelete={() => handleDeleteStudent(student.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Groups Section */}
            <div>
                <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
                    Группы ({groups.filter(g => g.isActive).length})
                </h2>
                {groups.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <Users size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                        <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                            Нет групп
                        </p>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowGroupModal(true)}
                        >
                            Добавить первую группу
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-3">
                        {groups.map(group => (
                            <GroupCard
                                key={group.id}
                                group={group}
                                onEdit={() => {
                                    setEditingGroup(group);
                                    setShowGroupModal(true);
                                }}
                                onDelete={() => handleDeleteGroup(group.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showStudentModal && (
                <StudentModal
                    student={editingStudent}
                    onClose={() => {
                        setShowStudentModal(false);
                        setEditingStudent(null);
                    }}
                    onSave={() => {
                        loadData();
                        setShowStudentModal(false);
                        setEditingStudent(null);
                    }}
                />
            )}

            {showGroupModal && (
                <GroupModal
                    group={editingGroup}
                    onClose={() => {
                        setShowGroupModal(false);
                        setEditingGroup(null);
                    }}
                    onSave={() => {
                        loadData();
                        setShowGroupModal(false);
                        setEditingGroup(null);
                    }}
                />
            )}
        </div>
    );
}

function StudentCard({
    student,
    onEdit,
    onDelete
}: {
    student: Student;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <div className="card" style={{ opacity: student.isActive ? 1 : 0.6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{student.name}</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={onEdit}
                        style={{
                            background: 'var(--bg-tertiary)',
                            padding: '6px',
                            borderRadius: '6px',
                            transition: 'var(--transition)',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--border)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={onDelete}
                        style={{
                            background: 'var(--bg-tertiary)',
                            padding: '6px',
                            borderRadius: '6px',
                            color: 'var(--error)',
                            transition: 'var(--transition)',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--error)20'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {student.email && (
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                        📧 {student.email}
                    </p>
                )}
                {student.phone && (
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                        📱 {student.phone}
                    </p>
                )}
                <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-sm)',
                }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Ставка за час
                    </p>
                    <p style={{ fontSize: '20px', fontWeight: '700', color: 'var(--success)' }}>
                        {student.ratePerHour}
                    </p>
                </div>
                <div className={`badge ${student.isActive ? 'badge-success' : 'badge-error'}`}>
                    {student.isActive ? 'Активен' : 'Неактивен'}
                </div>
            </div>
        </div>
    );
}

function GroupCard({
    group,
    onEdit,
    onDelete
}: {
    group: Group;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <div className="card" style={{ opacity: group.isActive ? 1 : 0.6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{group.name}</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={onEdit}
                        style={{
                            background: 'var(--bg-tertiary)',
                            padding: '6px',
                            borderRadius: '6px',
                            transition: 'var(--transition)',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--border)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={onDelete}
                        style={{
                            background: 'var(--bg-tertiary)',
                            padding: '6px',
                            borderRadius: '6px',
                            color: 'var(--error)',
                            transition: 'var(--transition)',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--error)20'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    👥 Количество учеников: {group.studentCount}
                </p>
                <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-sm)',
                }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Ставка за час
                    </p>
                    <p style={{ fontSize: '20px', fontWeight: '700', color: 'var(--success)' }}>
                        {group.ratePerHour}
                    </p>
                </div>
                <div className={`badge ${group.isActive ? 'badge-success' : 'badge-error'}`}>
                    {group.isActive ? 'Активна' : 'Неактивна'}
                </div>
            </div>
        </div>
    );
}

function StudentModal({
    student,
    onClose,
    onSave
}: {
    student: Student | null;
    onClose: () => void;
    onSave: () => void;
}) {
    const [formData, setFormData] = useState({
        name: student?.name || '',
        email: student?.email || '',
        phone: student?.phone || '',
        ratePerHour: student?.ratePerHour || 0,
        isActive: student?.isActive ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (student) {
            studentsDB.update(student.id, formData);
        } else {
            studentsDB.create(formData);
        }

        onSave();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {student ? 'Редактировать ученика' : 'Добавить ученика'}
                    </h2>
                    <button onClick={onClose} style={{ padding: '4px' }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">Имя *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-input"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Телефон</label>
                            <input
                                type="tel"
                                className="form-input"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Ставка за час *</label>
                            <input
                                type="number"
                                className="form-input"
                                value={formData.ratePerHour}
                                onChange={(e) => setFormData({ ...formData, ratePerHour: Number(e.target.value) })}
                                required
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <span className="form-label" style={{ marginBottom: 0 }}>Активен</span>
                            </label>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {student ? 'Сохранить' : 'Добавить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function GroupModal({
    group,
    onClose,
    onSave
}: {
    group: Group | null;
    onClose: () => void;
    onSave: () => void;
}) {
    const [formData, setFormData] = useState({
        name: group?.name || '',
        studentCount: group?.studentCount || 0,
        ratePerHour: group?.ratePerHour || 0,
        isActive: group?.isActive ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (group) {
            groupsDB.update(group.id, formData);
        } else {
            groupsDB.create(formData);
        }

        onSave();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {group ? 'Редактировать группу' : 'Добавить группу'}
                    </h2>
                    <button onClick={onClose} style={{ padding: '4px' }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">Название *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Количество учеников *</label>
                            <input
                                type="number"
                                className="form-input"
                                value={formData.studentCount}
                                onChange={(e) => setFormData({ ...formData, studentCount: Number(e.target.value) })}
                                required
                                min="1"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Ставка за час *</label>
                            <input
                                type="number"
                                className="form-input"
                                value={formData.ratePerHour}
                                onChange={(e) => setFormData({ ...formData, ratePerHour: Number(e.target.value) })}
                                required
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <span className="form-label" style={{ marginBottom: 0 }}>Активна</span>
                            </label>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {group ? 'Сохранить' : 'Добавить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
