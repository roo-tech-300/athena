import { useState } from 'react'
import { Save, Trash2, AlertTriangle, ShieldCheck } from 'lucide-react'
import Button from '../ui/Button'
import Loader from '../ui/Loader'
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
                        <div>
                            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: '8px' }}>Grant Name</label>
                            <input
                                required
                                style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', outline: 'none' }}
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: '8px' }}>Grant Type</label>
                            <input
                                required
                                style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', outline: 'none' }}
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: '8px' }}>Description</label>
                        <textarea
                            style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', outline: 'none', minHeight: '120px' }}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: '8px' }}>Expected Funding (₦)</label>
                            <input
                                type="text"
                                style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', outline: 'none' }}
                                value={formData.expectedFunding === 0 ? '' : formData.expectedFunding.toLocaleString()}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setFormData({ ...formData, expectedFunding: val ? parseInt(val, 10) : 0 });
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: '8px' }}>Current Completion (%)</label>
                            <input
                                type="number"
                                max="100"
                                min="0"
                                style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', outline: 'none' }}
                                value={formData.completion}
                                onChange={e => setFormData({ ...formData, completion: Number(e.target.value) })}
                            />
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

            {isDeleteModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, backdropFilter: 'blur(4px)'
                }}>
                    <div className="card-neumorphic" style={{ background: 'white', padding: 'var(--space-8)', maxWidth: '450px', width: '90%' }}>
                        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4) auto' }}>
                                <AlertTriangle size={32} />
                            </div>
                            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>Are you absolutely sure?</h3>
                            <p style={{ color: 'var(--color-gray-500)', marginTop: 'var(--space-2)' }}>
                                This action cannot be undone. This will permanently delete the grant <strong>{grant.name}</strong> and remove all associated data.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                            <Button variant="ghost" style={{ flex: 1 }} onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                            <Button variant="primary" style={{ flex: 1, background: 'var(--color-error)' }} onClick={handleDelete} disabled={isDeleting}>
                                {isDeleting ? <Loader size="sm" variant="white" /> : 'Yes, Delete'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
