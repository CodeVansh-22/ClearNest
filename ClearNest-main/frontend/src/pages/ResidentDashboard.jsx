import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  MessageSquare, 
  Vote, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Sparkles,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuth';
import { useLedger } from '../hooks/useLedger';
import { useComplaints } from '../hooks/useComplaints';
import { votingResolutions } from '../data/mockData';

const ResidentDashboard = () => {
  const { user } = useAuthStore();
  const { transactions, analytics, loading: ledgerLoading } = useLedger();
  const { complaints, loading: complaintsLoading } = useComplaints();

  const loading = ledgerLoading || complaintsLoading;

  if (loading && !transactions.length) {
    return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10" /></div>;
  }

  const income = analytics?.income || 0;
  const expense = analytics?.expense || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.full_name || 'Resident'}</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening in ClearNest today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm bg-accent/20 text-primary px-4 py-2 rounded-full font-bold border border-accent/30">
          <Sparkles className="w-4 h-4" />
          {user?.role} Portal Active
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Society Income', value: `₹${income.toLocaleString('en-IN')}`, change: '+12%', positive: true },
          { label: 'Total Society Expense', value: `₹${expense.toLocaleString('en-IN')}`, change: 'On Track', positive: true },
          { label: 'Active Complaints', value: complaints.filter(c => c.status !== 'Resolved').length, change: 'Pending', positive: false },
          { label: 'My Participation', value: '100%', change: 'Excellent', positive: true },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="bg-card p-6 rounded-2xl border border-border shadow-sm group hover:border-accent transition-all duration-300"
          >
            <p className="text-sm font-medium text-muted-foreground mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.positive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Society Ledger Preview
            </h2>
            <Link to="/ledger" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              View Full Ledger <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-card rounded-3xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.slice(0, 5).map((tx) => (
                    <tr key={tx._id} className="hover:bg-muted/50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-semibold">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">ID: #CN-{tx._id.slice(-6).toUpperCase()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium px-2.5 py-1 rounded-lg bg-muted text-muted-foreground">{tx.category || 'General'}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-foreground'}`}>
                        {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Active Complaints */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Latest Complaints
            </h2>
            <div className="space-y-3">
              {complaints.slice(0, 4).map((ticket) => (
                <div key={ticket._id} className="bg-card p-4 rounded-2xl border border-border hover:border-accent transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      ticket.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' : 
                      ticket.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-500/10 text-slate-500'
                    }`}>
                      {ticket.status}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground">{new Date(ticket.created_at).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{ticket.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{ticket.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Verified Voting */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Vote className="w-5 h-5 text-primary" />
                Verified Voting
              </h2>
              <Link to="/voting" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {votingResolutions.slice(0, 2).map((res) => (
                <div key={res.id} className="bg-card p-4 rounded-2xl border border-border hover:border-accent transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {res.endsIn}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{res.title}</h4>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
                      <span>Progress</span>
                      <span>{res.votes}/{res.total} Votes</span>
                    </div>
                    <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden flex">
                      <div 
                        style={{ width: `${(res.votes/res.total)*100}%` }}
                        className="bg-accent h-full rounded-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboard;
