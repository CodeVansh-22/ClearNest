import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Hash, Mail, ArrowRight, Loader2, CheckCircle2, Copy, Users, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import logo from '../assets/logo.png';

const SocietyOnboarding = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState('choice');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [societyData, setSocietyData] = useState(null);
    const [formData, setFormData] = useState({
        society_name: '',
        city: '',
        address: '',
        total_flats: '',
        admin_email: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/societies/register', formData);
            setSocietyData(res.data);
            setSuccess(true);
        } catch (err) {
            console.error("Registration Error:", err);
            const msg = err?.message || (typeof err === 'string' ? err : null) || "Registration failed";
            alert(`Error: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    if (mode === 'choice') {
        return (
            <div className="min-h-screen bg-[#F5F5F4] flex items-center justify-center p-6">
                <div className="w-full max-w-4xl">
                    <div className="text-center mb-10">
                        <img src={logo} alt="Logo" className="h-12 mx-auto mb-6" />
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-[#0F172A]">
                            Choose your ClearNest access
                        </h1>
                        <p className="text-muted-foreground mt-4 text-lg">
                            Create a new society workspace or join your existing society portal.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <motion.button
                            whileHover={{ y: -6 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setMode('register')}
                            className="bg-white border border-border rounded-[2rem] p-8 text-left shadow-xl hover:shadow-2xl transition-all group"
                        >
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-100 transition-colors">
                                <Building2 className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter mb-3">Register Society</h2>
                            <p className="text-muted-foreground leading-relaxed mb-8">
                                For society owners or admins creating a new ClearNest workspace and society code.
                            </p>
                            <span className="inline-flex items-center gap-2 font-bold text-[#0F172A]">
                                Create society
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </motion.button>

                        <motion.button
                            whileHover={{ y: -6 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/auth')}
                            className="bg-[#0F172A] text-white border border-[#0F172A] rounded-[2rem] p-8 text-left shadow-xl hover:shadow-2xl transition-all group"
                        >
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/15 transition-colors">
                                <Users className="w-7 h-7 text-emerald-300" />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter mb-3">Society Members & Committee</h2>
                            <p className="text-slate-300 leading-relaxed mb-8">
                                For residents and committee members joining with the 8-digit society code.
                            </p>
                            <span className="inline-flex items-center gap-2 font-bold">
                                Login or sign up
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </motion.button>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                        <Shield className="w-3.5 h-3.5" />
                        Residents need the society code shared by their admin
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-[#F5F5F4] flex items-center justify-center p-6">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-lg bg-white rounded-[3rem] p-12 text-center shadow-2xl border border-emerald-100"
                >
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tighter mb-4">Society Registered!</h1>
                    <p className="text-muted-foreground mb-8">Welcome to ClearNest. Your society has been successfully onboarded.</p>
                    
                    <div className="bg-muted/50 p-8 rounded-[2rem] border border-border mb-8">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Unique Society Code</p>
                        <div className="flex items-center justify-center gap-4">
                            <span className="text-4xl font-black tracking-widest text-primary">{societyData.society_code}</span>
                            <button 
                                onClick={() => navigator.clipboard.writeText(societyData.society_code)}
                                className="p-2 hover:bg-white rounded-lg transition-colors"
                            >
                                <Copy className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-10 leading-relaxed px-8">
                        Share this code with your residents. They will need it to join your society's private portal.
                    </p>

                    <button 
                        onClick={() => navigate('/auth')}
                        className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 group"
                    >
                        Go to Login
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F5F4] flex items-center justify-center p-6">
            <div className="w-full max-w-2xl grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <img src={logo} alt="Logo" className="h-12" />
                    <h1 className="text-5xl font-bold tracking-tighter leading-tight">
                        Digitize your <br />
                        <span className="text-primary">Society</span> in <br />
                        minutes.
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Join 450+ modern communities using ClearNest to manage finances, complaints, and voting with absolute transparency.
                    </p>
                    <div className="space-y-4">
                        {['Real-time Ledgers', 'Automated Maintenance', 'Verified Voting'].map(f => (
                            <div key={f} className="flex items-center gap-3 font-bold text-sm">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                {f}
                            </div>
                        ))}
                    </div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-[2.5rem] border border-border shadow-2xl p-8 lg:p-10"
                >
                    <h2 className="text-2xl font-bold mb-8">Register Society</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <button
                            type="button"
                            onClick={() => setMode('choice')}
                            className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors mb-2"
                        >
                            Back to options
                        </button>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Society Name</label>
                            <div className="relative">
                                <Building2 className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input 
                                    type="text" required
                                    placeholder="e.g. Green Valley Apartments"
                                    className="w-full bg-muted/30 border border-border rounded-xl py-3 pl-12 text-sm focus:ring-2 focus:ring-primary"
                                    onChange={e => setFormData({...formData, society_name: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">City</label>
                                <div className="relative">
                                    <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input 
                                        type="text" required
                                        placeholder="Mumbai"
                                        className="w-full bg-muted/30 border border-border rounded-xl py-3 pl-12 text-sm"
                                        onChange={e => setFormData({...formData, city: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Flats</label>
                                <div className="relative">
                                    <Hash className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input 
                                        type="number" required
                                        placeholder="120"
                                        className="w-full bg-muted/30 border border-border rounded-xl py-3 pl-12 text-sm"
                                        onChange={e => setFormData({...formData, total_flats: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Admin Email</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input 
                                    type="email" required
                                    placeholder="admin@society.com"
                                    className="w-full bg-muted/30 border border-border rounded-xl py-3 pl-12 text-sm"
                                    onChange={e => setFormData({...formData, admin_email: e.target.value})}
                                />
                            </div>
                        </div>

                        <button 
                            disabled={loading}
                            className="w-full bg-[#0F172A] text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                                <>
                                    Create Society Account
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default SocietyOnboarding;
