import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Layers, Activity, Clock, Calendar, User, Info, Edit2, Trash2, Search, Filter } from 'lucide-react'
import Loader from '../../components/ui/Loader'
import { toast } from 'react-toastify'
import { useAuth } from '../../useContext/context'
import { useCreateGrant, useJoinGrantByCode, useUserGrants, useUpdateGrant, useDeleteGrant } from '../../hooks/useGrants'

interface Grant {
    id: string
    title: string
    status: string
    type: string
    role: string
    deadline: string
    completion: number
    description?: string
    expectedFunding?: number
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
        completion: g.grant.completion || 0,
        description: g.grant.description,
        expectedFunding: g.grant.expectedFunding
    }))

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
    const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    // Form states for create/edit
    const [title, setTitle] = useState('')
    const [type, setType] = useState('Research')
    const [description, setDescription] = useState('')
    const [expectedFunding, setExpectedFunding] = useState<number>(0)
    const [code, setCode] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('All')

    const { mutateAsync: createGrant, isPending: isCreatingGrant } = useCreateGrant()
    const { mutateAsync: joinGrant, isPending: isJoiningGrant } = useJoinGrantByCode()
    const { mutateAsync: updateGrant, isPending: isUpdatingGrant } = useUpdateGrant()
    const { mutateAsync: deleteGrant, isPending: isDeletingGrant } = useDeleteGrant()

    if (!user) return <Loader fullPage label="Securing session..." />;

    const handleOpenDetails = (grant: Grant) => {
        setSelectedGrant(grant)
        setIsDetailsModalOpen(true)
    }

    const handleOpenEdit = (grant: Grant) => {
        setSelectedGrant(grant)
        setTitle(grant.title)
        setType(grant.type)
        setDescription(grant.description || '')
        setExpectedFunding(grant.expectedFunding || 0)
        setIsEditModalOpen(true)
    }

    const handleOpenDelete = (grant: Grant) => {
        setSelectedGrant(grant)
        setIsDeleteModalOpen(true)
    }

    const handleOpenWorkspace = (id: string) => {
        navigate(`/grant/${id}`)
    }

    const handleCreateGrant = async () => {
        if (!user) return;
        try {
            await createGrant({ userId: user.id, title, type, expectedFunding, description })
            await refreshGrants()
            toast.success("Grant created successfully")
            setIsCreateModalOpen(false)
            resetForms()
        } catch (error) {
            console.error(error)
            toast.error("Failed to create grant")
        }
    }

    const handleUpdateGrant = async () => {
        if (!selectedGrant) return;
        try {
            await updateGrant({
                grantId: selectedGrant.id,
                data: { name: title, type, description, expectedFunding }
            })
            await refreshGrants()
            toast.success("Grant updated successfully")
            setIsEditModalOpen(false)
        } catch (error) {
            console.error(error)
            toast.error("Failed to update grant")
        }
    }

    const handleDeleteGrant = async () => {
        if (!selectedGrant) return;
        try {
            await deleteGrant(selectedGrant.id)
            await refreshGrants()
            toast.success("Grant removed from portfolio")
            setIsDeleteModalOpen(false)
        } catch (error) {
            console.error(error)
            toast.error("Failed to delete grant")
        }
    }

    const handleJoinGrantByCode = async () => {
        if (!user) return;
        try {
            await joinGrant({ code, userId: user.id })
            await refreshGrants()
            toast.success("Joined grant successfully")
            setIsJoinModalOpen(false)
            setCode('')
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

    const resetForms = () => {
        setTitle('')
        setType('Research')
        setDescription('')
        setExpectedFunding(0)
    }

    const filteredGrants = grants.filter(grant => {
        const matchesSearch = grant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            grant.type.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'All' || grant.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
            <div className="liquid-bg">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <Navbar />

            <main style={{ paddingTop: '100px', paddingBottom: 'var(--space-16)' }}>
                <div className="container" style={{ maxWidth: '1200px' }}>
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
                            <Button variant="primary" size="md" onClick={() => { resetForms(); setIsCreateModalOpen(true); }}>+ Create New Grant</Button>
                        </div>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 'var(--space-6)',
                        marginBottom: 'var(--space-12)',
                    }}>
                        {[
                            { label: 'Total Grants', value: grants.length, icon: Layers, color: 'var(--color-primary)' },
                            { label: 'Active Projects', value: grants.filter((g: any) => g.status === 'Accepted').length, icon: Activity, color: 'var(--color-accent-indigo)' },
                            { label: 'Pending Review', value: grants.filter((g: any) => g.status === 'Pending').length, icon: Clock, color: 'var(--color-warning)' },
                        ].map((stat, i) => (
                            <div key={i} className="card-neumorphic glass" style={{
                                padding: 'var(--space-6)',
                                borderRadius: 'var(--radius-xl)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--space-4)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <stat.icon size={80} style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.05, transform: 'rotate(-10deg)', color: stat.color }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-gray-500)' }}>{stat.label}</div>
                                    <div style={{ padding: 'var(--space-2)', background: 'var(--color-white)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                                        <stat.icon size={18} />
                                    </div>
                                </div>
                                <div style={{ marginTop: 'var(--space-1)' }}>
                                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, lineHeight: 1, color: 'var(--color-gray-900)' }}>{stat.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--space-6)' }}>
                        <div style={{ gridColumn: 'span 12', marginBottom: 'var(--space-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>Active Portfolio</h2>

                            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flex: 1, maxWidth: '600px', justifyContent: 'flex-end' }}>
                                {/* Search Bar */}
                                <div style={{ position: 'relative', flex: 1, maxWidth: '350px' }}>
                                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                                    <input
                                        type="text"
                                        placeholder="Search grants or types..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px 10px 38px',
                                            borderRadius: 'var(--radius-lg)',
                                            border: '1px solid rgba(0,0,0,0.05)',
                                            background: 'rgba(255,255,255,0.8)',
                                            fontSize: 'var(--text-sm)',
                                            outline: 'none',
                                            transition: 'all 0.2s'
                                        }}
                                        className="card-neumorphic"
                                    />
                                </div>

                                {/* Status Filter */}
                                <div style={{ position: 'relative', minWidth: '140px' }}>
                                    <Filter size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px 10px 32px',
                                            borderRadius: 'var(--radius-lg)',
                                            border: '1px solid rgba(0,0,0,0.05)',
                                            background: 'rgba(255,255,255,0.8)',
                                            fontSize: 'var(--text-sm)',
                                            outline: 'none',
                                            cursor: 'pointer',
                                            appearance: 'none'
                                        }}
                                        className="card-neumorphic"
                                    >
                                        <option value="All">All Statuses</option>
                                        <option value="Accepted">Accepted</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {grantsLoading ? (
                            <div style={{ gridColumn: 'span 12', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                                <Loader />
                            </div>
                        ) : (
                            <>
                                {filteredGrants.length === 0 ? (
                                    <div style={{ gridColumn: 'span 12', textAlign: 'center', padding: 'var(--space-20)', background: 'rgba(255,255,255,0.3)', borderRadius: 'var(--radius-xl)', border: '2px dashed rgba(0,0,0,0.05)' }}>
                                        <Search size={48} style={{ color: 'var(--color-gray-200)', marginBottom: 'var(--space-4)' }} />
                                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-gray-500)' }}>No grants match your search</h3>
                                        <button onClick={() => { setSearchQuery(''); setFilterStatus('All'); }} style={{ marginTop: 'var(--space-4)', color: 'var(--color-primary)', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Clear all filters</button>
                                    </div>
                                ) : (
                                    filteredGrants.map((grant) => (
                                        <div key={grant.id} className="card-neumorphic" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', minHeight: '280px', position: 'relative' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                                                <span style={{ fontSize: '10px', fontWeight: 700, padding: '4px 8px', background: 'var(--color-gray-100)', borderRadius: 'var(--radius-sm)', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>{grant.type}</span>

                                                {grant.role === 'Principal Investigator' && (
                                                    <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                                        <button onClick={() => handleOpenEdit(grant)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', color: 'var(--color-gray-400)' }} title="Edit Grant">
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button onClick={() => handleOpenDelete(grant)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', color: 'var(--color-gray-400)' }} title="Delete Grant">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)', flex: 1, fontWeight: 700 }}>{grant.title}</h3>

                                            <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>Status</span>
                                                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: grant.status === 'Accepted' ? 'var(--color-success)' : 'var(--color-warning)' }}>{grant.status}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>Role</span>
                                                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{grant.role}</span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                                <Button variant="outline" size="sm" style={{ flex: 1 }} onClick={() => handleOpenDetails(grant)}>Details</Button>
                                                <Button variant="primary" size="sm" style={{ flex: 1 }} onClick={() => handleOpenWorkspace(grant.id)}>Open Workspace</Button>
                                            </div>
                                        </div>
                                    )))}

                                <div className="card-neumorphic glass" onClick={() => setIsJoinModalOpen(true)} style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', border: '2px dashed var(--color-gray-300)', background: 'transparent', boxShadow: 'none', cursor: 'pointer' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: 'var(--space-4)' }}>➕</div>
                                    <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-2)' }}>Expand Your Research</h3>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', marginBottom: 'var(--space-4)' }}>Join a collaborative project.</p>
                                    <Button variant="ghost" size="sm">Get Started</Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>

            {/* Create Grant Modal */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Grant Portfolio"
                footer={<><Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button><Button onClick={() => handleCreateGrant()}>{isCreatingGrant ? <Loader size="sm" variant="white" /> : 'Create'}</Button></>}>
                <div className="input-group">
                    <label className="input-label">Grant Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="e.g. Advanced Bio-Engineering Study 2026" />
                </div>
                <div className="input-group">
                    <label className="input-label">Grant Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className="input-field">
                        <option>Research</option><option>Infrastructure</option><option>Fellowship</option><option>Equipment</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Initial Funding (₦)</label>
                    <input
                        type="text"
                        value={expectedFunding === 0 ? '' : expectedFunding.toLocaleString()}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setExpectedFunding(val ? parseInt(val, 10) : 0);
                        }}
                        className="input-field"
                        placeholder="0"
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Project Description</label>
                    <textarea className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Brief overview of the grant purpose..." style={{ resize: 'none' }}></textarea>
                </div>
            </Modal>

            {/* Edit Grant Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Grant Portfolio"
                footer={<><Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button><Button onClick={() => handleUpdateGrant()}>{isUpdatingGrant ? <Loader size="sm" variant="white" /> : 'Save Changes'}</Button></>}>
                <div className="input-group">
                    <label className="input-label">Grant Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" />
                </div>
                <div className="input-group">
                    <label className="input-label">Grant Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className="input-field">
                        <option>Research</option><option>Infrastructure</option><option>Fellowship</option><option>Equipment</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Total Funding (₦)</label>
                    <input
                        type="text"
                        value={expectedFunding === 0 ? '' : expectedFunding.toLocaleString()}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setExpectedFunding(val ? parseInt(val, 10) : 0);
                        }}
                        className="input-field"
                        placeholder="0"
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Project Description</label>
                    <textarea className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={{ resize: 'none' }}></textarea>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Remove Grant?"
                footer={<><Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button><Button variant="primary" style={{ background: 'var(--color-error)' }} onClick={() => handleDeleteGrant()}>{isDeletingGrant ? <Loader size="sm" variant="white" /> : 'Confirm Deletion'}</Button></>}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}>
                    Are you sure you want to remove <strong>{selectedGrant?.title}</strong> from your portfolio? This will permanently delete the grant and all its associated data.
                </p>
            </Modal>

            {/* Join Grant Modal */}
            <Modal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} title="Join Existing Grant"
                footer={<><Button variant="ghost" onClick={() => setIsJoinModalOpen(false)}>Cancel</Button><Button onClick={() => handleJoinGrantByCode()}>{isJoiningGrant ? <Loader size="sm" variant="white" /> : 'Join'}</Button></>}>
                <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>Enter the unique Grant Identifier or Invite Code provided by the project owner.</p>
                <div className="input-group">
                    <label className="input-label">Grant ID / Invite Code</label>
                    <input type="text" className="input-field" value={code} onChange={(e) => setCode(e.target.value)} placeholder="GRT-XXX-XXX" />
                </div>
            </Modal>

            {/* Grant Details Modal */}
            <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Grant Overview" footer={<Button onClick={() => setIsDetailsModalOpen(false)}>Close Overview</Button>}>
                {selectedGrant && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Info size={20} /></div>
                            <div><h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{selectedGrant.title}</h3><p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>ID: {selectedGrant.id.toUpperCase()}</p></div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                            <div><div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}><Calendar size={12} color="var(--color-gray-400)" /><span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Deadline</span></div><div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{selectedGrant.deadline}</div></div>
                            <div><div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}><User size={12} color="var(--color-gray-400)" /><span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Access Level</span></div><div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{selectedGrant.role}</div></div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Compliance Status</span>
                            <div style={{ height: '8px', width: '100%', background: 'var(--color-gray-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}><div style={{ height: '100%', width: `${selectedGrant.completion}%`, background: 'var(--color-success)' }} /></div>
                            <span style={{ fontSize: '10px', color: 'var(--color-gray-400)' }}>{selectedGrant.completion}%</span>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
