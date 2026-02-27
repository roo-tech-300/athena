import { Download, Upload, MoreHorizontal } from 'lucide-react'
import Button from '../ui/Button'
import NairaSymbol from '../ui/NairaSymbol'

import { BUDGET_CATEGORY_MAP } from '../../constants/budget'

interface BudgetAllocationsTableProps {
    budgetItems: any[]
    canManageBudget: boolean
    onExportCSV: () => void
    onImportXLSX: () => void
    onAddLineItem: () => void
    formatAllocation: (price: number) => string
}

export default function BudgetAllocationsTable({
    budgetItems,
    canManageBudget,
    onExportCSV,
    onImportXLSX,
    onAddLineItem,
    formatAllocation
}: BudgetAllocationsTableProps) {
    return (
        <div className="card-neumorphic" style={{ padding: '0' }}>
            <div style={{
                padding: 'var(--space-6)',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 'var(--space-4)'
            }}>
                <div>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Budget Allocations</h3>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    <Button variant="outline" size="sm" onClick={onExportCSV} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}>
                        <Download size={16} /> Export CSV
                    </Button>
                    {canManageBudget && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onImportXLSX}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent-indigo)', borderColor: 'var(--color-accent-indigo)' }}
                            >
                                <Upload size={16} /> Import XLSX
                            </Button>
                            <Button variant="primary" size="sm" onClick={onAddLineItem}>+ Add Line Item</Button>
                        </>
                    )}
                </div>
            </div>
            <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
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
                                <td style={{ padding: '12px 24px' }}>
                                    <span style={{ fontSize: '10px', background: 'var(--color-gray-100)', padding: '2px 8px', borderRadius: '4px' }}>
                                        {BUDGET_CATEGORY_MAP[item.category] || item.category}
                                    </span>
                                </td>
                                <td style={{ padding: '12px 24px', fontWeight: 700 }}><NairaSymbol />{item.price.toLocaleString()}</td>
                                <td style={{ padding: '12px 24px' }}>{formatAllocation(item.price)}</td>
                                <td style={{ padding: '12px 24px' }}>{item.status}</td>
                                <td style={{ padding: '12px 24px', textAlign: 'right' }}><MoreHorizontal size={18} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
