'use client';

import { addTransaction } from '@/app/actions';
import { useRef } from 'react';

export function TransactionForm() {
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <form
            action={async (formData) => {
                await addTransaction(formData);
                formRef.current?.reset();
            }}
            ref={formRef}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>Type</label>
                    <select name="type" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                        <option value="INCOME">Income</option>
                        <option value="EXPENSE">Expense</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>Category</label>
                    <select name="category" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                        <option value="CASH">Cash Sales</option>
                        <option value="CARD">Card Sales</option>
                        <option value="PLATFORM">Platform</option>
                        <option value="RENT">Rent</option>
                        <option value="SALARY">Salary</option>
                        <option value="OPS">Operations</option>
                    </select>
                </div>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>Amount</label>
                <input
                    type="number"
                    name="amount"
                    step="0.01"
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>Description</label>
                <input
                    type="text"
                    name="description"
                    placeholder="Optional note..."
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', justifyContent: 'center', width: '100%' }}>
                Add Transaction
            </button>
        </form>
    );
}
