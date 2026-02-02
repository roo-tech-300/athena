import { Activity, Users, FileText, CheckCircle2 } from 'lucide-react'
import Loader from '../ui/Loader'



export default function GrantDashboard({ grant }: { grant?: any }) {
    if (!grant) {
        return <Loader label="Loading dashboard metrics..." />
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)' }}>
                {[
                    { label: 'Completion', value: grant.completion + '%', icon: Activity, color: 'var(--color-primary)' },
                    { label: 'Team Size', value: grant.members.length, icon: Users, color: 'var(--color-accent-indigo)' },
                    // TODO: Add docs ready and milestones
                    { label: 'Docs Ready', value: '28', icon: FileText, color: 'var(--color-success)' },
                    { label: 'Milestones', value: '4/6', icon: CheckCircle2, color: 'var(--color-warning)' },
                ].map((m, i) => (
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
                <div className="card-neumorphic" style={{ gridColumn: 'span 8', minHeight: '300px' }}>
                    {/* TODO: Add recent activity and upcoming deadlines */}
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>Recent Activity</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {[
                            { user: 'Dr. Sarah Chen', action: 'Uploaded ethics clearance draft', time: '2h ago' },
                            { user: 'Admin', action: 'Approved quarterly budget injection', time: '5h ago' },
                            { user: 'Grant System', action: 'Automated backup completed', time: '1d ago' },
                        ].map((act, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>{act.user[0]}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{act.user}</div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{act.action}</div>
                                </div>
                                <span style={{ fontSize: '10px', color: 'var(--color-gray-400)' }}>{act.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card-neumorphic glass" style={{ gridColumn: 'span 4' }}>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>Upcoming Deadlines</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {[
                            { date: 'Oct 24', label: 'Interim Report', urgency: 'High' },
                            { date: 'Nov 12', label: 'Safety Audit', urgency: 'Medium' },
                        ].map((d, i) => (
                            <div key={i} style={{ borderLeft: `3px solid ${d.urgency === 'High' ? 'var(--color-error)' : 'var(--color-warning)'}`, paddingLeft: 'var(--space-4)' }}>
                                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{d.label}</div>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>Due {d.date}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
