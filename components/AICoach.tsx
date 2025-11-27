import React, { useState } from 'react';
import { getAICoachAdvice } from '../services/geminiService';
import { DistanceType, WeeklyPlan } from '../types';
import ReactMarkdown from 'react-markdown';

interface AICoachProps {
  distance: DistanceType;
  weeks: number;
  plan: WeeklyPlan[];
}

export const AICoach: React.FC<AICoachProps> = ({ distance, weeks, plan }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleAskCoach = async () => {
    setLoading(true);
    setIsOpen(true);
    const result = await getAICoachAdvice(distance, weeks, plan);
    setAdvice(result);
    setLoading(false);
  };

  if (plan.length === 0) return null;

  return (
    <div className="mt-8">
      {!isOpen ? (
        <button
          onClick={handleAskCoach}
          className="group relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-md transition-all hover:shadow-lg"
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white text-slate-800 rounded-md group-hover:bg-opacity-0 group-hover:text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Ask AI Coach for Insights
          </span>
        </button>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Coach Gemini
             </h3>
             <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
               Close
             </button>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="text-slate-500 text-sm animate-pulse">Analyzing your plan structure...</p>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none text-sm">
              <ReactMarkdown>{advice || ''}</ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};