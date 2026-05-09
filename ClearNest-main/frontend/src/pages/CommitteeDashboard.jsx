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
  Activity
} from 'lucide-react';
import { transactions } from '../data/mockData';

const CommitteeDashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Committee Overview</h1>
          <p className="text-muted-foreground mt-1">Strategic management and society oversight dashboard.</p>
        </div>
        <div className="flex items-center gap-2 text-sm bg-primary text-white px-4 py-2 rounded-full font-bold">
          <ShieldCheck className="w-4 h-4 text-accent" />
          Admin Session Active
        </div>
      </div>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-[#0F172A] text-white p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
               <Building2 className="w-24 h-24" />
            </div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Total Society Reserve</p>
            <h2 className="text-4xl font-bold mb-4">₹4,28,950.00</h2>
            <div className="flex items-center gap-2 text-accent text-sm font-bold">
               <TrendingUp className="w-4 h-4" /> +5.2% this quarter
            </div>
         </div>

         <div className="bg-card p-8 rounded-[2.5rem] border border-border">
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest mb-2">Maintenance Collection</p>
            <h2 className="text-4xl font-bold mb-4">94.2%</h2>
            <div className="w-full bg-muted h-2 rounded-full mb-4">
               <div className="bg-emerald-500 h-full w-[94.2%] rounded-full" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">188 of 200 units paid</p>
         </div>

         <div className="bg-card p-8 rounded-[2.5rem] border border-border flex flex-col justify-between">
            <div>
               <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest mb-2">Active Vendors</p>
               <h2 className="text-4xl font-bold">12</h2>
            </div>
            <div className="flex items-center gap-3 mt-6">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-card bg-slate-200 flex items-center justify-center text-[10px] font-bold">V{i}</div>
                  ))}
               </div>
               <span className="text-xs font-bold text-muted-foreground">+8 pending bids</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Pending Approvals */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Expense Approval Queue
               </h3>
               <span className="text-xs font-bold bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full">4 Pending</span>
            </div>

            <div className="space-y-4">
               {[
                 { id: 'EXP-902', title: 'Main Gate Hydraulic Repair', amount: '₹1,200', vendor: 'QuickFix Ltd', date: 'Requested 4h ago' },
                 { id: 'EXP-899', title: 'Swimming Pool Chemicals', amount: '₹450', vendor: 'AquaClear', date: 'Requested 1d ago' },
                 { id: 'EXP-895', title: 'Security Guard Uniforms', amount: '₹850', vendor: 'SafeGuard Pro', date: 'Requested 2d ago' },
               ].map((item) => (
                 <div key={item.id} className="bg-card p-6 rounded-3xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-accent transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                          <AlertCircle className="w-6 h-6 text-amber-500" />
                       </div>
                       <div>
                          <h4 className="font-bold">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">{item.vendor} • {item.date}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <span className="text-lg font-bold">{item.amount}</span>
                       <div className="flex gap-2">
                          <button className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90">Approve</button>
                          <button className="px-4 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-bold hover:bg-red-500/10 hover:text-red-500">Reject</button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* System Activity */}
         <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
               <Activity className="w-5 h-5 text-primary" />
               System Activity
            </h3>
            <div className="bg-card rounded-3xl border border-border p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-accent blur-[60px] opacity-10"></div>
               <div className="space-y-6 relative z-10">
                  {[
                    { event: 'New Resolution Created', time: '10m ago', user: 'Sec. Sarah' },
                    { event: 'Bulk Invoice Generated', time: '2h ago', user: 'System' },
                    { event: 'Vendor Bid Received', time: '5h ago', user: 'QuickFix Ltd' },
                    { event: 'Security Alert: Gate 2', time: '12h ago', user: 'Guard 4' },
                    { event: 'Financial Report Exported', time: '1d ago', user: 'Treas. Mike' },
                  ].map((log, i) => (
                    <div key={i} className="flex gap-4 items-start last:border-0 pb-4 border-b border-border/50">
                       <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                       <div>
                          <p className="text-sm font-bold leading-none mb-1">{log.event}</p>
                          <p className="text-xs text-muted-foreground">{log.user} • {log.time}</p>
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-6 py-3 text-xs font-bold text-muted-foreground hover:text-primary flex items-center justify-center gap-1 transition-colors">
                  View Full Logs <ChevronRight className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CommitteeDashboard;
