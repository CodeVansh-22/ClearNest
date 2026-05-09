import React, { useState, useCallback } from 'react';
import { Upload, X, File, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadApi } from '../../api/uploadApi';

const FileUpload = ({ onUploadSuccess, type = 'image', label = 'Upload File' }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error
    const [error, setError] = useState(null);

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Validation
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (selectedFile.size > maxSize) {
            setError('File size exceeds 10MB limit');
            setStatus('error');
            return;
        }

        setFile(selectedFile);
        setError(null);
        setStatus('idle');

        if (selectedFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setStatus('uploading');
        setProgress(30);

        try {
            const res = type === 'image' 
                ? await uploadApi.uploadImage(file)
                : await uploadApi.uploadDocument(file);
            
            setProgress(100);
            setStatus('success');
            onUploadSuccess(res.data.file_path);
        } catch (err) {
            setError(err.message || 'Upload failed');
            setStatus('error');
        } finally {
            setUploading(false);
        }
    };

    const removeFile = () => {
        setFile(null);
        setPreview(null);
        setStatus('idle');
        setProgress(0);
        setError(null);
    };

    return (
        <div className="w-full space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
            
            <AnimatePresence mode="wait">
                {!file ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="relative border-2 border-dashed border-border rounded-[2rem] p-10 text-center hover:border-accent transition-all group bg-card/50"
                    >
                        <input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            onChange={handleFileSelect}
                            accept={type === 'image' ? 'image/*' : '.pdf,.docx'}
                        />
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto group-hover:bg-accent/10 transition-colors">
                                <Upload className="w-8 h-8 text-muted-foreground group-hover:text-accent" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Click to upload or drag & drop</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {type === 'image' ? 'PNG, JPG, WEBP up to 10MB' : 'PDF, DOCX up to 10MB'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative bg-card border border-border rounded-[2rem] p-6 flex items-center gap-4 overflow-hidden"
                    >
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-2xl border border-border" />
                        ) : (
                            <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center border border-border">
                                <File className="w-8 h-8 text-muted-foreground" />
                            </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                            
                            <div className="mt-3">
                                {status === 'idle' && (
                                    <button 
                                        onClick={handleUpload}
                                        className="text-xs font-bold bg-primary text-white px-4 py-1.5 rounded-full hover:opacity-90 transition-all"
                                    >
                                        Start Upload
                                    </button>
                                )}
                                {status === 'uploading' && (
                                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            className="h-full bg-accent"
                                        />
                                    </div>
                                )}
                                {status === 'success' && (
                                    <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Upload Complete
                                    </div>
                                )}
                                {status === 'error' && (
                                    <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold">
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button 
                            onClick={removeFile}
                            className="p-2 hover:bg-muted rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FileUpload;
