import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  AlertCircle, 
  ArrowUpRight,
  ChevronRight,
  Building2,
  FileText,
  Activity,
  Loader2
} from 'lucide-react';
import { useLedger } from '../hooks/useLedger';
import { useComplaints } from '../hooks/useComplaints';

const CommitteeDashboard = () => {
  const { analytics, loading: ledgerLoading } = useLedger();
  const { complaints, loading: complaintsLoading } = useComplaints();

  const loading = ledgerLoading || complaintsLoading;

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <Loader2 className="animate-spin w-12 h-12 text-accent" />
      <p className="text-muted-foreground font-medium animate-pulse">Synchronizing ledger data...</p>
    </div>
  );

  const income = analytics?.income || 0;
  const expense = analytics?.expense || 0;
  const balance = analytics?.balance || 0;
  const pendingComplaints = complaints.filter(c => c.status !== 'Resolved').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Committee Overview</h1>
          <p className="text-muted-foreground mt-1 font-medium">Strategic management and society oversight dashboard.</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-primary text-primary-foreground px-5 py-2.5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">
          <ShieldCheck className="w-4 h-4 text-accent" />
          Admin Session Active
        </div>
      </div>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-primary text-primary-foreground p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-primary/20">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
               <Building2 className="w-24 h-24" />
            </div>
            <p className="text-primary-foreground/60 font-black text-xs uppercase tracking-[0.2em] mb-2">Total Society Reserve</p>
            <h2 className="text-5xl font-black mb-6 tracking-tighter">₹{balance.toLocaleString('en-IN')}</h2>
            <div className="flex items-center gap-2 text-accent text-sm font-black">
               <TrendingUp className="w-4 h-4" /> +5.2% this quarter
            </div>
         </div>

         <div className="bg-card p-8 rounded-[2.5rem] border border-border/60 shadow-sm card-hover">
            <p className="text-muted-foreground font-black text-xs uppercase tracking-[0.2em] mb-2">Maintenance Collection</p>
            <h2 className="text-5xl font-black mb-6 tracking-tighter text-foreground">94.2%</h2>
            <div className="w-full bg-muted h-3 rounded-full mb-4 overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: '94.2%' }}
                 className="bg-accent h-full rounded-full shadow-[0_0_12px_rgba(134,239,172,0.5)]"
               />
            </div>
            <p className="text-xs text-muted-foreground font-bold">188 of 200 units paid</p>
         </div>

         <div className="bg-card p-8 rounded-[2.5rem] border border-border/60 shadow-sm card-hover">
            <div className="flex justify-between items-start mb-2">
               <p className="text-muted-foreground font-black text-xs uppercase tracking-[0.2em]">Active Vendors</p>
               <Users className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-5xl font-black mb-6 tracking-tighter text-foreground">12</h2>
            <div className="flex -space-x-3 mb-4">
               {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-xl border-4 border-card bg-muted flex items-center justify-center text-[10px] font-black">
                     V{i}
                  </div>
               ))}
               <div className="w-10 h-10 rounded-xl border-4 border-card bg-accent/20 text-accent flex items-center justify-center text-[10px] font-black">
                  +8
               </div>
            </div>
            <p className="text-xs text-muted-foreground font-bold">+8 pending bids</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Pending Approvals */}
         <div className="lg:col-span-2 bg-card rounded-[2.5rem] border border-border/60 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-black flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Expense Approval Queue
               </h3>
               <span className="px-3 py-1 bg-accent/20 text-accent text-[10px] font-black rounded-lg uppercase tracking-widest">
                 {pendingComplaints} Pending
               </span>
            </div>

            <div className="space-y-4">
               {[
                 { id: 'EXP-902', title: 'Main Gate Hydraulic Repair', amount: '₹1,200', vendor: 'QuickFix Ltd', date: 'Requested 4h ago' },
                 { id: 'EXP-899', title: 'Swimming Pool Chemicals', amount: '₹450', vendor: 'AquaClear', date: 'Requested 1d ago' },
                 { id: 'EXP-895', title: 'Security Guard Uniforms', amount: '₹850', vendor: 'SafeGuard Pro', date: 'Requested 2d ago' },
               ].map((item) => (
                 <div key={item.id} className="bg-muted/30 p-6 rounded-3xl border border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-muted/50 transition-all duration-300">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-card flex items-center justify-center text-accent shadow-sm">
                          <AlertCircle className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="font-black text-foreground">{item.title}</h4>
                          <p className="text-xs text-muted-foreground font-medium">{item.vendor} • {item.date}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <span className="text-lg font-black text-foreground">{item.amount}</span>
                       <div className="flex items-center gap-2">
                          <button className="px-4 py-2 bg-primary text-primary-foreground text-xs font-black rounded-xl hover:scale-105 transition-all">Approve</button>
                          <button className="px-4 py-2 text-muted-foreground hover:text-destructive text-xs font-bold transition-colors">Reject</button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Activity Log */}
         <div className="bg-card rounded-[2.5rem] border border-border/60 p-8 shadow-sm">
            <h3 className="text-xl font-black flex items-center gap-2 mb-8 text-foreground">
               <Activity className="w-5 h-5 text-primary" />
               System Activity
            </h3>
            <div className="space-y-6">
               {[
                 { event: 'New Resolution Created', time: '10m ago', user: 'Sec. Sarah' },
                 { event: 'Bulk Invoice Generated', time: '2h ago', user: 'System' },
                 { event: 'Vendor Bid Received', time: '5h ago', user: 'QuickFix Ltd' },
                 { event: 'Security Alert: Gate 2', time: '12h ago', user: 'Guard 4' },
                 { event: 'Financial Report Exported', time: '1d ago', user: 'Treas. Mike' },
               ].map((log, i) => (
                 <div key={i} className="flex gap-4 items-start last:border-0 pb-6 border-b border-border/40">
                    <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0 shadow-[0_0_8px_rgba(134,239,172,0.8)]" />
                    <div>
                       <p className="text-sm font-black leading-none mb-1 text-foreground">{log.event}</p>
                       <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{log.user} • {log.time}</p>
                    </div>
                 </div>
               ))}
            </div>
            <button className="w-full mt-6 py-4 rounded-2xl border border-border/60 text-xs font-black uppercase tracking-widest hover:bg-muted transition-all">
               View Full Logs
            </button>
         </div>
      </div>
    </div>
  );
};

export default CommitteeDashboard;
