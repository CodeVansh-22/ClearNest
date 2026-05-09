import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Download, 
  Filter, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp,
  PieChart as PieIcon,
  Calendar,
  Loader2
} from 'lucide-react';
import { useLedger } from '../hooks/useLedger';

const LedgerPage = () => {
  const { transactions, analytics, loading, error } = useLedger();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const incomeTotal = analytics?.income || 0;
  const expenseTotal = analytics?.expense || 0;
  const netReserve = incomeTotal - expenseTotal;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Ledger</h1>
          <p className="text-muted-foreground mt-1">Institutional-grade transparency for all society funds.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-xl text-sm font-bold hover:bg-muted transition-all">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Income', value: `₹${incomeTotal.toLocaleString('en-IN')}`, icon: ArrowUpRight, color: 'text-emerald-500' },
          { label: 'Total Expenses', value: `₹${expenseTotal.toLocaleString('en-IN')}`, icon: ArrowDownRight, color: 'text-amber-500' },
          { label: 'Net Reserve', value: `₹${netReserve.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-primary' },
        ].map((item, i) => (
          <div key={i} className="bg-card p-6 rounded-3xl border border-border group hover:border-accent transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-xl bg-muted group-hover:bg-accent/20 transition-colors">
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
            <h3 className="text-3xl font-bold mt-1">{item.value}</h3>
          </div>
        ))}
      </div>

      {/* Detailed Ledger Table */}
      <div className="bg-card rounded-[2rem] border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="font-bold">Transaction History</h3>
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by vendor, ID..." 
              className="w-full bg-muted/50 border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30">
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">ID</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-8 py-5 text-sm font-mono text-muted-foreground">#CN-{tx._id.slice(-6).toUpperCase()}</td>
                  <td className="px-8 py-5">
                    <p className="font-bold">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{tx.type === 'income' ? 'Income' : 'Expense'}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-muted border border-border">
                      {tx.category || 'General'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-muted-foreground">
                    {new Date(tx.date).toLocaleDateString('en-IN')}
                  </td>
                  <td className={`px-8 py-5 text-right font-bold text-lg ${tx.type === 'income' ? 'text-emerald-500' : 'text-foreground'}`}>
                    {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LedgerPage;
