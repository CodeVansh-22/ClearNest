import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, User, Calendar, MapPin } from 'lucide-react';
import api from '../api/axios';

const VerifyVisitor = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visitorData, setVisitorData] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('No token provided in the URL.');
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/visitors/verify/${token}`);
        setVisitorData(res.data?.data || res.data);
      } catch (err) {
        console.error('Verification Error:', err);
        setError(err.message || 'Failed to verify visitor.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Verifying visitor pass...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="bg-destructive/10 p-4 rounded-full mb-4">
          <XCircle className="w-12 h-12 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
        <p className="text-muted-foreground text-center max-w-md">{error}</p>
        <p className="text-xs text-muted-foreground mt-4">Token: {token}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="bg-card w-full max-w-md p-8 rounded-[2rem] border border-border shadow-2xl text-center">
        <div className="bg-emerald-500/10 p-4 rounded-full inline-block mb-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold mb-1">Valid Pass</h1>
        <p className="text-sm text-muted-foreground mb-6">Visitor is authorized to enter.</p>

        <div className="space-y-4 text-left border-t border-b border-border py-6 mb-6">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Visitor</p>
              <p className="font-semibold">{visitorData?.visitor?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Host (Resident)</p>
              <p className="font-semibold">{visitorData?.host?.name || 'Resident'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Society</p>
              <p className="font-semibold">{visitorData?.society || 'ClearNest Society'}</p>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground break-all">
          Token: {token}
        </div>
      </div>
    </div>
  );
};

export default VerifyVisitor;
