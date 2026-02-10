import { useState } from 'react'
import {
    TrendingDown,
    DollarSign,
    PieChart,
    MoreHorizontal,
    ShoppingBag,
    Download
} from 'lucide-react'
import Button from '../ui/Button'
import Loader from '../ui/Loader'
import NairaSymbol from '../ui/NairaSymbol'
import { formatMoneyCompact } from '../../utils/grant'
import { useToast } from '../ui/Toast'
import {
    useCreateBudgetItem,
    useGetBudgetItems,
    useCreateTransaction,
    useGetTransactions,
    useUpdateBudgetItem
} from '../../hooks/useBudget'

export default function BudgetTracker({ grant, myMembership }: { grant?: any, myMembership?: any }) {
    const roles = myMembership?.role || [];
    const canManageBudget = roles.includes('Principal Investigator') || roles.includes('Finance Officer');

    const { addToast } = useToast()
    const { data: budgetItems = [], isLoading: itemsLoading } = useGetBudgetItems(grant?.$id || '')
    const { data: transactions = [], isLoading: txLoading } = useGetTransactions(grant?.$id || '')
    const { mutateAsync: createBudgetItemMutation, isPending: isCreatingBudgetItem } = useCreateBudgetItem()
    const { mutateAsync: createTransactionMutation, isPending: isCreatingTransaction } = useCreateTransaction()
    const { mutateAsync: updateBudgetItemMutation } = useUpdateBudgetItem()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        description: '',
        category: 'Hardware',
        price: 0,
        allocation: '',
        status: 'Planned'
    })
    const [transactionData, setTransactionData] = useState({
        item: '',
        amount: 0
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!grant) return
        try {
            await createBudgetItemMutation({
                grantId: grant.$id,
                description: formData.description,
                category: formData.category,
                status: formData.status,
                price: Number(formData.price) || 0
            })

            addToast("Budget item added successfully", "success")
            setIsModalOpen(false)
            setFormData({
                description: '',
                category: 'Hardware',
                price: 0,
                allocation: '',
                status: 'Planned'
            })
        } catch (error) {
            addToast("Failed to add budget item", "error")
        }
    }

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

        const itemTransactions = (transactions as any[]).filter(tx => tx.budgetItem.$id === selectedBudgetItem.$id)
        const currentSpent = itemTransactions.reduce((acc, tx: any) => acc + tx.amount, 0)

        if (currentSpent + amount > selectedBudgetItem.price) {
            addToast(`Warning: Transaction exceeds allocated budget. Status will be set to Exceeded.`, 'warning')
        }

        try {
            await createTransactionMutation({
                item: transactionData.item,
                amount,
                grantId: grant.$id
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
            setIsTransactionModalOpen(false)
            setTransactionData({ item: '', amount: 0 })
        } catch (error) {
            console.error(error)
            addToast("Failed to create transaction. Please try again.", 'error')
        }
    }

    const handleExportCSV = () => {
        if (!budgetItems.length) {
            addToast("No budget data to export", "warning")
            return
        }

        const headers = ["Description", "Category", `Allocated (${grant.currency || 'NGN'})`, `Spent (${grant.currency || 'NGN'})`, "Remaining", "Status"]

        const rows = budgetItems.map((item: any) => {
            const itemTransactions = (transactions as any[]).filter(tx => tx.budgetItem?.$id === item.$id)
            const spent = itemTransactions.reduce((acc, tx) => acc + tx.amount, 0)
            const remaining = item.price - spent

            return [
                `"${item.description?.replace(/"/g, '""') || ''}"`,
                `"${item.category || ''}"`,
                item.price,
                spent,
                remaining,
                `"${item.status || ''}"`
            ].join(',')
        })

        const csvContent = [headers.join(','), ...rows].join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `budget_report_${grant?.name?.replace(/\s+/g, '_') || 'export'}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        addToast("Budget report exported", "success")
    }

    if (!grant || itemsLoading || txLoading) {
        return <Loader size="xl" label="Synchronizing budget data..." />
    }

    const totalFunds = grant.expectedFunding
    const totalSpent = (transactions as any[]).reduce((acc, tx: any) => acc + tx.amount, 0)
    const available = totalFunds - totalSpent
    const allocatedFunds = (budgetItems as any[]).reduce((acc, item: any) => acc + item.price, 0)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)' }}>
                <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Total Funds</span>
                        <DollarSign size={18} color="var(--color-primary)" />
                    </div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}><NairaSymbol />{formatMoneyCompact(totalFunds)}</div>
                    <div style={{ color: 'var(--color-success)', fontSize: '11px', fontWeight: 600, marginTop: 'var(--space-2)' }}>Baseline Secured</div>
                </div>

                <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Total Spent</span>
                        <TrendingDown size={18} color="#ef4444" />
                    </div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}><NairaSymbol />{formatMoneyCompact(totalSpent)}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-gray-400)', marginTop: 'var(--space-2)' }}>
                        {totalFunds > 0 ? `${((totalSpent / totalFunds) * 100).toFixed(1)}%` : '0%'} of total utilized
                    </div>
                </div>

                <div className="card-neumorphic" style={{
                    padding: 'var(--space-6)',
                    borderRadius: 'var(--radius-lg)',
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                    color: 'white'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Available</span>
                        <PieChart size={16} />
                    </div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}><NairaSymbol />{formatMoneyCompact(available)}</div>
                </div>

                <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Allocated</span>
                        <ShoppingBag size={18} />
                    </div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}><NairaSymbol /> {formatMoneyCompact(allocatedFunds)}</div>
                </div>
            </div>

            <div className="card-neumorphic" style={{ padding: '0' }}>
                <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Budget Allocations</h3>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <Button variant="outline" size="sm" onClick={handleExportCSV} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}>
                            <Download size={16} /> Export CSV
                        </Button>
                        {canManageBudget && (
                            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>+ Add Line Item</Button>
                        )}
                    </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--color-gray-25)' }}>
                            {['Description', 'Category', 'Price', 'Alloc.', 'Status', ''].map((h, i) => (
                                <th key={i} style={{ padding: '12px 24px', fontSize: '11px', fontWeight: 700, color: 'var(--color-gray-400)', textTransform: 'uppercase', textAlign: 'left' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {budgetItems.map((item: any) => (
                            <tr key={item.$id} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                                <td style={{ padding: '12px 24px', fontWeight: 600 }}>{item.description}</td>
                                <td style={{ padding: '12px 24px' }}><span style={{ fontSize: '10px', background: 'var(--color-gray-100)', padding: '2px 8px', borderRadius: '4px' }}>{item.category}</span></td>
                                <td style={{ padding: '12px 24px', fontWeight: 700 }}><NairaSymbol />{item.price.toLocaleString()}</td>
                                <td style={{ padding: '12px 24px' }}>{totalFunds ? `${Math.round((item.price / totalFunds) * 100)}%` : '0%'}</td>
                                <td style={{ padding: '12px 24px' }}>{item.status}</td>
                                <td style={{ padding: '12px 24px', textAlign: 'right' }}><MoreHorizontal size={18} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--space-6)' }}>
                <div className="card-neumorphic" style={{ gridColumn: 'span 8', padding: 'var(--space-6)' }}>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '24px' }}>Budget Composition</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {(() => {
                            const categories = ['Personnel', 'Hardware', 'Supplies', 'Admin', 'Computing', 'Travel', 'Logistics', 'Other']
                            const colors: Record<string, string> = { Personnel: 'var(--color-primary)', Hardware: 'var(--color-accent-indigo)', Computing: 'var(--color-success)', Supplies: '#f59e0b', Admin: '#ef4444', Other: 'var(--color-gray-400)' }
                            const total = budgetItems.reduce((acc: number, i: any) => acc + i.price, 0)
                            const composition = categories.map(cat => ({
                                label: cat,
                                amount: budgetItems.filter((i: any) => i.category === cat).reduce((acc: number, i: any) => acc + i.price, 0)
                            })).filter(c => c.amount > 0)

                            if (composition.length === 0) return <p>No budget data available.</p>

                            return composition.map((c, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                                        <span>{c.label}</span>
                                        <span style={{ fontWeight: 700 }}><NairaSymbol />{c.amount.toLocaleString()}</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: 'var(--color-gray-100)', borderRadius: '4px' }}>
                                        <div style={{ width: `${(c.amount / total) * 100}%`, height: '100%', background: colors[c.label] || 'var(--color-gray-400)', borderRadius: '4px' }} />
                                    </div>
                                </div>
                            ))
                        })()}
                    </div>
                </div>

                <div className="card-neumorphic" style={{ gridColumn: 'span 4', padding: 'var(--space-6)' }}>
                    <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '16px' }}>Burn Analysis</h3>
                    <div style={{ textAlign: 'center', padding: '24px' }}>
                        <div style={{ fontSize: '32px', fontWeight: 800 }}>{totalFunds > 0 ? `${((totalSpent / totalFunds) * 100).toFixed(1)}%` : '0%'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-gray-400)' }}>Total Utilized</div>
                    </div>
                </div>
            </div>

            <div className="card-neumorphic" style={{ padding: 'var(--space-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Recent Capital Execution</h3>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <span onClick={() => setIsHistoryModalOpen(true)} style={{ cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 700, fontSize: '12px' }}>View History</span>
                        {canManageBudget && (
                            <Button size="sm" variant="primary" onClick={() => setIsTransactionModalOpen(true)}>Add Transaction</Button>
                        )}
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {transactions.slice(0, 3).map((tx: any) => (
                        <div key={tx.$id} style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                            <div style={{ fontWeight: 600, fontSize: '14px' }}>{tx.budgetItem.description}</div>
                            <div style={{ color: '#ef4444', fontWeight: 700 }}>-<NairaSymbol />{tx.amount.toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)}>
                    <div style={{ background: 'white', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '24px', fontWeight: 700 }}>Add Budget Item</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <input type="text" placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} required />
                            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
                                <option value="Hardware">Hardware</option>
                                <option value="Personnel">Personnel</option>
                                <option value="Supplies">Supplies</option>
                                <option value="Admin">Admin</option>
                                <option value="Computing">Computing</option>
                                <option value="Travel">Travel</option>
                                <option value="Logistics">Logistics</option>
                                <option value="Other">Other</option>
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
                                <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button variant="primary" type="submit" disabled={isCreatingBudgetItem}>Add Item</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isTransactionModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={() => setIsTransactionModalOpen(false)}>
                    <div style={{ background: 'white', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '24px', fontWeight: 700 }}>Log Transaction</h2>
                        <form onSubmit={handleTransactionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <select value={transactionData.item} onChange={e => setTransactionData({ ...transactionData, item: e.target.value })} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} required>
                                <option value="">Select Item</option>
                                {budgetItems.map((i: any) => <option key={i.$id} value={i.$id}>{i.description}</option>)}
                            </select>
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
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                                <Button variant="ghost" type="button" onClick={() => setIsTransactionModalOpen(false)}>Cancel</Button>
                                <Button variant="primary" type="submit" disabled={isCreatingTransaction}>Log</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isHistoryModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={() => setIsHistoryModalOpen(false)}>
                    <div style={{ background: 'white', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '700px', maxHeight: '80vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontWeight: 700 }}>Transaction History</h2>
                            <button onClick={() => setIsHistoryModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #eee' }}>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Item</th>
                                    <th style={{ padding: '12px', textAlign: 'right' }}>Amount</th>
                                    <th style={{ padding: '12px', textAlign: 'right' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx: any) => (
                                    <tr key={tx.$id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '12px' }}>{tx.budgetItem.description}</td>
                                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700 }}><NairaSymbol />{tx.amount.toLocaleString()}</td>
                                        <td style={{ padding: '12px', textAlign: 'right', fontSize: '12px' }}>{new Date(tx.$createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
