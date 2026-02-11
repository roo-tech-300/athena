import React from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import Button from '../ui/Button'

import type { Grant } from '../../types/portal'

interface GrantCardProps {
    grant: Grant
    onDetails: (grant: Grant) => void
    onWorkspace: (id: string) => void
    onEdit?: (grant: Grant) => void
    onDelete?: (grant: Grant) => void
}

const GrantCard: React.FC<GrantCardProps> = ({ grant, onDetails, onWorkspace, onEdit, onDelete }) => {
    const isPI = grant.role === 'Principal Investigator'

    return (
        <div className="card-neumorphic" style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '280px',
            position: 'relative'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '4px 8px',
                    background: 'var(--color-gray-100)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-gray-500)',
                    textTransform: 'uppercase'
                }}>{grant.type}</span>

                {isPI && (
                    <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                        <button onClick={() => onEdit?.(grant)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', color: 'var(--color-gray-400)' }} title="Edit Grant">
                            <Edit2 size={14} />
                        </button>
                        <button onClick={() => onDelete?.(grant)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', color: 'var(--color-gray-400)' }} title="Delete Grant">
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}
            </div>

            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)', flex: 1, fontWeight: 700 }}>{grant.title}</h3>

            <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>Status</span>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: grant.status === 'Accepted' ? 'var(--color-success)' : 'var(--color-warning)' }}>{grant.status}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>Role</span>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{grant.role}</span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <Button variant="outline" size="sm" style={{ flex: 1 }} onClick={() => onDetails(grant)}>Details</Button>
                <Button variant="primary" size="sm" style={{ flex: 1 }} onClick={() => onWorkspace(grant.id)}>Open Workspace</Button>
            </div>
        </div>
    )
}

export default GrantCard
