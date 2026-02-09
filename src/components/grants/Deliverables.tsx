import React, { useState } from 'react'
import { CheckCircle, Clock, Package, TrendingUp, MoreHorizontal, Users, ChevronDown } from 'lucide-react'
import Button from '../ui/Button'
import Loader from '../ui/Loader'
import { useToast } from '../ui/Toast'
import { useCreateDeliverable, useGetDeliverables, useCreateDeliverableTask } from '../../hooks/useDeliverables'
import { useGrantMembers } from '../../hooks/useGrants'

interface DeliverableType {
    $id: string
    title: string
    dueDate: string
    status: 'Progress' | 'Completed'
    tasks?: TaskType[]
}

interface TaskType {
    $id: string
    title: string
    description?: string
    status: 'Progress' | 'Completed'
    dueDate: string
    assignedMembers: { memberId: string }[]
}

interface GrantMember {
    $id: string;
    user: {
        name: string;
        email: string;
    };
}

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



const formatDate = (dateString: string) => {
    if (!dateString) return 'No date'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

export default function Deliverables({ grant, myMembership }: { grant?: any, myMembership?: any }) {
    const roles = myMembership?.role || [];
    const isPI = roles.includes('Principal Investigator');
    const isResearcher = roles.includes('Researcher');
    const isFO = roles.includes('Finance Officer');
    const isRev = roles.includes('Reviewer');
    const myMemberId = myMembership?.$id;

    const { addToast } = useToast()
    const { data: deliverables = [], isLoading: deliverablesLoading } = useGetDeliverables(grant?.$id || '')
    const { data: grantMembers = [] as GrantMember[] } = useGrantMembers(grant?.$id || '')
    const { mutateAsync: createDeliverableMutation } = useCreateDeliverable()
    const { mutateAsync: createDeliverableTaskMutation } = useCreateDeliverableTask()

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedDeliverable, setSelectedDeliverable] = useState<DeliverableType | null>(null)
    const [expandedDeliverables, setExpandedDeliverables] = useState<string[]>([])

    const [deliverableForm, setDeliverableForm] = useState({
        title: '',
        dueDate: '',
        status: 'Progress' as 'Progress' | 'Completed',
    })

    const [taskForm, setTaskForm] = useState({
        title: '',
        dueDate: '',
        assignedMembers: [] as string[],
        description: '',
    })

    const handleAddDeliverable = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setIsSubmitting(true)
            await createDeliverableMutation({
                grant: grant.$id,
                ...deliverableForm
            })
            addToast("Deliverable created", "success")
            setIsAddModalOpen(false)
            setDeliverableForm({
                title: '',
                dueDate: '',
                status: 'Progress',
            })
        } catch (error) {
            addToast("Failed to create deliverable", "error")
        } finally {
            setIsSubmitting(false)
        }
    }

    const toggleExpand = (id: string) => {
        setExpandedDeliverables(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedDeliverable || !grant) return
        try {
            setIsSubmitting(true)
            await createDeliverableTaskMutation({
                deliverable: selectedDeliverable.$id,
                title: taskForm.title,
                dueDate: taskForm.dueDate,
                status: 'Progress',
                assignedMembers: taskForm.assignedMembers,
                description: taskForm.description,
                grantId: grant.$id
            })
            addToast("Task added successfully", "success")
            setIsTaskModalOpen(false)
            setTaskForm({
                title: '',
                dueDate: '',
                assignedMembers: [],
                description: ''
            })
        } catch (error) {
            addToast("Failed to add task", "error")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!grant || deliverablesLoading) return <Loader size="xl" label="Accessing deliverables..." />

    const filteredDeliverables = (!isPI && !isRev)
        ? deliverables.filter(d => d.tasks?.some((t: TaskType) => t.assignedMembers?.some((m: any) => (m.$id === myMemberId || m.$id === myMemberId))))
        : deliverables;

    const submittedCount = filteredDeliverables.filter(d => d.status === 'Completed').length
    const completionRate = filteredDeliverables.length > 0 ? Math.round((submittedCount / filteredDeliverables.length) * 100) : 0

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)' }}>
                <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Total Deliverables</span>
                        <Package size={18} color="var(--color-primary)" />
                    </div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>{deliverables.length}</div>
                </div>
                <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Completion Rate</span>
                        <TrendingUp size={18} color="#10b981" />
                    </div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>{completionRate}%</div>
                </div>
                <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Team Size</span>
                        <Users size={18} color="#3b82f6" />
                    </div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>{grantMembers.length}</div>
                </div>
                <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Pending</span>
                        <Clock size={18} color="#8b5cf6" />
                    </div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>{deliverables.filter(d => d.status === 'Progress').length}</div>
                </div>
            </div>

            {/* Main Table */}
            <div className="card-neumorphic" style={{ padding: '0' }}>
                <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Deliverables Schedule</h2>
                    {isPI && (
                        <Button variant="primary" size="sm" onClick={() => setIsAddModalOpen(true)}>+ Add Deliverable</Button>
                    )}
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'var(--color-gray-25)' }}>
                                {['Title', 'Due Date', 'Status', 'Tasks', ''].map((h, i) => (
                                    <th key={i} style={{ padding: 'var(--space-4) var(--space-6)', fontSize: '11px', fontWeight: 700, color: 'var(--color-gray-400)', textTransform: 'uppercase' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDeliverables.map((d: DeliverableType) => (
                                <React.Fragment key={d.$id}>
                                    <tr
                                        style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', cursor: 'pointer' }}
                                        onClick={() => toggleExpand(d.$id)}
                                    >
                                        <td style={{ padding: 'var(--space-4) var(--space-6)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <ChevronDown size={14} style={{
                                                    transform: expandedDeliverables.includes(d.$id) ? 'rotate(180deg)' : 'none',
                                                    transition: 'transform 0.2s',
                                                    color: 'var(--color-gray-400)'
                                                }} />
                                                {d.title}
                                            </div>
                                        </td>
                                        <td style={{ padding: 'var(--space-4) var(--space-6)', fontSize: '11px' }}>{formatDate(d.dueDate)}</td>
                                        <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusConfig(d.status).color }} />
                                                <span style={{ fontSize: '11px', fontWeight: 600 }}>{d.status}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>
                                                    {d.tasks?.length || 0} Task{(d.tasks?.length !== 1) ? 's' : ''}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'right' }}>
                                            {isPI && <MoreHorizontal size={18} color="var(--color-gray-300)" cursor="pointer" />}
                                        </td>
                                    </tr>
                                    {expandedDeliverables.includes(d.$id) && (
                                        <tr>
                                            <td colSpan={5} style={{ padding: 'var(--space-4) var(--space-6)', background: 'var(--color-gray-25)' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-gray-400)', textTransform: 'uppercase' }}>Sub-tasks</h4>
                                                        {isPI && (
                                                            <Button variant="ghost" size="sm" onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedDeliverable(d);
                                                                setIsTaskModalOpen(true);
                                                            }}>+ Add Task</Button>
                                                        )}
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                        {(!d.tasks || d.tasks.length === 0) ? (
                                                            <div style={{ fontSize: '11px', color: 'var(--color-gray-400)', textAlign: 'center', padding: '16px' }}>No tasks assigned to this deliverable</div>
                                                        ) : (
                                                            d.tasks.map((task: TaskType) => (
                                                                <div key={task.$id} className="card-neumorphic" style={{ background: 'white', padding: '12px', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: '16px' }}>
                                                                    <div>
                                                                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{task.title}</div>
                                                                        <div style={{ fontSize: '10px', color: 'var(--color-gray-400)' }}>{task.description}</div>
                                                                    </div>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                                                            {task.assignedMembers?.slice(0, 3).map((assignment: any, i: number) => {
                                                                                const memberId = typeof assignment === 'string' ? assignment : assignment.memberId;
                                                                                const member = grantMembers.find((m: GrantMember) => m.$id === memberId);
                                                                                return (
                                                                                    <div key={memberId} title={member?.user?.name || 'Unknown'} style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-primary)', border: '2px solid white', marginLeft: i === 0 ? 0 : '-6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '9px', fontWeight: 700 }}>
                                                                                        {member?.user?.name?.charAt(0) || '?'}
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                        <div style={{ fontSize: '10px', fontWeight: 500 }}>{formatDate(task.dueDate)}</div>
                                                                    </div>
                                                                    <div style={{ fontSize: '10px', fontWeight: 700, color: getStatusConfig(task.status).color }}>{task.status.toUpperCase()}</div>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>



            {/* Add Deliverable Modal */}
            {isAddModalOpen && (
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
                    zIndex: 1100,
                    backdropFilter: 'blur(4px)'
                }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setIsAddModalOpen(false)
                        }
                    }}
                >
                    <div className="card-neumorphic" style={{
                        background: 'white',
                        padding: 0,
                        borderRadius: 'var(--radius-lg)',
                        width: '90%',
                        maxWidth: '550px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                    }}>
                        <div style={{
                            padding: 'var(--space-6)',
                            borderBottom: '1px solid rgba(0,0,0,0.05)',
                        }}>
                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, margin: 0 }}>
                                Add New Deliverable
                            </h2>
                            <p style={{ fontSize: 'var(--text-xs)', opacity: 0.6, margin: '4px 0 0 0' }}>
                                Define a new project output or milestone
                            </p>
                        </div>
                        <form onSubmit={handleAddDeliverable}>
                            <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: '8px' }}>Deliverable Title *</label>
                                    <input
                                        required
                                        className="card-neumorphic"
                                        style={{ width: '100%', padding: 'var(--space-3)', fontSize: 'var(--text-sm)', border: '1px solid var(--color-gray-200)', background: 'white', borderRadius: 'var(--radius-md)', outline: 'none' }}
                                        value={deliverableForm.title}
                                        onChange={e => setDeliverableForm({ ...deliverableForm, title: e.target.value })}
                                        placeholder="e.g. Quarterly Review Report"
                                        onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)' }}
                                        onBlur={(e) => { e.target.style.borderColor = 'var(--color-gray-200)'; e.target.style.boxShadow = 'none' }}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: '8px' }}>Type *</label>
                                        <select
                                            className="card-neumorphic"
                                            style={{ width: '100%', padding: 'var(--space-3)', fontSize: 'var(--text-sm)', border: '1px solid var(--color-gray-200)', background: 'white', borderRadius: 'var(--radius-md)', outline: 'none', cursor: 'pointer' }}
                                            value={deliverableForm.status}
                                            onChange={e => setDeliverableForm({ ...deliverableForm, status: e.target.value as any })}
                                        >
                                            <option value="Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: '8px' }}>Due Date *</label>
                                        <input
                                            required
                                            type="date"
                                            className="card-neumorphic"
                                            style={{ width: '100%', padding: 'var(--space-3)', fontSize: 'var(--text-sm)', border: '1px solid var(--color-gray-200)', background: 'white', borderRadius: 'var(--radius-md)', outline: 'none' }}
                                            value={deliverableForm.dueDate}
                                            onChange={e => setDeliverableForm({ ...deliverableForm, dueDate: e.target.value })}
                                            onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)' }}
                                            onBlur={(e) => { e.target.style.borderColor = 'var(--color-gray-200)' }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div style={{
                                padding: 'var(--space-6)',
                                borderTop: '1px solid rgba(0,0,0,0.05)',
                                display: 'flex',
                                gap: 'var(--space-3)',
                                justifyContent: 'flex-end',
                                background: 'var(--color-gray-25)',
                                borderRadius: '0 0 var(--radius-lg) var(--radius-lg)'
                            }}>
                                <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                                <Button variant="primary" size="sm" type="submit">{isSubmitting ? <Loader size="sm" variant="white" /> : 'Create Deliverable'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Task Modal */}
            {isTaskModalOpen && (
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
                    zIndex: 1200,
                    backdropFilter: 'blur(4px)'
                }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setIsTaskModalOpen(false)
                        }
                    }}
                >
                    <div className="card-neumorphic" style={{
                        background: 'white',
                        padding: 0,
                        borderRadius: 'var(--radius-lg)',
                        width: '90%',
                        maxWidth: '650px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                    }}>
                        <div style={{
                            padding: 'var(--space-6)',
                            borderBottom: '1px solid rgba(0,0,0,0.05)',
                        }}>
                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, margin: 0 }}>
                                New Task for {selectedDeliverable?.title}
                            </h2>
                            <p style={{ fontSize: 'var(--text-xs)', opacity: 0.6, margin: '4px 0 0 0' }}>
                                Assign a specific action item to team members
                            </p>
                        </div>
                        <form onSubmit={handleAddTask}>
                            <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: '8px' }}>Task Title *</label>
                                    <input
                                        required
                                        className="card-neumorphic"
                                        style={{ width: '100%', padding: 'var(--space-3)', fontSize: 'var(--text-sm)', border: '1px solid var(--color-gray-200)', background: 'white', borderRadius: 'var(--radius-md)', outline: 'none' }}
                                        value={taskForm.title}
                                        onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                                        placeholder="e.g. Initial Data Analysis"
                                        onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)' }}
                                        onBlur={(e) => { e.target.style.borderColor = 'var(--color-gray-200)'; e.target.style.boxShadow = 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: '8px' }}>Assign Team Members</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '12px', background: 'var(--color-gray-25)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0,0,0,0.03)' }}>
                                        {grantMembers.map(m => (
                                            <div key={m.$id} onClick={() => {
                                                const current = taskForm.assignedMembers;
                                                if (current.includes(m.$id)) setTaskForm({ ...taskForm, assignedMembers: current.filter(id => id !== m.$id) })
                                                else setTaskForm({ ...taskForm, assignedMembers: [...current, m.$id] })
                                            }} style={{
                                                padding: '6px 12px',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: '11px',
                                                cursor: 'pointer',
                                                background: taskForm.assignedMembers.includes(m.$id) ? 'var(--color-primary)' : 'white',
                                                color: taskForm.assignedMembers.includes(m.$id) ? 'white' : 'var(--color-gray-700)',
                                                border: '1px solid var(--color-gray-100)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                transition: 'all 0.2s',
                                                boxShadow: taskForm.assignedMembers.includes(m.$id) ? '0 2px 4px rgba(102, 126, 234, 0.2)' : 'none'
                                            }}>
                                                <div style={{
                                                    width: '18px',
                                                    height: '18px',
                                                    borderRadius: '50%',
                                                    background: taskForm.assignedMembers.includes(m.$id) ? 'white' : 'var(--color-primary)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '9px',
                                                    fontWeight: 700,
                                                    color: taskForm.assignedMembers.includes(m.$id) ? 'var(--color-primary)' : 'white'
                                                }}>
                                                    {m.user.name.charAt(0)}
                                                </div>
                                                {m.user.name}
                                            </div>
                                        ))}
                                    </div>
                                    <p style={{ fontSize: '10px', color: 'var(--color-gray-400)', marginTop: '6px' }}>
                                        Click on members to toggle assignment. {taskForm.assignedMembers.length} member(s) selected.
                                    </p>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: '8px' }}>Due Date *</label>
                                    <input
                                        required
                                        type="date"
                                        className="card-neumorphic"
                                        style={{ width: '100%', padding: 'var(--space-3)', fontSize: 'var(--text-sm)', border: '1px solid var(--color-gray-200)', background: 'white', borderRadius: 'var(--radius-md)', outline: 'none' }}
                                        value={taskForm.dueDate}
                                        onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                                        onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)' }}
                                        onBlur={(e) => { e.target.style.borderColor = 'var(--color-gray-200)' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: '8px' }}>Description</label>
                                    <textarea
                                        className="card-neumorphic"
                                        style={{ width: '100%', padding: 'var(--space-3)', fontSize: 'var(--text-sm)', border: '1px solid var(--color-gray-200)', background: 'white', borderRadius: 'var(--radius-md)', outline: 'none', minHeight: '100px', resize: 'vertical' }}
                                        value={taskForm.description}
                                        onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                                        placeholder="Describe the specific objectives of this task..."
                                        onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)' }}
                                        onBlur={(e) => { e.target.style.borderColor = 'var(--color-gray-200)'; e.target.style.boxShadow = 'none' }}
                                    />
                                </div>
                            </div>
                            <div style={{
                                padding: 'var(--space-6)',
                                borderTop: '1px solid rgba(0,0,0,0.05)',
                                display: 'flex',
                                gap: 'var(--space-3)',
                                justifyContent: 'flex-end',
                                background: 'var(--color-gray-25)',
                                borderRadius: '0 0 var(--radius-lg) var(--radius-lg)'
                            }}>
                                <Button variant="ghost" size="sm" type="button" onClick={() => setIsTaskModalOpen(false)}>Cancel</Button>
                                <Button variant="primary" size="sm" type="submit">{isSubmitting ? <Loader size="sm" variant="white" /> : 'Add Task to Schedule'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
