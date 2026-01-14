'use client';

import type { ReactNode } from 'react';
import React from 'react';

export interface ModalProps {
    title: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    footer?: ReactNode;
    children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
    title,
    isOpen,
    onClose,
    footer,
    children,
}) => {
    if (!isOpen) return null;

    const stopPropagation: React.MouseEventHandler<HTMLDivElement> = (event) => {
        event.stopPropagation();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal fade-in" onClick={stopPropagation}>
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                    <button onClick={onClose} style={{ padding: '4px' }}>
                        ✕
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    {footer}
                </div>
            </div>
        </div>
    );
};

