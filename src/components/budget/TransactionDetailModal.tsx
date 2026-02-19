import React from 'react'
import { Calendar, Link as LinkIcon } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import PDFViewer from '../ui/PDFViewer'
import NairaSymbol from '../ui/NairaSymbol'

interface TransactionDetailModalProps {
    transaction: any
    allTransactions: any[]
    onClose: () => void
}

export default function TransactionDetailModal({ transaction, allTransactions, onClose }: TransactionDetailModalProps) {
    if (!transaction) return null

    return (
        <Modal
            isOpen={!!transaction}
            onClose={onClose}
            title="Capital Execution Details"
            footer={<Button variant="ghost" onClick={onClose}>Close Overlay</Button>}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 'var(--space-8)' }}>
                    {/* Left Side: Stats & Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                        <div className="card-neumorphic" style={{ padding: 'var(--space-4)', background: 'var(--color-gray-25)' }}>
                            <h4 style={{ fontSize: '11px', color: 'var(--color-gray-400)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>Transaction Profile</h4>
                            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: '#ef4444' }}>
                                -<NairaSymbol />{transaction.amount.toLocaleString()}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-2)', color: 'var(--color-gray-500)', fontSize: '12px' }}>
                                <Calendar size={14} />
                                {new Date(transaction.$createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                            </div>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '12px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <LinkIcon size={14} /> Linked Budget Item
                            </h4>
                            <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', background: 'white', border: '1px solid var(--color-gray-100)' }}>
                                <div style={{ fontWeight: 700, fontSize: '14px' }}>{transaction.budgetItem?.description}</div>
                                <div style={{ fontSize: '11px', color: 'var(--color-gray-400)', marginTop: '4px' }}>Category: {transaction.budgetItem?.category}</div>

                                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-gray-400)' }}>ALLOCATION STATUS</span>
                                    <span style={{
                                        fontSize: '10px',
                                        fontWeight: 800,
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        background: transaction.budgetItem?.status === 'Exceeded' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                        color: transaction.budgetItem?.status === 'Exceeded' ? '#ef4444' : '#10b981'
                                    }}>
                                        {transaction.budgetItem?.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>Activity Context</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {allTransactions
                                    .filter((tx: any) => tx.budgetItem?.$id === transaction.budgetItem?.$id)
                                    .map((tx: any) => (
                                        <div key={tx.$id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', fontSize: '12px', background: tx.$id === transaction.$id ? 'rgba(59, 130, 246, 0.05)' : 'transparent', borderRadius: '8px', border: tx.$id === transaction.$id ? '1px solid rgba(59, 130, 246, 0.1)' : 'none' }}>
                                            <span style={{ color: 'var(--color-gray-500)' }}>{new Date(tx.$createdAt).toLocaleDateString()}</span>
                                            <span style={{ fontWeight: 600 }}>-<NairaSymbol />{tx.amount.toLocaleString()}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: PDF Preview */}
                    <div>
                        <h4 style={{ fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>Capital Execution Proof</h4>
                        <PDFViewer url={transaction.fileUrl} title={`Proof - ${transaction.budgetItem?.description}`} />
                    </div>
                </div>
            </div>
        </Modal>
    )
}
