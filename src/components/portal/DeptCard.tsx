import React from 'react'
import { Building2 } from 'lucide-react'
import Button from '../ui/Button'
import { useNavigate } from 'react-router-dom'

interface DeptCardProps {
    dept: any
    grantCount: number
    totalFunding: number
}

const DeptCard: React.FC<DeptCardProps> = ({ dept, grantCount, totalFunding }) => {
    const navigate = useNavigate()
    const isAdmin = dept.userRole === 'Admin'

    return (
        <div className="card-neumorphic" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--color-gray-50)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary)'
                }}>
                    <Building2 size={24} />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{dept.name}</h3>
                        {isAdmin && (
                            <span style={{
                                fontSize: '9px',
                                fontWeight: 800,
                                color: 'var(--color-success)',
                                background: 'var(--color-success-light)',
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-full)',
                                textTransform: 'uppercase'
                            }}>Admin</span>
                        )}
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>Role: {dept.userRole}</p>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-4)',
                background: 'var(--color-gray-50)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 'var(--space-6)'
            }}>
                <div>
                    <div style={{ fontSize: '10px', color: 'var(--color-gray-400)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>Active Grants</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{grantCount}</div>
                </div>
                <div>
                    <div style={{ fontSize: '10px', color: 'var(--color-gray-400)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>Total Funding</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>₦{totalFunding.toLocaleString()}</div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <Button variant="primary" size="sm" style={{ flex: 1, padding: '12px 0' }} onClick={() => navigate(`/department/${dept.$id}`)}>Research Group Info</Button>
            </div>
        </div>
    )
}

export default DeptCard
