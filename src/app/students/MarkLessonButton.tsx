'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Plus, X } from 'lucide-react';
import { markLesson } from '@/app/actions/students';

export default function MarkLessonButton({
  studentId,
  currentUsed,
  totalLessons,
}: {
  studentId: string;
  currentUsed: number;
  totalLessons: number;
}) {
  const router = useRouter();
  const [showInput, setShowInput] = useState(false);
  const [lessonsCount, setLessonsCount] = useState('1');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const count = parseInt(lessonsCount, 10);
    
    if (isNaN(count) || count < 1) {
      alert('Введите корректное количество уроков (минимум 1)');
      return;
    }

    if (currentUsed + count > totalLessons) {
      alert(`Нельзя превысить лимит уроков (${totalLessons}). Доступно: ${totalLessons - currentUsed}`);
      return;
    }

    setIsLoading(true);
    
    const result = await markLesson({ studentId, count });
    setIsLoading(false);

    if (result.success) {
      setLessonsCount('1');
      setShowInput(false);
      router.refresh();
    } else {
      alert(result.error || 'Ошибка при отметке урока');
    }
  };

  if (!showInput) {
    return (
      <button
        onClick={() => setShowInput(true)}
        className="btn btn-primary"
        style={{
          width: '100%',
          fontSize: '12px',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
        disabled={isLoading || currentUsed >= totalLessons}
      >
        <CheckCircle2 size={14} />
        Отметить урок
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      <div style={{ display: 'flex', gap: '6px', alignItems: 'stretch' }}>
        <input
          type="number"
          min="1"
          max={totalLessons - currentUsed}
          value={lessonsCount}
          onChange={(e) => setLessonsCount(e.target.value)}
          placeholder="Количество уроков"
          required
          disabled={isLoading}
          autoFocus
          style={{
            flex: 1,
            padding: '6px 8px',
            fontSize: '12px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            color: 'var(--text-primary)',
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary"
          style={{
            fontSize: '12px',
            padding: '6px 10px',
            minWidth: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {isLoading ? (
            '...'
          ) : (
            <>
              <Plus size={14} />
              Добавить
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowInput(false);
            setLessonsCount('1');
          }}
          disabled={isLoading}
          style={{
            padding: '6px 8px',
            fontSize: '12px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            color: 'var(--text-muted)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.5 : 1,
          }}
        >
          <X size={14} />
        </button>
      </div>
    </form>
  );
}
