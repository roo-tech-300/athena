import { FileText, Download, Eye, Calendar, User, File, FolderOpen, HardDrive, Upload } from 'lucide-react'
import Button from '../ui/Button'
import Loader from '../ui/Loader'

interface Document {
    id: string
    title: string
    type: 'report' | 'publication' | 'proposal' | 'presentation' | 'dataset' | 'contract' | 'other'
    category: string
    uploadedBy: string
    uploadDate: string
    fileSize: string
    version: string
    status: 'approved' | 'pending' | 'draft' | 'archived'
}

// Sample documents data
const documents: Document[] = [
    {
        id: '1',
        title: 'Project Proposal - Quantum Computing Initiative',
        type: 'proposal',
        category: 'Administrative',
        uploadedBy: 'Prof. Michael Torres',
        uploadDate: '2026-01-15',
        fileSize: '2.4 MB',
        version: 'v1.0',
        status: 'approved'
    },
    {
        id: '2',
        title: 'Grant Agreement & Contract Documents',
        type: 'contract',
        category: 'Legal',
        uploadedBy: 'Dr. Sarah Chen',
        uploadDate: '2026-01-20',
        fileSize: '1.8 MB',
        version: 'v1.0',
        status: 'approved'
    },
    {
        id: '3',
        title: 'Literature Review - Quantum Algorithms',
        type: 'report',
        category: 'Research',
        uploadedBy: 'Dr. Sarah Chen',
        uploadDate: '2026-04-10',
        fileSize: '5.2 MB',
        version: 'v2.1',
        status: 'approved'
    },
    {
        id: '4',
        title: 'Q1 Progress Report',
        type: 'report',
        category: 'Progress Reports',
        uploadedBy: 'Prof. Michael Torres',
        uploadDate: '2026-04-30',
        fileSize: '3.1 MB',
        version: 'v1.0',
        status: 'approved'
    },
    {
        id: '5',
        title: 'Conference Presentation - QC Advances 2026',
        type: 'presentation',
        category: 'Presentations',
        uploadedBy: 'Dr. Emily Rodriguez',
        uploadDate: '2026-05-15',
        fileSize: '12.5 MB',
        version: 'v1.2',
        status: 'approved'
    },
    {
        id: '6',
        title: 'Experimental Dataset - Algorithm Performance',
        type: 'dataset',
        category: 'Data',
        uploadedBy: 'Dr. James Wilson',
        uploadDate: '2026-06-20',
        fileSize: '145.3 MB',
        version: 'v1.0',
        status: 'approved'
    },
    {
        id: '7',
        title: 'Mid-Year Progress Report (Draft)',
        type: 'report',
        category: 'Progress Reports',
        uploadedBy: 'Prof. Michael Torres',
        uploadDate: '2026-07-25',
        fileSize: '4.7 MB',
        version: 'v0.9',
        status: 'draft'
    },
    {
        id: '8',
        title: 'Research Paper - Error Correction Methods',
        type: 'publication',
        category: 'Publications',
        uploadedBy: 'Dr. Sarah Chen',
        uploadDate: '2026-08-10',
        fileSize: '1.9 MB',
        version: 'v2.0',
        status: 'pending'
    },
    {
        id: '9',
        title: 'Technical Specifications Document',
        type: 'other',
        category: 'Technical',
        uploadedBy: 'Dr. James Wilson',
        uploadDate: '2026-09-05',
        fileSize: '3.8 MB',
        version: 'v1.5',
        status: 'approved'
    },
    {
        id: '10',
        title: 'Budget Revision Request',
        type: 'other',
        category: 'Administrative',
        uploadedBy: 'Prof. Michael Torres',
        uploadDate: '2026-10-12',
        fileSize: '0.8 MB',
        version: 'v1.0',
        status: 'pending'
    }
]

