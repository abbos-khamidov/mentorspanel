'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

const variantClassName: Record<ButtonVariant, string> = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    success: 'btn btn-success',
    danger: 'btn btn-danger',
    ghost: 'btn btn-ghost',
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
    sm: { padding: '6px 12px', fontSize: '13px' },
    md: { padding: '10px 20px', fontSize: '14px' },
    lg: { padding: '12px 24px', fontSize: '15px' },
};

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    fullWidth,
    leftIcon,
    rightIcon,
    children,
    style,
    ...props
}) => {
    const baseClassName = variantClassName[variant];
    const sizeStyle = sizeStyles[size];

    return (
        <button
            className={baseClassName}
            style={{
                width: fullWidth ? '100%' : undefined,
                ...sizeStyle,
                ...style,
            }}
            {...props}
        >
            {leftIcon}
            {children}
            {rightIcon}
        </button>
    );
};

