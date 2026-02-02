import { useState } from 'react'
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    PieChart,
    MoreHorizontal,
    ShoppingBag,
    FlaskConical,
    BarChart3,
    WalletCards
} from 'lucide-react'
import FinanceCharts from './FinanceCharts'
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



export default function BudgetTracker({ grant }: { grant?: any }) {
    const { addToast } = useToast()
    const { data: budgetItems = [], isLoading: itemsLoading } = useGetBudgetItems(grant?.$id || '')
    const { data: transactions = [], isLoading: txLoading } = useGetTransactions(grant?.$id || '')
    const { mutateAsync: createBudgetItemMutation, isPending: isCreatingBudgetItem } = useCreateBudgetItem()
    const { mutateAsync: createTransactionMutation, isPending: isCreatingTransaction } = useCreateTransaction()
    const { mutateAsync: updateBudgetItemMutation } = useUpdateBudgetItem()

    const [view, setView] = useState<'tracker' | 'analytics'>('tracker')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        description: '',
        category: 'Hardware',
        price: '',
        allocation: '',
        status: 'Planned'
    })
    const [transactionData, setTransactionData] = useState({
        item: '',
        amount: ''
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
                price: '',
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



        // Calculate total spent for this item so far
        const itemTransactions = (transactions as any[]).filter(tx => tx.budgetItem.$id === selectedBudgetItem.$id)
        const currentSpent = itemTransactions.reduce((acc, tx: any) => acc + tx.amount, 0)

        // Check if transaction exceeds allocated budget
        if (currentSpent + amount > selectedBudgetItem.price) {
            addToast(`Warning: Transaction exceeds allocated budget. Status will be set to Exceeded.`, 'warning')
        }

        try {
            // Create Transaction
            await createTransactionMutation({
                item: transactionData.item,
                amount,
                grantId: grant.$id
            })

            // Update Budget Item Status
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
            setTransactionData({ item: '', amount: '' })
        } catch (error) {
            console.error(error)
            addToast("Failed to create transaction. Please try again.", 'error')
        }
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
            {/* View Toggle */}
            <div className="card-neumorphic" style={{ padding: 'var(--space-3)', display: 'inline-flex', gap: 'var(--space-2)', alignSelf: 'flex-start' }}>
                <button
                    onClick={() => setView('tracker')}
                    style={{
                        padding: 'var(--space-3)',
                        background: view === 'tracker' ? 'var(--color-primary)' : 'transparent',
                        color: view === 'tracker' ? 'white' : 'var(--color-gray-600)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <WalletCards size={16} />
                    Budget Tracker
                </button>
                <button
                    onClick={() => setView('analytics')}
                    style={{
                        padding: 'var(--space-3)',
                        background: view === 'analytics' ? 'var(--color-primary)' : 'transparent',
                        color: view === 'analytics' ? 'white' : 'var(--color-gray-600)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <BarChart3 size={16} />
                    Finance Analytics
                </button>
            </div>

            {view === 'analytics' ? (
                <FinanceCharts />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                    {/* Top Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)' }}>
                        <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Total Funds</span>
                                <div style={{ padding: '6px', color: 'var(--color-primary)' }}>
                                    <DollarSign size={18} />
                                </div>
                            </div>
                            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}><NairaSymbol />{formatMoneyCompact(totalFunds)}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'var(--space-2)', color: 'var(--color-success)', fontSize: '11px', fontWeight: 600 }}>
                                <TrendingUp size={12} />
                                <span>Baseline Secured</span>
                            </div>
                        </div>

                        <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Total Spent</span>
                                <div style={{ padding: '6px', color: '#ef4444' }}>
                                    <TrendingDown size={18} />
                                </div>
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
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: 'var(--space-2)' }}>
                                Funds ready for allocation
                            </div>
                        </div>

                        <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Total Allocated</span>
                                <div style={{ padding: '6px', color: 'var(--color-gray-600)' }}>
                                    <ShoppingBag size={18} />
                                </div>
                            </div>
                            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}><NairaSymbol /> {formatMoneyCompact(allocatedFunds)}</div>
                            <div style={{ fontSize: '11px', color: 'var(--color-gray-400)', marginTop: 'var(--space-2)' }}>
                                Active allocations
                            </div>
                        </div>
                    </div>

                    {/* Detailed Budget Items Table */}
                    <div className="card-neumorphic" style={{ padding: '0' }}>
                        <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Budget Allocations</h3>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>Line-item breakdown of grant funding</p>
                            </div>
                            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>+ Add Line Item</Button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'var(--color-gray-25)' }}>
                                        {['Description', 'Category', 'Price', 'Alloc.', 'Status', ''].map((h, i) => (
                                            <th key={i} style={{ padding: 'var(--space-4) var(--space-6)', fontSize: '11px', fontWeight: 700, color: 'var(--color-gray-400)', textTransform: 'uppercase' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {budgetItems.map((item) => (
                                        <tr key={item.$id} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                                            <td style={{ padding: 'var(--space-4) var(--space-6)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>{item.description}</td>
                                            <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                                                <span style={{ fontSize: '10px', background: 'var(--color-gray-100)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{item.category}</span>
                                            </td>
                                            <td style={{ padding: 'var(--space-4) var(--space-6)', fontSize: 'var(--text-sm)', fontWeight: 700 }}><NairaSymbol />{item.price.toLocaleString()}</td>
                                            <td style={{ padding: 'var(--space-4) var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
                                                {totalFunds ? `${Math.round((item.price / totalFunds) * 100)}%` : '0%'}
                                            </td>
                                            <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.status === 'Planned' ? 'var(--color-warning)' : item.status === 'Complete' ? 'var(--color-success)' : item.status === 'Exceeded' ? '#ef4444' : 'var(--color-primary)' }} />
                                                    <span style={{ fontSize: '11px', fontWeight: 600 }}>{item.status}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'right' }}>
                                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-300)' }}><MoreHorizontal size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Visual Budget Breakdown (Charts) */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--space-6)' }}>
                        <div className="card-neumorphic" style={{ gridColumn: 'span 8', padding: 'var(--space-6)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
                                <div>
                                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Budget Composition</h3>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>Distribution by category</p>
                                </div>
                                <Button variant="ghost" size="sm">Export Report</Button>
                            </div>

                            {/* Bars */}
                            {/* Bars */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                {(() => {
                                    const categories = ['Personnel', 'Hardware', 'Supplies', 'Admin', 'Computing', 'Travel', 'Logistics', 'Other']
                                    const categoryColors: Record<string, string> = {
                                        'Personnel': 'var(--color-primary)',
                                        'Hardware': 'var(--color-accent-indigo)',
                                        'Computing': 'var(--color-success)',
                                        'Supplies': '#f59e0b',
                                        'Admin': '#ef4444',
                                        'Travel': '#06b6d4',
                                        'Logistics': '#8b5cf6',
                                        'Other': 'var(--color-gray-400)'
                                    }

                                    const total = (budgetItems as any[]).reduce((acc, item: any) => acc + item.price, 0)

                                    // Calculate percentage for each category
                                    const composition = categories.map(cat => {
                                        const catTotal = (budgetItems as any[])
                                            .filter((item: any) => item.category === cat)
                                            .reduce((acc, item: any) => acc + item.price, 0)
                                        return {
                                            label: cat,
                                            val: total > 0 ? Math.round((catTotal / total) * 100) : 0,
                                            color: categoryColors[cat] || 'var(--color-gray-400)',
                                            amount: catTotal
                                        }
                                    }).filter(item => item.val > 0).sort((a, b) => b.val - a.val)

                                    if (composition.length === 0) {
                                        return <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-gray-500)' }}>No budget items allocated yet</div>
                                    }

                                    return composition.map((item, i) => (
                                        <div key={i}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: '6px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                                                    <span style={{ fontWeight: 600 }}>{item.label}</span>
                                                </div>
                                                <span style={{ fontWeight: 700 }}>{item.val}% (<NairaSymbol />{formatMoneyCompact(item.amount)})</span>
                                            </div>
                                            <div style={{ width: '100%', height: '8px', background: 'var(--color-gray-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                                <div style={{
                                                    width: `${item.val}%`,
                                                    height: '100%',
                                                    background: item.color,
                                                    borderRadius: 'var(--radius-full)',
                                                    transition: 'width 1s ease'
                                                }} />
                                            </div>
                                        </div>
                                    ))
                                })()}
                            </div>
                        </div>

                        <div className="card-neumorphic glass" style={{ gridColumn: 'span 4', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Burn Analysis</h3>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--space-4)' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ position: 'relative', display: 'inline-block' }}>
                                        <svg width="120" height="120" viewBox="0 0 120 120">
                                            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--color-gray-100)" strokeWidth="12" />
                                            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--color-primary)" strokeWidth="12"
                                                strokeDasharray="339.292"
                                                strokeDashoffset={339.292 * (1 - (totalFunds > 0 ? totalSpent / totalFunds : 0))}
                                                strokeLinecap="round" transform="rotate(-90 60 60)" />
                                        </svg>
                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
                                                {totalFunds > 0 ? `${((totalSpent / totalFunds) * 100).toFixed(1)}%` : '0%'}
                                            </div>
                                            <div style={{ fontSize: '9px', fontWeight: 600, color: 'var(--color-gray-400)', textTransform: 'uppercase' }}>Utilized</div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>Burn Rate</span>
                                        <span style={{ fontSize: '11px', fontWeight: 700 }}>Low (Optimal)</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>Next Injection</span>
                                        <span style={{ fontSize: '11px', fontWeight: 700 }}>March 2026</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Executed Transactions */}
                    <div className="card-neumorphic glass" style={{ padding: 'var(--space-6)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Recent Capital Execution</h3>
                            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                                <span
                                    style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', cursor: 'pointer' }}
                                    onClick={() => setIsHistoryModalOpen(true)}
                                >
                                    View Transaction History
                                </span>
                                <Button size="sm" variant="primary" onClick={() => setIsTransactionModalOpen(true)}>Add Transaction</Button >
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
                            {transactions.length === 0 ? (
                                <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '20px', color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>
                                    No executed transactions yet.
                                </div>
                            ) : (
                                transactions.slice(0, 3).map((exec: any) => (
                                    <div key={exec.$id} style={{
                                        background: 'white',
                                        padding: 'var(--space-4)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid rgba(0,0,0,0.03)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-4)'
                                    }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--color-gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gray-600)' }}>
                                            <FlaskConical size={18} />
                                        </div>
                                        <div style={{ overflow: 'hidden' }}>
                                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exec.budgetItem.description}</div>
                                            <div style={{ fontSize: '10px', color: 'var(--color-gray-400)' }}>
                                                {new Date(exec.$createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div style={{ marginLeft: 'auto', textAlign: 'right', flexShrink: 0 }}>
                                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-gray-900)' }}>-<NairaSymbol />{exec.amount.toLocaleString()}</div>
                                            <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--color-success)' }}>VERIFIED</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add Line Item Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setIsModalOpen(false)
                        }
                    }}
                >
                    <div className="card-neumorphic" style={{
                        background: 'white',
                        padding: 0,
                        borderRadius: 'var(--radius-lg)',
                        width: '90%',
                        maxWidth: '600px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            padding: 'var(--space-6)',
                            borderBottom: '1px solid rgba(0,0,0,0.05)',
                            background: 'white',
                            color: 'black',
                            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
                        }}>
                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, margin: 0 }}>
                                Add Budget Item
                            </h2>
                            <p style={{ fontSize: 'var(--text-xs)', opacity: 0.9, margin: '4px 0 0 0' }}>
                                Create a new budget allocation entry
                            </p>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit}>
                            <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                {/* Description Field */}
                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 600,
                                        marginBottom: 'var(--space-2)',
                                        color: 'var(--color-gray-700)'
                                    }}>
                                        Description *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="e.g., Quantum Processor Units"
                                        style={{
                                            width: '100%',
                                            padding: 'var(--space-3)',
                                            border: '1px solid var(--color-gray-500)',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: 'var(--text-sm)',
                                            outline: 'none',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = 'var(--color-primary)'
                                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = 'var(--color-gray-200)'
                                            e.target.style.boxShadow = 'none'
                                        }}
                                    />
                                </div>

                                {/* Category and Price Row */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 600,
                                            marginBottom: 'var(--space-2)',
                                            color: 'var(--color-gray-700)'
                                        }}>
                                            Category *
                                        </label>
                                        <select
                                            required
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: 'var(--space-3)',
                                                border: '1px solid var(--color-gray-500)',
                                                borderRadius: 'var(--radius-md)',
                                                fontSize: 'var(--text-sm)',
                                                outline: 'none',
                                                background: 'white',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="Hardware">Hardware</option>
                                            <option value="Personnel">Personnel</option>
                                            <option value="Supplies">Supplies</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Computing">Computing</option>
                                            <option value="Travel">Travel</option>
                                            <option value="Logistics">Logistics</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 600,
                                            marginBottom: 'var(--space-2)',
                                            color: 'var(--color-gray-700)'
                                        }}>
                                            Price (NGN) *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="0"
                                            min="0"
                                            step="0.01"
                                            style={{
                                                width: '100%',
                                                padding: 'var(--space-3)',
                                                border: '1px solid var(--color-gray-500)',
                                                borderRadius: 'var(--radius-md)',
                                                fontSize: 'var(--text-sm)',
                                                outline: 'none'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = 'var(--color-primary)'
                                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = 'var(--color-gray-200)'
                                                e.target.style.boxShadow = 'none'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Info Box */}
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                                    border: '1px solid rgba(102, 126, 234, 0.2)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: 'var(--space-4)',
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--color-gray-600)'
                                }}>
                                    <strong>Note:</strong> All fields marked with * are required. The allocation percentage should reflect the proportion of total budget this item represents.
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div style={{
                                padding: 'var(--space-6)',
                                borderTop: '1px solid rgba(0,0,0,0.05)',
                                display: 'flex',
                                gap: 'var(--space-3)',
                                justifyContent: 'flex-end',
                                background: 'var(--color-gray-25)'
                            }}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setIsModalOpen(false)
                                        setFormData({
                                            description: '',
                                            category: 'Hardware',
                                            price: '',
                                            allocation: '',
                                            status: 'Planned'
                                        })
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="sm"
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-1px)'
                                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(102, 126, 234, 0.3)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(102, 126, 234, 0.2)'
                                    }}
                                >
                                    {isCreatingBudgetItem ? <Loader size="sm" variant="white" /> : 'Add Budget Item'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Add Transaction Modal */}
            {isTransactionModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsTransactionModalOpen(false)
                    }}
                >
                    <div className="card-neumorphic" style={{
                        background: 'white',
                        padding: 0,
                        borderRadius: 'var(--radius-lg)',
                        width: '90%',
                        maxWidth: '500px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                    }}>
                        <div style={{
                            padding: 'var(--space-6)',
                            borderBottom: '1px solid rgba(0,0,0,0.05)',
                            background: 'white',
                            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
                        }}>
                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, margin: 0 }}>Log Expense</h2>
                        </div>
                        <form onSubmit={handleTransactionSubmit}>
                            <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--color-gray-700)' }}>
                                        Budget Item *
                                    </label>
                                    <select
                                        required
                                        value={transactionData.item}
                                        onChange={(e) => setTransactionData({ ...transactionData, item: e.target.value })}
                                        style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', background: 'white' }}
                                    >
                                        <option value="">Select a budget item...</option>
                                        {budgetItems.map(item => (
                                            <option key={item.$id} value={item.$id}>
                                                {item.description} (Allocated: N{formatMoneyCompact(item.price)})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--color-gray-700)' }}>
                                        Amount (NGN) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={transactionData.amount}
                                        onChange={(e) => setTransactionData({ ...transactionData, amount: e.target.value })}
                                        className="input-field"
                                        style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)' }}
                                    />
                                </div>
                            </div>
                            <div style={{ padding: 'var(--space-6)', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', background: 'var(--color-gray-25)' }}>
                                <Button variant="ghost" size="sm" onClick={() => setIsTransactionModalOpen(false)}>Cancel</Button>
                                <Button type="submit" variant="primary" size="sm">{isCreatingTransaction ? <Loader size="sm" variant="white" /> : 'Log Transaction'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Transaction History Modal */}
            {isHistoryModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsHistoryModalOpen(false)
                    }}
                >
                    <div className="card-neumorphic" style={{
                        background: 'white',
                        padding: 0,
                        borderRadius: 'var(--radius-lg)',
                        width: '90%',
                        maxWidth: '700px',
                        maxHeight: '80vh',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                    }}>
                        <div style={{
                            padding: 'var(--space-6)',
                            borderBottom: '1px solid rgba(0,0,0,0.05)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, margin: 0 }}>Transaction History</h2>
                            <button onClick={() => setIsHistoryModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
                        </div>
                        <div style={{ overflowY: 'auto', padding: 'var(--space-6)' }}>
                            {transactions.length === 0 ? (
                                <p style={{ textAlign: 'center', color: 'var(--color-gray-500)' }}>No transactions found.</p>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--color-gray-100)' }}>
                                            <th style={{ padding: '8px', fontSize: '12px', color: 'var(--color-gray-500)' }}>ITEM</th>
                                            <th style={{ padding: '8px', fontSize: '12px', color: 'var(--color-gray-500)' }}>DATE</th>
                                            <th style={{ padding: '8px', fontSize: '12px', color: 'var(--color-gray-500)', textAlign: 'right' }}>AMOUNT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.slice().reverse().map((tx: any) => (
                                            <tr key={tx.$id} style={{ borderBottom: '1px solid var(--color-gray-50)' }}>
                                                <td style={{ padding: '12px 8px', fontWeight: 600 }}>{tx.budgetItem?.description}</td>
                                                <td style={{ padding: '12px 8px', fontSize: '12px', color: 'var(--color-gray-600)' }}>{new Date(tx.$createdAt).toLocaleDateString()} {new Date(tx.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                                <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 700 }}>-<NairaSymbol />{tx.amount.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

