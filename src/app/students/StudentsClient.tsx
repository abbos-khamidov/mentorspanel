'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Pencil, Trash2, X } from 'lucide-react';
import { createStudent, updateStudent, deleteStudent, updateMonthlyPlanLessons } from '@/app/actions/students';

interface Student {
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
}

export default function StudentsClient({
  initialStudents,
  studentId,
}: {
  initialStudents?: Student[];
  studentId?: string;
}) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого ученика?')) return;

    setIsLoading(true);
    const result = await deleteStudent(id);
    setIsLoading(false);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  if (studentId) {
    // Action buttons for a specific student card
    const student = initialStudents?.find((s) => s.id === studentId);
    if (!student) return null;

    return (
      <>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              setEditingStudent(student);
              setShowModal(true);
            }}
            style={{
              background: 'var(--bg-tertiary)',
              padding: '6px',
              borderRadius: '6px',
              transition: 'var(--transition)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--border)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => handleDelete(student.id)}
            disabled={isLoading}
            style={{
              background: 'var(--bg-tertiary)',
              padding: '6px',
              borderRadius: '6px',
              color: 'var(--error)',
              transition: 'var(--transition)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
            }}
            onMouseEnter={(e) => !isLoading && (e.currentTarget.style.background = 'var(--error)20')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
          >
            <Trash2 size={16} />
          </button>
        </div>

        {showModal && (
          <StudentModal
            student={editingStudent}
            onClose={() => {
              setShowModal(false);
              setEditingStudent(null);
            }}
            onSave={() => {
              router.refresh();
              setShowModal(false);
              setEditingStudent(null);
            }}
          />
        )}
      </>
    );
  }

  // Add student button
  return (
    <>
      <button
        className="btn btn-primary"
        onClick={() => {
          setEditingStudent(null);
          setShowModal(true);
        }}
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <UserPlus size={18} />
        Добавить ученика
      </button>

      {showModal && (
        <StudentModal
          student={editingStudent}
          onClose={() => {
            setShowModal(false);
            setEditingStudent(null);
          }}
          onSave={() => {
            router.refresh();
            setShowModal(false);
            setEditingStudent(null);
          }}
        />
      )}
    </>
  );
}

function StudentModal({
  student,
  onClose,
  onSave,
}: {
  student: Student | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    phone: student?.phone || '',
    githubLink: student?.githubLink || '',
    totalLessons: student?.monthlyPlan?.totalLessons || 12,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Обновляем formData когда student меняется
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        githubLink: student.githubLink || '',
        totalLessons: student.monthlyPlan?.totalLessons || 12,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        githubLink: '',
        totalLessons: 12,
      });
    }
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Обновляем или создаем ученика
      const studentResult = student
        ? await updateStudent(student.id, {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            githubLink: formData.githubLink,
          })
        : await createStudent({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            githubLink: formData.githubLink,
          });

      if (!studentResult.success) {
        alert(studentResult.error);
        setIsLoading(false);
        return;
      }

      // Если редактируем существующего ученика, обновляем количество уроков в месячном плане
      if (student && studentResult.success) {
        const planResult = await updateMonthlyPlanLessons({
          studentId: student.id,
          totalLessons: formData.totalLessons,
        });

        if (!planResult.success) {
          alert(planResult.error);
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(false);
      onSave();
    } catch (error) {
      setIsLoading(false);
      alert('Произошла ошибка при сохранении');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {student ? 'Редактировать ученика' : 'Добавить ученика'}
          </h2>
          <button onClick={onClose} style={{ padding: '4px' }} disabled={isLoading}>
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
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Телефон</label>
              <input
                type="tel"
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ссылка на GitHub</label>
              <input
                type="url"
                className="form-input"
                value={formData.githubLink}
                onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                disabled={isLoading}
                placeholder="https://github.com/username"
              />
            </div>

            {student && (
              <div className="form-group" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid var(--border)' }}>
                <label className="form-label" style={{ fontWeight: '600', fontSize: '14px', marginBottom: '8px' }}>
                  Количество уроков в месяц *
                </label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={formData.totalLessons || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value) && value > 0) {
                      setFormData({
                        ...formData,
                        totalLessons: value,
                      });
                    } else if (e.target.value === '') {
                      setFormData({
                        ...formData,
                        totalLessons: 12,
                      });
                    }
                  }}
                  disabled={isLoading}
                  placeholder="12"
                  required
                  style={{ fontSize: '14px', padding: '10px 12px', width: '100%' }}
                />
                {student.monthlyPlan && (
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', marginBottom: 0 }}>
                    Текущий прогресс: <strong>{student.monthlyPlan.usedLessons}</strong> / <strong>{formData.totalLessons}</strong> уроков
                  </p>
                )}
              </div> 
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Отмена
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Сохранение...' : student ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
