import React, { useState } from 'react';
import { WeeklyPlan, RunSession, FeedbackType } from '../types';

interface PlanTableProps {
  plan: WeeklyPlan[];
  onUpdateSession?: (weekIndex: number, dayIndex: number, updates: Partial<RunSession>) => void;
  readOnly?: boolean;
}

const FeedbackSelector: React.FC<{ 
  current: FeedbackType | undefined, 
  onSelect: (f: FeedbackType) => void 
}> = ({ current, onSelect }) => (
  <div className="flex gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
    <button 
      onClick={(e) => { e.stopPropagation(); onSelect('easy'); }}
      className={`flex-1 px-2 py-1 text-[10px] uppercase font-bold tracking-wide rounded border transition-all ${current === 'easy' ? 'bg-green-100 border-green-300 text-green-700 shadow-inner' : 'bg-white border-slate-200 text-slate-400 hover:text-green-600 hover:border-green-200'}`}
      title="Too Easy"
    >
      Easy
    </button>
    <button 
      onClick={(e) => { e.stopPropagation(); onSelect('good'); }}
      className={`flex-1 px-2 py-1 text-[10px] uppercase font-bold tracking-wide rounded border transition-all ${current === 'good' ? 'bg-blue-100 border-blue-300 text-blue-700 shadow-inner' : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200'}`}
      title="Just Right"
    >
      Good
    </button>
    <button 
      onClick={(e) => { e.stopPropagation(); onSelect('hard'); }}
      className={`flex-1 px-2 py-1 text-[10px] uppercase font-bold tracking-wide rounded border transition-all ${current === 'hard' ? 'bg-red-100 border-red-300 text-red-700 shadow-inner' : 'bg-white border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200'}`}
      title="Too Hard"
    >
      Hard
    </button>
  </div>
);

const getCategoryBadge = (category: RunSession['category']) => {
  switch (category) {
    case 'Speed':
      return { 
        style: 'bg-rose-50 text-rose-700 border-rose-200', 
        icon: (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ) 
      };
    case 'Long':
      return { 
        style: 'bg-indigo-50 text-indigo-700 border-indigo-200', 
        icon: (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        ) 
      };
    case 'Medium':
      return { 
        style: 'bg-amber-50 text-amber-700 border-amber-200', 
        icon: (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ) 
      };
    case 'Easy':
      return { 
        style: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
        icon: (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) 
      };
    case 'Rest':
      return { 
        style: 'bg-slate-50 text-slate-500 border-slate-200', 
        icon: (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) 
      };
    default:
      return { style: 'bg-slate-50 text-slate-700 border-slate-200', icon: null };
  }
};

interface SessionCellProps {
  day: RunSession;
  weekIndex: number;
  dayIndex: number;
  onUpdateSession?: (weekIndex: number, dayIndex: number, updates: Partial<RunSession>) => void;
  readOnly?: boolean;
}

