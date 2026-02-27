import { useState } from 'react'
import { FileText, Calendar, File, FolderOpen, Plus, CheckCircle, Clock, BookOpen, Users } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'
import Button from '../ui/Button'
import Loader from '../ui/Loader'
import { useToast } from '../ui/Toast'
import { useGetMilestones } from '../../hooks/useMilestones'
import { useGetDeliverables } from '../../hooks/useDeliverables'
import { createGoogleDoc } from '../../lib/googleDocs'
import { useCreateDocument, useGetDocuments, useUpdateDocument } from '../../hooks/useDocuments'
import { useGetUser } from '../../hooks/useUser'

const getTypeConfig = (type?: string) => {
    switch (type) {
        case 'Report':
        case 'report':
            return {
                color: '#3b82f6',
                bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 100%)',
                borderColor: 'rgba(59, 130, 246, 0.3)',
                label: 'Report',
                icon: FileText
            }
        case 'Journal Paper':
            return {
                color: '#8b5cf6',
                bg: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(139, 92, 246, 0.06) 100%)',
                borderColor: 'rgba(139, 92, 246, 0.3)',
                label: 'Journal',
                icon: BookOpen
            }
        case 'Conference':
            return {
                color: '#f97316',
                bg: 'linear-gradient(135deg, rgba(249, 115, 22, 0.12) 0%, rgba(249, 115, 22, 0.06) 100%)',
                borderColor: 'rgba(249, 115, 22, 0.3)',
                label: 'Conference',
                icon: Users
            }
        default:
            return {
                color: '#6b7280',
                bg: 'linear-gradient(135deg, rgba(107, 114, 128, 0.08) 0%, rgba(107, 114, 128, 0.04) 100%)',
                borderColor: 'rgba(107, 114, 128, 0.2)',
                label: 'Google Doc',
                icon: File
            }
    }
}

const getStatusConfig = (status?: string) => {
    switch (status) {
        case 'Accepted':
            return {
                color: '#10b981',
                bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                label: 'Accepted'
            }
        default:
            return {
                color: '#f59e0b',
                bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
                borderColor: 'rgba(245, 158, 11, 0.3)',
                label: 'Pending'
            }
    }
}

const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recent'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const inputStyle = {
    width: '100%',
    padding: 'var(--space-3)',
    border: '1px solid var(--color-gray-300)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--text-sm)',
    outline: 'none',
    transition: 'all 0.2s ease',
    background: 'white'
}

