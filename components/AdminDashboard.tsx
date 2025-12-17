import React, { useState, useRef } from 'react';
import { Constituency, Message } from '../types';
import { CONSTITUENCIES } from '../constants';
import { MockMap } from './MockMap';
import { Send, Sparkles, Map, Bell, ShieldAlert, History } from 'lucide-react';
import { draftGovernmentMessage } from '../services/geminiService';

interface AdminDashboardProps {
  onSendMessage: (targetId: string, content: string, priority: 'NORMAL' | 'HIGH' | 'CRITICAL') => void;
  messageHistory: Message[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSendMessage, messageHistory }) => {
  const [selectedConstituencyId, setSelectedConstituencyId] = useState<string | null>(null);
  const [messageDraft, setMessageDraft] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [priority, setPriority] = useState<'NORMAL' | 'HIGH' | 'CRITICAL'>('NORMAL');

  const selectedConstituency = CONSTITUENCIES.find(c => c.id === selectedConstituencyId);

  const handleSendMessage = () => {
    if (selectedConstituencyId && messageDraft.trim()) {
      onSendMessage(selectedConstituencyId, messageDraft, priority);
      setMessageDraft('');
      // Optional: Don't clear selection so they can send another, or clear it.
    }
  };

  const handleAIDraft = async () => {
    if (!selectedConstituency) return;
    setIsDrafting(true);
    // Use the current draft as the topic
    const topic = messageDraft.trim() || "Regular Status Check";
    const draft = await draftGovernmentMessage(topic, selectedConstituency.officerName, priority);
    setMessageDraft(draft);
    setIsDrafting(false);
  };

  return (
    <div className="flex h-full gap-6 p-6 text-slate-200">
      
      {/* Left Panel: Map & Status */}
      <div className="flex-1 flex flex-col gap-6 min-w-[350px]">
        <div className="bg-slate-900 p-4 rounded-xl shadow-lg border border-slate-800 flex-grow flex flex-col">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-bold flex items-center gap-2 text-white">
               <Map className="w-5 h-5 text-blue-400" /> Live Surveillance
             </h2>
             <span className="text-xs font-mono text-green-400 animate-pulse">● SYSTEM ONLINE</span>
          </div>
          <div className="flex-grow relative min-h-[400px]">
            <MockMap 
              constituencies={CONSTITUENCIES} 
              selectedId={selectedConstituencyId}
              onSelect={setSelectedConstituencyId}
            />
          </div>
        </div>

        {/* Constituency Details Card */}
        <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800 h-48 transition-all">
          {selectedConstituency ? (
            <div className="animate-fadeIn">
              <h3 className="text-lg font-bold text-white mb-2">{selectedConstituency.name}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Officer In Charge</p>
                  <p className="font-medium text-blue-300">{selectedConstituency.officerName}</p>
                </div>
                <div>
                  <p className="text-slate-400">Current Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold mt-1 ${
                    selectedConstituency.status === 'ALERT' ? 'bg-red-900/50 text-red-400 border border-red-800' : 
                    selectedConstituency.status === 'OFFLINE' ? 'bg-gray-700 text-gray-300' :
                    'bg-green-900/30 text-green-400 border border-green-900'
                  }`}>
                    {selectedConstituency.status === 'ALERT' && <ShieldAlert className="w-3 h-3" />}
                    {selectedConstituency.status}
                  </span>
                </div>
                <div>
                  <p className="text-slate-400">Coordinates</p>
                  <p className="font-mono text-xs text-slate-500">
                    {selectedConstituency.location.lat.toFixed(4)}, {selectedConstituency.location.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <Map className="w-10 h-10 mb-2 opacity-50" />
              <p>Select a constituency on the map to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Command Center */}
      <div className="w-[450px] flex flex-col gap-6">
        
        {/* Message Composer */}
        <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800">
           <div className="mb-4">
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
               <Send className="w-5 h-5 text-blue-400" /> Command Link
             </h2>
             <p className="text-xs text-slate-400 mt-1">Send secure directives to field operatives.</p>
           </div>

           <div className="space-y-4">
             <div>
               <label className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">Target</label>
               <div className="p-3 bg-slate-800 rounded border border-slate-700 text-sm text-slate-300">
                 {selectedConstituency ? selectedConstituency.name : "No Target Selected"}
               </div>
             </div>

             <div>
               <label className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">Priority Protocol</label>
               <div className="flex gap-2">
                 {(['NORMAL', 'HIGH', 'CRITICAL'] as const).map(p => (
                   <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-2 text-xs font-bold rounded border transition-colors ${
                      priority === p 
                      ? p === 'CRITICAL' ? 'bg-red-600 border-red-500 text-white' : 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                    }`}
                   >
                     {p}
                   </button>
                 ))}
               </div>
             </div>

             <div>
                <label className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">Directive Content</label>
                <div className="relative">
                  <textarea
                    value={messageDraft}
                    onChange={(e) => setMessageDraft(e.target.value)}
                    placeholder={selectedConstituency ? `Enter orders for ${selectedConstituency.name}...` : "Select a target first..."}
                    disabled={!selectedConstituency || isDrafting}
                    className="w-full h-32 bg-slate-800 border border-slate-700 rounded p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 disabled:opacity-50 resize-none"
                  />
                  <button
                    onClick={handleAIDraft}
                    disabled={!selectedConstituency || isDrafting}
                    className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded transition-colors disabled:opacity-0 disabled:pointer-events-none"
                    title="Auto-Draft with AI"
                  >
                    <Sparkles className={`w-3 h-3 ${isDrafting ? 'animate-spin' : ''}`} />
                    {isDrafting ? 'Drafting...' : 'AI Draft'}
                  </button>
                </div>
             </div>

             <button
                onClick={handleSendMessage}
                disabled={!selectedConstituency || !messageDraft.trim()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded shadow-lg transition-all flex justify-center items-center gap-2"
             >
               <Send className="w-4 h-4" /> TRANSMIT ORDER
             </button>
           </div>
        </div>

        {/* Recent Logs */}
        <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 flex-1 flex flex-col overflow-hidden">
           <div className="p-4 border-b border-slate-800 bg-slate-900/50">
             <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
               <History className="w-4 h-4" /> Transmission Log
             </h3>
           </div>
           <div className="overflow-y-auto flex-1 p-0">
             {messageHistory.length === 0 ? (
               <div className="p-8 text-center text-slate-600 text-sm">No recent transmissions.</div>
             ) : (
               <div className="divide-y divide-slate-800">
                 {messageHistory.slice().reverse().map(msg => {
                   const target = CONSTITUENCIES.find(c => c.id === msg.toConstituencyId);
                   return (
                     <div key={msg.id} className="p-4 hover:bg-slate-800/50 transition-colors">
                       <div className="flex justify-between items-start mb-1">
                         <span className="text-xs font-bold text-slate-300">To: {target?.name || 'Unknown'}</span>
                         <span className="text-[10px] text-slate-500 font-mono">
                           {new Date(msg.timestamp).toLocaleTimeString()}
                         </span>
                       </div>
                       <p className="text-xs text-slate-400 line-clamp-2">{msg.content}</p>
                       <div className="mt-2 flex justify-end">
                         <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                            msg.priority === 'CRITICAL' ? 'border-red-900 text-red-500' : 'border-slate-700 text-slate-500'
                         }`}>
                           {msg.priority}
                         </span>
                       </div>
                     </div>
                   )
                 })}
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};
