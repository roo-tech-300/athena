import React from 'react'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
    label: string
    value: string | number
    icon: LucideIcon
    color: string
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color }) => {
    return (
        <div className="card-neumorphic glass" style={{
            padding: 'var(--space-6)',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <Icon size={80} style={{
                position: 'absolute',
                right: '-10px',
                bottom: '-10px',
                opacity: 0.1,
                transform: 'rotate(-10deg)',
                color: color
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--color-gray-500)'
                }}>{label}</div>
                <div style={{
                    padding: 'var(--space-2)',
                    background: 'var(--color-white)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: color
                }}>
                    <Icon size={18} />
                </div>
            </div>
            <div style={{ marginTop: 'var(--space-1)' }}>
                <div style={{
                    fontSize: 'var(--text-3xl)',
                    fontWeight: 700,
                    lineHeight: 1,
                    color: 'var(--color-gray-900)'
                }}>{value}</div>
            </div>
        </div>
    )
}

export default StatCard