const getTypeConfig = (type: Document['type']) => {
    switch (type) {
        case 'report':
            return {
                color: '#3b82f6',
                bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 100%)',
                borderColor: 'rgba(59, 130, 246, 0.3)',
                label: 'Report',
                icon: FileText
            }
        case 'publication':
            return {
                color: '#8b5cf6',
                bg: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(139, 92, 246, 0.06) 100%)',
                borderColor: 'rgba(139, 92, 246, 0.3)',
                label: 'Publication',
                icon: File
            }
        case 'proposal':
            return {
                color: '#10b981',
                bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.06) 100%)',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                label: 'Proposal',
                icon: FileText
            }
        case 'presentation':
            return {
                color: '#f59e0b',
                bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0.06) 100%)',
                borderColor: 'rgba(245, 158, 11, 0.3)',
                label: 'Presentation',
                icon: FileText
            }
        case 'dataset':
            return {
                color: '#06b6d4',
                bg: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(6, 182, 212, 0.06) 100%)',
                borderColor: 'rgba(6, 182, 212, 0.3)',
                label: 'Dataset',
                icon: HardDrive
            }
        case 'contract':
            return {
                color: '#ef4444',
                bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.06) 100%)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                label: 'Contract',
                icon: FileText
            }
        default:
            return {
                color: '#6b7280',
                bg: 'linear-gradient(135deg, rgba(107, 114, 128, 0.08) 0%, rgba(107, 114, 128, 0.04) 100%)',
                borderColor: 'rgba(107, 114, 128, 0.2)',
                label: 'Other',
                icon: File
            }
    }
}

