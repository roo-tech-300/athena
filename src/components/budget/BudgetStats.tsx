import { DollarSign, TrendingDown, PieChart, ShoppingBag } from 'lucide-react'
import NairaSymbol from '../ui/NairaSymbol'
import { formatMoneyCompact } from '../../utils/grant'

interface BudgetStatsProps {
    totalFunds: number
    totalSpent: number
    available: number
    allocatedFunds: number
}

export default function BudgetStats({ totalFunds, totalSpent, available, allocatedFunds }: BudgetStatsProps) {
    return (
        <div className="metrics-grid metrics-grid-4">
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
    )
}
