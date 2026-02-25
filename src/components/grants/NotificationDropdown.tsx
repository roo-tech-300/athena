import { Activity, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface NotificationDropdownProps {
    activities: any[]
    onClose: () => void
    onActivityClick: (activity: any) => void
    canViewBudgetActivities: boolean
    isPI: boolean
    userId: string
}

const formatRelativeTime = (dateString: string) => {
    const now = new Date()
    const then = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
}

export default function NotificationDropdown({
    activities,
    onClose,
    onActivityClick,
    canViewBudgetActivities,
    isPI,
    userId
}: NotificationDropdownProps) {
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [onClose])

    const filteredActivities = activities.filter((act: any) => {
        // Personnel activities: only visible to PIs
        if (act.entityType === 'Personnel') return isPI
        // Task activities: only visible to assigned members
        if (act.entityType === 'Task') return act.involvedUsers?.includes(userId)
        // PI, FO, and Reviewers see all other activities
        if (canViewBudgetActivities) return true
        // Other users only see activities they are involved in
        if (act.involvedUsers?.includes(userId)) return true
        // Filter out Budget/Transaction activities for non-privileged users
        if (act.entityType === 'Budget' || act.entityType === 'Transaction') return false
        return true
    })

    return (
        <div
            ref={dropdownRef}
            style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '400px',
                maxHeight: '500px',
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--color-gray-100)',
                zIndex: 1000,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Header */}
            <div style={{
                padding: 'var(--space-4) var(--space-6)',
                borderBottom: '1px solid var(--color-gray-100)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--color-gray-50)'
            }}>
                <h3 style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 700,
                    color: 'var(--color-gray-900)'
                }}>
                    Recent Activity
                </h3>
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 'var(--space-1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-gray-500)',
                        borderRadius: 'var(--radius-md)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-gray-200)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                    <X size={18} />
                </button>
            </div>

            {/* Activities List */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: 'var(--space-2)'
            }}>
                {filteredActivities.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--space-12)',
                        color: 'var(--color-gray-400)'
                    }}>
                        <Activity size={48} style={{ margin: '0 auto var(--space-4)', opacity: 0.3 }} />
                        <p style={{ fontSize: 'var(--text-sm)' }}>No new notifications</p>
                    </div>
                ) : (
                    filteredActivities.map((act: any, i: number) => {
                    const isClickable = act.entityType === 'Deliverable' || act.entityType === 'Budget' || act.entityType === 'Transaction' || act.entityType === 'Task' || act.entityType === 'Document'

                        return (
                            <div
                                key={i}
                                onClick={() => isClickable && onActivityClick(act)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 'var(--space-3)',
                                    padding: 'var(--space-3)',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: isClickable ? 'pointer' : 'default',
                                    transition: 'all 0.2s ease',
                                    marginBottom: 'var(--space-1)'
                                }}
                                onMouseEnter={(e) => {
                                    if (isClickable) {
                                        e.currentTarget.style.background = 'var(--color-gray-50)'
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (isClickable) {
                                        e.currentTarget.style.background = 'transparent'
                                    }
                                }}
                            >
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: 'var(--radius-full)',
                                    background: 'var(--color-primary-light)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 700,
                                    color: 'var(--color-primary)',
                                    flexShrink: 0
                                }}>
                                    {act.entityType?.[0] || 'A'}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 600,
                                        color: 'var(--color-gray-900)',
                                        marginBottom: '2px'
                                    }}>
                                        {act.entityType} Update
                                    </div>
                                    <div style={{
                                        fontSize: 'var(--text-xs)',
                                        color: 'var(--color-gray-600)',
                                        lineHeight: 1.4,
                                        marginBottom: '4px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                    }}>
                                        {act.description}
                                    </div>
                                    <div style={{
                                        fontSize: '10px',
                                        color: 'var(--color-gray-400)',
                                        fontWeight: 500
                                    }}>
                                        {formatRelativeTime(act.$createdAt)}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
