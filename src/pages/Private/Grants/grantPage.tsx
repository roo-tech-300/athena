import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    WalletCards,
    Milestone,
    Send,
    Users,
    FileText,
    LogOut,
    ChevronRight,
    Bell,
    Settings,
    PanelLeftClose,
    PanelLeftOpen,
    Lock
} from 'lucide-react'
import Dashboard from '../../../components/grants/Dashboard'
import BudgetTracker from '../../../components/grants/BudgetTracker'
import Milestones from '../../../components/grants/Milestones'
import Deliverables from '../../../components/grants/Deliverables'
import Personnel from '../../../components/grants/Personnel'
import Documents from '../../../components/grants/Documents'
import PendingAccess from '../../../components/grants/PendingAccess'
import GrantSettings from '../../../components/grants/GrantSettings'
import PremiumFeatureGuard from '../../../components/grants/PremiumFeatureGuard'
import { SidebarItem } from '../../../components/grants/grantLayout/SideBarItem'
import { useAuth } from '../../../useContext/context'
import { useLogoutAccount } from '../../../hooks/useAuth'
import Loader from '../../../components/ui/Loader'
import { useGrant, useGrantMembers } from '../../../hooks/useGrants'
import { useDepartment } from '../../../hooks/useDepartments'
import { getUserInitials } from '../../../utils/user'
import { isPremiumFeature, isPremiumFeatureAllowed } from '../../../utils/subscription'




