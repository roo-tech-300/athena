import { useState } from 'react'
import { Mail, Award, Clock, Star, Users, CheckCircle, XCircle, Shield } from 'lucide-react'
import Button from '../ui/Button'
import Loader from '../ui/Loader'
import { useGrantMembers, useUpdateGrantMember } from '../../hooks/useGrants'
import { useAuth } from '../../useContext/context'
import { toast } from 'react-toastify'

type Role = 'Principal Investigator' | 'Researcher' | 'Reviewer' | 'Finance Officer';

const ALL_ROLES: Role[] = ['Principal Investigator', 'Researcher', 'Reviewer', 'Finance Officer'];

const getRoleConfig = (role: Role) => {
    switch (role) {
        case 'Principal Investigator':
            return {
                color: '#8b5cf6',
                bg: 'rgba(139, 92, 246, 0.1)',
                borderColor: 'rgba(139, 92, 246, 0.2)',
                label: 'PI',
                icon: Star
            }
        case 'Researcher':
            return {
                color: '#10b981',
                bg: 'rgba(16, 185, 129, 0.1)',
                borderColor: 'rgba(16, 185, 129, 0.2)',
                label: 'Researcher',
                icon: Award
            }
        case 'Reviewer':
            return {
                color: '#3b82f6',
                bg: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 0.2)',
                label: 'Reviewer',
                icon: Shield
            }
        case 'Finance Officer':
            return {
                color: '#f59e0b',
                bg: 'rgba(245, 158, 11, 0.1)',
                borderColor: 'rgba(245, 158, 11, 0.2)',
                label: 'Finance',
                icon: Clock
            }
        default:
            return {
                color: '#6b7280',
                bg: 'rgba(107, 114, 128, 0.1)',
                borderColor: 'rgba(107, 114, 128, 0.2)',
                label: 'Member',
                icon: Users
            }
    }
}

