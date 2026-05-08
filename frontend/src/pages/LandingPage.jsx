import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CreditCard, Users, ArrowRight, CheckCircle2, TrendingUp, Lock, Eye, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import logo from '../assets/logo.png';

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#0F172A] selection:bg-accent selection:text-primary">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <img src={logo} alt="ClearNest Logo" className="h-16 w-auto object-contain" />
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#features" className="hover:text-primary/70 transition-colors">Features</a>
          <a href="#transparency" className="hover:text-primary/70 transition-colors">Transparency</a>
          <a href="#governance" className="hover:text-primary/70 transition-colors">Governance</a>
        </div>
        <Link 
          to="/register-society"
          className="bg-[#0F172A] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2 group"
        >
          Launch Platform
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="px-6 lg:px-12 pt-12 pb-24 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-[#86EFAC]/20 text-[#0F172A] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-[#86EFAC]/30">
              <Shield className="w-3.5 h-3.5" />
              Institutional-Grade Governance
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-6xl lg:text-8xl font-bold tracking-tighter leading-[0.9]">
              Transparent <br />
              <span className="text-[#64748B]">Society</span> <br />
              Management.
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-[#64748B] max-w-lg leading-relaxed">
              The premium operating system for residential societies. Real-time financial transparency, automated maintenance, and democratic governance.
            </motion.p>
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <Link to="/register-society" className="bg-[#0F172A] text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl transition-all">
                Get Started
              </Link>
              <button className="flex items-center gap-2 font-bold px-8 py-4 rounded-2xl border border-border hover:bg-white transition-all">
                View Demo
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#86EFAC] to-blue-400 blur-3xl opacity-20 -z-10 animate-pulse"></div>
            <div className="bg-white rounded-[2rem] border border-border shadow-2xl overflow-hidden p-2">
              <div className="bg-[#0F172A] rounded-[1.5rem] p-6 text-white overflow-hidden relative group">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#86EFAC] rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-[#0F172A]" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Monthly Reserve</p>
                      <p className="text-xl font-bold">₹124,500.00</p>
                    </div>
                  </div>
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0F172A] bg-slate-700"></div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-[#86EFAC]" />
                        </div>
                        <div className="h-2 w-24 bg-white/20 rounded-full"></div>
                      </div>
                      <div className="h-2 w-12 bg-white/10 rounded-full"></div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-between items-end">
                   <div className="space-y-1">
                      <div className="h-2 w-32 bg-white/10 rounded-full"></div>
                      <div className="h-2 w-20 bg-white/5 rounded-full"></div>
                   </div>
                   <div className="w-12 h-12 rounded-full border-4 border-[#86EFAC] border-t-transparent animate-spin-slow"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="bg-white border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between gap-12">
          {[
            { label: 'Societies Onboarded', value: '450+' },
            { label: 'Financials Tracked', value: '₹12Cr+' },
            { label: 'Resident Satisfaction', value: '98.5%' },
            { label: 'Uptime Guarantee', value: '99.99%' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl font-bold tracking-tighter mb-1">{stat.value}</p>
              <p className="text-sm font-medium text-[#64748B]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-6 lg:px-12 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter mb-6">Engineered for Excellence.</h2>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto">Every module is designed to provide maximum clarity and absolute control over your society's operations.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Eye, title: 'Absolute Transparency', desc: 'Every penny tracked. Detailed ledgers accessible to every resident, ensuring trust and accountability.' },
            { icon: Users, title: 'Verified Voting', desc: 'Blockchain-inspired digital voting system. Secure, tamper-proof, and completely democratic.' },
            { icon: Lock, title: 'Enterprise Security', desc: 'Your data is encrypted and stored in institutional-grade servers. Privacy is our top priority.' },
            { icon: CreditCard, title: 'Smart Payments', desc: 'Auto-recurring maintenance dues with instant receipts and zero-manual entry accounting.' },
            { icon: Shield, title: 'Vendor Bidding', desc: 'Fair and transparent bidding process for society maintenance and projects. Best value, always.' },
            { icon: MessageSquare, title: 'AI Support', desc: 'Smart complaint routing and 24/7 AI assistance for residents to get answers instantly.' },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl bg-white border border-border group hover:border-[#86EFAC] transition-all duration-300"
            >
              <div className="w-12 h-12 bg-[#F5F5F4] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#86EFAC]/20 transition-colors">
                <feature.icon className="w-6 h-6 text-[#0F172A]" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-[#64748B] leading-relaxed text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 lg:px-12 py-24 max-w-7xl mx-auto">
        <div className="bg-[#0F172A] rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#86EFAC] blur-[120px] opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 blur-[120px] opacity-10"></div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-white tracking-tighter mb-8 leading-tight">
            Ready to upgrade your <br className="hidden md:block" /> society experience?
          </h2>
          <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto">Join hundreds of modern residential communities using ClearNest to manage their future.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link to="/register-society" className="w-full sm:w-auto bg-[#86EFAC] text-[#0F172A] px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-all">
                Get Started Now
             </Link>
             <button className="w-full sm:w-auto text-white px-10 py-4 rounded-2xl font-bold border border-white/20 hover:bg-white/10 transition-all">
                Talk to Sales
             </button>
          </div>
        </div>
      </section>

      <footer className="px-6 lg:px-12 py-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl mx-auto text-sm text-[#64748B] font-medium">
        <div className="flex items-center gap-2">
           <Shield className="w-4 h-4" />
           <span>© 2024 ClearNest Technologies Inc.</span>
        </div>
        <div className="flex items-center gap-8">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Security</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
