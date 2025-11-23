import React, { useState } from 'react';
import { CaseDetails } from '../types';
import { geminiService } from '../services/geminiService';
import MarkdownMessage from './MarkdownMessage';

const CaseAdvisor: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CaseDetails>({
    incidentDate: '',
    incidentType: '',
    jurisdiction: '',
    affectedParties: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setAnalysis(null);
    setStep(2); // Move to analysis view
    
    try {
      const result = await geminiService.analyzeCase(formData);
      setAnalysis(result);
    } catch (error) {
      setAnalysis("**Error:** Failed to generate legal analysis. Please check your connection and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setAnalysis(null);
    setFormData({
      incidentDate: '',
      incidentType: '',
      jurisdiction: '',
      affectedParties: '',
      description: ''
    });
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 bg-cyber-darker/50">
      
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-3xl font-bold text-white mb-3">Incident Helper</h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Don't worry if you don't know the law. <br/>
            Just answer a few simple questions, and we'll give you a <span className="text-cyber-accent">plain English plan</span> to stay safe.
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSubmit} className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-700/60 shadow-xl space-y-8">
            
            {/* Section 1: Basics */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/50 flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">What Happened?</h3>
                  <p className="text-xs text-slate-500">The basics of the problem.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Type of Problem</label>
                  <select
                    name="incidentType"
                    required
                    value={formData.incidentType}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900/60 border border-slate-600 rounded-xl p-3 text-white focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select what fits best...</option>
                    <option value="Data Breach">My data was stolen (Data Breach)</option>
                    <option value="Ransomware">My files are locked (Ransomware)</option>
                    <option value="Phishing">I clicked a bad link (Phishing)</option>
                    <option value="Lost Device">I lost my phone/laptop</option>
                    <option value="Hacked Account">My account was hacked</option>
                    <option value="Copyright Issue">Someone copied my work</option>
                    <option value="Other">Something else</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">When did it happen?</label>
                  <input
                    type="date"
                    name="incidentDate"
                    required
                    value={formData.incidentDate}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900/60 border border-slate-600 rounded-xl p-3 text-white focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-slate-700/50"></div>

            {/* Section 2: Context */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/50 flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">The Details</h3>
                  <p className="text-xs text-slate-500">This helps us check local rules for you.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Where are you located?</label>
                  <input
                    type="text"
                    name="jurisdiction"
                    required
                    placeholder="e.g., California, London, Berlin"
                    value={formData.jurisdiction}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900/60 border border-slate-600 rounded-xl p-3 text-white focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent outline-none transition-all placeholder:text-slate-600"
                  />
                  <p className="text-xs text-slate-500">We need this to know which laws apply to you.</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Who is affected?</label>
                  <input
                    type="text"
                    name="affectedParties"
                    required
                    placeholder="e.g., Just me, My customers, My family"
                    value={formData.affectedParties}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900/60 border border-slate-600 rounded-xl p-3 text-white focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent outline-none transition-all placeholder:text-slate-600"
                  />
                   <p className="text-xs text-slate-500">Is it personal, or does it involve others' information?</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Describe what happened</label>
                <textarea
                  name="description"
                  required
                  placeholder="Just tell us the story in your own words. You don't need to use fancy legal terms."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full bg-slate-900/60 border border-slate-600 rounded-xl p-3 text-white focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent outline-none transition-all resize-y placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyber-accent to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-900/20 hover:shadow-cyan-500/30 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-3 text-lg"
              >
                <span>Generate My Action Plan</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <p className="text-center text-xs text-slate-500 mt-3">
                This is an AI guide to help you get started. It is not a substitute for a real lawyer.
              </p>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
             {/* Summary Card */}
             <div className="glass-panel p-4 rounded-xl border border-slate-700/50 flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-400 items-center justify-center md:justify-start bg-slate-900/40">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyber-accent"></span>
                  <span className="text-white font-medium">{formData.incidentType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">|</span>
                  <span>{formData.jurisdiction}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">|</span>
                  <span>{formData.incidentDate}</span>
                </div>
             </div>

            {isAnalyzing ? (
              <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center space-y-8 min-h-[400px] border-t border-cyber-accent/10">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-[6px] border-slate-800 rounded-full"></div>
                  <div className="absolute inset-0 border-[6px] border-t-cyber-accent border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-cyber-accent animate-pulse">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                  </div>
                </div>
                <div className="max-w-md">
                  <h3 className="text-2xl font-bold text-white mb-3">Checking the details...</h3>
                  <p className="text-slate-400">We are looking up safe steps for you to take based on your location and problem.</p>
                </div>
              </div>
            ) : (
              <div className="glass-panel p-8 rounded-2xl border border-cyber-accent/30 shadow-[0_0_40px_rgba(6,182,212,0.1)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-cyber-accent to-blue-600"></div>
                <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4 border-b border-slate-700/50 pb-6">
                   <div>
                     <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                       <span className="text-3xl">🛡️</span> Your Safety Plan
                     </h3>
                     <p className="text-slate-400 mt-2 text-sm">Here is a simplified guide based on what you told us.</p>
                   </div>
                   <button onClick={resetForm} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium text-slate-300 hover:text-white transition-colors border border-slate-700 hover:border-slate-600">
                     Start Over
                   </button>
                </div>
                
                <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-white prose-strong:text-cyber-glow prose-a:text-cyber-accent max-w-none">
                  {analysis && <MarkdownMessage content={analysis} />}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                   <p className="text-xs text-slate-500 italic">
                     * This information is for educational purposes only. Always consult a qualified attorney for legal advice.
                   </p>
                   <button 
                     onClick={() => window.print()}
                     className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold text-white transition-colors shadow-lg shadow-blue-900/20"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                     </svg>
                     Print / Save PDF
                   </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CaseAdvisor;