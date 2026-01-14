import type { Metadata } from 'next';
import './globals.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
    title: 'Панель Менторства',
    description: 'Управление уроками и оплатами учеников',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ru">
            <body>
                <div style={{ display: 'flex', minHeight: '100vh' }}>
                    <Navigation />
                    <main style={{ flex: 1, padding: '24px', marginLeft: '260px' }}>
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
