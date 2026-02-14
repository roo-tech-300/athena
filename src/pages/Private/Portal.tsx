import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Layers, Activity, Clock, Landmark, PlusCircle, Building2, Search, GraduationCap, ChevronRight as ChevronIcon } from 'lucide-react'
import Loader from '../../components/ui/Loader'
import { toast } from 'react-toastify'
import { useAuth } from '../../useContext/context'
import { useCreateGrant, useJoinGrantByCode, useUserGrants, useUpdateGrant, useDeleteGrant } from '../../hooks/useGrants'
import { useUserDepartments, useCreateDepartment } from '../../hooks/useDepartments'

// Sub-components
import StatCard from '../../components/portal/StatCard'
import GrantCard from '../../components/portal/GrantCard'
import DeptCard from '../../components/portal/DeptCard'
import PortalFilters from '../../components/portal/PortalFilters'

import type { Grant } from '../../types/portal'

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
        expectedFunding: g.grant.expectedFunding,
        department: g.grant.department,
        departmentName: g.grant.departmentName || 'Personal Projects'
    }))

    const { data: departments = [] } = useUserDepartments(user?.id || '')
    const isAnyDeptAdmin = (departments as any[]).some(d => d.userRole === 'Admin')
    const { mutateAsync: createDept, isPending: isCreatingDept } = useCreateDepartment()

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isSelectDeptModalOpen, setIsSelectDeptModalOpen] = useState(false)
    const [isCreateDeptModalOpen, setIsCreateDeptModalOpen] = useState(false)
    const [selectedDeptId, setSelectedDeptId] = useState<string>('')
    const [newDeptName, setNewDeptName] = useState('')
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
    const [activeTab, setActiveTab] = useState<'grants' | 'departments'>('grants')

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
        if (!user || !selectedDeptId) return;
        try {
            await createGrant({
                userId: user.id,
                title,
                type,
                expectedFunding,
                description,
                departmentId: selectedDeptId
            })
            await refreshGrants()
            toast.success("Grant created successfully")
            setIsCreateModalOpen(false)
            resetForms()
        } catch (error) {
            console.error(error)
            toast.error("Failed to create grant")
        }
    }

    const handleCreateDepartment = async () => {
        if (!user || !newDeptName) return;
        try {
            const { department } = await createDept({ name: newDeptName, userId: user.id });
            toast.success(`${newDeptName} group created!`);
            setIsCreateDeptModalOpen(false);
            setNewDeptName('');
            setSelectedDeptId(department.$id);
            setIsSelectDeptModalOpen(false);
            setIsCreateModalOpen(true);
        } catch (error) {
            console.error(error);
            toast.error("Failed to create funding group");
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
            grant.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            grant.departmentName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'All' || grant.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Group grants by department (using both ID and Name)
    const groupedGrants = filteredGrants.reduce((acc: any, grant: Grant) => {
        const groupKey = grant.department || 'personal';
        if (!acc[groupKey]) {
            acc[groupKey] = {
                id: grant.department,
                name: grant.departmentName,
                grants: []
            };
        }
        acc[groupKey].grants.push(grant);
        return acc;
    }, {});

    return (
        <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
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

                        {/* Tab Navigation */}
                        {isAnyDeptAdmin && (
                            <div style={{ display: 'flex', gap: 'var(--space-1)', background: 'rgba(0,0,0,0.03)', padding: '4px', borderRadius: 'var(--radius-lg)' }}>
                                {(['grants', 'departments'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        style={{
                                            padding: '8px 20px',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 700,
                                            transition: 'all 0.2s',
                                            border: 'none',
                                            background: activeTab === tab ? 'white' : 'transparent',
                                            color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-gray-500)',
                                            boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {tab === 'grants' ? 'Grants' : 'Manage Research Groups'}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Statistics Bar */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 'var(--space-6)',
                        marginBottom: 'var(--space-12)',
                    }}>
                        <StatCard
                            label="Total Grants"
                            value={grants.length}
                            icon={Layers}
                            color="var(--color-primary)"
                        />
                        <StatCard
                            label="Active Projects"
                            value={grants.filter((g: any) => g.status === 'Accepted').length}
                            icon={Activity}
                            color="var(--color-accent-indigo)"
                        />
                        <StatCard
                            label="Pending Review"
                            value={grants.filter((g: any) => g.status === 'Pending').length}
                            icon={Clock}
                            color="var(--color-warning)"
                        />
                    </div>

                    {/* Conditional Toolbar for Grants */}
                    {activeTab === 'grants' && (
                        <PortalFilters
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            filterStatus={filterStatus}
                            setFilterStatus={setFilterStatus}
                            onJoin={() => setIsJoinModalOpen(true)}
                            onCreate={() => { resetForms(); setIsSelectDeptModalOpen(true); }}
                        />
                    )}

                    {/* Main Content Area */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
                        {activeTab === 'grants' ? (
                            <div style={{ gridColumn: 'span 12' }}>
                                {grantsLoading ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-20) 0' }}><Loader /></div>
                                ) : grants.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: 'var(--space-20)', background: 'rgba(255,255,255,0.4)', borderRadius: 'var(--radius-2xl)', border: '2px dashed rgba(0,0,0,0.05)', backdropFilter: 'blur(10px)' }}>
                                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary-light), white)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-6) auto', fontSize: '32px', boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.2)', color: 'var(--color-primary)' }}>
                                            <GraduationCap size={40} />
                                        </div>
                                        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Begin Your Research Journey</h2>
                                        <p style={{ color: 'var(--color-gray-500)', maxWidth: '400px', margin: '0 auto var(--space-8) auto' }}>Your research portfolio is currently empty. Start by creating a new grant or join an existing collaborative project.</p>
                                        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginTop: 'var(--space-8)' }}>
                                            <Button variant="outline" onClick={() => setIsJoinModalOpen(true)}>Join Existing Grant</Button>
                                        </div>
                                    </div>
                                ) : Object.keys(groupedGrants).length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: 'var(--space-20)', background: 'rgba(255,255,255,0.3)', borderRadius: 'var(--radius-xl)', border: '2px dashed rgba(0,0,0,0.05)' }}>
                                        <Search size={48} style={{ color: 'var(--color-gray-200)', marginBottom: 'var(--space-4)' }} />
                                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-gray-500)' }}>No grants match your search</h3>
                                        <button onClick={() => { setSearchQuery(''); setFilterStatus('All'); }} style={{ marginTop: 'var(--space-4)', color: 'var(--color-primary)', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Clear all filters</button>
                                    </div>
                                ) : (
                                    Object.entries(groupedGrants).map(([groupId, groupData]: [string, any]) => (
                                        <div key={groupId} style={{ marginBottom: 'var(--space-12)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                                                <div style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-md)', background: 'var(--color-gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gray-500)' }}>
                                                    <Landmark size={14} />
                                                </div>
                                                <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-gray-500)' }}>{groupData.name}</h3>
                                                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(0,0,0,0.05), transparent)', marginLeft: 'var(--space-4)' }} />
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--space-6)' }}>
                                                {groupData.grants.map((grant: Grant) => (
                                                    <div key={grant.id} style={{ gridColumn: 'span 4' }}>
                                                        <GrantCard
                                                            grant={grant}
                                                            onDetails={handleOpenDetails}
                                                            onWorkspace={handleOpenWorkspace}
                                                            onEdit={handleOpenEdit}
                                                            onDelete={handleOpenDelete}
                                                        />
                                                    </div>
                                                ))}
                                                <div
                                                    className="card-neumorphic"
                                                    onClick={() => { setSelectedDeptId(groupId); setIsCreateModalOpen(true); }}
                                                    style={{
                                                        gridColumn: 'span 4',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        textAlign: 'center',
                                                        border: '2px dashed var(--color-primary)',
                                                        background: 'rgba(59, 130, 246, 0.04)',
                                                        boxShadow: 'none',
                                                        cursor: 'pointer',
                                                        minHeight: '280px',
                                                        transition: 'all 0.2s',
                                                        padding: 'var(--space-6)'
                                                    }}
                                                    onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                                    onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                                >
                                                    <div style={{
                                                        width: '52px',
                                                        height: '52px',
                                                        borderRadius: '50%',
                                                        background: 'var(--color-primary)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        marginBottom: 'var(--space-4)',
                                                        fontSize: '24px',
                                                        fontWeight: 'bold',
                                                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                                                    }}>+</div>
                                                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-gray-700)', lineHeight: '1.5' }}>
                                                        Add Grant to <br />
                                                        <strong style={{ color: 'var(--color-primary)' }}>{groupData.name}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : (
                            /* Departments Tab Content */
                            <div style={{ gridColumn: 'span 12' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
                                    <div>
                                        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>Grants Groups & Research Groups</h2>
                                        <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>Manage administrative access and billing for your research organizations.</p>
                                    </div>
                                    <Button variant="primary" style={{ borderRadius: 'var(--radius-full)' }} onClick={() => setIsCreateDeptModalOpen(true)}>+ Create Research Group</Button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--space-6)' }}>
                                    {departments.length === 0 ? (
                                        <div style={{ gridColumn: 'span 12', textAlign: 'center', padding: 'var(--space-20)', background: 'white', borderRadius: 'var(--radius-xl)' }}>
                                            <Building2 size={48} style={{ color: 'var(--color-gray-200)', marginBottom: 'var(--space-4)' }} />
                                            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>No research groups found</h3>
                                            <p style={{ color: 'var(--color-gray-500)', marginBottom: 'var(--space-6)' }}>You haven't joined or created any funding groups yet.</p>
                                            <Button variant="primary" onClick={() => setIsCreateDeptModalOpen(true)}>Create First Research Group</Button>
                                        </div>
                                    ) : (
                                        departments.map((dept: any) => (
                                            <div key={dept.$id} style={{ gridColumn: 'span 6' }}>
                                                <DeptCard
                                                    dept={dept}
                                                    grantCount={grants.filter(g => g.department === dept.$id).length}
                                                    totalFunding={grants.filter(g => g.department === dept.$id).reduce((sum, g) => sum + (g.expectedFunding || 0), 0)}
                                                />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modals Section */}
            <Modal
                isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Grant Portfolio"
                footer={<><Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button><Button onClick={handleCreateGrant}>{isCreatingGrant ? <Loader size="sm" variant="white" /> : 'Create'}</Button></>}
            >
                <div className="input-group"><label className="input-label">Grant Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="e.g. Advanced Bio-Engineering Study 2026" /></div>
                <div className="input-group"><label className="input-label">Grant Type</label><select value={type} onChange={(e) => setType(e.target.value)} className="input-field"><option>Research</option><option>Infrastructure</option><option>Fellowship</option><option>Equipment</option></select></div>
                <div className="input-group"><label className="input-label">Initial Funding (₦)</label><input type="text" value={expectedFunding === 0 ? '' : expectedFunding.toLocaleString()} onChange={(e) => { const val = e.target.value.replace(/\D/g, ''); setExpectedFunding(val ? parseInt(val, 10) : 0); }} className="input-field" placeholder="0" /></div>
                <div className="input-group"><label className="input-label">Project Description</label><textarea className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Brief overview of the grant purpose..." style={{ resize: 'none' }}></textarea></div>
            </Modal>

            <Modal
                isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Grant Portfolio"
                footer={<><Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button><Button onClick={handleUpdateGrant}>{isUpdatingGrant ? <Loader size="sm" variant="white" /> : 'Save Changes'}</Button></>}
            >
                <div className="input-group"><label className="input-label">Grant Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" /></div>
                <div className="input-group"><label className="input-label">Grant Type</label><select value={type} onChange={(e) => setType(e.target.value)} className="input-field"><option>Research</option><option>Infrastructure</option><option>Fellowship</option><option>Equipment</option></select></div>
                <div className="input-group"><label className="input-label">Total Funding (₦)</label><input type="text" value={expectedFunding === 0 ? '' : expectedFunding.toLocaleString()} onChange={(e) => { const val = e.target.value.replace(/\D/g, ''); setExpectedFunding(val ? parseInt(val, 10) : 0); }} className="input-field" placeholder="0" /></div>
                <div className="input-group"><label className="input-label">Project Description</label><textarea className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={{ resize: 'none' }}></textarea></div>
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Remove Grant?"
                footer={<><Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button><Button variant="primary" style={{ background: 'var(--color-error)' }} onClick={handleDeleteGrant}>{isDeletingGrant ? <Loader size="sm" variant="white" /> : 'Confirm Deletion'}</Button></>}
            >
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}>Are you sure you want to remove <strong>{selectedGrant?.title}</strong>? All data will be permanently deleted.</p>
            </Modal>

            <Modal
                isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} title="Join Existing Grant"
                footer={<><Button variant="ghost" onClick={() => setIsJoinModalOpen(false)}>Cancel</Button><Button onClick={handleJoinGrantByCode}>{isJoiningGrant ? <Loader size="sm" variant="white" /> : 'Join'}</Button></>}
            >
                <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>Enter the unique Grant Identifier or Invite Code.</p>
                <div className="input-group"><label className="input-label">Grant ID / Invite Code</label><input type="text" className="input-field" value={code} onChange={(e) => setCode(e.target.value)} placeholder="GRT-XXX-XXX" /></div>
            </Modal>

            <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Grant Overview" footer={<Button onClick={() => setIsDetailsModalOpen(false)}>Close Overview</Button>}>
                {selectedGrant && <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Layers size={20} /></div>
                        <div><h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{selectedGrant.title}</h3><p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>ID: {selectedGrant.id.toUpperCase()}</p></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', background: 'var(--color-gray-100)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
                        <div><div style={{ fontSize: '10px', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Type</div><div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{selectedGrant.type}</div></div>
                        <div><div style={{ fontSize: '10px', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Role</div><div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{selectedGrant.role}</div></div>
                    </div>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', lineHeight: '1.6' }}>{selectedGrant.description || 'No description provided.'}</p>
                </div>}
            </Modal>

            <Modal isOpen={isSelectDeptModalOpen} onClose={() => setIsSelectDeptModalOpen(false)} title="Select Funding Home">
                <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>Where should this grant belong?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {departments.length === 0 ? <p style={{ textAlign: 'center', color: 'var(--color-gray-400)' }}>No groups found.</p> : departments.map((dept: any) => (
                        <button key={dept.$id} disabled={dept.userRole !== 'Admin'} onClick={() => { setSelectedDeptId(dept.$id); setIsSelectDeptModalOpen(false); setIsCreateModalOpen(true); }} className="card-neumorphic" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4)', textAlign: 'left', cursor: dept.userRole === 'Admin' ? 'pointer' : 'not-allowed', opacity: dept.userRole === 'Admin' ? 1 : 0.6, background: 'white' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Landmark size={20} /></div>
                            <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{dept.name}</div><div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>Role: {dept.userRole}</div></div>
                            {dept.userRole === 'Admin' ? <ChevronIcon size={16} color="var(--color-primary)" /> : <div style={{ fontSize: '10px', color: 'var(--color-error)' }}>NO ACCESS</div>}
                        </button>
                    ))}
                    <div style={{ height: '1px', background: 'var(--color-gray-100)', margin: 'var(--space-2) 0' }} />
                    <button onClick={() => { setIsSelectDeptModalOpen(false); setIsCreateDeptModalOpen(true); }} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer', border: '1px dashed var(--color-primary-light)' }}>
                        <PlusCircle size={18} /> Create New Funding Group
                    </button>
                </div>
            </Modal>

            <Modal isOpen={isCreateDeptModalOpen} onClose={() => setIsCreateDeptModalOpen(false)} title="Create Funding Group" footer={<><Button variant="ghost" onClick={() => setIsCreateDeptModalOpen(false)}>Cancel</Button><Button onClick={handleCreateDepartment} disabled={isCreatingDept}>{isCreatingDept ? <Loader size="sm" variant="white" /> : 'Create Group'}</Button></>}>
                <div className="input-group"><label className="input-label">Name of Research Group</label><input type="text" className="input-field" value={newDeptName} onChange={e => setNewDeptName(e.target.value)} placeholder="e.g. Biomedical Sciences" /></div>
            </Modal>
        </div>
    )
}
