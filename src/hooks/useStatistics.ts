'use client';

import { useEffect, useState } from 'react';
import { getStatistics, lessonsDB } from '@/lib/db';
import type { FinancialStats, Lesson } from '@/lib/types';
import { LessonStatus } from '@/lib/types';

interface UseStatisticsResult {
    stats: FinancialStats | null;
    upcomingLessons: Lesson[];
    isLoading: boolean;
}

export function useStatistics(): UseStatisticsResult {
    const [stats, setStats] = useState<FinancialStats | null>(null);
    const [upcomingLessons, setUpcomingLessons] = useState<Lesson[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // выполняется только на клиенте
        const statistics = getStatistics();
        setStats(statistics);

        const allLessons = lessonsDB.getAll();
        const now = new Date();
        const upcoming = allLessons
            .filter(
                lesson =>
                    lesson.status === LessonStatus.Scheduled &&
                    new Date(lesson.startTime) > now,
            )
            .sort(
                (a, b) =>
                    new Date(a.startTime).getTime() -
                    new Date(b.startTime).getTime(),
            )
            .slice(0, 5);

        setUpcomingLessons(upcoming);
        setIsLoading(false);
    }, []);

    return { stats, upcomingLessons, isLoading };
}

