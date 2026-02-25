import React from 'react'
import logoImg from '../../assets/images/logo.png'

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
            <img
                src={logoImg}
                alt="Granto Logo"
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    objectFit: 'contain',
                    flexShrink: 0
                }}
            />
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
