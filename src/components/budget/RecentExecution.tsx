import { FileText, ArrowRight } from 'lucide-react'
import Button from '../ui/Button'
import NairaSymbol from '../ui/NairaSymbol'

interface RecentExecutionProps {
    transactions: any[]
    canManageBudget: boolean
    onViewHistory: () => void
    onAddTransaction: () => void
    onSelectTransaction: (tx: any) => void
}

export default function RecentExecution({
    transactions,
    canManageBudget,
    onViewHistory,
    onAddTransaction,
    onSelectTransaction
}: RecentExecutionProps) {
    return (
        <div className="card-neumorphic" style={{ padding: 'var(--space-6)' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: 'var(--space-4)'
            }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Recent Capital Execution</h3>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <span onClick={onViewHistory} style={{ cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 700, fontSize: '12px' }}>View History</span>
                    {canManageBudget && (
                        <Button size="sm" variant="primary" onClick={onAddTransaction}>Add Transaction</Button>
                    )}
                </div>
            </div>
            <div className="metrics-grid metrics-grid-3">
                {transactions.slice(0, 3).map((tx: any) => (
                    <div
                        key={tx.$id}
                        onClick={() => onSelectTransaction(tx)}
                        style={{
                            background: 'white',
                            padding: '16px',
                            borderRadius: '12px',
                            border: '1px solid rgba(0,0,0,0.05)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        className="capital-card"
                    >
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '14px' }} className="truncate-1">{tx.budgetItem?.description}</div>
                            <div style={{ color: '#ef4444', fontWeight: 700 }}><NairaSymbol />{tx.amount.toLocaleString()}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {tx.proof && <FileText size={16} color="var(--color-primary)" style={{ opacity: 0.7 }} />}
                            <ArrowRight size={14} color="var(--color-gray-300)" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
