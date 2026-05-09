import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, User, ArrowRight, Loader2, Globe, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../hooks/useAuth';
import logo from '../assets/logo.png';

const AuthPage = () => {
    const [step, setStep] = useState(1); 
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        role: 'RESIDENT',
        society_code: '',
        flat_number: ''
    });
    
    const { login, register, googleLogin, loading, error } = useAuthStore();
    const navigate = useNavigate();

    const roles = [
        { id: 'RESIDENT', title: 'Resident', desc: 'I live in a society', icon: User },
        { id: 'SOCIETY_ADMIN', title: 'Society Admin', desc: 'I manage a society', icon: Shield },
    ];

    const handleGoogleSuccess = async (credentialResponse) => {
        const success = await googleLogin({
            credential: credentialResponse.credential,
            role: formData.role,
            society_code: formData.society_code,
            flat_number: formData.flat_number
        });
        if (success) {
            const role = useAuthStore.getState().user?.role;
            navigate(role === 'SOCIETY_ADMIN' ? '/committee' : '/dashboard');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            const success = await login({ 
                email: formData.email, 
                password: formData.password,
                role: formData.role,
                society_code: formData.society_code
            });
            if (success) {
                const role = useAuthStore.getState().user?.role;
                navigate(role === 'SOCIETY_ADMIN' ? '/committee' : '/dashboard');
            }
        } else {
            const success = await register(formData);
            if (success) setIsLogin(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F4] flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] border border-border shadow-2xl overflow-hidden p-8 lg:p-12"
            >
                <div className="text-center mb-8">
                    <img src={logo} alt="Logo" className="h-12 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold tracking-tighter">
                        {isLogin ? 'Access Portal' : 'Join ClearNest'}
                    </h1>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div 
                            key="step1"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-4"
                        >
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block text-center mb-4">Select your role</label>
                            {roles.map((r) => (
                                <button
                                    key={r.id}
                                    onClick={() => { setFormData({...formData, role: r.id}); setStep(2); }}
                                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left group hover:border-primary ${formData.role === r.id ? 'border-primary bg-primary/5' : 'border-border'}`}
                                >
                                    <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center group-hover:bg-primary/10">
                                        <r.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-bold">{r.title}</p>
                                        <p className="text-xs text-muted-foreground">{r.desc}</p>
                                    </div>
                                </button>
                            ))}
                            <div className="pt-4 text-center">
                                <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-bold text-muted-foreground hover:text-primary underline">
                                    {isLogin ? "Need an account? Sign Up" : "Back to Login"}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div 
                            key="step2"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Society Code</label>
                                <div className="relative">
                                    <Hash className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input 
                                        type="text" 
                                        placeholder="Enter Society Access Code"
                                        className="w-full bg-muted/50 border border-border rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                        value={formData.society_code}
                                        onChange={(e) => setFormData({...formData, society_code: e.target.value.toUpperCase()})}
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground">Ask your committee for the 8-digit unique code.</p>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setStep(1)} className="flex-1 py-4 border border-border rounded-2xl font-bold text-sm">Back</button>
                                <button 
                                    disabled={!formData.society_code}
                                    onClick={() => setStep(3)} 
                                    className="flex-[2] bg-[#0F172A] text-white py-4 rounded-2xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
                                >
                                    Continue
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div 
                            key="step3"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {!isLogin && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider">Full Name</label>
                                        <div className="relative">
                                            <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            <input 
                                                type="text" required
                                                className="w-full bg-muted/50 border border-border rounded-2xl py-3.5 pl-12 text-sm focus:ring-2 focus:ring-accent"
                                                value={formData.full_name}
                                                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider">Email</label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input 
                                            type="email" required
                                            className="w-full bg-muted/50 border border-border rounded-2xl py-3.5 pl-12 text-sm focus:ring-2 focus:ring-accent"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider">Password</label>
                                    <div className="relative">
                                        <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input 
                                            type="password" required
                                            className="w-full bg-muted/50 border border-border rounded-2xl py-3.5 pl-12 text-sm focus:ring-2 focus:ring-accent"
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        />
                                    </div>
                                </div>

                                {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setStep(2)} className="flex-1 py-4 border border-border rounded-2xl font-bold text-sm">Back</button>
                                    <button 
                                        disabled={loading}
                                        className="flex-[2] bg-[#0F172A] text-white py-4 rounded-2xl font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                            <>
                                                {isLogin ? 'Login' : 'Signup'}
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                            
                            <div className="mt-8 text-center space-y-4">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">Or continue with</span></div>
                                </div>
                                
                                <div className="flex justify-center">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => console.log('Login Failed')}
                                        useOneTap
                                        theme="outline"
                                        shape="pill"
                                        size="large"
                                        text="continue_with"
                                        width="100%"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-10 pt-8 border-t border-border flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                    <Shield className="w-3.5 h-3.5" />
                    Secure Multi-Tenant SaaS Environment
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
