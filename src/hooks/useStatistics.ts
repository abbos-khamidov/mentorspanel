'use client';

import { useEffect, useState } from 'react';
// Removed old db imports - using API instead
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
        // Fetch statistics and lessons from API
        const fetchData = async () => {
            try {
                const [statsRes, lessonsRes] = await Promise.all([
                    fetch('/api/statistics'),
                    fetch('/api/lessons'),
                ]);

                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setStats(statsData);
                }

                if (lessonsRes.ok) {
                    const allLessons = await lessonsRes.json();
                    const now = new Date();
                    const upcoming = allLessons
                        .filter(
                            (lesson: Lesson) =>
                                lesson.status === LessonStatus.Pending &&
                                new Date(lesson.startTime) > now,
                        )
                        .sort(
                            (a: Lesson, b: Lesson) =>
                                new Date(a.startTime).getTime() -
                                new Date(b.startTime).getTime(),
                        )
                        .slice(0, 5);
                    setUpcomingLessons(upcoming);
                }
            } catch (error) {
                console.error('Failed to fetch statistics:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return { stats, upcomingLessons, isLoading };
}

