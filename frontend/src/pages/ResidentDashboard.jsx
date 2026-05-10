import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  QrCode,
  Plus,
  X,
  Mail,
  User as UserIcon,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuth';
import { useLedger } from '../hooks/useLedger';
import { useComplaints } from '../hooks/useComplaints';
import api from '../api/axios';

const ResidentDashboard = () => {
  const { user } = useAuthStore();
  const { transactions, analytics, loading: ledgerLoading } = useLedger();
  const { complaints, loading: complaintsLoading } = useComplaints();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    visitDate: '',
    purpose: ''
  });

  const loading = ledgerLoading || complaintsLoading;

  if (loading && !transactions.length) {
    return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10" /></div>;
  }

  const income = analytics?.income || 0;
  const expense = analytics?.expense || 0;

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteLoading(true);
    try {
      const res = await api.post('/visitors/invite', formData);
      const token = res.data?.data?.visitor?.token || res.data?.visitor?.token;
      setGeneratedToken(token);
    } catch (err) {
      console.error("Invite Error:", err);
      alert("Failed to create invite");
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.fullName || 'Resident'}</h1>
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
          {/* Visitor Invites Widget */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <QrCode className="w-5 h-5 text-primary" />
                Visitor Invites
              </h2>
              <button 
                onClick={() => { setIsModalOpen(true); setGeneratedToken(''); }}
                className="text-xs font-bold flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-full hover:opacity-90 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Invite
              </button>
            </div>
            <div className="bg-card p-4 rounded-2xl border border-border">
              <p className="text-xs text-muted-foreground text-center py-4">
                No active invites. Click "Invite" to generate a QR code for your guests.
              </p>
            </div>
          </section>

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
                    <span className="text-[10px] font-medium text-muted-foreground">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{ticket.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{ticket.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute right-6 top-6 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              {!generatedToken ? (
                <>
                  <h2 className="text-2xl font-bold mb-6">Invite Guest</h2>
                  <form onSubmit={handleInvite} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Guest Name</label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input 
                          type="text" required
                          className="w-full bg-muted/50 border border-border rounded-xl py-3 pl-12 text-sm focus:ring-2 focus:ring-primary"
                          placeholder="John Doe"
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input 
                          type="text"
                          className="w-full bg-muted/50 border border-border rounded-xl py-3 pl-12 text-sm focus:ring-2 focus:ring-primary"
                          placeholder="Optional"
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Visit Date</label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input 
                          type="date" required
                          className="w-full bg-muted/50 border border-border rounded-xl py-3 pl-12 text-sm focus:ring-2 focus:ring-primary"
                          onChange={e => setFormData({...formData, visitDate: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Purpose</label>
                      <input 
                        type="text"
                        className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary"
                        placeholder="e.g. Social Visit"
                        onChange={e => setFormData({...formData, purpose: e.target.value})}
                      />
                    </div>

                    <button 
                      disabled={inviteLoading}
                      className="w-full bg-[#0F172A] text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                    >
                      {inviteLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Generate Invite'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <h2 className="text-2xl font-bold mb-2">Invite Generated!</h2>
                  <p className="text-sm text-muted-foreground mb-6">Share this QR code with your guest.</p>
                  
                  <div className="bg-muted/50 p-6 rounded-2xl inline-block mb-6 border border-border">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin + '/verify-visitor?token=' + generatedToken)}`} 
                      alt="QR Code"
                      className="mx-auto"
                    />
                  </div>

                  <p className="text-xs text-muted-foreground mb-6 break-all">
                    Token: {generatedToken}
                  </p>

                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="w-full bg-[#0F172A] text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResidentDashboard;
