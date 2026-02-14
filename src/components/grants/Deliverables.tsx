import React, { useState } from 'react'
import {
    CheckCircle,
    Clock,
    Package,
    TrendingUp,
    MoreHorizontal,
    Users,
    ChevronDown,
    Square,
    CheckSquare,
    ClipboardList,
    Receipt,
    AlertCircle,
    XCircle
} from 'lucide-react'
import Button from '../ui/Button'
import Loader from '../ui/Loader'
import { useToast } from '../ui/Toast'
import { useCreateDeliverable, useGetDeliverables, useCreateDeliverableTask, useUpdateDeliverableTask, useUpdateDeliverable } from '../../hooks/useDeliverables'
import { useGrantMembers } from '../../hooks/useGrants'
import { useGetBudgetItems, useGetTransactions } from '../../hooks/useBudget'
import { createActivity } from '../../lib/apis/grants'
import CreateTransactionModal from '../budget/CreateTransactionModal'
import { useQueryClient } from '@tanstack/react-query'
import Modal from '../ui/Modal'

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
    status: 'Progress' | 'Completed' | 'PendingApproval'
    dueDate: string
    assignedMembers: { $id: string, user: { name: string } }[]
    action?: 'Transaction' | 'Other'
    actionItem?: string
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
                color: 'var(--color-success)',
                bg: 'rgba(16, 185, 129, 0.1)',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                label: 'Completed'
            }
        case 'Progress':
            return {
                icon: Clock,
                color: 'var(--color-primary)',
                bg: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 0.3)',
                label: 'In Progress'
            }
        case 'PendingApproval':
            return {
                icon: Clock,
                color: 'var(--color-warning)',
                bg: 'rgba(245, 158, 11, 0.1)',
                borderColor: 'rgba(245, 158, 11, 0.3)',
                label: 'Pending Approval'
            }
        default:
            return {
                icon: Clock,
                color: 'var(--color-gray-500)',
                bg: 'var(--color-gray-100)',
                borderColor: 'var(--color-gray-200)',
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
    const isRev = roles.includes('Reviewer');
    const myMemberId = myMembership?.$id;


    const { addToast } = useToast()
    const { data: deliverables = [], isLoading: deliverablesLoading } = useGetDeliverables(grant?.$id || '')
    const { data: grantMembers = [] as GrantMember[] } = useGrantMembers(grant?.$id || '')
    const { data: budgetItems = [] } = useGetBudgetItems(grant?.$id || '')
    const { data: transactions = [] } = useGetTransactions(grant?.$id || '')
    const { mutateAsync: createDeliverableMutation } = useCreateDeliverable()
    const { mutateAsync: createDeliverableTaskMutation } = useCreateDeliverableTask()
    const { mutateAsync: updateDeliverableTaskMutation } = useUpdateDeliverableTask()
    const { mutateAsync: updateDeliverableMutation } = useUpdateDeliverable()

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
    const [selectedDeliverable, setSelectedDeliverable] = useState<DeliverableType | null>(null)
    const [expandedDeliverables, setExpandedDeliverables] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [confirmingTask, setConfirmingTask] = useState<TaskType | null>(null)
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState<TaskType | null>(null)

    const [deliverableForm, setDeliverableForm] = useState({
        title: '',
        dueDate: '',
        status: 'Progress' as 'Progress' | 'Completed'
    })

    const [taskForm, setTaskForm] = useState({
        title: '',
        dueDate: '',
        status: 'Progress' as 'Progress' | 'Completed' | 'PendingApproval',
        assignedMembers: [] as string[],
        description: '',
        action: 'Other' as 'Transaction' | 'Other',
    })

    const handleAddDeliverable = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await createDeliverableMutation({
                grant: grant.$id,
                ...deliverableForm
            })
            // Optimistic update handles UI feedback
            setIsAddModalOpen(false)
            setDeliverableForm({
                title: '',
                dueDate: '',
                status: 'Progress',
            })
        } catch (error) {
            addToast("Failed to create deliverable. Please try again.", "error")
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

        if (taskForm.assignedMembers.length === 0) {
            addToast("Please select at least one team member for this task", "warning")
            return
        }

        setIsSubmitting(true)
        try {
            await createDeliverableTaskMutation({
                deliverable: selectedDeliverable.$id,
                title: taskForm.title,
                dueDate: taskForm.dueDate,
                status: 'Progress',
                assignedMembers: taskForm.assignedMembers,
                description: taskForm.description,
                action: taskForm.action,
                grantId: grant.$id
            })
            // Optimistic update handles UI feedback
            setIsTaskModalOpen(false)
            setTaskForm({
                title: '',
                dueDate: '',
                status: 'Progress',
                assignedMembers: [],
                description: '',
                action: 'Other'
            })
        } catch (error) {
            addToast("Failed to add task. Please try again.", "error")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleTaskCheckboxClick = async (task: TaskType, e: React.MouseEvent) => {
        e.stopPropagation()

        // Only allow assigned members to check the box
        const isAssigned = task.assignedMembers.some(m => m.$id === myMemberId)
        if (!isAssigned) {
            addToast("Only assigned members can complete this task", "warning")
            return
        }

        // If already completed, don't allow unchecking
        if (task.status === 'Completed') {
            addToast("This task is already completed", "info")
            return
        }

        // If it's a transaction task, open the transaction modal
        if (task.action === 'Transaction') {
            setSelectedTask(task)
            setIsTransactionModalOpen(true)
        } else {
            setConfirmingTask(task)
        }
    }

    const confirmStandardTaskCompletion = async () => {
        if (!confirmingTask || !grant) return

        setIsSubmitting(true)
        try {
            await updateDeliverableTaskMutation({
                taskId: confirmingTask.$id,
                data: { status: 'PendingApproval' },
                grantId: grant.$id
            })

            // Create activity notification for PI
            await createActivity(
                grant.$id,
                `Task "${confirmingTask.title}" is pending approval`,
                "Deliverable",
                confirmingTask.$id
            )

            // Optimistic update handles UI feedback
            setConfirmingTask(null)
        } catch (error) {
            addToast("Failed to submit task for approval. Please try again.", "error")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleTransactionSuccess = async (transactionId: string) => {
        // Update task status to completed and link the transaction
        if (selectedTask) {
            try {
                await updateDeliverableTaskMutation({
                    taskId: selectedTask.$id,
                    data: {
                        status: 'Completed',
                        actionItem: transactionId
                    },
                    grantId: grant.$id
                })
                // Optimistic update handles UI feedback
                setSelectedTask(null)

                // Check if all tasks in the deliverable are now completed
                await checkAndUpdateDeliverableStatus(selectedTask)
            } catch (error) {
                addToast("Failed to complete task. Please try again.", "error")
            }
        }
    }

    // Pending tasks for PI approval
    const pendingApprovalTasks = React.useMemo(() => {
        if (!deliverables || !isPI) return []
        return deliverables.flatMap((d: DeliverableType) =>
            (d.tasks || []).filter((t: TaskType) => t.status === 'PendingApproval').map((t: TaskType) => ({ ...t, deliverableTitle: d.title, deliverableId: d.$id }))
        )
    }, [deliverables, isPI])

    const handleApproveTask = async (task: any) => {
        try {
            await updateDeliverableTaskMutation({
                taskId: task.$id,
                data: { status: 'Completed' },
                grantId: grant.$id
            })
            // Optimistic update handles UI feedback
            await checkAndUpdateDeliverableStatus(task)
        } catch (error) {
            addToast("Failed to approve task. Please try again.", "error")
        }
    }

    const handleRejectTask = async (task: any) => {
        try {
            await updateDeliverableTaskMutation({
                taskId: task.$id,
                data: { status: 'Progress' },
                grantId: grant.$id
            })
            // Optimistic update handles UI feedback
        } catch (error) {
            addToast("Failed to return task to progress. Please try again.", "error")
        }
    }

    const checkAndUpdateDeliverableStatus = async (completedTask: TaskType) => {
        // Find the deliverable this task belongs to
        const deliverable = deliverables.find((d: DeliverableType) =>
            d.tasks?.some((t: TaskType) => t.$id === completedTask.$id)
        )

        if (!deliverable || !deliverable.tasks) return

        // Check if all tasks are completed
        const allTasksCompleted = deliverable.tasks.every((task: TaskType) =>
            task.$id === completedTask.$id ? true : task.status === 'Completed'
        )

        // If all tasks are completed, update deliverable status
        if (allTasksCompleted && deliverable.status !== 'Completed') {
            try {
                await updateDeliverableMutation({
                    deliverableId: deliverable.$id,
                    data: { status: 'Completed' },
                    grantId: grant.$id
                })
                // Optimistic update handles UI feedback
            } catch (error) {
                console.error("Failed to update deliverable status:", error)
                addToast("Failed to mark deliverable as completed.", "error")
            }
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
                        <TrendingUp size={18} color="var(--color-success)" />
                    </div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>{completionRate}%</div>
                </div>
                <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Team Size</span>
                        <Users size={18} color="var(--color-primary)" />
                    </div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>{grantMembers.length}</div>
                </div>
                <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Pending</span>
                        <Clock size={18} color="var(--color-accent-violet)" />
                    </div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>{deliverables.filter(d => d.status === 'Progress').length}</div>
                </div>
            </div>

            {/* Pending Approvals Section (PI Only) */}
            {isPI && pendingApprovalTasks.length > 0 && (
                <div className="card-neumorphic" style={{ padding: 'var(--space-6)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--color-primary-light)',
                            color: 'var(--color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <AlertCircle size={18} />
                        </div>
                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Pending Approvals</h3>
                        <span style={{
                            fontSize: 'var(--text-xs)',
                            background: 'var(--color-primary)',
                            color: 'white',
                            padding: 'var(--space-1) var(--space-2)',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: 700
                        }}>
                            {pendingApprovalTasks.length}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
                        {pendingApprovalTasks.map(task => (
                            <div key={task.$id} style={{
                                background: 'white',
                                padding: 'var(--space-4)',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: 'var(--shadow-sm)',
                                border: '1px solid var(--color-gray-100)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--space-3)',
                                transition: 'transform var(--duration-base) var(--ease-out), box-shadow var(--duration-base) var(--ease-out), border-color var(--duration-base) var(--ease-out)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                    e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                                    e.currentTarget.style.borderColor = 'var(--color-primary)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                                    e.currentTarget.style.borderColor = 'var(--color-gray-100)'
                                }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '4px',
                                    height: '100%',
                                    background: 'var(--color-primary)'
                                }} />

                                <div style={{ paddingLeft: 'var(--space-2)' }}>
                                    <div style={{
                                        fontSize: 'var(--text-xs)',
                                        color: 'var(--color-gray-500)',
                                        textTransform: 'uppercase',
                                        fontWeight: 700,
                                        marginBottom: 'var(--space-2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-2)'
                                    }}>
                                        <Package size={12} />
                                        {task.deliverableTitle}
                                    </div>
                                    <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--color-gray-900)' }}>{task.title}</div>
                                    {task.description && (
                                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginTop: 'var(--space-2)', lineHeight: 1.5 }}>
                                            {task.description}
                                        </div>
                                    )}
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--color-gray-600)',
                                    background: 'var(--color-gray-50)',
                                    padding: 'var(--space-2) var(--space-3)',
                                    borderRadius: 'var(--radius-md)'
                                }}>
                                    <Users size={14} color="var(--color-gray-400)" />
                                    <span style={{ fontWeight: 500 }}>
                                        {task.assignedMembers?.map((m: any) => m.user.name).join(', ') || 'Unassigned'}
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', marginTop: 'auto' }}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRejectTask(task)}
                                        style={{
                                            color: 'var(--color-primary)',
                                            borderColor: 'var(--color-primary)'
                                        }}
                                    >
                                        <XCircle size={16} style={{ marginRight: 'var(--space-2)' }} />
                                        Reject
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleApproveTask(task)}
                                    >
                                        <CheckCircle size={16} style={{ marginRight: 'var(--space-2)' }} />
                                        Approve
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
                            <tr style={{ background: 'var(--color-gray-50)' }}>
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
                                            <td colSpan={5} style={{ padding: 'var(--space-4) var(--space-6)', background: 'var(--color-gray-50)' }}>
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
                                                            d.tasks.map((task: TaskType) => {
                                                                const isAssigned = task.assignedMembers.some(m => m.$id === myMemberId)
                                                                const isClickable = isAssigned && task.status !== 'Completed'

                                                                return (
                                                                    <div
                                                                        key={task.$id}
                                                                        className="card-neumorphic"
                                                                        onClick={(e) => isClickable ? handleTaskCheckboxClick(task, e) : undefined}
                                                                        style={{
                                                                            background: 'white',
                                                                            padding: '12px',
                                                                            borderRadius: 'var(--radius-md)',
                                                                            display: 'grid',
                                                                            gridTemplateColumns: 'auto 1fr auto auto',
                                                                            alignItems: 'center',
                                                                            gap: '16px',
                                                                            cursor: isClickable ? 'pointer' : 'default',
                                                                            opacity: task.status === 'Completed' ? 0.7 : 1,
                                                                            transition: 'all 0.2s ease',
                                                                            border: '2px solid transparent'
                                                                        }}
                                                                        onMouseEnter={(e) => {
                                                                            if (isClickable) {
                                                                                e.currentTarget.style.borderColor = 'var(--color-primary)'
                                                                                e.currentTarget.style.transform = 'translateY(-2px)'
                                                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)'
                                                                            }
                                                                        }}
                                                                        onMouseLeave={(e) => {
                                                                            if (isClickable) {
                                                                                e.currentTarget.style.borderColor = 'transparent'
                                                                                e.currentTarget.style.transform = 'translateY(0)'
                                                                                e.currentTarget.style.boxShadow = ''
                                                                            }
                                                                        }}
                                                                    >
                                                                        {/* Checkbox - only visible to assigned members */}
                                                                        {isAssigned && (
                                                                            <div style={{ pointerEvents: 'none' }}>
                                                                                {task.status === 'Completed' || task.status === 'PendingApproval' ? (
                                                                                    <CheckSquare size={18} color={getStatusConfig(task.status).color} />
                                                                                ) : (
                                                                                    <Square size={18} color="var(--color-primary)" />
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                        {!isAssigned && <div style={{ width: '18px' }} />}

                                                                        <div>
                                                                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{task.title}</div>
                                                                            <div style={{ fontSize: '10px', color: 'var(--color-gray-400)' }}>
                                                                                {task.description}
                                                                                {task.action === 'Transaction' && (
                                                                                    <span style={{ marginLeft: '8px', padding: '2px 6px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '4px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                                                        <Receipt size={10} /> Transaction
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                            <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                                                                {task.assignedMembers?.slice(0, 3).map((assignment: any, i: number) => {
                                                                                    const memberId = assignment.$id
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
                                                                        <div style={{ fontSize: '10px', fontWeight: 700, color: getStatusConfig(task.status).color }}>{getStatusConfig(task.status).label.toUpperCase()}</div>
                                                                    </div>
                                                                )
                                                            })
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
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Deliverable"
                footer={(
                    <>
                        <Button variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button
                            variant="primary"
                            size="sm"
                            type="submit"
                            form="add-deliverable-form"
                        >
                            {isSubmitting ? <Loader size="sm" variant="white" /> : 'Create Deliverable'}
                        </Button>
                    </>
                )}
            >
                <form id="add-deliverable-form" onSubmit={handleAddDeliverable} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <p style={{ fontSize: 'var(--text-xs)', opacity: 0.6, margin: '-8px 0 0 0' }}>
                        Define a new project output or milestone
                    </p>

                    <div>
                        <label className="input-label">Deliverable Title *</label>
                        <input
                            required
                            className="input-field"
                            value={deliverableForm.title}
                            onChange={e => setDeliverableForm({ ...deliverableForm, title: e.target.value })}
                            placeholder="e.g. Quarterly Review Report"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label className="input-label">Status *</label>
                            <select
                                className="input-field"
                                value={deliverableForm.status}
                                onChange={e => setDeliverableForm({ ...deliverableForm, status: e.target.value as any })}
                                style={{ cursor: 'pointer' }}
                            >
                                <option value="Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Due Date *</label>
                            <input
                                required
                                type="date"
                                className="input-field"
                                value={deliverableForm.dueDate}
                                onChange={e => setDeliverableForm({ ...deliverableForm, dueDate: e.target.value })}
                            />
                        </div>
                    </div>
                </form>
            </Modal>

            {/* Add Task Modal */}
            <Modal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                title={`New Task for ${selectedDeliverable?.title}`}
                footer={(
                    <>
                        <Button variant="ghost" size="sm" onClick={() => setIsTaskModalOpen(false)}>Cancel</Button>
                        <Button
                            variant="primary"
                            size="sm"
                            type="submit"
                            form="add-task-form"
                        >
                            {isSubmitting ? <Loader size="sm" variant="white" /> : 'Add Task to Schedule'}
                        </Button>
                    </>
                )}
            >
                <form id="add-task-form" onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <p style={{ fontSize: 'var(--text-xs)', opacity: 0.6, margin: '-8px 0 0 0' }}>
                        Assign a specific action item to team members
                    </p>

                    <div>
                        <label className="input-label">Task Title *</label>
                        <input
                            required
                            className="input-field"
                            value={taskForm.title}
                            onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                            placeholder="e.g. Initial Data Analysis"
                        />
                    </div>

                    <div>
                        <label className="input-label">Assign Team Members</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '12px', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-100)' }}>
                            {grantMembers.map(m => (
                                <div key={m.$id} onClick={() => {
                                    const current = taskForm.assignedMembers
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
                                    boxShadow: taskForm.assignedMembers.includes(m.$id) ? '0 2px 4px rgba(59, 130, 246, 0.2)' : 'none'
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
                        <label className="input-label">Due Date *</label>
                        <input
                            required
                            type="date"
                            className="input-field"
                            value={taskForm.dueDate}
                            max={selectedDeliverable?.dueDate}
                            onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                        />
                        {selectedDeliverable?.dueDate && (
                            <p style={{ fontSize: '10px', color: 'var(--color-gray-400)', marginTop: '6px' }}>
                                Must be on or before {formatDate(selectedDeliverable.dueDate)}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="input-label">Task Type</label>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div
                                onClick={() => setTaskForm({ ...taskForm, action: 'Other' })}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: 'var(--radius-md)',
                                    border: `2px solid ${taskForm.action === 'Other' ? 'var(--color-primary)' : 'var(--color-gray-200)'}`,
                                    background: taskForm.action === 'Other' ? 'rgba(59, 130, 246, 0.05)' : 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    textAlign: 'center'
                                }}
                            >
                                <div style={{ fontSize: '20px', marginBottom: '4px', display: 'flex', justifyContent: 'center' }}><ClipboardList color="var(--color-primary)" size={24} /></div>
                                <div style={{ fontSize: '12px', fontWeight: 600 }}>Standard Task</div>
                                <div style={{ fontSize: '10px', color: 'var(--color-gray-400)', marginTop: '2px' }}>Regular deliverable task</div>
                            </div>
                            <div
                                onClick={() => setTaskForm({ ...taskForm, action: 'Transaction' })}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: 'var(--radius-md)',
                                    border: `2px solid ${taskForm.action === 'Transaction' ? 'var(--color-primary)' : 'var(--color-gray-200)'}`,
                                    background: taskForm.action === 'Transaction' ? 'rgba(59, 130, 246, 0.05)' : 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    textAlign: 'center'
                                }}
                            >
                                <div style={{ fontSize: '20px', marginBottom: '4px', display: 'flex', justifyContent: 'center' }}><Receipt color="var(--color-primary)" size={24} /></div>
                                <div style={{ fontSize: '12px', fontWeight: 600 }}>Transaction Task</div>
                                <div style={{ fontSize: '10px', color: 'var(--color-gray-400)', marginTop: '2px' }}>Requires budget transaction</div>
                            </div>
                        </div>
                        <p style={{ fontSize: '10px', color: 'var(--color-gray-400)', marginTop: '6px' }}>
                            {taskForm.action === 'Transaction' ? 'Assigned members will log a transaction when completing this task.' : 'Task will require PI approval upon completion.'}
                        </p>
                    </div>

                    <div>
                        <label className="input-label">Description</label>
                        <textarea
                            className="input-field"
                            style={{ minHeight: '100px', resize: 'vertical' }}
                            value={taskForm.description}
                            onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                            placeholder="Describe the specific objectives of this task..."
                        />
                    </div>
                </form>
            </Modal>

            {/* Confirmation Modal for Standard Tasks */}
            {confirmingTask && (
                <Modal
                    isOpen={!!confirmingTask}
                    onClose={() => setConfirmingTask(null)}
                    title="Complete Task"
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                            <AlertCircle size={24} color="#3b82f6" />
                            <div>
                                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Wait for Approval</h4>
                                <p style={{ fontSize: '12px', color: '#64748b' }}>
                                    This task requires PI approval before it can be marked as fully completed.
                                </p>
                            </div>
                        </div>

                        <p style={{ fontSize: '14px', color: '#475569' }}>
                            Are you sure you want to mark <strong>"{confirmingTask.title}"</strong> as done? The status will change to <strong>Pending Approval</strong>.
                        </p>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <Button variant="ghost" onClick={() => setConfirmingTask(null)}>Cancel</Button>
                            <Button
                                variant="primary"
                                onClick={confirmStandardTaskCompletion}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader variant="white" size="sm" /> : 'Submit for Approval'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Transaction Modal for Transaction Tasks */}
            <CreateTransactionModal
                isOpen={isTransactionModalOpen}
                onClose={() => {
                    setIsTransactionModalOpen(false)
                    setSelectedTask(null)
                }}
                grant={grant}
                budgetItems={budgetItems}
                transactions={transactions}
                onSuccess={handleTransactionSuccess}
            />
        </div>
    )
}
