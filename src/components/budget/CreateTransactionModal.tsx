import React, { useState } from 'react'
import { FileUp, FileText, X } from 'lucide-react'
import Button from '../ui/Button'
import Loader from '../ui/Loader'
import { useToast } from '../ui/Toast'
import { useCreateTransaction, useUpdateBudgetItem } from '../../hooks/useBudget'
import { useAuth } from '../../useContext/context'

interface CreateTransactionModalProps {
    isOpen: boolean
    onClose: () => void
    grant: any
    budgetItems: any[]
    transactions?: any[]
    onSuccess?: (transactionId: string) => void
    preselectedItem?: string
}

export default function CreateTransactionModal({
    isOpen,
    onClose,
    grant,
    budgetItems,
    transactions = [],
    onSuccess,
    preselectedItem
}: CreateTransactionModalProps) {
    const { addToast } = useToast()
    const { user } = useAuth()
    const { mutateAsync: createTransactionMutation, isPending: isCreatingTransaction } = useCreateTransaction()
    const { mutateAsync: updateBudgetItemMutation } = useUpdateBudgetItem()

    const [transactionData, setTransactionData] = useState<{ item: string, amount: number, description: string, file: File | null }>({
        item: preselectedItem || '',
        amount: 0,
        description: '',
        file: null
    })

    // Update item when preselectedItem changes
    React.useEffect(() => {
        if (preselectedItem) {
            setTransactionData(prev => ({ ...prev, item: preselectedItem }))
        }
    }, [preselectedItem])

    const handleTransactionSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!grant) return

        const selectedBudgetItem = budgetItems.find(i => i.$id === transactionData.item)
        if (!selectedBudgetItem) {
            addToast("Please select a valid budget item.", 'warning')
            return
        }

        const amount = Number(transactionData.amount) || 0
        if (amount <= 0) {
            addToast("Amount must be greater than 0.", 'warning')
            return
        }

        if (!transactionData.description.trim()) {
            addToast("Please provide a description for this transaction.", 'warning')
            return
        }

        // Get all transactions for this budget item to calculate current spent
        const itemTransactions: any[] = transactions.filter((tx: any) => tx.budgetItem?.$id === selectedBudgetItem.$id)
        const currentSpent = itemTransactions.reduce((acc: number, tx: any) => acc + tx.amount, 0)

        if (currentSpent + amount > selectedBudgetItem.price) {
            addToast(`Warning: Transaction exceeds allocated budget. Status will be set to Exceeded.`, 'warning')
        }

        try {
            const result = await createTransactionMutation({
                item: transactionData.item,
                amount,
                description: transactionData.description,
                grantId: grant.$id,
                userId: user?.id || '',
                file: transactionData.file || undefined
            })

            const newTotalSpent = currentSpent + amount
            let newStatus = selectedBudgetItem.status

            if (newTotalSpent > selectedBudgetItem.price) {
                newStatus = 'Exceeded'
            } else if (newTotalSpent === selectedBudgetItem.price) {
                newStatus = 'Complete'
            } else if (newTotalSpent > 0) {
                newStatus = 'Partial'
            }

            if (newStatus !== selectedBudgetItem.status) {
                await updateBudgetItemMutation({
                    budgetItemId: selectedBudgetItem.$id,
                    data: { status: newStatus },
                    grantId: grant.$id
                })
            }

            addToast("Transaction logged successfully", "success")

            // Call onSuccess callback with transaction ID
            if (onSuccess && result.$id) {
                onSuccess(result.$id)
            }

            onClose()
            setTransactionData({ item: preselectedItem || '', amount: 0, description: '', file: null })
        } catch (error) {
            console.error(error)
            addToast("Failed to create transaction. Please try again.", 'error')
        }
    }

    if (!isOpen) return null

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                backdropFilter: 'blur(4px)'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'white',
                    padding: '32px',
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '500px'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontWeight: 700, margin: 0 }}>Log Transaction</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '4px',
                            color: 'var(--color-gray-400)'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleTransactionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <select
                        value={transactionData.item}
                        onChange={(e) => setTransactionData({ ...transactionData, item: e.target.value })}
                        style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                        required
                        disabled={!!preselectedItem}
                    >
                        <option value="">Select Budget Item</option>
                        {budgetItems.map((i: any) => <option key={i.$id} value={i.$id}>{i.description}</option>)}
                    </select>

                    <input
                        type="text"
                        placeholder="Transaction Description *"
                        value={transactionData.description}
                        onChange={e => setTransactionData({ ...transactionData, description: e.target.value })}
                        style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Amount"
                        value={transactionData.amount === 0 ? '' : Number(transactionData.amount).toLocaleString()}
                        onChange={e => {
                            const val = e.target.value.replace(/\D/g, '');
                            setTransactionData({ ...transactionData, amount: val ? parseInt(val, 10) : 0 });
                        }}
                        style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                        required
                    />

                    <div className="input-group">
                        <label className="input-label" style={{ fontSize: '12px', color: 'var(--color-gray-500)', marginBottom: '8px', display: 'block' }}>Payment Proof (PDF Only)</label>
                        <div
                            style={{
                                border: '2px dashed var(--color-gray-200)',
                                borderRadius: '12px',
                                padding: '20px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: transactionData.file ? 'rgba(16, 185, 129, 0.05)' : 'var(--color-gray-25)',
                                borderColor: transactionData.file ? 'var(--color-success)' : 'var(--color-gray-200)',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => document.getElementById('transaction-file')?.click()}
                        >
                            <input
                                id="transaction-file"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file && file.type === 'application/pdf') {
                                        setTransactionData({ ...transactionData, file });
                                    } else if (file) {
                                        addToast("Only PDF files are accepted", "warning");
                                    }
                                }}
                                style={{ display: 'none' }}
                            />
                            {transactionData.file ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--color-success)' }}>
                                    <FileText size={20} />
                                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{transactionData.file.name}</span>
                                </div>
                            ) : (
                                <div style={{ color: 'var(--color-gray-400)' }}>
                                    <FileUp size={24} style={{ marginBottom: '8px' }} />
                                    <div style={{ fontSize: '13px', fontWeight: 500 }}>Click to upload receipt or proof</div>
                                    <div style={{ fontSize: '11px' }}>Maximum 5MB • PDF preferred</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                        <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={isCreatingTransaction}>
                            {isCreatingTransaction ? <Loader /> : 'Log Transaction'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
