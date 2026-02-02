import { Mail, Phone, Award, Briefcase, Clock, GraduationCap, Star, Users, TrendingUp } from 'lucide-react'
import Button from '../ui/Button'
import Loader from '../ui/Loader'

interface TeamMember {
    id: string
    name: string
    role: 'principal-investigator' | 'co-investigator' | 'researcher' | 'technician' | 'postdoc'
    department: string
    expertise: string[]
    allocation: number // percentage of time
    email: string
    phone: string
    joinDate: string
    publications: number
}

// Sample personnel data
const personnel: TeamMember[] = [
    {
        id: '1',
        name: 'Prof. Michael Torres',
        role: 'principal-investigator',
        department: 'Quantum Physics',
        expertise: ['Quantum Computing', 'Algorithm Design', 'Research Leadership'],
        allocation: 40,
        email: 'm.torres@university.edu',
        phone: '+1 (555) 123-4567',
        joinDate: '2026-01-15',
        publications: 127
    },
    {
        id: '2',
        name: 'Dr. Sarah Chen',
        role: 'co-investigator',
        department: 'Computer Science',
        expertise: ['Machine Learning', 'Quantum Algorithms', 'Data Analysis'],
        allocation: 50,
        email: 's.chen@university.edu',
        phone: '+1 (555) 234-5678',
        joinDate: '2026-01-20',
        publications: 89
    },
    {
        id: '3',
        name: 'Dr. James Wilson',
        role: 'co-investigator',
        department: 'Engineering',
        expertise: ['Hardware Design', 'Systems Integration', 'Testing'],
        allocation: 45,
        email: 'j.wilson@university.edu',
        phone: '+1 (555) 345-6789',
        joinDate: '2026-02-01',
        publications: 64
    },
    {
        id: '4',
        name: 'Dr. Emily Rodriguez',
        role: 'researcher',
        department: 'Applied Mathematics',
        expertise: ['Optimization', 'Numerical Methods', 'Algorithm Development'],
        allocation: 60,
        email: 'e.rodriguez@university.edu',
        phone: '+1 (555) 456-7890',
        joinDate: '2026-02-10',
        publications: 42
    },
    {
        id: '5',
        name: 'Dr. Alex Kumar',
        role: 'postdoc',
        department: 'Quantum Physics',
        expertise: ['Quantum Error Correction', 'Theoretical Physics'],
        allocation: 80,
        email: 'a.kumar@university.edu',
        phone: '+1 (555) 567-8901',
        joinDate: '2026-03-01',
        publications: 28
    },
    {
        id: '6',
        name: 'Lisa Martinez',
        role: 'technician',
        department: 'Laboratory Services',
        expertise: ['Equipment Maintenance', 'Lab Safety', 'Technical Support'],
        allocation: 30,
        email: 'l.martinez@university.edu',
        phone: '+1 (555) 678-9012',
        joinDate: '2026-02-15',
        publications: 5
    },
    {
        id: '7',
        name: 'Dr. David Park',
        role: 'researcher',
        department: 'Computer Science',
        expertise: ['Software Development', 'Simulation', 'Visualization'],
        allocation: 55,
        email: 'd.park@university.edu',
        phone: '+1 (555) 789-0123',
        joinDate: '2026-03-10',
        publications: 31
    }
]

const getRoleConfig = (role: TeamMember['role']) => {
    switch (role) {
        case 'principal-investigator':
            return {
                color: '#8b5cf6',
                bg: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(139, 92, 246, 0.06) 100%)',
                borderColor: 'rgba(139, 92, 246, 0.3)',
                label: 'Principal Investigator',
                dotColor: '#8b5cf6',
                icon: Star
            }
        case 'co-investigator':
            return {
                color: '#3b82f6',
                bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 100%)',
                borderColor: 'rgba(59, 130, 246, 0.3)',
                label: 'Co-Investigator',
                dotColor: '#3b82f6',
                icon: Award
            }
        case 'researcher':
            return {
                color: '#10b981',
                bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.06) 100%)',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                label: 'Researcher',
                dotColor: '#10b981',
                icon: GraduationCap
            }
        case 'postdoc':
            return {
                color: '#f59e0b',
                bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0.06) 100%)',
                borderColor: 'rgba(245, 158, 11, 0.3)',
                label: 'Postdoctoral Fellow',
                dotColor: '#f59e0b',
                icon: GraduationCap
            }
        default:
            return {
                color: '#6b7280',
                bg: 'linear-gradient(135deg, rgba(107, 114, 128, 0.08) 0%, rgba(107, 114, 128, 0.04) 100%)',
                borderColor: 'rgba(107, 114, 128, 0.2)',
                label: 'Technician',
                dotColor: '#6b7280',
                icon: Briefcase
            }
    }
}

const getAllocationColor = (allocation: number) => {
    if (allocation >= 70) return '#10b981' // Green - High allocation
    if (allocation >= 40) return '#3b82f6' // Blue - Medium allocation
    return '#f59e0b' // Orange - Low allocation
}

