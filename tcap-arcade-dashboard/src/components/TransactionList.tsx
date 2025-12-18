'use client';

import { deleteTransaction } from '@/app/actions';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

type Transaction = {
    id: number;
    date: Date;
    type: string;
    category: string;
    amount: number;
    description: string | null;
    createdAt: Date;
};

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            setIsDeleting(id);
            await deleteTransaction(id);
            setIsDeleting(null);
        }
    };

    return (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)', background: 'rgba(255,255,255,0.02)' }}>
                        <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 500, fontSize: '0.875rem' }}>Date</th>
                        <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 500, fontSize: '0.875rem' }}>Type</th>
                        <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 500, fontSize: '0.875rem' }}>Category</th>
                        <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 500, fontSize: '0.875rem' }}>Description</th>
                        <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 500, fontSize: '0.875rem', textAlign: 'right' }}>Amount</th>
                        <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: 500, fontSize: '0.875rem', textAlign: 'center' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((t) => (
                        <tr key={t.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)', transition: 'background 0.2s' }} className="hover:bg-slate-800/50">
                            <td style={{ padding: '1rem', color: 'white' }}>{new Date(t.date).toLocaleDateString()}</td>
                            <td style={{ padding: '1rem' }}>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    background: t.type === 'INCOME' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                                    color: t.type === 'INCOME' ? '#10b981' : '#f43f5e'
                                }}>
                                    {t.type}
                                </span>
                            </td>
                            <td style={{ padding: '1rem', color: '#cbd5e1' }}>{t.category}</td>
                            <td style={{ padding: '1rem', color: '#cbd5e1' }}>{t.description || '-'}</td>
                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: t.type === 'INCOME' ? '#10b981' : '#f43f5e' }}>
                                {t.type === 'INCOME' ? '+' : '-'}${t.amount.toLocaleString()}
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                <button
                                    onClick={() => handleDelete(t.id)}
                                    disabled={isDeleting === t.id}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#94a3b8',
                                        transition: 'color 0.2s',
                                        opacity: isDeleting === t.id ? 0.5 : 1
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#f43f5e'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {transactions.length === 0 && (
                        <tr>
                            <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                                No transactions found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
