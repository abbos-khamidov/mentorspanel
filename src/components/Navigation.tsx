'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Calendar,
    Users,
    Wallet,
    TrendingUp,
    GraduationCap
} from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { getTranslation } from '@/lib/i18n';
import ThemeToggle from './ThemeToggle';
import LocaleToggle from './LocaleToggle';

export default function Navigation() {
    const pathname = usePathname();
    const { locale } = useLocale();
    const t = getTranslation(locale);

    return (
        <nav style={{
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            width: '260px',
            background: 'var(--bg-secondary)',
            borderRight: '1px solid var(--border)',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
        }}>
            {/* Logo & Controls */}
            <div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    marginBottom: '16px',
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <GraduationCap size={24} color="white" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                        }}>
                            Менторство
                        </h1>
                        <p style={{
                            fontSize: '12px',
                            color: 'var(--text-muted)',
                        }}>
                            {t.nav.panel}
                        </p>
                    </div>
                </div>
                
                {/* Theme & Language Toggles */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    padding: '0 12px',
                    marginBottom: '16px',
                }}>
                    <ThemeToggle />
                    <LocaleToggle />
                </div>
            </div>

            {/* Navigation Links */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                flex: 1,
            }}>
                {[
                    { href: '/', label: t.nav.dashboard, icon: LayoutDashboard },
                    { href: '/calendar', label: t.nav.calendar, icon: Calendar },
                    { href: '/students', label: t.nav.students, icon: Users },
                    { href: '/payments', label: t.nav.payments, icon: Wallet },
                    { href: '/analytics', label: t.nav.analytics, icon: TrendingUp },
                ].map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: 'var(--radius-sm)',
                                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                border: isActive ? '1px solid var(--primary)' : '1px solid transparent',
                                fontWeight: isActive ? '600' : '500',
                                fontSize: '14px',
                                transition: 'var(--transition)',
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                                    e.currentTarget.style.borderColor = 'var(--border)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.borderColor = 'transparent';
                                }
                            }}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>

        </nav>
    );
}
