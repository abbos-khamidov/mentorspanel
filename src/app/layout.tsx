import type { Metadata } from 'next';
import './globals.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Navigation from '@/components/Navigation';
import ThemeProvider from '@/components/ThemeProvider';
import { LocaleProvider } from '@/contexts/LocaleContext';
import Footer from '@/components/Footer';

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
        <html lang="ru" suppressHydrationWarning>
            <body>
                <ThemeProvider>
                    <LocaleProvider>
                        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', flex: 1 }}>
                                <Navigation />
                                <main style={{ flex: 1, padding: '24px', marginLeft: '260px', minHeight: 'calc(100vh - 60px)' }}>
                                    {children}
                                </main>
                            </div>
                            <Footer />
                        </div>
                    </LocaleProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
