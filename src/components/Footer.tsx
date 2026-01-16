'use client';

import { Github, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      marginLeft: '260px',
      padding: '16px 24px',
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-secondary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      fontSize: '12px',
      color: 'var(--text-muted)',
    }}>
      <a
        href="https://github.com/abbos-khamidov"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          transition: 'var(--transition)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--text-muted)';
        }}
      >
        <Github size={16} />
        <span>GitHub</span>
      </a>
      
      <span>•</span>
      
      <span>Made by Adams Midov</span>
      
      <span>•</span>
      
      <a
        href="https://t.me/adamsmidov"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          transition: 'var(--transition)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--text-muted)';
        }}
      >
        <Send size={16} />
        <span>Telegram</span>
      </a>
    </footer>
  );
}
