import { Activity, Users, FileText, CheckCircle2, Calendar } from 'lucide-react'
import Loader from '../ui/Loader'
import { useActivities } from '../../hooks/useGrants'
import { useGetMilestones } from '../../hooks/useMilestones'
import { useGetDocuments } from '../../hooks/useDocuments'

const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const then = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export default function GrantDashboard({ grant, myMembership, setActiveTab }: { grant?: any, myMembership?: any, setActiveTab?: (tab: string) => void }) {
    const { data: activities = [], isLoading: activitiesLoading } = useActivities(grant?.$id || '');
    const { data: milestones = [], isLoading: milestonesLoading } = useGetMilestones(grant?.$id || '');
    const { data: documents = [], isLoading: docsLoading } = useGetDocuments(grant?.$id || '');

    if (!grant || activitiesLoading || milestonesLoading || docsLoading) {
        return <Loader label="Compiling workspace insights..." />
    }

    const roles = myMembership?.role || [];
    const isPI = roles.includes('Principal Investigator');
    const isReviewer = roles.includes('Reviewer');
    const isFO = roles.includes('Finance Officer');
    const isStaff = isPI || isReviewer || isFO;
    const canViewBudgetActivities = isPI || isReviewer || isFO;

    const upcomingMilestones = milestones
        .filter((m: any) => m.status !== 'Completed')
        .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 3);

    let metrics = [
        { label: 'Completion', value: (grant.completion || 0) + '%', icon: Activity, color: 'var(--color-primary)' },
        { label: 'Team Size', value: grant.members?.length || 0, icon: Users, color: 'var(--color-accent-indigo)' },
        { label: isStaff ? 'Docs Ready' : 'My Documents', value: documents.filter((d: any) => d.status === 'Accepted').length.toString(), icon: FileText, color: 'var(--color-success)' },
        { label: isStaff ? 'Milestones' : 'My Tasks', value: `${milestones.filter((m: any) => m.status === 'Completed').length}/${milestones.length}`, icon: CheckCircle2, color: 'var(--color-warning)' },
    ];

    if (isFO) {
        metrics.push({
            label: 'Remaining Budget',
            value: '₦' + (grant.expectedFunding || 0).toLocaleString(),
            icon: Activity,
            color: 'var(--color-accent-purple)'
        });
    }

    const canViewActivity = isPI || isReviewer;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {/* Quick Metrics */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${metrics.length > 4 ? 3 : metrics.length}, 1fr)`,
                gap: 'var(--space-6)'
            }}>
                {metrics.map((m, i) => (
                    <div key={i} className="card-neumorphic glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-gray-500)' }}>{m.label}</span>
                            <m.icon size={18} color={m.color} />
                        </div>
                        <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>{m.value}</div>
                    </div>
                ))}
            </div>

            {/* Layout Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--space-6)' }}>
                {canViewActivity && (
                    <div className="card-neumorphic" style={{ gridColumn: 'span 8', minHeight: '350px' }}>
                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>Recent Activity</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            {activities.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--color-gray-400)' }}>
                                    No recent activity logged.
                                </div>
                            ) : activities
                                .filter((act: any) => {
                                    // Filter out Budget activities if user doesn't have permission
                                    if (act.entityType === 'Budget' && !canViewBudgetActivities) {
                                        return false;
                                    }
                                    return true;
                                })
                                .map((act: any, i: number) => {
                                const isClickable = (act.entityType === 'Deliverable' || act.entityType === 'Budget') && setActiveTab;
                                return (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            if (act.entityType === 'Deliverable' && setActiveTab) setActiveTab('Deliverables')
                                            if (act.entityType === 'Budget' && setActiveTab) setActiveTab('Budget tracker')
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-4)',
                                            padding: 'var(--space-4)',
                                            background: 'var(--color-gray-50)',
                                            borderRadius: 'var(--radius-md)',
                                            cursor: isClickable ? 'pointer' : 'default',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (isClickable) {
                                                e.currentTarget.style.background = 'var(--color-gray-100)'
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (isClickable) {
                                                e.currentTarget.style.background = 'var(--color-gray-50)'
                                            }
                                        }}
                                    >
                                        <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: 'var(--color-primary)', boxShadow: 'var(--shadow-sm)' }}>
                                            {act.entityType?.[0] || 'A'}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{act.entityType} Update</div>
                                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{act.description}</div>
                                        </div>
                                        <span style={{ fontSize: '10px', color: 'var(--color-gray-400)' }}>{formatRelativeTime(act.$createdAt)}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                <div className="card-neumorphic glass" style={{ gridColumn: canViewActivity ? 'span 4' : 'span 12' }}>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>Upcoming Deadlines</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {upcomingMilestones.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--color-gray-400)' }}>
                                No milestones to show!
                            </div>
                        ) : upcomingMilestones.map((d: any, i: number) => (
                            <div key={i} style={{
                                borderLeft: `4px solid ${d.priority === 'High' ? 'var(--color-error)' : d.priority === 'Medium' ? 'var(--color-warning)' : 'var(--color-primary)'}`,
                                padding: 'var(--space-4)',
                                background: 'white',
                                borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                                boxShadow: 'var(--shadow-sm)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{d.title}</div>
                                    {d.priority === 'High' && <span style={{ fontSize: '8px', background: 'var(--color-error-light)', color: 'var(--color-error)', padding: '2px 6px', borderRadius: 'var(--radius-full)', fontWeight: 800 }}>URGENT</span>}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', marginTop: '4px' }}>
                                    <Calendar size={12} />
                                    Due {new Date(d.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