const getStatusConfig = (status: Document['status']) => {
    switch (status) {
        case 'approved':
            return {
                color: '#10b981',
                bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                label: 'Approved'
            }
        case 'pending':
            return {
                color: '#f59e0b',
                bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
                borderColor: 'rgba(245, 158, 11, 0.3)',
                label: 'Pending'
            }
        case 'draft':
            return {
                color: '#6b7280',
                bg: 'linear-gradient(135deg, rgba(107, 114, 128, 0.08) 0%, rgba(107, 114, 128, 0.04) 100%)',
                borderColor: 'rgba(107, 114, 128, 0.2)',
                label: 'Draft'
            }
        default:
            return {
                color: '#64748b',
                bg: 'linear-gradient(135deg, rgba(100, 116, 139, 0.08) 0%, rgba(100, 116, 139, 0.04) 100%)',
                borderColor: 'rgba(100, 116, 139, 0.2)',
                label: 'Archived'
            }
    }
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const getTotalSize = () => {
    const sizes = documents.map(d => parseFloat(d.fileSize))
    const total = sizes.reduce((sum, size) => sum + size, 0)
    return total > 1000 ? `${(total / 1000).toFixed(1)} GB` : `${total.toFixed(1)} MB`
}

export default function Documents({ grant }: { grant?: any }) {
    if (!grant) {
        return <Loader size="xl" label="Accessing archive..." />
    }

    const totalDocs = documents.length
    const approvedCount = documents.filter(d => d.status === 'approved').length
    const pendingCount = documents.filter(d => d.status === 'pending').length
    const totalSize = getTotalSize()

    // Group documents by category
    const categories = Array.from(new Set(documents.map(d => d.category)))

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 'var(--space-4)'
            }}>
                <div className="card-neumorphic" style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'relative', zIndex: 1, padding: 'var(--space-4) var(--space-2)' }}>
                        <div style={{
                            fontSize: 'var(--text-xs)',
                            opacity: 0.9,
                            marginBottom: 'var(--space-2)',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Total Documents
                        </div>
                        <div style={{
                            fontSize: 'var(--text-3xl)',
                            fontWeight: 700,
                            marginBottom: 'var(--space-1)'
                        }}>
                            {totalDocs}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>
                            Across {categories.length} categories
                        </div>
                    </div>
                    <div style={{
                        position: 'absolute',
                        right: '-20px',
                        top: '-20px',
                        opacity: 0.15,
                        fontSize: '120px',
                        fontWeight: 700
                    }}>
                        {totalDocs}
                    </div>
                </div>

                <div className="card-neumorphic" style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    padding: 'var(--space-4) var(--space-2)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{
                            fontSize: 'var(--text-xs)',
                            opacity: 0.9,
                            marginBottom: 'var(--space-2)',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Approved
                        </div>
                        <div style={{
                            fontSize: 'var(--text-3xl)',
                            fontWeight: 700,
                            marginBottom: 'var(--space-1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)'
                        }}>
                            {approvedCount}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>
                            {Math.round((approvedCount / totalDocs) * 100)}% of total
                        </div>
                        <div style={{
                            position: 'absolute',
                            right: '-20px',
                            top: '-20px',
                            opacity: 0.15,
                            fontSize: '120px',
                            fontWeight: 700
                        }}>
                            <FileText size={100} style={{ opacity: 0.8 }} />
                        </div>
                    </div>
                </div>

                <div className="card-neumorphic" style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    padding: 'var(--space-4) var(--space-2)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{
                            fontSize: 'var(--text-xs)',
                            opacity: 0.9,
                            marginBottom: 'var(--space-2)',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Pending Review
                        </div>
                        <div style={{
                            fontSize: 'var(--text-3xl)',
                            fontWeight: 700,
                            marginBottom: 'var(--space-1)'
                        }}>
                            {pendingCount}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>
                            Awaiting approval
                        </div>
                    </div>
                    <div style={{
                        position: 'absolute',
                        right: '-20px',
                        top: '-20px',
                        opacity: 0.15,
                        fontSize: '120px',
                        fontWeight: 700
                    }}>
                        <Upload size={80} style={{ opacity: 0.8 }} />
                    </div>
                </div>

                <div className="card-neumorphic" style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    padding: 'var(--space-4) var(--space-2)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{
                            fontSize: 'var(--text-xs)',
                            opacity: 0.9,
                            marginBottom: 'var(--space-2)',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Storage Used
                        </div>
                        <div style={{
                            fontSize: 'var(--text-3xl)',
                            fontWeight: 700,
                            marginBottom: 'var(--space-1)'
                        }}>
                            {totalSize}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>
                            Total file size
                        </div>
                    </div>
                    <div style={{
                        position: 'absolute',
                        right: '-20px',
                        top: '-20px',
                        opacity: 0.15,
                        fontSize: '120px',
                        fontWeight: 700
                    }}>
                        <HardDrive size={80} style={{ opacity: 0.8 }} />
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="card-neumorphic" style={{ padding: '0' }}>
                {/* Table Header */}
                <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
                            Document Library
                        </h2>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>
                            Manage and access project documents
                        </p>
                    </div>
                    <Button variant="primary" size="sm">+ Upload Document</Button>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'var(--color-gray-25)' }}>
                                {['Document Title', 'Category', 'Uploaded By', 'Date', 'Status', 'Actions'].map((h, i) => (
                                    <th key={i} style={{ padding: 'var(--space-4) var(--space-6)', fontSize: '11px', fontWeight: 700, color: 'var(--color-gray-400)', textTransform: 'uppercase' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc) => {
                                const typeConfig = getTypeConfig(doc.type)
                                const statusConfig = getStatusConfig(doc.status)
                                const TypeIcon = typeConfig.icon

                                return (
                                    <tr
                                        key={doc.id}
                                        style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'linear-gradient(to right, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)'
                                            e.currentTarget.style.transform = 'translateX(2px)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent'
                                            e.currentTarget.style.transform = 'translateX(0)'
                                        }}
                                    >
                                        <td style={{ padding: 'var(--space-4) var(--space-6)', fontSize: 'var(--text-sm)', fontWeight: 600, maxWidth: '300px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                <TypeIcon size={16} style={{ color: typeConfig.color, flexShrink: 0 }} />
                                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {doc.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: 'var(--space-4) var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                <FolderOpen size={14} style={{ color: 'var(--color-gray-400)' }} />
                                                {doc.category}
                                            </div>
                                        </td>
                                        <td style={{ padding: 'var(--space-4) var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                <User size={14} style={{ color: 'var(--color-gray-400)' }} />
                                                {doc.uploadedBy}
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
                                                <span style={{ fontWeight: 500 }}>{formatDate(doc.uploadDate)}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: 'var(--space-4) var(--space-6)', fontSize: 'var(--text-sm)', fontWeight: 700 }}>
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
                                                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                                            }}>
                                                {statusConfig.label}
                                            </div>
                                        </td>
                                        <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                                <button
                                                    style={{
                                                        padding: 'var(--space-2)',
                                                        borderRadius: 'var(--radius-md)',
                                                        border: 'none',
                                                        background: 'var(--color-gray-100)',
                                                        color: 'var(--color-gray-600)',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = 'var(--color-gray-200)'
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'var(--color-gray-100)'
                                                    }}
                                                    title="View"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    style={{
                                                        padding: 'var(--space-2)',
                                                        borderRadius: 'var(--radius-md)',
                                                        border: 'none',
                                                        background: 'var(--color-gray-100)',
                                                        color: 'var(--color-gray-600)',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = 'var(--color-gray-200)'
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'var(--color-gray-100)'
                                                    }}
                                                    title="Download"
                                                >
                                                    <Download size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
