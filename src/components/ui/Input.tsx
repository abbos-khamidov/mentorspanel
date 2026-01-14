'use client';

import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';
import React from 'react';

interface BaseFieldProps {
    label?: ReactNode;
    error?: ReactNode;
    hint?: ReactNode;
}

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement>, BaseFieldProps {}

export const TextInput: React.FC<TextInputProps> = ({ label, error, hint, ...props }) => {
    return (
        <div className="form-group">
            {label && (
                <label className="form-label">
                    {label}
                </label>
            )}
            <input className="form-input" {...props} />
            {hint && !error && (
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {hint}
                </p>
            )}
            {error && (
                <p style={{ fontSize: '12px', color: 'var(--error)', marginTop: '4px' }}>
                    {error}
                </p>
            )}
        </div>
    );
};

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseFieldProps {}

export const TextArea: React.FC<TextAreaProps> = ({ label, error, hint, ...props }) => {
    return (
        <div className="form-group">
            {label && (
                <label className="form-label">
                    {label}
                </label>
            )}
            <textarea className="form-textarea" {...props} />
            {hint && !error && (
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {hint}
                </p>
            )}
            {error && (
                <p style={{ fontSize: '12px', color: 'var(--error)', marginTop: '4px' }}>
                    {error}
                </p>
            )}
        </div>
    );
};

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, BaseFieldProps {}

export const Select: React.FC<SelectProps> = ({ label, error, hint, children, ...props }) => {
    return (
        <div className="form-group">
            {label && (
                <label className="form-label">
                    {label}
                </label>
            )}
            <select className="form-select" {...props}>
                {children}
            </select>
            {hint && !error && (
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {hint}
                </p>
            )}
            {error && (
                <p style={{ fontSize: '12px', color: 'var(--error)', marginTop: '4px' }}>
                    {error}
                </p>
            )}
        </div>
    );
};

