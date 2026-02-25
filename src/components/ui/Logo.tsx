import React from 'react'

interface LogoProps {
    size?: number;
    className?: string;
    style?: React.CSSProperties;
    showText?: boolean;
    textColor?: string;
}

export default function Logo({
    size = 32,
    className = '',
    style = {},
    showText = false,
    textColor = 'var(--color-gray-900)'
}: LogoProps) {
    return (
        <div
            className={`logo-container ${className}`}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                ...style
            }}
        >
            <div style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: 'var(--color-primary)',
                borderRadius: 'calc(var(--radius-lg) * ' + (size / 32) + ')',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: `${size * 0.6}px`,
                flexShrink: 0
            }}>
                G
            </div>
            {showText && (
                <span style={{
                    fontSize: `calc(var(--text-xl) * ${size / 32})`,
                    fontWeight: 'var(--font-semibold)',
                    color: textColor
                }}>
                    Granto
                </span>
            )}
        </div>
    )
}
