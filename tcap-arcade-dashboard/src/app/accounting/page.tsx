import { getTransactions } from '@/app/actions';
import { CSVImporter } from '@/components/CSVImporter';
import { TransactionList } from '@/components/TransactionList';
import { LayoutDashboard, Wallet, TrendingUp } from 'lucide-react';

export default async function AccountingPage() {
    const transactions = await getTransactions();

    return (
        <div className="dashboard-grid">
            <aside className="sidebar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', borderRadius: '8px' }}></div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>TCAP Arcade</h1>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <a href="/" className="nav-item">
                        <LayoutDashboard size={20} />
                        <span>Overview</span>
                    </a>
                    <a href="/accounting" className="nav-item active">
                        <Wallet size={20} />
                        <span>Accounting</span>
                    </a>
                    <a href="#" className="nav-item">
                        <TrendingUp size={20} />
                        <span>Analysis</span>
                    </a>
                </nav>
            </aside>

            <main className="main-content">
                <header className="mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Transaction History</h2>
                        <p style={{ color: '#94a3b8' }}>View and manage all financial records.</p>
                    </div>
                </header>

                <CSVImporter />
                <TransactionList transactions={transactions} />
            </main>
        </div>
    );
}
