import { useState } from 'react'
import { Save, Trash2, AlertTriangle, ShieldCheck } from 'lucide-react'
import Button from '../ui/Button'
import Loader from '../ui/Loader'
import Modal from '../ui/Modal'
import { useUpdateGrant, useDeleteGrant } from '../../hooks/useGrants'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export default function GrantSettings({ grant, isPI }: { grant: any, isPI: boolean }) {
    const navigate = useNavigate()
    const { mutateAsync: updateGrant, isPending: isUpdating } = useUpdateGrant()
    const { mutateAsync: deleteGrant, isPending: isDeleting } = useDeleteGrant()
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const [formData, setFormData] = useState({
        name: grant?.name || '',
        type: grant?.type || '',
        description: grant?.description || '',
        expectedFunding: grant?.expectedFunding || 0,
        completion: grant?.completion || 0
    })

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isPI) return

        try {
            await updateGrant({
                grantId: grant.$id,
                data: formData
            })
            toast.success("Grant settings updated successfully")
        } catch (error) {
            toast.error("Failed to update grant settings")
        }
    }

    const handleDelete = async () => {
        if (!isPI) return
        try {
            await deleteGrant(grant.$id)
            toast.success("Grant deleted successfully")
            navigate('/portal')
        } catch (error) {
            toast.error("Failed to delete grant")
        }
    }

    if (!isPI) {
        return (
            <div className="card-neumorphic" style={{ padding: 'var(--space-10)', textAlign: 'center' }}>
                <ShieldCheck size={48} color="var(--color-primary)" style={{ marginBottom: 'var(--space-4)', opacity: 0.5 }} />
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>Access Restricted</h2>
                <p style={{ color: 'var(--color-gray-500)', marginTop: 'var(--space-2)' }}>Only the Principal Investigator can modify grant settings.</p>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            <div className="card-neumorphic" style={{ padding: 'var(--space-8)' }}>
                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    General Settings
                </h2>

                <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                        <div className="input-group">
                            <label className="input-label">Grant Name</label>
                            <input
                                required
                                className="input-field"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Grant Type</label>
                            <select
                                className="input-field"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option>Research</option>
                                <option>Infrastructure</option>
                                <option>Fellowship</option>
                                <option>Equipment</option>
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Project Description</label>
                        <textarea
                            className="input-field"
                            rows={3}
                            style={{ resize: 'none', minHeight: '100px' }}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                        <div className="input-group">
                            <label className="input-label">Total Funding (₦)</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="0"
                                value={formData.expectedFunding === 0 ? '' : formData.expectedFunding.toLocaleString()}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setFormData({ ...formData, expectedFunding: val ? parseInt(val, 10) : 0 });
                                }}
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Project Completion (%)</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="number"
                                    max="100"
                                    min="0"
                                    className="input-field"
                                    value={formData.completion}
                                    onChange={e => setFormData({ ...formData, completion: Number(e.target.value) })}
                                />
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-20px',
                                    left: 0,
                                    width: '100%',
                                    height: '4px',
                                    background: 'var(--color-gray-100)',
                                    borderRadius: '10px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${formData.completion}%`,
                                        height: '100%',
                                        background: 'var(--color-primary)',
                                        transition: 'width 0.3s ease'
                                    }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                        <Button type="submit" variant="primary" disabled={isUpdating}>
                            {isUpdating ? <Loader size="sm" variant="white" /> : <><Save size={18} style={{ marginRight: '8px' }} /> Save Changes</>}
                        </Button>
                    </div>
                </form>
            </div>

            <div className="card-neumorphic" style={{ padding: 'var(--space-8)', border: '1px solid rgba(239, 68, 68, 0.1)', background: 'rgba(239, 68, 68, 0.01)' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-error)', marginBottom: 'var(--space-2)' }}>Danger Zone</h3>
                <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                    Once you delete a grant, there is no going back. Please be certain.
                </p>
                <Button variant="outline" style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }} onClick={() => setIsDeleteModalOpen(true)}>
                    <Trash2 size={18} style={{ marginRight: '8px' }} /> Delete Grant
                </Button>
            </div>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Remove Grant Portfolio?"
                footer={<>
                    <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                    <Button variant="primary" style={{ background: 'var(--color-error)' }} onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? <Loader size="sm" variant="white" /> : 'Confirm Deletion'}
                    </Button>
                </>}
            >
                <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4) auto' }}>
                        <AlertTriangle size={32} />
                    </div>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', lineHeight: 1.6 }}>
                        Are you sure you want to remove <strong>{grant.name}</strong>? This action is permanent and will delete all associated data including budget, personnel, and milestones.
                    </p>
                </div>
            </Modal>
        </div>
    )
}
