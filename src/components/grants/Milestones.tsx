import { useState } from 'react'
import { Calendar, CheckCircle, Clock, AlertCircle, TrendingUp, Flag } from 'lucide-react'
import Button from '../ui/Button'
import Loader from '../ui/Loader'
import { useToast } from '../ui/Toast'
import { useCreateMilestone, useGetMilestones } from '../../hooks/useMilestones'



const getStatusConfig = (status: string) => {
    switch (status) {
        case 'Completed':
            return {
                icon: CheckCircle,
                color: '#10b981',
                bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                label: 'Completed'
            }
        case 'Progress':
            return {
                icon: Clock,
                color: '#3b82f6',
                bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                borderColor: 'rgba(59, 130, 246, 0.3)',
                label: 'In Progress'
            }
        default:
            return {
                icon: Clock,
                color: '#6b7280',
                bg: 'linear-gradient(135deg, rgba(107, 114, 128, 0.08) 0%, rgba(107, 114, 128, 0.04) 100%)',
                borderColor: 'rgba(107, 114, 128, 0.2)',
                label: 'Pending'
            }
    }
}

const getPriorityConfig = (priority: string) => {
    switch (priority) {
        case 'High':
            return {
                color: '#ef4444',
                bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.06) 100%)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                label: 'High',
                dotColor: '#ef4444'
            }
        case 'Medium':
            return {
                color: '#f59e0b',
                bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0.06) 100%)',
                borderColor: 'rgba(245, 158, 11, 0.3)',
                label: 'Medium',
                dotColor: '#f59e0b'
            }
        default:
            return {
                color: '#6b7280',
                bg: 'linear-gradient(135deg, rgba(107, 114, 128, 0.08) 0%, rgba(107, 114, 128, 0.04) 100%)',
                borderColor: 'rgba(107, 114, 128, 0.2)',
                label: 'Low',
                dotColor: '#6b7280'
            }
    }
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

