import React, { useState } from 'react';
import { Message, User, Announcement } from '../types';
import { Send, Bell, MessageSquare, Info } from 'lucide-react';

interface MessagingProps {
  currentUser: User;
  users: User[];
  messages: Message[];
  announcements: Announcement[];
  onSendMessage: (content: string, receiverId: string) => void;
}

export const Messaging: React.FC<MessagingProps> = ({ currentUser, users, messages, announcements, onSendMessage }) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'announcements'>('chats');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Get conversation partners
  const chatPartners = users.filter(u => u.id !== currentUser.id);

  // Filter messages for selected conversation
  const currentChat = selectedUser 
    ? messages.filter(m => 
        (m.senderId === currentUser.id && m.receiverId === selectedUser.id) ||
        (m.senderId === selectedUser.id && m.receiverId === currentUser.id)
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];

  const handleSend = () => {
    if (!selectedUser || !newMessage.trim()) return;
    onSendMessage(newMessage, selectedUser.id);
    setNewMessage('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
      
      {/* Sidebar List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setActiveTab('chats')}
            className={`flex-1 p-4 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'chats' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <MessageSquare size={16} /> Chats
          </button>
          <button 
            onClick={() => setActiveTab('announcements')}
            className={`flex-1 p-4 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'announcements' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Bell size={16} /> News
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {activeTab === 'chats' ? (
            chatPartners.map(user => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${selectedUser?.id === user.id ? 'bg-indigo-50 ring-1 ring-indigo-200' : 'hover:bg-slate-50'}`}
              >
                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full bg-slate-200 object-cover" />
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.role}</p>
                </div>
              </button>
            ))
          ) : (
            announcements.map(ann => (
              <div key={ann.id} className="p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 ${
                  ann.type === 'event' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {ann.type}
                </span>
                <h4 className="font-semibold text-slate-800 text-sm mb-1">{ann.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{ann.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
        {activeTab === 'chats' ? (
          selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                <img src={selectedUser.avatarUrl} alt={selectedUser.name} className="w-8 h-8 rounded-full object-cover" />
                <span className="font-bold text-slate-800">{selectedUser.name}</span>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                {currentChat.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <MessageSquare size={48} className="mb-2 opacity-20"/>
                        <p>No messages yet.</p>
                    </div>
                ) : (
                    currentChat.map(msg => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                            isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                        }`}>
                            {msg.content}
                        </div>
                        </div>
                    )
                    })
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-slate-100 border-0 rounded-full focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <MessageSquare size={64} className="mb-4 text-slate-200" />
              <h3 className="text-lg font-semibold text-slate-600">Select a conversation</h3>
              <p className="text-sm">Choose a family member from the list to start chatting.</p>
            </div>
          )
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Family Announcements</h2>
            {announcements.map(ann => (
               <div key={ann.id} className="bg-slate-50 rounded-xl p-6 border border-slate-100 relative overflow-hidden">
                 <div className={`absolute top-0 left-0 w-1 h-full ${ann.type === 'event' ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
                 <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-800">{ann.title}</h3>
                    <span className="text-xs text-slate-500">{new Date(ann.date).toLocaleDateString()}</span>
                 </div>
                 <p className="text-slate-600 leading-relaxed">{ann.content}</p>
                 <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                    <Info size={12} />
                    <span>Posted by {users.find(u => u.id === ann.authorId)?.name || 'Admin'}</span>
                 </div>
               </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
