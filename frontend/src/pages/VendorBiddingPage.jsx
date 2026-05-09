import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Star, 
  FileCheck, 
  ArrowUpRight, 
  ShieldCheck, 
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingDown
} from 'lucide-react';

const VendorBiddingPage = () => {
  const activeBids = [
    { 
      project: 'Rooftop Solar Installation', 
      deadline: '3 days left', 
      bids: 3, 
      status: 'Reviewing',
      vendors: [
        { name: 'SunPower Systems', bid: '₹45,000', rating: 4.9, time: '2 weeks' },
        { name: 'EcoVolt Energy', bid: '₹42,500', rating: 4.5, time: '3 weeks' },
        { name: 'GreenGrid Solar', bid: '₹48,200', rating: 4.8, time: '12 days' },
      ]
    },
    { 
      project: 'Lobby Interior Renovation', 
      deadline: '8 days left', 
      bids: 5, 
      status: 'Open',
      vendors: [
        { name: 'ModernSpaces', bid: '₹12,000', rating: 4.7, time: '1 month' },
        { name: 'DesignWorks', bid: '₹14,500', rating: 4.9, time: '3 weeks' },
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor Management</h1>
          <p className="text-muted-foreground mt-1">Transparent bidding and vendor performance tracking.</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          Create New RFP
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Bidding Projects */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-xl font-bold">Active Bids</h2>
          <div className="space-y-6">
            {activeBids.map((project, idx) => (
              <div key={idx} className="bg-card rounded-[2.5rem] border border-border p-8 shadow-sm group">
                <div className="flex justify-between items-start mb-6">
                   <div>
                      <div className="flex items-center gap-3 mb-2">
                         <span className="text-[10px] font-bold uppercase tracking-widest bg-accent/20 text-primary px-3 py-1 rounded-full">
                            {project.status}
                         </span>
                         <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {project.deadline}
                         </span>
                      </div>
                      <h3 className="text-2xl font-bold">{project.project}</h3>
                   </div>
                   <div className="text-right">
                      <p className="text-xs font-bold text-muted-foreground uppercase">Current Bids</p>
                      <p className="text-2xl font-bold">{project.bids}</p>
                   </div>
                </div>

                <div className="bg-muted/30 rounded-3xl overflow-hidden border border-border">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-muted/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                            <th className="px-6 py-4">Vendor</th>
                            <th className="px-6 py-4">Quote</th>
                            <th className="px-6 py-4">Reliability</th>
                            <th className="px-6 py-4 text-right">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                         {project.vendors.map((v, i) => (
                            <tr key={i} className="hover:bg-card transition-colors">
                               <td className="px-6 py-5">
                                  <p className="font-bold text-sm">{v.name}</p>
                                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                     <FileCheck className="w-3 h-3" /> Verified Vendor
                                  </p>
                               </td>
                               <td className="px-6 py-5">
                                  <p className="font-bold text-sm">{v.bid}</p>
                                  <p className="text-[10px] text-muted-foreground">{v.time} completion</p>
                               </td>
                               <td className="px-6 py-5">
                                  <div className="flex items-center gap-1.5">
                                     <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                     <span className="text-sm font-bold">{v.rating}</span>
                                  </div>
                               </td>
                               <td className="px-6 py-5 text-right">
                                  <button className="text-primary hover:text-accent transition-colors">
                                     <ChevronRight className="w-5 h-5" />
                                  </button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>

                <div className="mt-8 flex justify-center">
                   <button className="text-sm font-bold text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors">
                      View Bid Comparison Matrix <ExternalLink className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendor Insights */}
        <div className="space-y-8">
           <h2 className="text-xl font-bold">Insights</h2>
           
           <div className="bg-[#0F172A] text-white p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                 <TrendingDown className="w-32 h-32" />
              </div>
              <h3 className="text-lg font-bold mb-2">Cost Savings</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                 Transparent bidding has reduced maintenance overhead by 12% in the last 6 months.
              </p>
              <div className="text-3xl font-bold text-accent">-₹8,450.00</div>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Total Savings YTD</p>
           </div>

           <div className="bg-card rounded-3xl border border-border p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                 <ShieldCheck className="w-5 h-5 text-emerald-500" />
                 Vendor Compliance
              </h3>
              <div className="space-y-4">
                 {[
                   { label: 'Insurance Verified', value: '100%' },
                   { label: 'Tax Compliant', value: '100%' },
                   { label: 'SLA Adherence', value: '94%' },
                 ].map((stat, i) => (
                    <div key={i}>
                       <div className="flex justify-between text-xs font-bold mb-2">
                          <span className="text-muted-foreground">{stat.label}</span>
                          <span>{stat.value}</span>
                       </div>
                       <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full" style={{ width: stat.value }} />
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-card rounded-3xl border border-border p-6">
              <h3 className="font-bold mb-4 text-sm">Top Rated Vendors</h3>
              <div className="space-y-4">
                 {[
                   { name: 'SafeGuard Pro', rating: 4.8, category: 'Security' },
                   { name: 'GreenThumb', rating: 4.6, category: 'Landscaping' },
                   { name: 'AquaClear', rating: 4.5, category: 'Pool' },
                 ].map((v, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
                       <div>
                          <p className="text-sm font-bold">{v.name}</p>
                          <p className="text-[10px] text-muted-foreground">{v.category}</p>
                       </div>
                       <div className="flex items-center gap-1 font-bold text-sm">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {v.rating}
                       </div>
                    </div>
                 ))}
              </div>
              <button className="w-full mt-6 py-3 rounded-xl border border-border text-xs font-bold hover:bg-muted transition-all">
                 View All Vendors
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VendorBiddingPage;
