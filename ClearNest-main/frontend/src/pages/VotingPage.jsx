import React from 'react';
import { motion } from 'framer-motion';
import { 
  Vote, 
  Users, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2
} from 'lucide-react';
import { votingResolutions } from '../data/mockData';

const VotingPage = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Digital Governance</h1>
          <p className="text-muted-foreground mt-1">Participate in society decisions through secure, verified voting.</p>
        </div>
        <div className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl border border-emerald-500/20 text-sm font-bold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Voting Identity Verified
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <h2 className="text-xl font-bold">Active Resolutions</h2>
           <div className="space-y-6">
              {votingResolutions.map((res) => (
                <div key={res.id} className="bg-card rounded-[2rem] border border-border p-8 shadow-sm hover:shadow-md transition-all group">
                   <div className="flex justify-between items-start mb-6">
                      <div className="p-3 rounded-2xl bg-muted group-hover:bg-accent/20 transition-colors">
                         <Vote className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                         <Clock className="w-3.5 h-3.5" /> Ends in {res.endsIn}
                      </div>
                   </div>
                   
                   <h3 className="text-2xl font-bold mb-3">{res.title}</h3>
                   <p className="text-muted-foreground leading-relaxed mb-8">{res.description}</p>
                   
                   <div className="space-y-4">
                      <div className="flex justify-between items-end text-sm">
                         <span className="font-bold">Current Participation</span>
                         <span className="text-muted-foreground">{res.votes} of {res.total} Units Cast</span>
                      </div>
                      <div className="w-full bg-muted h-3 rounded-full overflow-hidden flex">
                         <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(res.votes/res.total)*100}%` }}
                            className="bg-accent h-full"
                         />
                      </div>
                   </div>

                   <div className="mt-8 flex flex-col sm:flex-row gap-4">
                      <button className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                         Cast Your Vote <ArrowRight className="w-4 h-4" />
                      </button>
                      <button className="px-8 py-4 rounded-2xl font-bold border border-border hover:bg-muted transition-all">
                         View Details
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-8">
           <h2 className="text-xl font-bold">Governance Stats</h2>
           
           <div className="bg-card rounded-3xl border border-border p-6 space-y-6">
              {[
                { label: 'Participation Rate', value: '78%', icon: Users, color: 'text-blue-500' },
                { label: 'Resolutions Passed', value: '24', icon: Award, color: 'text-emerald-500' },
                { label: 'Security Level', value: 'AES-256', icon: ShieldCheck, color: 'text-primary' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase">{stat.label}</p>
                      <p className="text-xl font-bold">{stat.value}</p>
                   </div>
                </div>
              ))}
           </div>

           <div className="bg-gradient-to-br from-accent/20 to-blue-500/10 rounded-3xl border border-accent/20 p-8">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                 <TrendingUp className="w-5 h-5 text-primary" />
                 Decision Impact
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                 Your votes have helped reduce society electricity costs by 15% this year through the Green Energy initiative.
              </p>
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                 <CheckCircle2 className="w-4 h-4" /> Keep up the participation!
              </div>
           </div>

           <div className="bg-card rounded-3xl border border-border p-6 overflow-hidden">
              <h3 className="font-bold mb-4 text-sm">Past Results</h3>
              <div className="space-y-4">
                 {[
                   { title: 'New Gym Carpet', result: 'Passed', percent: '89%' },
                   { title: 'Annual Gala Budget', result: 'Passed', percent: '62%' },
                   { title: 'Pet Policy Update', result: 'Rejected', percent: '44%' },
                 ].map((past, i) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b border-border pb-3 last:border-0 last:pb-0">
                       <div>
                          <p className="font-semibold">{past.title}</p>
                          <p className={`text-[10px] font-bold ${past.result === 'Passed' ? 'text-emerald-500' : 'text-red-500'}`}>{past.result}</p>
                       </div>
                       <span className="font-mono font-bold text-muted-foreground">{past.percent}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VotingPage;