export default function Personnel({ grant, myMembership }: { grant?: any, myMembership?: any }) {
    const [activeTab, setActiveTab] = useState<'Accepted' | 'Pending'>('Accepted');
    const { user: currentUser } = useAuth();
    const { data: members, isLoading: membersLoading } = useGrantMembers(grant?.$id);
    const { mutateAsync: updateMember, isPending: isUpdatingMember } = useUpdateGrantMember();

    if (!grant || membersLoading) {
        return <Loader size="xl" label="Synchronizing team data..." />
    }

    const rawAccepted = members?.filter((m: any) => m.status === 'Accepted') || [];
    const pendingMembers = members?.filter((m: any) => m.status === 'Pending') || [];

    // Sort to put "Me" first
    const acceptedMembers = [...rawAccepted].sort((a, b) => {
        const isAMe = a.user?.$id === currentUser?.id || a.user === currentUser?.id;
        const isBMe = b.user?.$id === currentUser?.id || b.user === currentUser?.id;
        if (isAMe) return -1;
        if (isBMe) return 1;
        return 0;
    });

    const isPI = myMembership?.role?.includes('Principal Investigator');

    const handleUpdateStatus = async (memberId: string, status: 'Accepted' | 'Rejected') => {
        try {
            await updateMember({ memberId, status, grantId: grant.$id });
        } catch (error) {
            toast.error("Failed to update member status");
        }
    }

    const toggleRole = async (member: any, roleToToggle: Role) => {
        if (!isPI) return;

        const currentRoles = member.role || [];
        let newRoles: string[];

        if (currentRoles.includes(roleToToggle)) {
            // Don't allow removing the last role
            if (currentRoles.length <= 1) {
                toast.warn("A member must have at least one role");
                return;
            }
            newRoles = currentRoles.filter((r: string) => r !== roleToToggle);
        } else {
            newRoles = [...currentRoles, roleToToggle];
        }

        try {
            await updateMember({ memberId: member.$id, role: newRoles, grantId: grant.$id });
        } catch (error) {
            toast.error("Failed to update roles");
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Tab Navigation */}
            <div style={{
                display: 'flex',
                gap: 'var(--space-2)',
                background: 'rgba(0,0,0,0.03)',
                padding: '4px',
                borderRadius: 'var(--radius-lg)',
                width: 'fit-content'
            }}>
                <button
                    onClick={() => setActiveTab('Accepted')}
                    style={{
                        padding: '8px 20px',
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        background: activeTab === 'Accepted' ? 'white' : 'transparent',
                        color: activeTab === 'Accepted' ? 'var(--color-primary)' : 'var(--color-gray-500)',
                        fontWeight: 600,
                        fontSize: 'var(--text-sm)',
                        cursor: 'pointer',
                        boxShadow: activeTab === 'Accepted' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                        transition: 'all 0.2s ease'
                    }}
                >
                    Accepted
                </button>
                {isPI && (
                    <button
                        onClick={() => setActiveTab('Pending')}
                        style={{
                            padding: '8px 20px',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            background: activeTab === 'Pending' ? 'white' : 'transparent',
                            color: activeTab === 'Pending' ? 'var(--color-warning)' : 'var(--color-gray-500)',
                            fontWeight: 600,
                            fontSize: 'var(--text-sm)',
                            cursor: 'pointer',
                            boxShadow: activeTab === 'Pending' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        Pending
                        {pendingMembers.length > 0 && (
                            <span style={{
                                background: 'var(--color-warning)',
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                fontSize: '10px',
                                fontWeight: 700
                            }}>
                                {pendingMembers.length}
                            </span>
                        )}
                    </button>
                )}
            </div>

            {activeTab === 'Accepted' ? (
                <div className="card-neumorphic" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{
                        padding: 'var(--space-6)',
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                        background: 'white'
                    }}>
                        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>Project Team</h2>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', margin: '4px 0 0 0' }}>Approved researchers and administrators</p>
                    </div>

                    <div style={{ padding: 'var(--space-6)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            {acceptedMembers.length === 0 ? (
                                <p style={{ textAlign: 'center', color: 'var(--color-gray-400)', padding: 'var(--space-8)' }}>No team members found.</p>
                            ) : (
                                acceptedMembers.map((member: any) => {
                                    const isMe = member.user?.$id === currentUser?.id || member.user === currentUser?.id;
                                    const userRoles = member.role || [];

                                    return (
                                        <div
                                            key={member.$id}
                                            className="card-neumorphic"
                                            style={{
                                                padding: 'var(--space-4)',
                                                borderRadius: 'var(--radius-lg)',
                                                background: isMe ? 'linear-gradient(to right, rgba(139, 92, 246, 0.03), white)' : 'white',
                                                border: '1px solid rgba(0,0,0,0.05)',
                                                transform: isMe ? 'scale(1.01)' : 'scale(1)',
                                            }}
                                        >
                                            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
                                                {/* Avatar */}
                                                <div style={{
                                                    width: '48px', height: '48px', borderRadius: '50%',
                                                    background: isMe ? 'var(--color-primary)' : 'var(--color-gray-500)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700,

                                                }}>
                                                    {member.user?.name?.charAt(0) || '?'}
                                                </div>

                                                {/* User Info */}
                                                <div style={{ flex: '1', minWidth: '200px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                                        <h3 style={{
                                                            fontSize: 'var(--text-base)',
                                                            fontWeight: 800,
                                                            margin: 0,
                                                            color: isMe ? 'var(--color-primary)' : 'inherit'
                                                        }}>
                                                            {isMe ? 'Me' : (member.user?.name || 'Unknown User')}
                                                        </h3>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: '4px' }}>
                                                        <Mail size={12} color="var(--color-gray-500)" />
                                                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{member.user?.email || 'N/A'}</span>
                                                    </div>
                                                </div>

                                                {/* Role Management (Multi-select pills) */}
                                                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                                    {ALL_ROLES.map(role => {
                                                        const isActive = userRoles.includes(role);
                                                        const roleConfig = getRoleConfig(role);
                                                        const Icon = roleConfig.icon;

                                                        const canToggle = isPI;

                                                        return (
                                                            <button
                                                                key={role}
                                                                onClick={() => toggleRole(member, role)}
                                                                disabled={!canToggle || isUpdatingMember}
                                                                title={!canToggle ? "You don't have permission to change roles" : `Toggle ${role}`}
                                                                style={{
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: 'var(--space-2)',
                                                                    padding: '6px 12px',
                                                                    borderRadius: 'var(--radius-full)',
                                                                    background: isActive ? roleConfig.bg : 'transparent',
                                                                    border: isActive ? `1.5px solid ${roleConfig.borderColor}` : '1.5px solid rgba(0,0,0,0.05)',
                                                                    color: isActive ? roleConfig.color : 'var(--color-gray-300)',
                                                                    fontSize: '10px',
                                                                    fontWeight: 700,
                                                                    cursor: canToggle ? 'pointer' : 'default',
                                                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                                    filter: isActive ? 'none' : 'grayscale(1)',
                                                                    opacity: isActive ? 1 : 0.6,
                                                                    whiteSpace: 'nowrap'
                                                                }}
                                                            >
                                                                <Icon size={12} />
                                                                {roleConfig.label}
                                                                {canToggle && (
                                                                    <div style={{
                                                                        marginLeft: '4px',
                                                                        width: '6px',
                                                                        height: '6px',
                                                                        borderRadius: '50%',
                                                                        background: isActive ? roleConfig.color : 'rgba(0,0,0,0.1)',
                                                                        boxShadow: isActive ? `0 0 8px ${roleConfig.color}` : 'none'
                                                                    }} />
                                                                )}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card-neumorphic" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{
                        padding: 'var(--space-6)',
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                        background: 'white'
                    }}>
                        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0, color: 'var(--color-warning)' }}>Pending Requests</h2>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', margin: '4px 0 0 0' }}>New collaboration requests awaiting review</p>
                    </div>

                    <div style={{ padding: 'var(--space-6)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            {pendingMembers.length === 0 ? (
                                <p style={{ textAlign: 'center', color: 'var(--color-gray-400)', padding: 'var(--space-8)' }}>No pending requests.</p>
                            ) : (
                                pendingMembers.map((member: any) => (
                                    <div key={member.$id} className="card-neumorphic" style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', background: 'rgba(245, 158, 11, 0.03)' }}>
                                        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                                            <div style={{
                                                width: '48px', height: '48px', borderRadius: '50%',
                                                background: 'var(--color-gray-200)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                                            }}>
                                                {member.user?.name?.charAt(0) || '?'}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: 0 }}>{member.user?.name || 'Unknown User'}</h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: '4px' }}>
                                                    <Mail size={12} color="var(--color-gray-500)" />
                                                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{member.user?.email || 'N/A'}</span>
                                                </div>
                                            </div>
                                            {isPI && (
                                                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleUpdateStatus(member.$id, 'Rejected')}
                                                        disabled={isUpdatingMember}
                                                        style={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    >
                                                        <XCircle size={14} style={{ marginRight: '6px' }} /> {isUpdatingMember ? <Loader /> : 'Reject'}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleUpdateStatus(member.$id, 'Accepted')}
                                                        disabled={isUpdatingMember}
                                                        style={{ background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    >
                                                        <CheckCircle size={14} style={{ marginRight: '6px' }} /> {isUpdatingMember ? <Loader /> : 'Accept'}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
