import React from 'react';
import { Constituency } from '../types';
import { MapPin } from 'lucide-react';

interface MockMapProps {
  constituencies: Constituency[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const MockMap: React.FC<MockMapProps> = ({ constituencies, selectedId, onSelect }) => {
  return (
    <div className="relative w-full h-full bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-inner group">
      {/* Grid Lines for "Map" feel */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(to right, #475569 1px, transparent 1px), linear-gradient(to bottom, #475569 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      
      {/* "Radar" effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent pointer-events-none" />

      {constituencies.map((c) => (
        <div
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
            selectedId === c.id ? 'scale-125 z-10' : 'hover:scale-110 z-0'
          }`}
          style={{ left: `${c.location.x}%`, top: `${c.location.y}%` }}
        >
          <div className="flex flex-col items-center">
             <div className={`relative p-2 rounded-full border-2 ${
               selectedId === c.id 
                ? 'bg-blue-600 border-white shadow-[0_0_15px_rgba(37,99,235,0.6)]' 
                : c.status === 'ALERT' ? 'bg-red-600 border-red-300 animate-pulse' 
                : 'bg-slate-700 border-slate-500'
             }`}>
                <MapPin className="w-5 h-5 text-white" />
             </div>
             <span className={`mt-1 text-xs font-bold px-2 py-0.5 rounded shadow-sm whitespace-nowrap ${
               selectedId === c.id ? 'bg-white text-blue-900' : 'bg-slate-900/80 text-slate-200'
             }`}>
               {c.name}
             </span>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-4 right-4 bg-slate-900/90 text-xs text-slate-400 p-2 rounded border border-slate-700">
        <p>SECURE LOCATION GRID</p>
        <p>LIVE TRACKING: ACTIVE</p>
      </div>
    </div>
  );
};
