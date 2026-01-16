'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthFormProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
  onError: () => void;
  onSuccess: () => void;
}

export default function AuthForm({ isLogin, setIsLogin, onError, onSuccess }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Очищаем ошибки при переключении, но сохраняем successMessage
    setError(null);
    setErrors({});
    // setSuccessMessage очищаем только если нет активного успешного сообщения
    // onSuccess();
  }, [isLogin]);

  // Заполнить email из URL если есть
  useEffect(() => {
    const email = searchParams.get('email');
    if (email) {
      setFormData((prev) => ({ ...prev, email }));
    }
  }, [searchParams]);

  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case 'email':
        if (!value) return 'Email обязателен';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Некорректный email';
        return null;
      case 'password':
        if (!value) return 'Пароль обязателен';
        if (value.length < 8) return 'Пароль должен содержать минимум 8 символов';
        if (!/[A-Z]/.test(value)) return 'Пароль должен содержать заглавную букву';
        if (!/[a-z]/.test(value)) return 'Пароль должен содержать строчную букву';
        if (!/[0-9]/.test(value)) return 'Пароль должен содержать цифру';
        return null;
      case 'confirmPassword':
        if (!isLogin && value !== formData.password) return 'Пароли не совпадают';
        return null;
      case 'name':
        if (!isLogin && !value) return 'Имя обязательно';
        if (!isLogin && value.length < 2) return 'Имя должно содержать минимум 2 символа';
        return null;
      default:
        return null;
    }
  };

  const handleBlur = (name: string) => {
    const value = formData[name as keyof typeof formData];
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    onSuccess();

    // Валидация всех полей
    const fieldErrors: Record<string, string> = {};
    if (!isLogin) {
      const nameError = validateField('name', formData.name);
      if (nameError) fieldErrors.name = nameError;
    }
    const emailError = validateField('email', formData.email);
    if (emailError) fieldErrors.email = emailError;
    const passwordError = validateField('password', formData.password);
    if (passwordError) fieldErrors.password = passwordError;
    if (!isLogin) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      if (confirmError) fieldErrors.confirmPassword = confirmError;
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setIsLoading(false);
      onError();
      return;
    }

    try {
      if (isLogin) {
        // Вход
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Ошибка входа');
          onError();
          setIsLoading(false);
          return;
        }

        // Успешный вход
        setSuccessMessage('Вход выполнен успешно! Перенаправление...');
        onSuccess();
        setIsLoading(false);
        
        setTimeout(() => {
          router.push(searchParams.get('redirect') || '/');
          router.refresh();
        }, 500);
      } else {
        // Регистрация
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Ошибка регистрации');
          onError();
          setIsLoading(false);
          return;
        }

        // Успешная регистрация
        setSuccessMessage(data.message || 'Регистрация успешна! Войдите в аккаунт.');
        onSuccess();
        setIsLoading(false);
        
        setTimeout(() => {
          setIsLogin(true);
          setFormData((prev) => ({
            ...prev,
            name: '',
            password: '',
            confirmPassword: '',
          }));
          setTimeout(() => setSuccessMessage(null), 3000);
        }, 1000);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Произошла ошибка. Попробуйте снова.');
      onError();
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '40px 40px 20px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2
            style={{
              fontSize: '32px',
              fontWeight: '700',
              marginBottom: '8px',
              color: '#1a1a1a',
            }}
          >
            {isLogin ? 'Добро пожаловать' : 'Создать аккаунт'}
          </h2>
          <p style={{ color: '#666', fontSize: '14px' }}>
            {isLogin
              ? 'Войдите в свой аккаунт для продолжения'
              : 'Заполните форму для регистрации'}
          </p>
        </motion.div>
      </div>

      {/* Form */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  padding: '12px 16px',
                  background: '#e8f5e9',
                  border: '1px solid #4caf50',
                  borderRadius: '8px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#2e7d32',
                  fontSize: '14px',
                }}
              >
                <CheckCircle2 size={18} />
                <span>{successMessage}</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  padding: '12px 16px',
                  background: '#fee',
                  border: '1px solid #fcc',
                  borderRadius: '8px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#c33',
                  fontSize: '14px',
                }}
              >
                <AlertCircle size={18} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: '#333',
                    }}
                  >
                    Имя *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User
                      size={20}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: errors.name ? '#c33' : '#999',
                      }}
                    />
                    <input
                      type="text"
                      required={!isLogin}
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) {
                          handleBlur('name');
                        }
                      }}
                      disabled={isLoading}
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 44px',
                        border: `2px solid ${errors.name ? '#c33' : '#e0e0e0'}`,
                        borderRadius: '8px',
                        fontSize: '15px',
                        transition: 'all 0.2s',
                        background: '#fff',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = errors.name ? '#c33' : '#667eea';
                        e.target.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.name ? '#c33' : '#e0e0e0';
                        handleBlur('name');
                      }}
                      placeholder="Ваше имя"
                    />
                  </div>
                  {errors.name && (
                    <p style={{ color: '#c33', fontSize: '12px', marginTop: '4px' }}>
                      {errors.name}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#333',
                }}
              >
                Email *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: errors.email ? '#c33' : '#999',
                  }}
                />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) {
                      handleBlur('email');
                    }
                  }}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 44px',
                    border: `2px solid ${errors.email ? '#c33' : '#e0e0e0'}`,
                    borderRadius: '8px',
                    fontSize: '15px',
                    transition: 'all 0.2s',
                    background: '#fff',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = errors.email ? '#c33' : '#667eea';
                    e.target.style.outline = 'none';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.email ? '#c33' : '#e0e0e0';
                    handleBlur('email');
                  }}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p style={{ color: '#c33', fontSize: '12px', marginTop: '4px' }}>
                  {errors.email}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#333',
                }}
              >
                Пароль *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: errors.password ? '#c33' : '#999',
                  }}
                />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) {
                      handleBlur('password');
                    }
                    if (!isLogin && errors.confirmPassword && formData.confirmPassword) {
                      handleBlur('confirmPassword');
                    }
                  }}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 44px',
                    border: `2px solid ${errors.password ? '#c33' : '#e0e0e0'}`,
                    borderRadius: '8px',
                    fontSize: '15px',
                    transition: 'all 0.2s',
                    background: '#fff',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = errors.password ? '#c33' : '#667eea';
                    e.target.style.outline = 'none';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.password ? '#c33' : '#e0e0e0';
                    handleBlur('password');
                  }}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p style={{ color: '#c33', fontSize: '12px', marginTop: '4px' }}>
                  {errors.password}
                </p>
              )}
              {!isLogin && (
                <p style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
                  Минимум 8 символов, заглавная и строчная буква, цифра
                </p>
              )}
            </motion.div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: '#333',
                    }}
                  >
                    Подтвердите пароль *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={20}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: errors.confirmPassword ? '#c33' : '#999',
                      }}
                    />
                    <input
                      type="password"
                      required={!isLogin}
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData({ ...formData, confirmPassword: e.target.value });
                        if (errors.confirmPassword) {
                          handleBlur('confirmPassword');
                        }
                      }}
                      disabled={isLoading}
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 44px',
                        border: `2px solid ${errors.confirmPassword ? '#c33' : '#e0e0e0'}`,
                        borderRadius: '8px',
                        fontSize: '15px',
                        transition: 'all 0.2s',
                        background: '#fff',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = errors.confirmPassword ? '#c33' : '#667eea';
                        e.target.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.confirmPassword ? '#c33' : '#e0e0e0';
                        handleBlur('confirmPassword');
                      }}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p style={{ color: '#c33', fontSize: '12px', marginTop: '4px' }}>
                      {errors.confirmPassword}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              marginTop: '32px',
              padding: '14px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            {isLoading ? (
              <>
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite',
                  }}
                />
                {isLogin ? 'Вход...' : 'Регистрация...'}
              </>
            ) : (
              <>
                {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                {isLogin ? 'Войти' : 'Зарегистрироваться'}
              </>
            )}
          </motion.button>
        </form>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '24px 40px',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
      >
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>
          {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
        </p>
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError(null);
            setErrors({});
            setSuccessMessage(null);
            setFormData({
              name: '',
              email: formData.email, // Сохраняем email
              password: '',
              confirmPassword: '',
            });
          }}
          disabled={isLoading}
          style={{
            background: 'transparent',
            border: '2px solid #667eea',
            color: '#667eea',
            padding: '10px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = '#667eea';
              e.currentTarget.style.color = 'white';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#667eea';
          }}
        >
          {isLogin ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