const SessionCell: React.FC<SessionCellProps> = ({ day, weekIndex, dayIndex, onUpdateSession, readOnly }) => {
  const [showNotes, setShowNotes] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const badge = getCategoryBadge(day.category);
  const isRest = day.category === 'Rest';

  return (
    <div className={`flex flex-col gap-1 transition-all duration-300 relative group ${day.completed ? 'opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          {/* Badge */}
          <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border mb-2 text-[10px] font-bold uppercase tracking-wider ${badge.style}`}>
            {badge.icon}
            <span>{day.category}</span>
          </div>

          {/* Type */}
          <span className={`font-semibold block text-sm leading-tight ${day.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
            {day.type}
          </span>
          
          {/* Distance */}
          {day.distance > 0 && (
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full inline-block mt-1.5 border ${
              day.completed ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white text-slate-600 border-slate-200 shadow-sm'
            }`}>
              {day.distance} km
            </span>
          )}
        </div>
        
        {!readOnly && (
          <div className="flex flex-col gap-2 mt-0.5">
            {/* Complete Button */}
            <button
              onClick={() => onUpdateSession?.(weekIndex, dayIndex, { completed: !day.completed })}
              className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                day.completed 
                  ? 'bg-green-500 border-green-500 text-white shadow-sm scale-110' 
                  : 'border-slate-300 hover:border-green-400 text-transparent bg-white hover:bg-green-50'
              }`}
              title={day.completed ? "Mark incomplete" : "Mark complete"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>

             {/* Feedback Toggle Button */}
             {day.completed && !isRest && (
               <button
                 onClick={() => setShowFeedback(!showFeedback)}
                 className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                   day.feedback === 'easy' ? 'bg-green-100 border-green-300 text-green-600' :
                   day.feedback === 'good' ? 'bg-blue-100 border-blue-300 text-blue-600' :
                   day.feedback === 'hard' ? 'bg-red-100 border-red-300 text-red-600' :
                   showFeedback ? 'bg-indigo-100 border-indigo-300 text-indigo-600' :
                   'border-slate-300 hover:border-indigo-400 text-slate-300 hover:text-indigo-500 bg-white'
                 }`}
                 title="Rate Workout"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                   <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                 </svg>
               </button>
             )}

            {/* Notes Toggle Button */}
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                (day.notes && day.notes.trim().length > 0) || showNotes
                  ? 'bg-amber-100 border-amber-300 text-amber-600'
                  : 'border-slate-300 hover:border-amber-400 text-slate-300 hover:text-amber-500 bg-white'
              }`}
              title="Add Notes"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* Feedback Selector Area */}
      {showFeedback && !readOnly && day.completed && !isRest && (
        <div className="mt-2">
           <FeedbackSelector 
             current={day.feedback} 
             onSelect={(feedback) => onUpdateSession?.(weekIndex, dayIndex, { feedback })} 
           />
        </div>
      )}

      {/* Notes Textarea */}
      {showNotes && !readOnly && (
         <div className="mt-2 animate-in slide-in-from-top-1 fade-in duration-200">
           <textarea
             value={day.notes || ''}
             onChange={(e) => onUpdateSession?.(weekIndex, dayIndex, { notes: e.target.value })}
             placeholder="How did it feel?"
             className="w-full text-xs p-2 rounded-md border border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 bg-slate-50 resize-none placeholder:text-slate-400 text-slate-700"
             rows={2}
             autoFocus
           />
         </div>
      )}

      {/* ReadOnly Notes View */}
      {readOnly && day.notes && (
          <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100 italic">
            "{day.notes}"
          </div>
      )}
    </div>
  );
};

export const PlanTable: React.FC<PlanTableProps> = ({ plan, onUpdateSession, readOnly = false }) => {
  if (plan.length === 0) return null;

  return (
    <div className="overflow-hidden border border-slate-200 rounded-xl shadow-sm bg-white">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-4 py-3 sticky left-0 bg-slate-50 z-10 w-16 text-center border-r border-slate-200">Week</th>
              <th scope="col" className="px-4 py-3 min-w-[150px]">Mon</th>
              <th scope="col" className="px-4 py-3 min-w-[150px]">Tue</th>
              <th scope="col" className="px-4 py-3 min-w-[150px]">Wed</th>
              <th scope="col" className="px-4 py-3 min-w-[150px]">Thu</th>
              <th scope="col" className="px-4 py-3 min-w-[150px]">Fri</th>
              <th scope="col" className="px-4 py-3 min-w-[150px]">Sat</th>
              <th scope="col" className="px-4 py-3 min-w-[150px] font-bold text-indigo-700 bg-indigo-50/30">Sun (Long)</th>
            </tr>
          </thead>
          <tbody>
            {plan.map((week, weekIndex) => (
              <tr key={week.weekNumber} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${weekIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                <td className="px-4 py-4 font-bold text-slate-900 sticky left-0 bg-inherit text-center border-r border-slate-200 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                  {week.weekNumber}
                </td>
                {week.days.map((day, dayIndex) => (
                    <td key={dayIndex} className={`px-4 py-4 align-top ${dayIndex === 6 ? 'bg-indigo-50/10' : ''}`}>
                      <SessionCell 
                        day={day} 
                        weekIndex={weekIndex} 
                        dayIndex={dayIndex} 
                        onUpdateSession={onUpdateSession} 
                        readOnly={readOnly}
                      />
                    </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};