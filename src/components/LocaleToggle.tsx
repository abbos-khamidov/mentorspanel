'use client';

import { Languages } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import type { Locale } from '@/lib/i18n';
import { useState } from 'react';

const locales: { code: Locale; label: string; flag: string }[] = [
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
];

export default function LocaleToggle() {
  const { locale, setLocale, mounted } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  if (!mounted) {
    return null;
  }

  const currentLocale = locales.find((l) => l.code === locale) || locales[0];

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: '8px',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border)',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          fontSize: '14px',
          transition: 'var(--transition)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--border)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--bg-tertiary)';
        }}
      >
        <Languages size={18} />
        <span>{currentLocale.flag}</span>
      </button>

      {isOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 998,
            }}
            onClick={() => setIsOpen(false)}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 999,
              minWidth: '150px',
              overflow: 'hidden',
            }}
          >
            {locales.map((loc) => (
              <button
                key={loc.code}
                onClick={() => {
                  setLocale(loc.code);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: locale === loc.code ? 'var(--bg-tertiary)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  transition: 'var(--transition)',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  if (locale !== loc.code) {
                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (locale !== loc.code) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '20px' }}>{loc.flag}</span>
                <span>{loc.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
