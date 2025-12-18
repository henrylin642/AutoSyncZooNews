'use client';

import { importTransactions } from '@/app/actions';
import { UploadCloud } from 'lucide-react';
import Papa from 'papaparse';
import { useRef, useState } from 'react';

export function CSVImporter() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    // Normalize Data
                    // Expected Headers: Date, Amount, Type, Category, Description
                    const validRecords = results.data.map((row: any) => {
                        // Basic Auto-detection logic for platforms Klook/KKday if desc contains keywords
                        let category = row['Category'] || 'PLATFORM';
                        const desc = row['Description'] || '';

                        if (desc.toLowerCase().includes('klook')) category = 'PLATFORM_KLOOK';
                        if (desc.toLowerCase().includes('kkday')) category = 'PLATFORM_KKDAY';

                        return {
                            date: row['Date'] || new Date().toISOString(),
                            amount: parseFloat(row['Amount'] || '0'),
                            type: row['Type']?.toUpperCase() || 'INCOME', // Default to Income
                            category: category,
                            description: desc
                        };
                    }).filter(r => !isNaN(r.amount) && r.amount !== 0);

                    if (validRecords.length > 0) {
                        await importTransactions(validRecords);
                        alert(`🎉 Successfully imported ${validRecords.length} transactions!`);
                    } else {
                        alert('⚠️ No valid records found. Please check your CSV format.');
                    }
                } catch (error) {
                    console.error(error);
                    alert('❌ Import failed.');
                } finally {
                    setLoading(false);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                }
            }
        });
    };

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Import CSV Report</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Upload Klook, KKday, or generic Excel/CSV exports.</p>
                <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>Format: Date, Amount, Type, Category, Description</p>
            </div>
            <div>
                <input
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                />
                <button
                    className="btn btn-primary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                >
                    <UploadCloud size={20} />
                    {loading ? 'Processing...' : 'Upload CSV'}
                </button>
            </div>
        </div>
    );
}
