'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import React from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    title?: string;
    headerRight?: ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, headerRight, children, style, ...props }) => {
    return (
        <div
            className="card"
            style={style}
            {...props}
        >
            {(title || headerRight) && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                    }}
                >
                    {title && (
                        <h2 style={{ fontSize: '20px', fontWeight: 600 }}>
                            {title}
                        </h2>
                    )}
                    {headerRight}
                </div>
            )}
            {children}
        </div>
    );
};

