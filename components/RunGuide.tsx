import React from 'react';
import { RUN_DESCRIPTIONS } from '../constants';

export const RunGuide: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
      {RUN_DESCRIPTIONS.map((category, idx) => (
        <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">{category.category}</h3>
          <div className="space-y-4">
            {category.items.map((item, i) => (
              <div key={i}>
                <h4 className="font-semibold text-primary-600 text-sm">{item.name}</h4>
                <p className="text-slate-500 text-sm leading-relaxed mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};