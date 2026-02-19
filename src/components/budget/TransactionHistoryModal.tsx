import React from 'react'
import { X, ExternalLink } from 'lucide-react'
import NairaSymbol from '../ui/NairaSymbol'
import { storage } from '../../lib/appwrite'

interface TransactionHistoryModalProps {
    isOpen: boolean
    onClose: () => void
    transactions: any[]
}

export default function TransactionHistoryModal({ isOpen, onClose, transactions }: TransactionHistoryModalProps) {
    if (!isOpen) return null

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={onClose}>
            <div style={{ background: 'white', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '700px', maxHeight: '80vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontWeight: 700 }}>Transaction History</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', color: 'var(--color-gray-400)' }}><X size={20} /></button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #eee' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Item</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Amount</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Date</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Proof</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx: any) => (
                            <tr key={tx.$id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>{tx.budgetItem.description}</td>
                                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700 }}><NairaSymbol />{tx.amount.toLocaleString()}</td>
                                <td style={{ padding: '12px', textAlign: 'right', fontSize: '12px' }}>{new Date(tx.$createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                    {tx.proof ? (
                                        <a
                                            href={storage.getFileView(import.meta.env.VITE_APPWRITE_STORAGE_ID, tx.proof).toString()}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}
                                        >
                                            View <ExternalLink size={12} />
                                        </a>
                                    ) : (
                                        <span style={{ color: 'var(--color-gray-300)', fontSize: '12px' }}>None</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
