'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, X } from 'lucide-react';
import { recordPayment } from '@/app/actions/payments';

export default function PaymentsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-open modal if studentId is in URL
  useEffect(() => {
    const studentId = searchParams.get('studentId');
    if (studentId) {
      setShowModal(true);
    }
  }, [searchParams]);

  return (
    <>
      <button
        className="btn btn-primary"
        onClick={() => setShowModal(true)}
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <Plus size={18} />
        Добавить оплату
      </button>

      {showModal && (
        <PaymentModal
          initialStudentId={searchParams.get('studentId') || undefined}
          onClose={() => {
            setShowModal(false);
            // Remove studentId from URL when closing
            if (searchParams.get('studentId')) {
              router.push('/payments');
            }
          }}
          onSave={() => {
            router.refresh();
            setShowModal(false);
            // Remove studentId from URL after saving
            if (searchParams.get('studentId')) {
              router.push('/payments');
            }
          }}
        />
      )}
    </>
  );
}

function PaymentModal({
  initialStudentId,
  onClose,
  onSave,
}: {
  initialStudentId?: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    studentId: initialStudentId || '',
    month: new Date().toISOString().slice(0, 7), // YYYY-MM
    totalLessons: 12,
    priceTotal: 6000000,
    paidAmount: 0,
  });
  const [students, setStudents] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load students on mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students');
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
          
          // Set initial student ID if provided
          if (initialStudentId && !formData.studentId) {
            setFormData((prev) => ({ ...prev, studentId: initialStudentId }));
          }
        }
      } catch (error) {
        console.error('Failed to load students:', error);
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [initialStudentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await recordPayment(formData);

    setIsLoading(false);

    if (result.success) {
      onSave();
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Добавить оплату</h2>
          <button onClick={onClose} style={{ padding: '4px' }} disabled={isLoading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div
                style={{
                  padding: '12px',
                  background: 'var(--error)20',
                  border: '1px solid var(--error)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '16px',
                  color: 'var(--error)',
                  fontSize: '14px',
                }}
              >
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Ученик *</label>
              {isLoadingStudents ? (
                <div className="form-input" style={{ color: 'var(--text-muted)' }}>
                  Загрузка учеников...
                </div>
              ) : (
                <select
                  className="form-select"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  required
                  disabled={isLoading}
                >
                  <option value="">Выберите ученика</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Месяц *</label>
              <input
                type="month"
                className="form-input"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Всего уроков *</label>
              <input
                type="number"
                className="form-input"
                value={formData.totalLessons}
                onChange={(e) => setFormData({ ...formData, totalLessons: Number(e.target.value) })}
                required
                min="1"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Общая цена *</label>
              <input
                type="number"
                className="form-input"
                value={formData.priceTotal}
                onChange={(e) => setFormData({ ...formData, priceTotal: Number(e.target.value) })}
                required
                min="0"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Оплаченная сумма *</label>
              <input
                type="number"
                className="form-input"
                value={formData.paidAmount}
                onChange={(e) => setFormData({ ...formData, paidAmount: Number(e.target.value) })}
                required
                min="0"
                disabled={isLoading}
              />
            </div>
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
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