export default function Milestones({ grant }: { grant?: any }) {
    const { addToast } = useToast()
    const { data: milestones = [], isLoading: milestonesLoading } = useGetMilestones(grant?.$id || '')
    const { mutateAsync: createMilestoneMutation, isPending: isCreatingMilestone } = useCreateMilestone()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        dueDate: '',
        status: 'Progress' as 'Progress' | 'Completed',
        priority: 'Medium' as 'High' | 'Medium' | 'Low'
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!grant) return

        try {
            await createMilestoneMutation({
                grant: grant.$id,
                ...formData
            })

            addToast("Milestone created successfully", "success")
            setIsModalOpen(false)
            setFormData({
                title: '',
                dueDate: '',
                status: 'Progress',
                priority: 'Medium'
            })
        } catch (error) {
            addToast("Failed to create milestone", "error")
        } finally {
            // setIsCreatingMilestone(false) // This is handled by react-query's isPending
        }
    }

    if (!grant || milestonesLoading) return <Loader size="xl" label="Synchronizing milestones..." />

    const completedCount = milestones.filter(m => m.status === 'Completed').length
    const inProgressCount = milestones.filter(m => m.status === 'Progress').length
    const completionRate = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 'var(--space-6)'
            }}>
                <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Total Milestones</span>
                        <div style={{ padding: '6px', color: 'var(--color-primary)' }}>
                            <Flag size={18} />
                        </div>
                    </div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>{milestones.length}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-gray-400)', marginTop: 'var(--space-2)' }}>
                        Across project timeline
                    </div>
                </div>

                <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Completion Rate</span>
                        <div style={{ padding: '6px', color: '#10b981' }}>
                            <TrendingUp size={18} />
                        </div>
                    </div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>{completionRate}%</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'var(--space-2)', color: 'var(--color-success)', fontSize: '11px', fontWeight: 600 }}>
                        <CheckCircle size={12} />
                        <span>{completedCount} Completed</span>
                    </div>
                </div>

                <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>In Progress</span>
                        <div style={{ padding: '6px', color: '#3b82f6' }}>
                            <Clock size={18} />
                        </div>
                    </div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>{inProgressCount}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-gray-400)', marginTop: 'var(--space-2)' }}>
                        Currently active
                    </div>
                </div>

                <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>High Priority</span>
                        <div style={{ padding: '6px', color: '#ef4444' }}>
                            <AlertCircle size={18} />
                        </div>
                    </div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>
                        {milestones.filter(m => m.priority === 'High' && m.status !== 'Completed').length}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'var(--space-2)', color: '#ef4444', fontSize: '11px', fontWeight: 600 }}>
                        <span>Require attention</span>
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="card-neumorphic" style={{ padding: '0' }}>
                {/* Table Header */}
                <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
                            Milestone Timeline
                        </h2>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>
                            Track progress and manage project milestones
                        </p>
                    </div>
                    <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>+ Add Milestone</Button>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'var(--color-gray-25)' }}>
                                {['Milestone Title', 'Due Date', 'Status', 'Priority', ''].map((h, i) => (
                                    <th key={i} style={{ padding: 'var(--space-4) var(--space-6)', fontSize: '11px', fontWeight: 700, color: 'var(--color-gray-400)', textTransform: 'uppercase' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {milestones.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-gray-500)' }}>
                                        No milestones found. Add one to get started.
                                    </td>
                                </tr>
                            ) : milestones.map((milestone) => {
                                const statusConfig = getStatusConfig(milestone.status)
                                const priorityConfig = getPriorityConfig(milestone.priority)
                                const StatusIcon = statusConfig.icon

                                return (
                                    <tr
                                        key={milestone.$id}
                                        style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'linear-gradient(to right, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)'
                                            e.currentTarget.style.transform = 'translateX(2px)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent'
                                            e.currentTarget.style.transform = 'translateX(0)'
                                        }}
                                    >
                                        <td style={{ padding: 'var(--space-4) var(--space-6)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                                            {milestone.title}
                                        </td>
                                        <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-2)'
                                            }}>
                                                <Calendar size={16} style={{ color: 'var(--color-gray-400)' }} />
                                                <span style={{ fontWeight: 500 }}>{formatDate(milestone.dueDate)}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: 'var(--space-4) var(--space-6)', fontSize: 'var(--text-sm)', fontWeight: 700 }}>
                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-2)',
                                                padding: 'var(--space-2) var(--space-4)',
                                                borderRadius: 'var(--radius-full)',
                                                background: statusConfig.bg,
                                                border: `1px solid ${statusConfig.borderColor}`,
                                                color: statusConfig.color,
                                                fontSize: 'var(--text-xs)',
                                                fontWeight: 700,
                                                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                                            }}>
                                                <StatusIcon size={14} strokeWidth={2.5} />
                                                {statusConfig.label}
                                            </div>
                                        </td>
                                        <td style={{ padding: 'var(--space-4) var(--space-6)', fontSize: 'var(--text-sm)', fontWeight: 700 }}>
                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-2)',
                                                padding: 'var(--space-2) var(--space-4)',
                                                borderRadius: 'var(--radius-full)',
                                                background: priorityConfig.bg,
                                                border: `1px solid ${priorityConfig.borderColor}`,
                                                color: priorityConfig.color,
                                                fontSize: 'var(--text-xs)',
                                                fontWeight: 700,
                                                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                                            }}>
                                                <div style={{
                                                    width: '6px',
                                                    height: '6px',
                                                    borderRadius: '50%',
                                                    background: priorityConfig.dotColor
                                                }} />
                                                {priorityConfig.label}
                                            </div>
                                        </td>
                                        <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                                            {/* Actions? */}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setIsModalOpen(false)
                        }
                    }}
                >
                    <div className="card-neumorphic" style={{
                        background: 'white',
                        padding: 0,
                        borderRadius: 'var(--radius-lg)',
                        width: '90%',
                        maxWidth: '600px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            padding: 'var(--space-6)',
                            borderBottom: '1px solid rgba(0,0,0,0.05)',
                            background: 'white',
                            color: 'black',
                            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
                        }}>
                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, margin: 0 }}>
                                Add Milestone
                            </h2>
                            <p style={{ fontSize: 'var(--text-xs)', opacity: 0.9, margin: '4px 0 0 0' }}>
                                Create a new project milestone
                            </p>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit}>
                            <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                {/* Title Field */}
                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 600,
                                        marginBottom: 'var(--space-2)',
                                        color: 'var(--color-gray-700)'
                                    }}>
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g., Phase 1 Implementation"
                                        style={{
                                            width: '100%',
                                            padding: 'var(--space-3)',
                                            border: '1px solid var(--color-gray-500)',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: 'var(--text-sm)',
                                            outline: 'none',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = 'var(--color-primary)'
                                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = 'var(--color-gray-200)'
                                            e.target.style.boxShadow = 'none'
                                        }}
                                    />
                                </div>

                                {/* Due Date and Status */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 600,
                                            marginBottom: 'var(--space-2)',
                                            color: 'var(--color-gray-700)'
                                        }}>
                                            Due Date *
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.dueDate}
                                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: 'var(--space-3)',
                                                border: '1px solid var(--color-gray-500)',
                                                borderRadius: 'var(--radius-md)',
                                                fontSize: 'var(--text-sm)',
                                                outline: 'none'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = 'var(--color-primary)'
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = 'var(--color-gray-200)'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 600,
                                            marginBottom: 'var(--space-2)',
                                            color: 'var(--color-gray-700)'
                                        }}>
                                            Status *
                                        </label>
                                        <select
                                            required
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                            style={{
                                                width: '100%',
                                                padding: 'var(--space-3)',
                                                border: '1px solid var(--color-gray-500)',
                                                borderRadius: 'var(--radius-md)',
                                                fontSize: 'var(--text-sm)',
                                                outline: 'none',
                                                background: 'white',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Priority */}
                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 600,
                                        marginBottom: 'var(--space-2)',
                                        color: 'var(--color-gray-700)'
                                    }}>
                                        Priority *
                                    </label>
                                    <select
                                        required
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                                        style={{
                                            width: '100%',
                                            padding: 'var(--space-3)',
                                            border: '1px solid var(--color-gray-500)',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: 'var(--text-sm)',
                                            outline: 'none',
                                            background: 'white',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div style={{
                                padding: 'var(--space-6)',
                                borderTop: '1px solid rgba(0,0,0,0.05)',
                                display: 'flex',
                                gap: 'var(--space-3)',
                                justifyContent: 'flex-end',
                                background: 'var(--color-gray-25)'
                            }}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsModalOpen(false)}
                                    type="button"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="sm"
                                >
                                    {isCreatingMilestone ? <Loader size="sm" variant="white" /> : 'Create Milestone'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
