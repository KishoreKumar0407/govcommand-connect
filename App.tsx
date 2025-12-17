import React, { useState, useEffect } from 'react';
import { UserSession, Message, Constituency } from './types';
import { CONSTITUENCIES } from './constants';
import { AdminDashboard } from './components/AdminDashboard';
import { MiddlemanDashboard } from './components/MiddlemanDashboard';
import { User, LogOut, LayoutDashboard, Database } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [session, setSession] = useState<UserSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // To simulate notification popups when user is logged in
  const [notification, setNotification] = useState<{msg: string, type: 'info' | 'alert'} | null>(null);

  // --- Handlers ---

  const login = (role: 'ADMIN' | 'CONSTITUENCY', constituencyId?: string) => {
    setSession({ role, constituencyId });
    setNotification(null); // Clear notifications on switch
  };

  const logout = () => {
    setSession(null);
  };

  const sendMessage = (targetId: string, content: string, priority: 'NORMAL' | 'HIGH' | 'CRITICAL') => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      toConstituencyId: targetId,
      from: 'ADMIN',
      content,
      timestamp: Date.now(),
      read: false,
      priority
    };

    setMessages(prev => [...prev, newMessage]);

    // Show instant feedback toast if sending was successful
    setNotification({ msg: 'Order Transmitted Successfully', type: 'info' });
    setTimeout(() => setNotification(null), 3000);
  };

  // Effect to simulate receiving a notification if logged in as the specific user
  useEffect(() => {
    if (session?.role === 'CONSTITUENCY' && session.constituencyId) {
       const myMessages = messages.filter(m => m.toConstituencyId === session.constituencyId);
       const lastMessage = myMessages[myMessages.length - 1];
       
       // Simple check: if a message arrived in the last 2 seconds
       if (lastMessage && Date.now() - lastMessage.timestamp < 2000) {
         setNotification({ 
           msg: `New Command Received from Admin!`, 
           type: lastMessage.priority === 'CRITICAL' ? 'alert' : 'info' 
         });
         setTimeout(() => setNotification(null), 5000);
       }
    }
  }, [messages, session]);


  // --- Render ---

  // 1. Auth / Role Selection Screen
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full grid md:grid-cols-2 bg-white rounded-2xl overflow-hidden shadow-2xl">
           
           {/* Left: Branding */}
           <div className="bg-blue-900 p-12 text-white flex flex-col justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900 opacity-90"></div>
             <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
             
             <div className="relative z-10">
               <Database className="w-16 h-16 mb-6 text-blue-300" />
               <h1 className="text-4xl font-extrabold tracking-tight mb-4">GovCommand Connect</h1>
               <p className="text-blue-200 text-lg leading-relaxed">
                 Secure, centralized directive distribution system. Authorized personnel only.
               </p>
               <div className="mt-8 flex gap-2 text-xs font-mono text-blue-400">
                 <span>v2.4.0-PROTOTYPE</span>
                 <span>•</span>
                 <span>SECURE CONNECTION</span>
               </div>
             </div>
           </div>

           {/* Right: Login Options */}
           <div className="p-12 bg-slate-50 flex flex-col justify-center">
             <h2 className="text-2xl font-bold text-slate-800 mb-6">Select Identity</h2>
             <div className="space-y-3">
               <button 
                 onClick={() => login('ADMIN')}
                 className="w-full p-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all flex items-center justify-between group shadow-lg"
               >
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-slate-800 rounded group-hover:bg-slate-700">
                      <LayoutDashboard className="w-5 h-5 text-blue-400" />
                   </div>
                   <div className="text-left">
                     <div className="font-bold">Government Admin</div>
                     <div className="text-xs text-slate-400">Central Command</div>
                   </div>
                 </div>
                 <span className="text-slate-500 group-hover:text-white">→</span>
               </button>

               <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase">Or Select Constituency</span>
                  <div className="flex-grow border-t border-slate-200"></div>
               </div>

               <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-2">
                 {CONSTITUENCIES.map(c => (
                   <button
                     key={c.id}
                     onClick={() => login('CONSTITUENCY', c.id)}
                     className="w-full p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all flex items-center gap-3 text-left"
                   >
                     <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                       {c.id.toUpperCase()}
                     </div>
                     <div>
                       <div className="font-bold text-slate-700 text-sm">{c.name}</div>
                       <div className="text-xs text-slate-500">{c.officerName}</div>
                     </div>
                   </button>
                 ))}
               </div>
             </div>
           </div>
        </div>
      </div>
    );
  }

  // 2. Main Application Views
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-slate-900 text-white h-16 px-6 flex items-center justify-between shadow-md z-50">
        <div className="flex items-center gap-3">
           <Database className="w-6 h-6 text-blue-500" />
           <span className="font-bold text-lg tracking-wide">GovCommand <span className="text-blue-500">Connect</span></span>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="text-right hidden md:block">
             <div className="text-sm font-bold text-slate-200">
               {session.role === 'ADMIN' ? 'Administrator' : CONSTITUENCIES.find(c => c.id === session.constituencyId)?.name}
             </div>
             <div className="text-xs text-slate-500 uppercase tracking-wider">{session.role} MODE</div>
           </div>
           
           <button 
             onClick={logout}
             className="p-2 bg-slate-800 rounded-full hover:bg-red-900/50 hover:text-red-400 transition-colors"
             title="Logout"
           >
             <LogOut className="w-5 h-5" />
           </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {session.role === 'ADMIN' ? (
          <div className="h-full bg-slate-950">
            <AdminDashboard 
              onSendMessage={sendMessage} 
              messageHistory={messages}
            />
          </div>
        ) : (
          <div className="h-full bg-slate-50">
             {session.constituencyId && (
               <MiddlemanDashboard 
                 constituency={CONSTITUENCIES.find(c => c.id === session.constituencyId)!}
                 messages={messages.filter(m => m.toConstituencyId === session.constituencyId)}
               />
             )}
          </div>
        )}

        {/* Global Notification Toast */}
        {notification && (
          <div className={`fixed top-20 right-6 p-4 rounded-lg shadow-2xl border-l-4 animate-slideIn z-50 flex items-start gap-3 max-w-sm ${
            notification.type === 'alert' ? 'bg-white border-red-500 text-slate-800' : 'bg-slate-900 border-blue-500 text-white'
          }`}>
             <div className={`mt-0.5 ${notification.type === 'alert' ? 'text-red-500' : 'text-blue-400'}`}>
               <User className="w-5 h-5" />
             </div>
             <div>
               <h4 className="font-bold text-sm">System Notification</h4>
               <p className="text-sm opacity-90">{notification.msg}</p>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
