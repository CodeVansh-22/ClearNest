import React, { useState } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon,
  MoreVertical,
  Loader2,
  Filter
} from 'lucide-react';
import { useComplaints } from '../hooks/useComplaints';
import { uploadApi } from '../api/services';
import { API_BASE_URL } from '../api/axios';
import FileUpload from '../components/uploads/FileUpload';

const ComplaintPage = () => {
  const { complaints, loading, error, createComplaint, updateStatus } = useComplaints();
  const [showModal, setShowModal] = useState(false);
  const [newComplaint, setNewComplaint] = useState({ title: '', description: '', image: null });
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let image_url = '';
    
    if (newComplaint.image) {
      try {
        const uploadRes = await uploadApi.uploadImage(newComplaint.image);
        image_url = uploadRes.data.url;
      } catch (err) {
        console.error("Upload failed", err);
      }
    }

    const success = await createComplaint({
      title: newComplaint.title,
      description: newComplaint.description,
      image_url
    });

    if (success) {
      setShowModal(false);
      setNewComplaint({ title: '', description: '', image: null });
    }
    setUploading(false);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Resolved': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'In Progress': return <Clock className="w-4 h-4 text-amber-500" />;
      default: return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10" /></div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Complaints & Requests</h1>
          <p className="text-muted-foreground mt-1">Submit and track your issues with full transparency.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#0F172A] text-white px-5 py-3 rounded-2xl text-sm font-bold hover:bg-opacity-90 transition-all shadow-xl shadow-primary/20"
        >
          <Plus className="w-5 h-5" /> File New Complaint
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {complaints.length === 0 ? (
            <div className="bg-card p-12 rounded-[2rem] border border-border text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="font-bold text-xl">No complaints found</h3>
              <p className="text-muted-foreground text-sm mt-2">Everything looks clear! Submit a complaint if you have an issue.</p>
            </div>
          ) : (
            complaints.map((c) => (
              <div key={c._id} className="bg-card p-6 rounded-3xl border border-border group hover:border-accent transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-muted group-hover:bg-accent/10 transition-colors">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold">{c.title}</h3>
                      <p className="text-xs text-muted-foreground">ID: #CN-{c._id.slice(-6).toUpperCase()} • {new Date(c.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold border ${
                    c.status === 'Resolved' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                    c.status === 'In Progress' ? 'bg-amber-50 border-amber-100 text-amber-600' : 
                    'bg-slate-50 border-slate-100 text-slate-500'
                  }`}>
                    {getStatusIcon(c.status)}
                    {c.status}
                  </div>
                </div>
                <p className="text-sm text-[#64748B] leading-relaxed mb-4">{c.description}</p>
                {c.image_url && (
                  <img src={`${API_BASE_URL}${c.image_url}`} alt="Proof" className="w-full h-48 object-cover rounded-2xl mb-4" />
                )}
                <div className="pt-4 border-t border-border flex justify-between items-center">
                   <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white"></div>
                   </div>
                   <button className="text-xs font-bold text-primary hover:underline">View Timeline</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-6">
           <div className="bg-[#0F172A] text-white p-8 rounded-[2rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#86EFAC] blur-[60px] opacity-20"></div>
              <h3 className="text-xl font-bold mb-2">Resolution Rate</h3>
              <p className="text-slate-400 text-xs mb-6">Our committee resolves 94% of complaints within 48 hours.</p>
              <div className="text-4xl font-bold tracking-tighter">94.2%</div>
              <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-[#86EFAC] w-[94%]"></div>
              </div>
           </div>
           
           <div className="bg-card p-6 rounded-[2rem] border border-border">
              <h3 className="font-bold mb-4">Quick Filters</h3>
              <div className="space-y-2">
                {['All Complaints', 'Pending', 'In Progress', 'Resolved'].map(f => (
                  <button key={f} className="w-full flex justify-between items-center p-3 rounded-xl hover:bg-muted transition-colors text-sm font-medium">
                    {f}
                    <div className="w-5 h-5 rounded-md bg-muted flex items-center justify-center text-[10px] font-bold">12</div>
                  </button>
                ))}
              </div>
           </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 lg:p-10 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">File a Complaint</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider">Complaint Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 text-sm"
                  placeholder="e.g. Water leakage in lobby"
                  value={newComplaint.title}
                  onChange={e => setNewComplaint({...newComplaint, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider">Description</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 text-sm"
                  placeholder="Describe the issue in detail..."
                  value={newComplaint.description}
                  onChange={e => setNewComplaint({...newComplaint, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <FileUpload 
                  label="Attach Photo (Optional)" 
                  type="image"
                  onUploadSuccess={(url) => setNewComplaint({...newComplaint, image_url: url})} 
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-border rounded-xl font-bold text-sm hover:bg-muted transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-3 bg-[#0F172A] text-white rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  {uploading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Submit Complaint'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ComplaintPage;