export default function Documents({ grant, myMembership }: { grant?: any, myMembership?: any }) {
    const { addToast } = useToast()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        type: 'Report',
        action: 'Milestone' as 'Milestone' | 'Deliverable',
        actionItem: ''
    })

    const { data: documents = [], isLoading: docsLoading } = useGetDocuments(grant?.$id || '')
    const { data: user } = useGetUser()
    const { data: milestones = [] } = useGetMilestones(grant?.$id || '')
    const { data: deliverables = [] } = useGetDeliverables(grant?.$id || '')
    const { mutateAsync: createDocumentMutation } = useCreateDocument()
    const { mutateAsync: updateDocumentMutation } = useUpdateDocument()

    const roles = myMembership?.role || []
    const isPI = roles.includes('Principal Investigator')
    const isReviewer = roles.includes('Reviewer')
    const canApprove = isPI || isReviewer

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            let docId = '';
            try {
                setIsCreating(true)
                addToast("Authentication successful. Creating document...", "info")

                // 1. Create the doc in Google
                const googleDoc = await createGoogleDoc(formData.title, tokenResponse.access_token)
                docId = googleDoc.documentId;

                // 2. Save the metadata to Appwrite
                await createDocumentMutation({
                    title: formData.title,
                    doc: docId,
                    grant: grant.$id,
                    action: formData.action,
                    actionItem: formData.actionItem,
                    creator: user?.$id || '',
                    type: formData.type,
                    creatorName: user?.name || 'Unknown'
                })

                addToast("Document created and connected successfully!", "success")
                setIsModalOpen(false)
                setFormData({ title: '', type: 'Report', action: 'Milestone', actionItem: '' })

                // 3. Redirect - using window.open fallback check
                const docUrl = `https://docs.google.com/document/d/${docId}/edit`;
                const newWindow = window.open(docUrl, '_blank');

                if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                    // Browser blocked the popup
                    addToast("Popup blocked! Click here to open your document.", "info", 10000, () => {
                        window.open(docUrl, '_blank')
                    });
                }
            } catch (error) {
                console.error('Workflow failed:', error)
                addToast("Failed to complete document setup", "error")
            } finally {
                setIsCreating(false)
            }
        },
        onError: (error) => {
            console.error('Google Auth Failed:', error)
            addToast("Google authentication failed", "error")
        },
        scope: 'https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.file'
    })

    if (!grant) return <Loader size="xl" label="Accessing archive..." />

    const visibleDocuments = documents.filter((doc: any) => {
        if (doc.status === 'Accepted') return true

        // Pending status visibility: PI, Reviewer, and Creator
        const isCreator = doc.creator === user?.$id
        return isPI || isReviewer || isCreator
    })

    const totalDocs = visibleDocuments.length
    const acceptedCount = visibleDocuments.filter((d: any) => d.status === 'Accepted').length
    const pendingCount = visibleDocuments.filter((d: any) => d.status === 'Pending' || !d.status).length

    const handleApprove = async (docId: string) => {
        try {
            await updateDocumentMutation({
                docId,
                data: { status: 'Accepted' },
                grantId: grant?.$id || ''
            })
            addToast("Document accepted successfully", "success")
        } catch (error) {
            addToast("Failed to accept document", "error")
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title || !formData.actionItem) {
            addToast("Please fill all required fields", "warning")
            return
        }
        googleLogin()
    }

    if (docsLoading) return <Loader size="lg" label="Loading documents..." />

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Stats Cards */}
            <div className="metrics-grid metrics-grid-4">
                <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Total Docs</span>
                        <div style={{ padding: '6px', color: 'var(--color-primary)' }}>
                            <FileText size={18} />
                        </div>
                    </div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>{totalDocs}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-gray-400)', marginTop: 'var(--space-2)' }}>
                        Project library
                    </div>
                </div>

                <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Accepted</span>
                        <div style={{ padding: '6px', color: '#10b981' }}>
                            <CheckCircle size={18} />
                        </div>
                    </div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>{acceptedCount}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'var(--space-2)', color: 'var(--color-success)', fontSize: '11px', fontWeight: 600 }}>
                        <span>Validated files</span>
                    </div>
                </div>

                <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Pending</span>
                        <div style={{ padding: '6px', color: '#f59e0b' }}>
                            <Clock size={18} />
                        </div>
                    </div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>{pendingCount}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-gray-400)', marginTop: 'var(--space-2)' }}>
                        Awaiting review
                    </div>
                </div>

                <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Last Update</span>
                        <div style={{ padding: '6px', color: '#8b5cf6' }}>
                            <Calendar size={18} />
                        </div>
                    </div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>{documents[0] ? formatDate(documents[0].$updatedAt) : 'N/A'}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-gray-400)', marginTop: 'var(--space-2)' }}>
                        Document activity
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="card-neumorphic" style={{ padding: '0' }}>
                <div style={{
                    padding: 'var(--space-6)',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 'var(--space-4)'
                }}>
                    <div>
                        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
                            Document Library
                        </h2>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>
                            Manage and access project documents
                        </p>
                    </div>
                    <Button style={{ display: "flex", alignItems: "center", justifyContent: "center" }} variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
                        <Plus size={16} />
                        Create New Doc
                    </Button>
                </div>

                <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: 'var(--color-gray-25)' }}>
                                {['Document Title', 'Linked To', 'Date Added', 'Status', ''].map((h, i) => (
                                    <th key={i} style={{ padding: 'var(--space-4) var(--space-6)', fontSize: '11px', fontWeight: 700, color: 'var(--color-gray-400)', textTransform: 'uppercase' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {visibleDocuments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: 'var(--space-10)', textAlign: 'center', color: 'var(--color-gray-400)' }}>
                                        No documents found. Create your first one!
                                    </td>
                                </tr>
                            ) : visibleDocuments.map((doc: any) => {
                                const typeConfig = getTypeConfig(doc.type)
                                const statusConfig = getStatusConfig(doc.status)
                                const TypeIcon = typeConfig.icon

                                return (
                                    <tr
                                        key={doc.$id}
                                        style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', cursor: 'pointer' }}
                                        onClick={() => window.open(`https://docs.google.com/document/d/${doc.doc}/edit`, '_blank')}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'linear-gradient(to right, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)'
                                            e.currentTarget.style.transform = 'translateX(2px)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent'
                                            e.currentTarget.style.transform = 'translateX(0)'
                                        }}
                                    >
                                        <td style={{ padding: 'var(--space-4) var(--space-6)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                                <div style={{
                                                    padding: 'var(--space-2)',
                                                    borderRadius: 'var(--radius-md)',
                                                    background: typeConfig.bg,
                                                    color: typeConfig.color,
                                                    border: `1px solid ${typeConfig.borderColor}`
                                                }}>
                                                    <TypeIcon size={16} />
                                                </div>
                                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {doc.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: 'var(--space-4) var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                <FolderOpen size={14} style={{ color: 'var(--color-gray-400)' }} />
                                                {doc.action}: {doc.actionItem.substring(0, 8)}...
                                            </div>
                                        </td>
                                        <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-2)',
                                                fontSize: 'var(--text-xs)',
                                                color: 'var(--color-gray-600)'
                                            }}>
                                                <Calendar size={14} style={{ color: 'var(--color-gray-400)' }} />
                                                <span style={{ fontWeight: 500 }}>{formatDate(doc.$createdAt)}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-2)',
                                                padding: 'var(--space-1) var(--space-3)',
                                                borderRadius: 'var(--radius-full)',
                                                background: statusConfig.bg,
                                                border: `1px solid ${statusConfig.borderColor}`,
                                                color: statusConfig.color,
                                                fontSize: 'var(--text-xs)',
                                                fontWeight: 700,
                                            }}>
                                                {statusConfig.label}
                                            </div>
                                        </td>
                                        <td style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'right' }}>
                                            {canApprove && doc.status !== 'approved' && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleApprove(doc.$id); }}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: 'var(--color-success)',
                                                        fontWeight: 700,
                                                        fontSize: 'var(--text-xs)',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Approve
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Upload Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, backdropFilter: 'blur(4px)'
                }}
                    onClick={(e) => { if (e.target === e.currentTarget && !isCreating) setIsModalOpen(false) }}
                >
                    <div className="card-neumorphic" style={{
                        background: 'white', padding: 0, borderRadius: 'var(--radius-lg)',
                        width: '90%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                    }}>
                        <div style={{
                            padding: 'var(--space-6)', borderBottom: '1px solid rgba(0,0,0,0.05)',
                            background: 'white', color: 'black', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
                        }}>
                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, margin: 0 }}>Create Google Document</h2>
                            <p style={{ fontSize: 'var(--text-xs)', opacity: 0.9, margin: '4px 0 0 0' }}>This will create a new blank document on your Google Drive</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Document Title *</label>
                                    <input
                                        type="text" required value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g., Q2 Sustainability Report"
                                        style={inputStyle}
                                        disabled={isCreating}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Document Type *</label>
                                    <select
                                        required
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        style={inputStyle}
                                        disabled={isCreating}
                                    >
                                        <option value="Report">Report</option>
                                        <option value="Journal Paper">Journal Paper</option>
                                        <option value="Conference">Conference</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="metrics-grid metrics-grid-2">
                                    <div>
                                        <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Link To *</label>
                                        <select
                                            required value={formData.action}
                                            onChange={(e) => setFormData({ ...formData, action: e.target.value as any, actionItem: '' })}
                                            style={inputStyle}
                                            disabled={isCreating}
                                        >
                                            <option value="Milestone">Milestone</option>
                                            <option value="Deliverable">Deliverable</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Select Item *</label>
                                        <select
                                            required value={formData.actionItem}
                                            onChange={(e) => setFormData({ ...formData, actionItem: e.target.value })}
                                            style={inputStyle}
                                            disabled={isCreating}
                                        >
                                            <option value="">-- Choose {formData.action} --</option>
                                            {formData.action === 'Milestone'
                                                ? milestones.map((m: any) => <option key={m.$id} value={m.$id}>{m.title}</option>)
                                                : deliverables.map((d: any) => <option key={d.$id} value={d.$id}>{d.title}</option>)
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                padding: 'var(--space-6)', borderTop: '1px solid rgba(0,0,0,0.05)',
                                display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end',
                                background: 'var(--color-gray-25)'
                            }}>
                                <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)} type="button" disabled={isCreating}>Cancel</Button>
                                <Button type="submit" variant="primary" size="sm" disabled={isCreating}>
                                    {isCreating ? <Loader size="sm" variant="white" /> : 'Authorize & Create'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
