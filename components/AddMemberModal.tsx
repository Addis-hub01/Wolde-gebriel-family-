import React, { useState } from 'react';
import { X, Send, CheckCircle, AlertCircle } from 'lucide-react';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xblnkbyd", {
        method: "POST",
        body: data,
        headers: {
            'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setStatus('success');
        form.reset();
        // Close modal automatically after 3 seconds on success
        setTimeout(() => {
            onClose();
            setStatus('idle');
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 scale-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
                <h3 className="font-bold text-lg text-slate-800">Family Tree Contribution</h3>
                <p className="text-xs text-slate-500">Add a member or request to join</p>
            </div>
            <button 
                onClick={onClose} 
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
                <X size={20}/>
            </button>
        </div>
        
        {/* Form Body */}
        <div className="p-6">
            {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2">Request Sent!</h4>
                    <p className="text-slate-500 max-w-xs">
                        Thank you for contributing. The family admin will review your submission shortly.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Identity */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Your Name</label>
                            <input 
                                id="name"
                                name="name" 
                                required 
                                type="text" 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-sm" 
                                placeholder="e.g. Abebe Bikila" 
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Email Address</label>
                            <input 
                                id="email"
                                name="email" 
                                required 
                                type="email" 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-sm" 
                                placeholder="you@email.com" 
                            />
                        </div>
                    </div>

                    {/* Connection */}
                    <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-4">
                        <h4 className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                            Who are you adding/connecting?
                        </h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">Relationship Type</label>
                                <div className="relative">
                                    <select 
                                        name="relationship" 
                                        className="w-full appearance-none px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                    >
                                        <option value="child">Child of...</option>
                                        <option value="spouse">Spouse of...</option>
                                        <option value="parent">Parent of...</option>
                                        <option value="sibling">Sibling of...</option>
                                        <option value="self">This is me (Request Access)</option>
                                    </select>
                                    <div className="absolute right-3 top-3 pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">Existing Family Member</label>
                                <input 
                                    name="relative_name" 
                                    required 
                                    type="text" 
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                                    placeholder="Name of relative..." 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Additional Details</label>
                        <textarea 
                            name="message" 
                            rows={3} 
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-sm resize-none" 
                            placeholder="Birth dates, locations, or any specific details..."
                        ></textarea>
                    </div>
                    
                    {/* Error Message */}
                    {status === 'error' && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                            <AlertCircle size={16} />
                            <span>Unable to send request. Please try again later.</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={status === 'submitting'} 
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {status === 'submitting' ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Sending...</span>
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                <span>Submit Request</span>
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};