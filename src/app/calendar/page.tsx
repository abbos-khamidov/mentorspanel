'use client';

import { useEffect, useState, useCallback } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { lessonsDB, studentsDB, groupsDB } from '@/lib/db';
import { Calendar as CalendarIcon, Plus, X, Trash2 } from 'lucide-react';
import type { Lesson } from '@/lib/types';
import { EntityType, LessonStatus } from '@/lib/types';
import { doLessonsOverlap, getLessonEndTime } from '@/lib/utils';

const locales = {
    'ru': ru,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

const messages = {
    allDay: 'Весь день',
    previous: 'Назад',
    next: 'Вперед',
    today: 'Сегодня',
    month: 'Месяц',
    week: 'Неделя',
    day: 'День',
    agenda: 'Повестка',
    date: 'Дата',
    time: 'Время',
    event: 'Урок',
    noEventsInRange: 'Нет уроков',
    showMore: (total: number) => `+${total} ещё`,
};

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resource: Lesson;
}

export default function CalendarPage() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [view, setView] = useState<View>('month');
    const [showModal, setShowModal] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const loadLessons = useCallback(() => {
        setLessons(lessonsDB.getAll());
    }, []);

    useEffect(() => {
        loadLessons();
    }, [loadLessons]);

    const events: CalendarEvent[] = lessons.map(lesson => {
        const start = new Date(lesson.startTime);
        const end = getLessonEndTime(lesson.startTime, lesson.duration);

        let title = '';
        if (lesson.type === EntityType.Student && lesson.studentId) {
            const student = studentsDB.getById(lesson.studentId);
            title = student ? `${student.name} (Индивид.)` : 'Индивидуальный урок';
        } else if (lesson.type === EntityType.Group && lesson.groupId) {
            const group = groupsDB.getById(lesson.groupId);
            title = group ? `${group.name} (Группа)` : 'Групповой урок';
        }

        return {
            id: lesson.id,
            title,
            start,
            end,
            resource: lesson,
        };
    });

    const handleSelectSlot = ({ start }: { start: Date }) => {
        setSelectedDate(start);
        setSelectedLesson(null);
        setShowModal(true);
    };

    const handleSelectEvent = (event: CalendarEvent) => {
        setSelectedLesson(event.resource);
        setShowModal(true);
    };

    const eventStyleGetter = (event: CalendarEvent) => {
        const lesson = event.resource;
        let backgroundColor = 'var(--primary)';

        if (lesson.type === EntityType.Group) {
            backgroundColor = 'var(--secondary)';
        }

        if (lesson.status === LessonStatus.Completed) {
            backgroundColor = 'var(--success)';
        } else if (lesson.status === LessonStatus.Cancelled) {
            backgroundColor = 'var(--error)';
        }

        return {
            style: {
                backgroundColor,
                borderRadius: '6px',
                opacity: 0.9,
                color: 'white',
                border: 'none',
                display: 'block',
            },
        };
    };

    return (
        <div className="container slide-up">
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
                        Календарь
                    </h1>
                    <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
                        Расписание уроков
                    </p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setSelectedDate(new Date());
                        setSelectedLesson(null);
                        setShowModal(true);
                    }}
                >
                    <Plus size={18} />
                    Добавить урок
                </button>
            </div>

            {/* Legend */}
            <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '20px',
                padding: '12px 16px',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
            }}>
                <LegendItem color="var(--primary)" label="Индивидуальный" />
                <LegendItem color="var(--secondary)" label="Группа" />
                <LegendItem color="var(--success)" label="Завершен" />
                <LegendItem color="var(--error)" label="Отменен" />
            </div>

            {/* Calendar */}
            <div className="card" style={{ padding: '24px', minHeight: '700px' }}>
                <BigCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%', minHeight: '650px' }}
                    view={view}
                    onView={setView}
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    selectable
                    messages={messages}
                    eventPropGetter={eventStyleGetter}
                    culture="ru"
                />
            </div>

            {/* Lesson Modal */}
            {showModal && (
                <LessonModal
                    lesson={selectedLesson}
                    initialDate={selectedDate}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedLesson(null);
                        setSelectedDate(null);
                    }}
                    onSave={() => {
                        loadLessons();
                        setShowModal(false);
                        setSelectedLesson(null);
                        setSelectedDate(null);
                    }}
                />
            )}
        </div>
    );
}

function LegendItem({ color, label }: { color: string; label: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '4px',
                backgroundColor: color,
            }} />
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {label}
            </span>
        </div>
    );
}

