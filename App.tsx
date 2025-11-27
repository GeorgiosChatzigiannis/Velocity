import React, { useState, useEffect } from 'react';
import { DistanceType, WeeklyPlan, SavedPlan, RunSession } from './types';
import { generatePlan } from './utils';
import { PlanTable } from './components/PlanTable';
import { RunGuide } from './components/RunGuide';
import { AICoach } from './components/AICoach';

const App: React.FC = () => {
  const [distance, setDistance] = useState<DistanceType>(DistanceType.FiveK);
  const [weeks, setWeeks] = useState<number>(12);
  const [currentPlan, setCurrentPlan] = useState<WeeklyPlan[]>([]);
  // activePlanId tracks if the current view corresponds to a saved plan (for auto-saving progress)
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [activeTab, setActiveTab] = useState<'create' | 'saved' | 'guide'>('create');

  useEffect(() => {
    const loaded = localStorage.getItem('velocity_plans');
    if (loaded) {
      setSavedPlans(JSON.parse(loaded));
    }
  }, []);

  const handleGenerate = () => {
    const plan = generatePlan(distance, weeks);
    setCurrentPlan(plan);
    setActivePlanId(null); // New plan, not saved yet
    setActiveTab('create');
  };

  const handleSave = () => {
    if (currentPlan.length === 0) return;
    
    // If it's already a saved plan, just update the existing record (save progress)
    if (activePlanId) {
        const updatedPlans = savedPlans.map(p => 
            p.id === activePlanId ? { ...p, plan: currentPlan } : p
        );
        setSavedPlans(updatedPlans);
        localStorage.setItem('velocity_plans', JSON.stringify(updatedPlans));
        alert('Progress saved!');
        return;
    }

    // Otherwise create a new save
    const newId = Date.now().toString();
    const newSavedPlan: SavedPlan = {
      id: newId,
      name: `${distance.toUpperCase()} - ${weeks} Weeks`,
      distance,
      weeks,
      createdAt: Date.now(),
      plan: currentPlan
    };
    const updated = [...savedPlans, newSavedPlan];
    setSavedPlans(updated);
    localStorage.setItem('velocity_plans', JSON.stringify(updated));
    setActivePlanId(newId);
    alert('Plan saved successfully!');
  };

  const handleLoad = (plan: SavedPlan) => {
    setDistance(plan.distance);
    setWeeks(plan.weeks);
    setCurrentPlan(plan.plan);
    setActivePlanId(plan.id);
    setActiveTab('create');
  };

  const handleDelete = (id: string) => {
    const updated = savedPlans.filter(p => p.id !== id);
    setSavedPlans(updated);
    localStorage.setItem('velocity_plans', JSON.stringify(updated));
    if (activePlanId === id) {
        setActivePlanId(null);
        setCurrentPlan([]);
    }
  };

  const handleSessionUpdate = (weekIndex: number, dayIndex: number, updates: Partial<RunSession>) => {
    const newPlan = [...currentPlan];
    // Create a deep copy of the week and the specific day to avoid mutation
    const newWeek = { ...newPlan[weekIndex] };
    const newDays = [...newWeek.days];
    newDays[dayIndex] = { ...newDays[dayIndex], ...updates };
    newWeek.days = newDays;
    newPlan[weekIndex] = newWeek;
    
    setCurrentPlan(newPlan);

    // Auto-save progress if this is an active saved plan
    if (activePlanId) {
        const updatedPlans = savedPlans.map(p => 
            p.id === activePlanId ? { ...p, plan: newPlan } : p
        );
        setSavedPlans(updatedPlans);
        localStorage.setItem('velocity_plans', JSON.stringify(updatedPlans));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold transform -skew-x-12">
               V
             </div>
             <h1 className="text-xl font-bold tracking-tight text-slate-900">Velocity</h1>
          </div>
          
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => setActiveTab('create')} className={`${activeTab === 'create' ? 'text-primary-600' : 'hover:text-slate-900'}`}>Generator</button>
            <button onClick={() => setActiveTab('saved')} className={`${activeTab === 'saved' ? 'text-primary-600' : 'hover:text-slate-900'}`}>My Plans ({savedPlans.length})</button>
            <button onClick={() => setActiveTab('guide')} className={`${activeTab === 'guide' ? 'text-primary-600' : 'hover:text-slate-900'}`}>Run Guide</button>
          </nav>

          <a href="https://buy.stripe.com/4gwfZf9zRaI79na148" target="_blank" rel="noreferrer" className="text-sm px-4 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors font-medium">
            Donate
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8">
        
        {/* Navigation for Mobile */}
        <div className="md:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
            <button onClick={() => setActiveTab('create')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === 'create' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Generator</button>
            <button onClick={() => setActiveTab('saved')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === 'saved' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Saved ({savedPlans.length})</button>
            <button onClick={() => setActiveTab('guide')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === 'guide' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Guide</button>
        </div>

        {activeTab === 'create' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Controls */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Target Distance</label>
                  <select 
                    value={distance} 
                    onChange={(e) => setDistance(e.target.value as DistanceType)}
                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2.5"
                  >
                    <option value={DistanceType.FiveK}>5k</option>
                    <option value={DistanceType.TenK}>10k</option>
                    <option value={DistanceType.HalfMarathon}>Half Marathon</option>
                    <option value={DistanceType.Marathon}>Marathon</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Weeks to Train</label>
                  <input 
                    type="number" 
                    value={weeks} 
                    onChange={(e) => setWeeks(Number(e.target.value))}
                    min={4} 
                    max={52}
                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2.5"
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleGenerate}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95"
                  >
                    Generate Plan
                  </button>
                  {currentPlan.length > 0 && (
                    <button 
                      onClick={handleSave}
                      className={`font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-colors flex items-center gap-2 ${activePlanId ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                      title="Save Plan"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      {activePlanId ? 'Saved' : 'Save'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* AI Coach Integration */}
            {currentPlan.length > 0 && (
              <AICoach distance={distance} weeks={weeks} plan={currentPlan} />
            )}

            {/* Results */}
            {currentPlan.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <h2 className="text-xl font-bold text-slate-900">Your Training Schedule</h2>
                   <div className="flex gap-4 items-center">
                     {activePlanId && <span className="text-sm text-green-600 font-medium">✓ Progress auto-saving</span>}
                     <button onClick={() => window.print()} className="text-sm text-slate-500 hover:text-primary-600 flex items-center gap-1 print:hidden">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Print
                     </button>
                   </div>
                </div>
                <PlanTable plan={currentPlan} onUpdateSession={handleSessionUpdate} />
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                   </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900">Ready to run?</h3>
                <p className="text-slate-500 mt-1">Select your distance and duration above to generate a custom plan.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Saved Plans</h2>
            {savedPlans.length === 0 ? (
              <p className="text-slate-500">No saved plans yet. Go create one!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedPlans.map(plan => {
                  // Calculate completion percentage
                  const totalSessions = plan.plan.reduce((acc, week) => acc + week.days.filter(d => d.distance > 0).length, 0);
                  const completedSessions = plan.plan.reduce((acc, week) => acc + week.days.filter(d => d.distance > 0 && d.completed).length, 0);
                  const progress = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

                  return (
                    <div key={plan.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-slate-800">{plan.name}</h3>
                          <p className="text-xs text-slate-500">{new Date(plan.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className="bg-primary-50 text-primary-700 text-xs font-bold px-2 py-1 rounded-md uppercase">{plan.distance}</span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1 text-slate-600">
                          <span>Progress</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button 
                          onClick={() => handleLoad(plan)}
                          className="flex-1 bg-slate-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-slate-800"
                        >
                          Open Plan
                        </button>
                        <button 
                          onClick={() => handleDelete(plan.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="animate-in fade-in duration-300">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Workout Glossary</h2>
              <p className="text-slate-600">Understanding your run types is key to executing the plan effectively and avoiding injury.</p>
            </div>
            <RunGuide />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 print:hidden">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p className="mb-2">&copy; {new Date().getFullYear()} Velocity Planner.</p>
          <p>Created by Mark Conroy. Modernized by AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;