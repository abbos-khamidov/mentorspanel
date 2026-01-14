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

const navItems = [
    { href: '/', label: 'Главная', icon: LayoutDashboard },
    { href: '/calendar', label: 'Календарь', icon: Calendar },
    { href: '/students', label: 'Ученики', icon: Users },
    { href: '/payments', label: 'Оплаты', icon: Wallet },
    { href: '/analytics', label: 'Аналитика', icon: TrendingUp },
];

export default function Navigation() {
    const pathname = usePathname();

    return (
        <nav style={{
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            width: '260px',
            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
            borderRight: '1px solid var(--border)',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
        }}>
            {/* Logo */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
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
                <div>
                    <h1 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, var(--primary-light), var(--secondary))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Менторство
                    </h1>
                    <p style={{
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                    }}>
                        Панель управления
                    </p>
                </div>
            </div>

            {/* Navigation Links */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                flex: 1,
            }}>
                {navItems.map((item) => {
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

            {/* Footer */}
            <div style={{
                padding: '16px',
                borderTop: '1px solid var(--border)',
                fontSize: '12px',
                color: 'var(--text-muted)',
                textAlign: 'center',
            }}>
                © 2026 Dashboard
            </div>
        </nav>
    );
}
