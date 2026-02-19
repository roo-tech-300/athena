import { useState } from 'react'
import Loader from '../ui/Loader'
import { useToast } from '../ui/Toast'
import { useGetBudgetItems, useGetTransactions } from '../../hooks/useBudget'

// Sub-components
import BudgetStats from '../budget/BudgetStats'
import BudgetAllocationsTable from '../budget/BudgetAllocationsTable'
import BudgetComposition from '../budget/BudgetComposition'
import RecentExecution from '../budget/RecentExecution'
import AddBudgetItemModal from '../budget/AddBudgetItemModal'
import ImportBudgetModal from '../budget/ImportBudgetModal'
import TransactionDetailModal from '../budget/TransactionDetailModal'
import CreateTransactionModal from '../budget/CreateTransactionModal'
import TransactionHistoryModal from '../budget/TransactionHistoryModal'

import { BUDGET_CATEGORY_MAP } from '../../constants/budget'

export default function BudgetTracker({ grant, myMembership }: { grant?: any, myMembership?: any }) {
    const roles = myMembership?.role || [];
    const canManageBudget = roles.includes('Principal Investigator') || roles.includes('Finance Officer');

    const { addToast } = useToast()
    const { data: budgetItems = [], isLoading: itemsLoading } = useGetBudgetItems(grant?.$id || '')
    const { data: transactions = [], isLoading: txLoading } = useGetTransactions(grant?.$id || '')

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
    const [isImportModalOpen, setIsImportModalOpen] = useState(false)
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null)

    const handleExportCSV = () => {
        if (!budgetItems.length) {
            addToast("No budget data to export", "warning")
            return
        }
        const headers = ["Description", "Category", `Allocated (${grant.currency || 'NGN'})`, `Spent (${grant.currency || 'NGN'})`, "Remaining", "Status"]
        const rows = budgetItems.map((item: any) => {
            const spent = (transactions as any[]).filter(tx => tx.budgetItem?.$id === item.$id).reduce((acc, tx) => acc + tx.amount, 0)
            const categoryUI = BUDGET_CATEGORY_MAP[item.category] || item.category
            return [`"${item.description?.replace(/"/g, '""') || ''}"`, `"${categoryUI?.replace(/"/g, '""') || ''}"`, item.price, spent, item.price - spent, `"${item.status || ''}"`].join(',')
        })
        const csvContent = [headers.join(','), ...rows].join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `budget_report_${grant?.name?.replace(/\s+/g, '_') || 'export'}.csv`)
        link.click()
        addToast("Budget report exported", "success")
    }

    if (!grant || itemsLoading || txLoading) return <Loader size="xl" label="Synchronizing budget data..." />

    const totalFunds = grant.expectedFunding
    const totalSpent = (transactions as any[]).reduce((acc, tx: any) => acc + tx.amount, 0)
    const available = totalFunds - totalSpent
    const allocatedFunds = (budgetItems as any[]).reduce((acc, item: any) => acc + item.price, 0)

    const formatAllocation = (price: number) => {
        if (!totalFunds) return '0%';
        const percent = (price / totalFunds) * 100;
        return percent >= 1 ? `${Math.round(percent)}%` : percent >= 0.1 ? `${percent.toFixed(1)}%` : '<0.1%';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            <BudgetStats totalFunds={totalFunds} totalSpent={totalSpent} available={available} allocatedFunds={allocatedFunds} />

            <BudgetAllocationsTable
                budgetItems={budgetItems}
                canManageBudget={canManageBudget}
                onExportCSV={handleExportCSV}
                onImportXLSX={() => setIsImportModalOpen(true)}
                onAddLineItem={() => setIsModalOpen(true)}
                formatAllocation={formatAllocation}
            />

            <BudgetComposition budgetItems={budgetItems} totalFunds={totalFunds} totalSpent={totalSpent} />

            <RecentExecution
                transactions={transactions}
                canManageBudget={canManageBudget}
                onViewHistory={() => setIsHistoryModalOpen(true)}
                onAddTransaction={() => setIsTransactionModalOpen(true)}
                onSelectTransaction={setSelectedTransaction}
            />

            <AddBudgetItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} grantId={grant.$id} />
            <ImportBudgetModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} grantId={grant.$id} />
            <TransactionDetailModal transaction={selectedTransaction} allTransactions={transactions} onClose={() => setSelectedTransaction(null)} />
            <CreateTransactionModal isOpen={isTransactionModalOpen} onClose={() => setIsTransactionModalOpen(false)} grant={grant} budgetItems={budgetItems} transactions={transactions} />
            <TransactionHistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} transactions={transactions} />

            <style>{`
                .capital-card:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 12px 24px rgba(0,0,0,0.08); border-color: var(--color-primary-light); z-index: 10; }
                .capital-card::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: var(--color-primary); transform: scaleX(0); transition: transform 0.3s ease; }
                .capital-card:hover::after { transform: scaleX(1); }
            `}</style>
        </div>
    )
}
