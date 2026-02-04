import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Layers, Activity, Clock, Calendar, User, Info } from 'lucide-react'
import Loader from '../../components/ui/Loader'
import { toast } from 'react-toastify'
import { useAuth } from '../../useContext/context'
import { useCreateGrant, useJoinGrantByCode, useUserGrants } from '../../hooks/useGrants'

interface Grant {
    id: string
    title: string
    status: string
    type: string
    role: string
    deadline: string
    completion: number
}

export default function Portal() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { data: grantsData, isLoading: grantsLoading, refetch: refreshGrants } = useUserGrants(user?.id || '')

    // Format grants for the UI
    const grants = (grantsData || []).map((g: any) => ({
        id: g.grant.$id,
        title: g.grant.name,
        status: g.status || 'Accepted',
        type: g.grant.type,
        role: g.role[0] || 'Member',
        deadline: g.grant.deadline || '2026-12-31',
        completion: g.grant.completion 
    }))

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
    const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [type, setType] = useState('')
    const [description, setDescription] = useState('')
    const [code, setCode] = useState('')

    const { mutateAsync: createGrant, isPending: isCreatingGrant } = useCreateGrant()
    const { mutateAsync: joinGrant, isPending: isJoiningGrant } = useJoinGrantByCode()

    if (!user) return <Loader fullPage label="Securing session..." />;



    const handleOpenDetails = (grant: Grant) => {
        setSelectedGrant(grant)
        setIsDetailsModalOpen(true)
    }

    const handleOpenWorkspace = (id: string) => {
        navigate(`/grant/${id}`)
    }

    const handleCreateGrant = async () => {
        if (!user) return;
        try {
            await createGrant({ userId: user.id, title, type, expectedFunding: 0, description })
            await refreshGrants()
            toast.success("Grant created successfully")
            setIsCreateModalOpen(false)

        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const handleJoinGrantByCode = async () => {
        if (!user) return;
        try {
            await joinGrant({ code, userId: user.id })
            await refreshGrants()
            toast.success("Joined grant successfully")
            setIsJoinModalOpen(false)
        } catch (error: any) {
            console.error(error)
            if (error.message === 'ALREADY_MEMBER') {
                toast.error("You are already a member of this grant.")
            } else if (error.message === 'GRANT_NOT_FOUND') {
                toast.error("Invalid grant code. Please check and try again.")
            } else {
                toast.error("Failed to join grant. Please try again.")
            }
        }
    }

    return (
        <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
            {/* Liquid Background */}
            <div className="liquid-bg">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <Navbar />

            <main style={{ paddingTop: '100px', paddingBottom: 'var(--space-16)' }}>
                <div className="container" style={{ maxWidth: '1200px' }}>

                    {/* Header Section */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        marginBottom: 'var(--space-12)',
                        paddingBottom: 'var(--space-6)',
                        borderBottom: '1px solid rgba(0,0,0,0.05)'
                    }}>
                        <div>
                            <span style={{
                                color: 'var(--color-primary)',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                fontSize: 'var(--text-xs)',
                                display: 'block',
                                marginBottom: 'var(--space-2)'
                            }}>Institutional Access</span>
                            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>Grant Portal</h1>
                            <p style={{ color: 'var(--color-gray-500)', marginTop: 'var(--space-1)' }}>Manage and track your academic research portfolio.</p>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                            <Button variant="outline" size="md" onClick={() => setIsJoinModalOpen(true)}>Join Existing Grant</Button>
                            <Button variant="primary" size="md" onClick={() => setIsCreateModalOpen(true)}>+ Create New Grant</Button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 'var(--space-6)',
                            marginBottom: 'var(--space-12)',
                        }}
                    >
                        {[
                            { label: 'Total Grants', value: grants.length, icon: Layers, color: 'var(--color-primary)' },
                            { label: 'Active Projects', value: grants.filter((g: any) => g.status === 'Accepted').length, icon: Activity, color: 'var(--color-accent-indigo)' },
                            { label: 'Pending Review', value: grants.filter((g: any) => g.status === 'Pending').length, icon: Clock, color: 'var(--color-warning)' },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="card-neumorphic glass"
                                style={{
                                    padding: 'var(--space-6)',
                                    borderRadius: 'var(--radius-xl)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 'var(--space-4)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Decorative Icon Background */}
                                <stat.icon
                                    size={80}
                                    style={{
                                        position: 'absolute',
                                        right: '-10px',
                                        bottom: '-10px',
                                        opacity: 0.05,
                                        transform: 'rotate(-10deg)',
                                        color: stat.color
                                    }}
                                />

                                {/* Header & Icon */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div
                                        style={{
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                            color: 'var(--color-gray-500)',
                                        }}
                                    >
                                        {stat.label}
                                    </div>
                                    <div style={{
                                        padding: 'var(--space-2)',
                                        background: 'var(--color-white)',
                                        borderRadius: 'var(--radius-md)',
                                        boxShadow: 'var(--shadow-sm)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: stat.color
                                    }}>
                                        <stat.icon size={18} />
                                    </div>
                                </div>

                                {/* Main value */}
                                <div style={{ marginTop: 'var(--space-1)' }}>
                                    <div
                                        style={{
                                            fontSize: 'var(--text-3xl)',
                                            fontWeight: 700,
                                            lineHeight: 1,
                                            color: 'var(--color-gray-900)',
                                            marginBottom: 'var(--space-1)'
                                        }}
                                    >
                                        {stat.value}
                                    </div>
                                </div>

                                {/* Progress */}
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-3)',
                                        marginTop: 'auto',
                                    }}
                                >
                                </div>
                            </div>
                        ))}
                    </div>


                    {/* Grants Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(12, 1fr)',
                        gap: 'var(--space-6)'
                    }}>
                        <div style={{ gridColumn: 'span 12', marginBottom: 'var(--space-2)' }}>
                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>Active Portfolio</h2>
                        </div>

                        {grantsLoading ? (
                            <div style={{ gridColumn: 'span 12', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                                <Loader />
                            </div>
                        ) : (
                            <>
                                {grants.map((grant) => (
                                    <div key={grant.id} className="card-neumorphic" style={{
                                        gridColumn: 'span 4',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        minHeight: '260px'
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
                                            <div style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: grant.status === 'Active' ? 'var(--color-success)' : grant.status === 'Under Review' ? 'var(--color-warning)' : 'var(--color-gray-300)'
                                            }}></div>
                                        </div>

                                        <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)', flex: 1 }}>{grant.title}</h3>

                                        <div style={{
                                            background: 'var(--color-gray-50)',
                                            padding: 'var(--space-4)',
                                            borderRadius: 'var(--radius-lg)',
                                            marginBottom: 'var(--space-6)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>Status</span>
                                                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{grant.status}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>Role</span>
                                                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{grant.role}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                            <Button variant="outline" size="sm" style={{ flex: 1 }} onClick={() => handleOpenDetails(grant)}>Details</Button>
                                            <Button variant="primary" size="sm" style={{ flex: 1 }} onClick={() => handleOpenWorkspace(grant.id)}>Open Workspace</Button>
                                        </div>
                                    </div>

                                ))}

                                {/* Join/Create Prompt Card */}
                                <div className="card-neumorphic glass"
                                    onClick={() => setIsJoinModalOpen(true)}
                                    style={{
                                        gridColumn: 'span 4',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        border: '2px dashed var(--color-gray-300)',
                                        background: 'transparent',
                                        boxShadow: 'none',
                                        cursor: 'pointer'
                                    }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: 'var(--color-primary-light)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '24px',
                                        marginBottom: 'var(--space-4)'
                                    }}>
                                        ➕
                                    </div>
                                    <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-2)' }}>Expand Your Research</h3>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', marginBottom: 'var(--space-4)' }}>Start a new grant application or join a collaborative project.</p>
                                    <Button variant="ghost" size="sm">Get Started</Button>
                                </div>
                            </>
                        )}


                    </div>

                </div>
            </main>

            {/* Create Grant Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Grant Portfolio"
                footer={<>
                    <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                    <Button onClick={() => handleCreateGrant()}>{isCreatingGrant ? <Loader size="sm" variant="white" /> : 'Create'}</Button>
                </>}
            >
                <div className="input-group">
                    <label className="input-label">Grant Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="e.g. Advanced Bio-Engineering Study 2026" />
                </div>
                <div className="input-group">
                    <label className="input-label">Grant Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className="input-field">
                        <option>Research</option>
                        <option>Infrastructure</option>
                        <option>Fellowship</option>
                        <option>Equipment</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Project Description</label>
                    <textarea
                        className="input-field"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Brief overview of the grant purpose..."
                        style={{ resize: 'none' }}
                    ></textarea>
                </div>
            </Modal >

            {/* Join Grant Modal */}
            < Modal
                isOpen={isJoinModalOpen}
                onClose={() => setIsJoinModalOpen(false)}
                title="Join Existing Grant"
                footer={<>
                    <Button variant="ghost" onClick={() => setIsJoinModalOpen(false)}>Cancel</Button>
                    <Button onClick={() => handleJoinGrantByCode()}>{isJoiningGrant ? <Loader size="sm" variant="white" /> : 'Join'}</Button>
                </>}
            >
                <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                    Enter the unique Grant Identifier or Invite Code provided by the project owner to request collaboration access.
                </p>
                <div className="input-group">
                    <label className="input-label">Grant ID / Invite Code</label>
                    <input type="text" className="input-field" value={code} onChange={(e) => setCode(e.target.value)} placeholder="GRT-XXX-XXX" />
                </div>
                <div style={{
                    padding: 'var(--space-4)',
                    background: 'var(--color-primary-light)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    gap: 'var(--space-3)',
                    alignItems: 'center'
                }}>
                    <span style={{ fontSize: '20px' }}>💡</span>
                    <p style={{ fontSize: '11px', color: 'var(--color-primary-dark)', fontWeight: 500 }}>
                        Collaboration requests must be approved by the Grant Owner or an Administrator.
                    </p>
                </div>
            </Modal>

            {/* Grant Details Modal */}
            <Modal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                title="Grant Overview"
                footer={<Button onClick={() => setIsDetailsModalOpen(false)}>Close Overview</Button>}
            >
                {selectedGrant && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--color-primary-light)',
                                color: 'var(--color-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Info size={20} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{selectedGrant.title}</h3>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>ID: {selectedGrant.id.toUpperCase()}-2026</p>
                            </div>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 'var(--space-4)',
                            background: 'var(--color-gray-50)',
                            padding: 'var(--space-4)',
                            borderRadius: 'var(--radius-lg)'
                        }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <Calendar size={12} color="var(--color-gray-400)" />
                                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Deadline</span>
                                </div>
                                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{selectedGrant.deadline}</div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <User size={12} color="var(--color-gray-400)" />
                                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Access Level</span>
                                </div>
                                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{selectedGrant.role}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Compliance Status</span>
                            <div style={{
                                height: '8px',
                                width: '100%',
                                background: 'var(--color-gray-100)',
                                borderRadius: 'var(--radius-full)',
                                overflow: 'hidden'
                            }}>
                                <div style={{ height: '100%', width: `${selectedGrant.completion}%`, background: 'var(--color-success)' }} />
                            </div>
                            <span style={{ fontSize: '10px', color: 'var(--color-gray-400)' }}>{selectedGrant.completion}%</span>
                        </div>
                    </div>
                )}
            </Modal>
        </div >
    )
}
