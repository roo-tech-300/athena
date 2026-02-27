import NairaSymbol from '../ui/NairaSymbol'
import { BUDGET_CATEGORY_MAP } from '../../constants/budget'

interface BudgetCompositionProps {
    budgetItems: any[]
    totalFunds: number
    totalSpent: number
}

export default function BudgetComposition({ budgetItems, totalFunds, totalSpent }: BudgetCompositionProps) {
    const categories = Object.keys(BUDGET_CATEGORY_MAP)
    const colors: Record<string, string> = {
        Personnel: 'var(--color-primary)',
        Equipment: 'var(--color-accent-indigo)',
        Supplies: '#f59e0b',
        Data: 'var(--color-success)',
        Travels: '#ef4444',
        Dissemination: '#8b5cf6',
        Miscellaneous: 'var(--color-gray-400)'
    }
    const totalAllocated = budgetItems.reduce((acc: number, i: any) => acc + i.price, 0)

    const composition = categories.map(cat => ({
        dbValue: cat,
        label: BUDGET_CATEGORY_MAP[cat] || cat,
        amount: budgetItems.filter((i: any) => i.category === cat).reduce((acc: number, i: any) => acc + i.price, 0)
    })).filter(c => c.amount > 0)

    return (
        <div className="dashboard-layout-grid">
            <div className="card-neumorphic" style={{ gridColumn: 'span 8', padding: 'var(--space-6)' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '24px' }}>Budget Composition</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {composition.length === 0 ? (
                        <p>No budget data available.</p>
                    ) : (
                        composition.map((c, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                                    <span>{c.label}</span>
                                    <span style={{ fontWeight: 700 }}><NairaSymbol />{c.amount.toLocaleString()}</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'var(--color-gray-100)', borderRadius: '4px' }}>
                                    <div style={{ width: `${(c.amount / totalAllocated) * 100}%`, height: '100%', background: colors[c.dbValue] || 'var(--color-gray-400)', borderRadius: '4px' }} />
                                </div>
                            </div>
                        ))
                    )}
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
    )
}