export default function Personnel({ grant }: { grant?: any }) {
    if (!grant) {
        return <Loader size="xl" label="Synchronizing team data..." />
    }

    const totalMembers = personnel.length
    const avgAllocation = Math.round(personnel.reduce((sum, p) => sum + p.allocation, 0) / personnel.length)
    const totalPublications = personnel.reduce((sum, p) => sum + p.publications, 0)
    const piCount = personnel.filter(p => p.role === 'principal-investigator' || p.role === 'co-investigator').length

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
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Team Members</span>
                        <div style={{ background: 'var(--color-primary-light)', padding: '6px', borderRadius: '50%', color: 'var(--color-primary)' }}>
                            <Users size={16} />
                        </div>
                    </div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>{totalMembers}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-gray-400)', marginTop: 'var(--space-2)' }}>
                        Active project capacity
                    </div>
                </div>

                <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Avg. Allocation</span>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '6px', borderRadius: '50%', color: '#3b82f6' }}>
                            <Clock size={16} />
                        </div>
                    </div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>{avgAllocation}%</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-gray-400)', marginTop: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <TrendingUp size={12} color="#10b981" />
                        <span>Workforce commitment</span>
                    </div>
                </div>

                <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Research Output</span>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '6px', borderRadius: '50%', color: '#10b981' }}>
                            <Award size={16} />
                        </div>
                    </div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>{totalPublications}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-gray-400)', marginTop: 'var(--space-2)' }}>
                        Total cumulative publications
                    </div>
                </div>

                <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Investigators</span>
                        <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '6px', borderRadius: '50%', color: '#8b5cf6' }}>
                            <Star size={16} />
                        </div>
                    </div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>{piCount}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-gray-400)', marginTop: 'var(--space-2)' }}>
                        PI & Co-Investigators
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="card-neumorphic" style={{ padding: '0', overflow: 'hidden' }}>
                {/* Table Header */}
                <div style={{
                    padding: 'var(--space-6)',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'white'
                }}>
                    <div>
                        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>
                            Project Team
                        </h2>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', margin: '4px 0 0 0' }}>
                            Manage personnel and research roles
                        </p>
                    </div>
                    <Button variant="primary" size="sm">+ Add Member</Button>
                </div>

                {/* Team Members List */}
                <div style={{ padding: 'var(--space-6)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {personnel.map((member) => {
                            const roleConfig = getRoleConfig(member.role)
                            const RoleIcon = roleConfig.icon
                            const allocationColor = getAllocationColor(member.allocation)

                            return (
                                <div
                                    key={member.id}
                                    className="card-neumorphic"
                                    style={{
                                        padding: 'var(--space-4)',
                                        borderRadius: 'var(--radius-lg)',
                                        background: 'white',
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)'
                                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.style.boxShadow = ''
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                                        {/* Avatar */}
                                        <div style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: 'var(--radius-lg)',
                                            background: `linear-gradient(135deg, ${roleConfig.color} 0%, ${roleConfig.dotColor} 100%)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: 'var(--text-2xl)',
                                            fontWeight: 700,
                                            flexShrink: 0,
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                        }}>
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </div>

                                        {/* Main Info */}
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                            {/* Name and Role */}
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                                                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>
                                                        {member.name}
                                                    </h3>
                                                    <div style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 'var(--space-2)',
                                                        padding: 'var(--space-1) var(--space-3)',
                                                        borderRadius: 'var(--radius-full)',
                                                        background: roleConfig.bg,
                                                        border: `1px solid ${roleConfig.borderColor}`,
                                                        color: roleConfig.color,
                                                        fontSize: 'var(--text-xs)',
                                                        fontWeight: 700
                                                    }}>
                                                        <RoleIcon size={12} />
                                                        {roleConfig.label}
                                                    </div>
                                                </div>
                                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', margin: 0 }}>
                                                    {member.department}
                                                </p>
                                            </div>

                                            {/* Expertise Tags */}
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                                                {member.expertise.map((skill, idx) => (
                                                    <span
                                                        key={idx}
                                                        style={{
                                                            padding: 'var(--space-1) var(--space-3)',
                                                            background: 'var(--color-gray-100)',
                                                            borderRadius: 'var(--radius-md)',
                                                            fontSize: 'var(--text-xs)',
                                                            color: 'var(--color-gray-700)',
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Stats Row */}
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                                gap: 'var(--space-4)',
                                                paddingTop: 'var(--space-3)',
                                                borderTop: '1px solid var(--color-gray-100)'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                    <Mail size={16} style={{ color: 'var(--color-gray-400)' }} />
                                                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-600)' }}>
                                                        {member.email}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                    <Phone size={16} style={{ color: 'var(--color-gray-400)' }} />
                                                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-600)' }}>
                                                        {member.phone}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                    <Clock size={16} style={{ color: allocationColor }} />
                                                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: allocationColor }}>
                                                        {member.allocation}% Allocation
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                    <Award size={16} style={{ color: 'var(--color-gray-400)' }} />
                                                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-600)' }}>
                                                        {member.publications} Publications
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