function LessonModal({
    lesson,
    initialDate,
    onClose,
    onSave
}: {
    lesson: Lesson | null;
    initialDate: Date | null;
    onClose: () => void;
    onSave: () => void;
}) {
    const students = studentsDB.getAll().filter(s => s.isActive);
    const groups = groupsDB.getAll().filter(g => g.isActive);

    const defaultDate = lesson
        ? new Date(lesson.startTime)
        : initialDate || new Date();

    const [formData, setFormData] = useState({
        type: lesson?.type || EntityType.Student,
        studentId: lesson?.studentId || '',
        groupId: lesson?.groupId || '',
        date: format(defaultDate, 'yyyy-MM-dd'),
        time: format(defaultDate, 'HH:mm'),
        duration: lesson?.duration || 1 as 1 | 2,
        status: lesson?.status || LessonStatus.Scheduled,
        notes: lesson?.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const startTime = new Date(`${formData.date}T${formData.time}`).toISOString();

        // проверка пересечений для выбранного ученика/группы
        const allLessons = lessonsDB.getAll();
        const related = allLessons.filter(existing => {
            if (lesson && existing.id === lesson.id) {
                return false;
            }
            if (formData.type === EntityType.Student) {
                return (
                    existing.type === EntityType.Student &&
                    existing.studentId === formData.studentId
                );
            }
            return (
                existing.type === EntityType.Group &&
                existing.groupId === formData.groupId
            );
        });

        const hasOverlap = related.some(existing =>
            doLessonsOverlap(
                existing.startTime,
                existing.duration,
                startTime,
                formData.duration,
            ),
        );

        if (hasOverlap) {
            // eslint-disable-next-line no-alert
            alert('Невозможно сохранить: урок пересекается с другим уроком для этого ученика/группы.');
            return;
        }

        const lessonData: Omit<Lesson, 'id' | 'createdAt'> = {
            type: formData.type,
            studentId: formData.type === EntityType.Student ? formData.studentId : undefined,
            groupId: formData.type === EntityType.Group ? formData.groupId : undefined,
            startTime,
            duration: formData.duration,
            status: formData.status,
            notes: formData.notes,
        };

        if (lesson) {
            lessonsDB.update(lesson.id, lessonData);
        } else {
            lessonsDB.create(lessonData);
        }

        onSave();
    };

    const handleDelete = () => {
        if (lesson && confirm('Вы уверены, что хотите удалить этот урок?')) {
            lessonsDB.delete(lesson.id);
            onSave();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {lesson ? 'Редактировать урок' : 'Добавить урок'}
                    </h2>
                    <button onClick={onClose} style={{ padding: '4px' }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">Тип урока *</label>
                            <select
                                className="form-select"
                                value={formData.type}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        type: e.target.value as EntityType,
                                        studentId: '',
                                        groupId: '',
                                    })
                                }
                                required
                            >
                                <option value={EntityType.Student}>Индивидуальный</option>
                                <option value={EntityType.Group}>Групповой</option>
                            </select>
                        </div>

                        {formData.type === EntityType.Student ? (
                            <div className="form-group">
                                <label className="form-label">Ученик *</label>
                                <select
                                    className="form-select"
                                    value={formData.studentId}
                                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                    required
                                >
                                    <option value="">Выберите ученика</option>
                                    {students.map(student => (
                                        <option key={student.id} value={student.id}>
                                            {student.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className="form-group">
                                <label className="form-label">Группа *</label>
                                <select
                                    className="form-select"
                                    value={formData.groupId}
                                    onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                                    required
                                >
                                    <option value="">Выберите группу</option>
                                    {groups.map(group => (
                                        <option key={group.id} value={group.id}>
                                            {group.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="grid grid-2" style={{ gap: '16px' }}>
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
                                <label className="form-label">Время *</label>
                                <input
                                    type="time"
                                    className="form-input"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Длительность *</label>
                            <select
                                className="form-select"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) as 1 | 2 })}
                                required
                            >
                                <option value={1}>1 час</option>
                                <option value={2}>2 часа</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Статус *</label>
                            <select
                                className="form-select"
                                value={formData.status}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        status: e.target.value as LessonStatus,
                                    })
                                }
                                required
                            >
                                <option value={LessonStatus.Scheduled}>Запланирован</option>
                                <option value={LessonStatus.Completed}>Завершен</option>
                                <option value={LessonStatus.Cancelled}>Отменен</option>
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
                        {lesson && (
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleDelete}
                                style={{ marginRight: 'auto' }}
                            >
                                <Trash2 size={16} />
                                Удалить
                            </button>
                        )}
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {lesson ? 'Сохранить' : 'Добавить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
