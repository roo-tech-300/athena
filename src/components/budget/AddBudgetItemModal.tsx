import React, { useState } from 'react'
import Button from '../ui/Button'
import Loader from '../ui/Loader'
import { useToast } from '../ui/Toast'
import { useCreateBudgetItem } from '../../hooks/useBudget'

import { BUDGET_CATEGORIES } from '../../constants/budget'

interface AddBudgetItemModalProps {
    isOpen: boolean
    onClose: () => void
    grantId: string
}

export default function AddBudgetItemModal({ isOpen, onClose, grantId }: AddBudgetItemModalProps) {
    const { addToast } = useToast()
    const { mutateAsync: createBudgetItemMutation, isPending: isCreatingBudgetItem } = useCreateBudgetItem()
    const [formData, setFormData] = useState({
        description: '',
        category: BUDGET_CATEGORIES[0].dbValue,
        price: 0,
        status: 'Planned'
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            console.log(formData)
            await createBudgetItemMutation({
                grantId,
                description: formData.description,
                category: formData.category,
                status: formData.status,
                price: Number(formData.price) || 0
            })

            addToast("Budget item added successfully", "success")
            onClose()
            setFormData({
                description: '',
                category: BUDGET_CATEGORIES[0].dbValue,
                price: 0,
                status: 'Planned'
            })
        } catch (error) {
            addToast("Failed to add budget item", "error")
        }
    }

    if (!isOpen) return null

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={onClose}>
            <div style={{ background: 'white', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
                <h2 style={{ marginBottom: '24px', fontWeight: 700 }}>Add Budget Item</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input type="text" placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} required />
                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
                        {BUDGET_CATEGORIES.map(cat => (
                            <option key={cat.dbValue} value={cat.dbValue}>{cat.uiValue}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Price"
                        value={formData.price === 0 ? '' : Number(formData.price).toLocaleString()}
                        onChange={e => {
                            const val = e.target.value.replace(/\D/g, '');
                            setFormData({ ...formData, price: val ? parseInt(val, 10) : 0 });
                        }}
                        style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                        required
                    />
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                        <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={isCreatingBudgetItem}>{isCreatingBudgetItem ? <Loader /> : 'Add Item'}</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
