'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import AuthForm from './AuthForm';
import ParticleBackground from './ParticleBackground';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isError, setIsError] = useState(false);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Minimalist Particle Background */}
      <ParticleBackground isSad={isError} />

      {/* Main Content */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          zIndex: 10,
          position: 'relative',
        }}
      >
        {/* Left Side - Minimalist Branding */}
        <div
          style={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px',
            color: 'white',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              maxWidth: '500px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '64px',
                fontWeight: '800',
                marginBottom: '24px',
                background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.9) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-2px',
              }}
            >
              Mentorship
            </div>
            <p
              style={{
                fontSize: '18px',
                opacity: 0.95,
                lineHeight: '1.7',
                fontWeight: '300',
                letterSpacing: '0.5px',
              }}
            >
              Профессиональная платформа для управления уроками и отслеживания прогресса учеников
            </p>
          </motion.div>
        </div>

        {/* Right Side - Auth Form */}
        <div
          style={{
            width: '480px',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            boxShadow: '-10px 0 60px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '40px' }}>
              <div style={{ textAlign: 'center', color: '#666' }}>Загрузка...</div>
            </div>
          }>
            <AuthForm
              isLogin={isLogin}
              setIsLogin={setIsLogin}
              onError={() => setIsError(true)}
              onSuccess={() => {
                setIsError(false);
                // Reset error state after delay
                setTimeout(() => setIsError(false), 2000);
              }}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
