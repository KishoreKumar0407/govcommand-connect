import React from 'react';
import { Message, Constituency } from '../types';
import { ShieldCheck, Mail, Bell, Clock, AlertTriangle } from 'lucide-react';

interface MiddlemanDashboardProps {
  constituency: Constituency;
  messages: Message[];
}

export const MiddlemanDashboard: React.FC<MiddlemanDashboardProps> = ({ constituency, messages }) => {
  // Sort messages by time, newest first
  const sortedMessages = [...messages].sort((a, b) => b.timestamp - a.timestamp);
  const unreadCount = sortedMessages.filter(m => !m.read).length;

  return (
    <div className="max-w-4xl mx-auto p-6 text-slate-800 h-full flex flex-col">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
               <ShieldCheck className="w-8 h-8 text-blue-700" />
               {constituency.name} Dashboard
            </h1>
            <p className="text-slate-500 mt-1">Logged in as {constituency.officerName}</p>
         </div>
         <div className="text-right">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${
               constituency.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
               constituency.status === 'ALERT' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
            }`}>
               <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
               STATUS: {constituency.status}
            </div>
            <p className="text-xs text-slate-400 mt-2 font-mono">LOC: {constituency.location.lat.toFixed(4)}, {constituency.location.lng.toFixed(4)}</p>
         </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex flex-col">
         <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm z-10">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
               <Mail className="w-5 h-5" /> Secure Inbox
            </h2>
            {unreadCount > 0 && (
               <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                  {unreadCount} New Directives
               </span>
            )}
         </div>

         <div className="overflow-y-auto flex-1 p-4 space-y-4">
            {sortedMessages.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <Clock className="w-12 h-12 mb-3 opacity-20" />
                  <p className="font-medium">All systems normal.</p>
                  <p className="text-sm">Waiting for central command directives...</p>
               </div>
            ) : (
               sortedMessages.map((msg) => (
                  <div key={msg.id} className={`relative p-5 rounded-lg border transition-all hover:shadow-md ${
                     msg.priority === 'CRITICAL' 
                     ? 'bg-red-50 border-red-200' 
                     : 'bg-white border-slate-200'
                  }`}>
                     <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                           {msg.priority === 'CRITICAL' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                           <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                              msg.priority === 'CRITICAL' ? 'bg-red-200 text-red-800' :
                              msg.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                              'bg-slate-100 text-slate-600'
                           }`}>
                              {msg.priority} Priority
                           </span>
                           <span className="text-xs text-slate-400 font-mono">ID: {msg.id.slice(0,8)}</span>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                           {new Date(msg.timestamp).toLocaleString()}
                        </span>
                     </div>
                     
                     <div className="prose prose-sm max-w-none text-slate-800">
                        <p className="leading-relaxed">{msg.content}</p>
                     </div>

                     <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-bold text-slate-500">FROM:</span> CENTRAL COMMAND
                     </div>
                     
                     {/* New Message Indicator Dot */}
                     {!msg.read && (
                        <div className="absolute top-4 right-4 w-3 h-3 bg-blue-500 rounded-full shadow-lg ring-4 ring-white"></div>
                     )}
                  </div>
               ))
            )}
         </div>
      </div>
    </div>
  );
};
