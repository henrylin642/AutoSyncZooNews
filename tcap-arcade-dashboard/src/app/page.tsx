import { getDashboardStats, getRevenueChartData } from './actions';
import { RevenueChart } from '@/components/RevenueChart';
import { TransactionForm } from '@/components/TransactionForm';
import { LayoutDashboard, Wallet, TrendingUp, DollarSign } from 'lucide-react';

export default async function Home() {
  const stats = await getDashboardStats();
  const chartData = await getRevenueChartData();

  return (
    <div className="dashboard-grid">
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', borderRadius: '8px' }}></div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>TCAP Arcade</h1>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <a href="#" className="nav-item active">
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </a>
          <a href="/accounting" className="nav-item">
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
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Dashboard Overview</h2>
            <p style={{ color: '#94a3b8' }}>Welcome back, Manager. Here is today's financial summary.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary">Download Report</button>
            <button className="btn btn-primary">New Campaign</button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid-cols-4 mb-8">
          <div className="glass-panel metric-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b5cf6', marginBottom: '10px' }}>
              <DollarSign size={16} />
              <span className="metric-label">Today's Revenue</span>
            </div>
            <div className="metric-value">${stats.todayIncome.toLocaleString()}</div>
          </div>
          <div className="glass-panel metric-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#06b6d4', marginBottom: '10px' }}>
              <TrendingUp size={16} />
              <span className="metric-label">Monthly Revenue</span>
            </div>
            <div className="metric-value">${stats.monthIncome.toLocaleString()}</div>
          </div>
          <div className="glass-panel metric-card">
            <div style={{ marginBottom: '10px' }}>
              <span className="metric-label" style={{ color: '#f43f5e' }}>Monthly Expenses</span>
            </div>
            <div className="metric-value">${stats.monthExpense.toLocaleString()}</div>
          </div>
          <div className="glass-panel metric-card">
            <div style={{ marginBottom: '10px' }}>
              <span className="metric-label" style={{ color: '#10b981' }}>Net Profit</span>
            </div>
            <div className="metric-value" style={{ color: stats.netProfit >= 0 ? '#10b981' : '#f43f5e' }}>
              ${stats.netProfit.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Charts & Actions Section */}
        <div className="grid-cols-2">
          {/* Revenue Chart */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Revenue Trends (Last 7 Days)</h3>
            <div className="chart-container" style={{ flex: 1, minHeight: '300px' }}>
              <RevenueChart data={chartData} />
            </div>
          </div>

          {/* Quick Transaction & Recent */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Quick Entry</h3>
              <TransactionForm />
            </div>

            {/* Placeholder for Recent Transactions */}
            <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Operations</h3>
              <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>No recent alerts.</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
