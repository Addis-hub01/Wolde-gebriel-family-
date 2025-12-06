import React, { useState, useEffect } from 'react';
import { INITIAL_MEMBERS, INITIAL_USERS, INITIAL_PHOTOS, INITIAL_MESSAGES, INITIAL_ANNOUNCEMENTS } from './services/mockData';
import { FamilyMember, User, Photo, Message, Announcement } from './types';
import { FamilyTree } from './components/FamilyTree';
import { Gallery } from './components/Gallery';
import { Messaging } from './components/Messaging';
import { AddMemberModal } from './components/AddMemberModal';
import { askFamilyHistorian } from './services/geminiService';
import { Users, Image, MessageCircle, Info, Menu, X, Sparkles, LogOut, UserPlus, FileText } from 'lucide-react';

// Simple navigation pages
type Page = 'tree' | 'gallery' | 'messages' | 'profile' | 'historian';

function App() {
  // --- Global State ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<Page>('tree');
  const [members, setMembers] = useState<FamilyMember[]>(INITIAL_MEMBERS);
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [announcements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  
  // Modal State
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  // Gemini AI State
  const [historianQuery, setHistorianQuery] = useState('');
  const [historianResponse, setHistorianResponse] = useState('');
  const [isHistorianThinking, setIsHistorianThinking] = useState(false);

  // Mobile Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Selected Member for Tree Details
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  // Login Simulation
  const handleLogin = () => {
    setCurrentUser(INITIAL_USERS[0]); // Auto-login as Admin for demo
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // --- Handlers ---
  const handleSendMessage = (content: string, receiverId: string) => {
    if (!currentUser) return;
    const newMessage: Message = {
      id: `m-${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };
    setMessages([...messages, newMessage]);
  };

  const handlePhotoUpload = (photo: Photo) => {
    setPhotos([photo, ...photos]);
  };

  const handleAskHistorian = async () => {
    if (!historianQuery.trim()) return;
    setIsHistorianThinking(true);
    const answer = await askFamilyHistorian(historianQuery, members);
    setHistorianResponse(answer);
    setIsHistorianThinking(false);
  };

  // --- Auth Screen ---
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        {/* Render Modal even here for "Request Access" */}
        <AddMemberModal isOpen={isAddMemberModalOpen} onClose={() => setIsAddMemberModalOpen(false)} />
        
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">The Wolde Gebriel Family</h1>
            <p className="text-slate-500">Connect, Share, and Preserve our History</p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={handleLogin}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
            >
              Log In as Dawit (Admin)
            </button>
            <button 
              onClick={() => setCurrentUser(INITIAL_USERS[1])}
              className="w-full bg-white text-slate-700 border border-slate-300 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all"
            >
              Log In as Sara (Contributor)
            </button>

            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-300 text-xs uppercase font-medium">New Here?</span>
                <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button 
              onClick={() => setIsAddMemberModalOpen(true)}
              className="w-full bg-slate-50 text-indigo-600 border border-slate-200 border-dashed py-3 rounded-xl font-semibold hover:bg-indigo-50 hover:border-indigo-300 transition-all flex items-center justify-center gap-2"
            >
              <FileText size={18} /> Request Access / Join Family
            </button>

            <div className="text-center mt-4">
               <span className="text-xs text-slate-400">Demo Mode: No password required</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Main App Layout ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Global Modals */}
      <AddMemberModal isOpen={isAddMemberModalOpen} onClose={() => setIsAddMemberModalOpen(false)} />

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActivePage('tree')}>
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">W</div>
              <span className="font-bold text-lg text-slate-800 hidden sm:block">Wolde Gebriel Family</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <NavButton icon={<Users size={18}/>} label="Tree" active={activePage === 'tree'} onClick={() => setActivePage('tree')} />
              <NavButton icon={<Image size={18}/>} label="Gallery" active={activePage === 'gallery'} onClick={() => setActivePage('gallery')} />
              <NavButton icon={<MessageCircle size={18}/>} label="Connect" active={activePage === 'messages'} onClick={() => setActivePage('messages')} />
              <NavButton icon={<Sparkles size={18}/>} label="Historian AI" active={activePage === 'historian'} onClick={() => setActivePage('historian')} />
            </div>

            {/* User Profile / Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">{currentUser.name}</p>
                    <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-600 font-medium">Log out</button>
                </div>
                <img src={currentUser.avatarUrl} alt="Avatar" className="w-9 h-9 rounded-full bg-slate-200 object-cover border border-slate-200" />
              </div>
              
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 animate-in slide-in-from-top-2 duration-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavButton icon={<Users size={18}/>} label="Family Tree" active={activePage === 'tree'} onClick={() => { setActivePage('tree'); setIsMenuOpen(false); }} />
              <MobileNavButton icon={<Image size={18}/>} label="Gallery" active={activePage === 'gallery'} onClick={() => { setActivePage('gallery'); setIsMenuOpen(false); }} />
              <MobileNavButton icon={<MessageCircle size={18}/>} label="Connect" active={activePage === 'messages'} onClick={() => { setActivePage('messages'); setIsMenuOpen(false); }} />
              <MobileNavButton icon={<Sparkles size={18}/>} label="Historian AI" active={activePage === 'historian'} onClick={() => { setActivePage('historian'); setIsMenuOpen(false); }} />
              <div className="border-t border-slate-100 my-2 pt-2">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-base font-medium text-red-600 rounded-md hover:bg-red-50">
                    <LogOut size={18} /> Log Out
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activePage === 'tree' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Family Tree</h1>
                    <p className="text-slate-500 text-sm">Interactive view of our lineage</p>
                </div>
                <button 
                    onClick={() => setIsAddMemberModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <UserPlus size={16} /> <span className="hidden sm:inline">Add Member</span>
                </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <FamilyTree members={members} onSelectMember={setSelectedMember} />
                </div>
                
                {/* Details Sidebar */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    {selectedMember ? (
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <img src={selectedMember.photoUrl} alt={selectedMember.firstName} className="w-32 h-32 rounded-full object-cover border-4 border-indigo-50 shadow-md" />
                            </div>
                            <div className="text-center border-b border-slate-100 pb-4">
                                <h2 className="text-xl font-bold text-slate-800">{selectedMember.firstName} {selectedMember.lastName}</h2>
                                <p className="text-slate-500 text-sm">{selectedMember.birthDate} — {selectedMember.deathDate || 'Present'}</p>
                                <p className="text-slate-400 text-xs mt-1">{selectedMember.location}</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Biography</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{selectedMember.bio || "No biography added yet."}</p>
                            </div>
                            <div className="pt-4 flex gap-2">
                                <button className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">Edit</button>
                                <button className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">Photos</button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                            <Info size={48} className="mb-4 opacity-50" />
                            <p>Select a family member on the tree to view their details.</p>
                        </div>
                    )}
                </div>
            </div>
          </div>
        )}

        {activePage === 'gallery' && (
          <Gallery photos={photos} currentUser={currentUser} onUpload={handlePhotoUpload} />
        )}

        {activePage === 'messages' && (
          <Messaging currentUser={currentUser} users={INITIAL_USERS} messages={messages} announcements={announcements} onSendMessage={handleSendMessage} />
        )}

        {activePage === 'historian' && (
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center">
                    <div className="inline-flex p-3 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                        <Sparkles size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Ask the Family Archivist</h1>
                    <p className="text-slate-600">Powered by Google Gemini</p>
                    <p className="text-slate-500 text-sm mt-2 max-w-lg mx-auto">
                        Ask questions about our family history, relationships, or dates. The AI will analyze our tree data to find the answer.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                    <div className="flex gap-2 mb-6">
                        <input 
                            type="text" 
                            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="e.g. Who are Gebriel's grandchildren?"
                            value={historianQuery}
                            onChange={(e) => setHistorianQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAskHistorian()}
                        />
                        <button 
                            onClick={handleAskHistorian}
                            disabled={isHistorianThinking || !historianQuery.trim()}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                            {isHistorianThinking ? 'Thinking...' : 'Ask'}
                        </button>
                    </div>

                    {(historianResponse || isHistorianThinking) && (
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                            {isHistorianThinking ? (
                                <div className="flex items-center gap-3 text-slate-500">
                                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                    <p>Consulting the archives...</p>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Answer</h3>
                                    <p className="text-slate-800 leading-relaxed whitespace-pre-line">{historianResponse}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="p-4 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300 transition-colors" onClick={() => setHistorianQuery("Who is the oldest family member?")}>
                        <p className="text-sm font-medium text-slate-700">Who is the oldest family member?</p>
                     </div>
                     <div className="p-4 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300 transition-colors" onClick={() => setHistorianQuery("Tell me about Wolde Gebriel.")}>
                        <p className="text-sm font-medium text-slate-700">Tell me about Wolde Gebriel.</p>
                     </div>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}

// Sub-components for Cleaner App.tsx
const NavButton = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const MobileNavButton = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 text-base font-medium rounded-md ${
        active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

export default App;