export default function GrantPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('Dashboard')
    const [isSidebarVisible, setIsSidebarVisible] = useState(true)
    // const [grant, setGrant] = useState<any>(null)

    const { data: grant, isLoading: grantLoading } = useGrant(id!)
    const { data: members, isLoading: membersLoading } = useGrantMembers(id!)
    const { data: department, isLoading: departmentLoading } = useDepartment(grant?.department || '')
    const { user, logout } = useAuth()

    const sidebarItems = [
        { label: 'Dashboard', icon: LayoutDashboard },
        { label: 'Budget tracker', icon: WalletCards },
        { label: 'Milestones', icon: Milestone },
        { label: 'Deliverables', icon: Send },
        { label: 'Personnel', icon: Users },
        { label: 'Documents', icon: FileText },
        { label: 'Settings', icon: Settings },
    ]

    const { mutateAsync: logoutMutation, isPending: logoutPending } = useLogoutAccount()

    // log out
    const handleLogout = async () => {
        try {
            await logoutMutation()
            logout() // Immediately clear AuthContext state
            navigate('/login')
        } catch (error) {
            console.log(error)
        }
    }

    // sidebar width
    const sidebarWidth = isSidebarVisible ? '260px' : '80px'

    if (grantLoading || membersLoading || departmentLoading) return <Loader fullPage size="xl" label="Loading Grant Workspace..." />
    if (!grant) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Grant not found</div>

    const myMembership = members?.find((m: any) =>
        (m.user?.$id === user?.id || m.user === user?.id)
    );

    const roles = myMembership?.role || [];
    const isPI = roles.includes('Principal Investigator');
    const isReviewer = roles.includes('Reviewer');
    const isFO = roles.includes('Finance Officer');
    const isResearcher = roles.includes('Researcher');

    const filteredSidebarItems = sidebarItems.filter(item => {
        if (isPI || isReviewer) return true;

        const allowedTabs = ['Dashboard', 'Documents'];
        if (isPI) allowedTabs.push('Settings');
        if (isFO) allowedTabs.push('Budget tracker');
        if (isResearcher) allowedTabs.push('Milestones', 'Deliverables', 'Personnel');

        return allowedTabs.includes(item.label);
    });

    if (myMembership?.status === 'Pending') {
        return <PendingAccess grantName={grant.name} />
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-gray-50)' }}>
            {/* Sidebar */}
            <aside className="glass" style={{
                width: sidebarWidth,
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                display: 'flex',
                flexDirection: 'column',
                padding: isSidebarVisible ? 'var(--space-6)' : 'var(--space-6) var(--space-2)',
                borderRight: '1px solid rgba(0,0,0,0.05)',
                zIndex: 10,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    marginBottom: 'var(--space-12)',
                    justifyContent: isSidebarVisible ? 'flex-start' : 'center'
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'var(--color-primary)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700,
                        minWidth: '32px'
                    }}>A</div>
                    {isSidebarVisible && <span style={{ fontWeight: 700, fontSize: 'var(--text-lg)', whiteSpace: 'nowrap' }}>Athena</span>}
                </div>

                <nav style={{ flex: 1 }}>
                    {filteredSidebarItems.map((item) => {
                        const isPremium = isPremiumFeature(item.label)
                        const hasAccess = isPremiumFeatureAllowed(department)
                        const showLock = isPremium && !hasAccess
                        
                        return (
                            <div key={item.label} style={{ position: 'relative' }}>
                                <SidebarItem
                                    icon={item.icon}
                                    label={item.label}
                                    isActive={activeTab === item.label}
                                    onClick={() => setActiveTab(item.label)}
                                    isCollapsed={!isSidebarVisible}
                                />
                                {showLock && isSidebarVisible && (
                                    <div style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--color-warning)',
                                        pointerEvents: 'none'
                                    }}>
                                        <Lock size={14} />
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </nav>

                <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 'var(--space-6)' }}>
                    {
                        logoutPending ? (
                            <Loader size="sm" />
                        ) : (
                            <SidebarItem
                                icon={LogOut}
                                label="Logout"
                                isActive={false}
                                onClick={handleLogout}
                                isCollapsed={!isSidebarVisible}
                            />
                        )
                    }
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{
                marginLeft: sidebarWidth,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                {/* Top Navbar */}
                <header style={{
                    height: '72px',
                    padding: '0 var(--space-8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'white',
                    borderBottom: '1px solid rgba(0,0,0,0.05)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                        <button
                            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                            className="btn-ghost"
                            style={{
                                padding: 'var(--space-2)',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: 'none',
                                background: 'var(--color-gray-50)',
                                cursor: 'pointer'
                            }}
                        >
                            {isSidebarVisible ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>
                            <button
                                onClick={() => navigate('/portal')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--color-gray-500)',
                                    cursor: 'pointer',
                                    padding: 0,
                                    fontWeight: 600,
                                    fontSize: 'var(--text-sm)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-gray-500)'}
                            >
                                Portal
                            </button>
                            <ChevronRight size={14} />
                            <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{grant?.name}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                        <button className="btn-ghost" style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <Bell size={20} />
                        </button>
                        <button
                            className="btn-ghost"
                            style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', background: 'none', border: 'none', cursor: 'pointer' }}
                            onClick={() => setActiveTab('Settings')}
                        >
                            <Settings size={20} />
                        </button>
                        <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 'var(--text-xs)' }}>
                            {getUserInitials(user)}
                        </div>
                    </div>
                </header>

                {/* Content */}
                {activeTab === 'Dashboard' ? (
                    <div style={{ padding: 'var(--space-8)', flex: 1 }}>
                        <div style={{ marginBottom: 'var(--space-8)' }}>
                            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>{activeTab}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                                <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Project: <span style={{ color: 'var(--color-gray-900)', fontWeight: 600 }}>{grant.name}</span></p>
                                <div style={{ width: '1px', height: '14px', background: 'var(--color-gray-300)' }} />
                                <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Grant Code: <span style={{ color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '0.05em', background: 'var(--color-primary-light)', padding: '2px 8px', borderRadius: '4px' }}>{grant.code}</span></p>
                            </div>
                        </div>
                        <Dashboard grant={grant} myMembership={myMembership} setActiveTab={setActiveTab} />
                    </div>
                ) : activeTab === 'Budget tracker' ? (
                    <PremiumFeatureGuard department={department} featureName="Budget Tracker">
                        <div style={{ padding: 'var(--space-8)', flex: 1 }}>
                            <div style={{ marginBottom: 'var(--space-8)' }}>
                                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>{activeTab}</h1>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                                    <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Project: <span style={{ color: 'var(--color-gray-900)', fontWeight: 600 }}>{grant.name}</span></p>
                                    <div style={{ width: '1px', height: '14px', background: 'var(--color-gray-300)' }} />
                                    <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Grant Code: <span style={{ color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '0.05em', background: 'var(--color-primary-light)', padding: '2px 8px', borderRadius: '4px' }}>{grant.code}</span></p>
                                </div>
                            </div>
                            <BudgetTracker grant={grant} myMembership={myMembership} />
                        </div>
                    </PremiumFeatureGuard>
                ) : activeTab === 'Milestones' ? (
                    <PremiumFeatureGuard department={department} featureName="Milestones">
                        <div style={{ padding: 'var(--space-8)', flex: 1 }}>
                            <div style={{ marginBottom: 'var(--space-8)' }}>
                                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>{activeTab}</h1>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                                    <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Project: <span style={{ color: 'var(--color-gray-900)', fontWeight: 600 }}>{grant.name}</span></p>
                                    <div style={{ width: '1px', height: '14px', background: 'var(--color-gray-300)' }} />
                                    <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Grant Code: <span style={{ color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '0.05em', background: 'var(--color-primary-light)', padding: '2px 8px', borderRadius: '4px' }}>{grant.code}</span></p>
                                </div>
                            </div>
                            <Milestones grant={grant} myMembership={myMembership} />
                        </div>
                    </PremiumFeatureGuard>
                ) : activeTab === 'Deliverables' ? (
                    <PremiumFeatureGuard department={department} featureName="Deliverables">
                        <div style={{ padding: 'var(--space-8)', flex: 1 }}>
                            <div style={{ marginBottom: 'var(--space-8)' }}>
                                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>{activeTab}</h1>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                                    <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Project: <span style={{ color: 'var(--color-gray-900)', fontWeight: 600 }}>{grant.name}</span></p>
                                    <div style={{ width: '1px', height: '14px', background: 'var(--color-gray-300)' }} />
                                    <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Grant Code: <span style={{ color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '0.05em', background: 'var(--color-primary-light)', padding: '2px 8px', borderRadius: '4px' }}>{grant.code}</span></p>
                                </div>
                            </div>
                            <Deliverables grant={grant} myMembership={myMembership} />
                        </div>
                    </PremiumFeatureGuard>
                ) : activeTab === 'Personnel' ? (
                    <div style={{ padding: 'var(--space-8)', flex: 1 }}>
                        <div style={{ marginBottom: 'var(--space-8)' }}>
                            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>{activeTab}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                                <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Project: <span style={{ color: 'var(--color-gray-900)', fontWeight: 600 }}>{grant.name}</span></p>
                                <div style={{ width: '1px', height: '14px', background: 'var(--color-gray-300)' }} />
                                <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Grant Code: <span style={{ color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '0.05em', background: 'var(--color-primary-light)', padding: '2px 8px', borderRadius: '4px' }}>{grant.code}</span></p>
                            </div>
                        </div>
                        <Personnel grant={grant} myMembership={myMembership} />
                    </div>
                ) : activeTab === 'Documents' ? (
                    <PremiumFeatureGuard department={department} featureName="Documents">
                        <div style={{ padding: 'var(--space-8)', flex: 1 }}>
                            <div style={{ marginBottom: 'var(--space-8)' }}>
                                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>{activeTab}</h1>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                                    <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Project: <span style={{ color: 'var(--color-gray-900)', fontWeight: 600 }}>{grant.name}</span></p>
                                    <div style={{ width: '1px', height: '14px', background: 'var(--color-gray-300)' }} />
                                    <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Grant Code: <span style={{ color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '0.05em', background: 'var(--color-primary-light)', padding: '2px 8px', borderRadius: '4px' }}>{grant.code}</span></p>
                                </div>
                            </div>
                            <Documents grant={grant} myMembership={myMembership} />
                        </div>
                    </PremiumFeatureGuard>
                ) : activeTab === 'Settings' ? (
                    <div style={{ padding: 'var(--space-8)', flex: 1 }}>
                        <div style={{ marginBottom: 'var(--space-8)' }}>
                            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>{activeTab}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                                <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Project: <span style={{ color: 'var(--color-gray-900)', fontWeight: 600 }}>{grant.name}</span></p>
                                <div style={{ width: '1px', height: '14px', background: 'var(--color-gray-300)' }} />
                                <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Grant Code: <span style={{ color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '0.05em', background: 'var(--color-primary-light)', padding: '2px 8px', borderRadius: '4px' }}>{grant.code}</span></p>
                            </div>
                        </div>
                        <GrantSettings grant={grant} isPI={isPI} />
                    </div>
                ) : (
                    <div style={{ padding: 'var(--space-8)', flex: 1 }}>
                        <div className="card-neumorphic" style={{ minHeight: '500px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-gray-300)' }}>
                                    {activeTab} Component Content
                                </p>
                                <p style={{ color: 'var(--color-gray-400)', marginTop: '8px' }}>This section is currently under development.</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
