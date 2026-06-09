
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const Guestbook: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ id: string; name: string; message: string; date: string }>>([]);
  const [loading, setLoading] = useState(false);

  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await apiService.getGuestbook();
      setMessages(data);
    } catch (err) {
      console.error('Failed to fetch guestbook messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newMessage) {
      setLoading(true);
      try {
        await apiService.submitMessage({
          author: newName,
          message: newMessage
        });
        setNewName('');
        setNewMessage('');
        await fetchMessages();
      } catch (err) {
        console.error('Failed to submit message:', err);
        alert('Failed to submit message. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif text-gold italic mb-2">Guestbook</h2>
        <p className="text-xs uppercase tracking-widest text-gray-400">Leave a note for the happy couple</p>
      </div>

      <div className="bg-stone-900 border border-gold/20 p-8 rounded-lg mb-12 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-gold block mb-2">Your Name</label>
            <input 
              required
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-black border border-gold/30 p-3 text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-gold block mb-2">Message</label>
            <textarea 
              required
              rows={4}
              maxLength={500}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full bg-black border border-gold/30 p-3 text-sm focus:outline-none focus:border-gold transition-colors"
              placeholder="What would you like to say?"
            />
            <div className="text-right text-[10px] text-gray-500 mt-1">{newMessage.length}/500</div>
          </div>
          <button type="submit" className="w-full py-3 bg-gold text-black uppercase tracking-widest text-xs font-bold hover:bg-[#b28c5e] transition-colors">
            Post Message
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className="relative bg-[#f4ece1] text-[#5e4f3e] p-8 rounded shadow-lg transform hover:-rotate-1 transition-transform">
            <div className="absolute top-0 right-0 p-2 opacity-20">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H14.017C13.4647 8 13.017 8.44772 13.017 9V15C13.017 15.5523 12.5693 16 12.017 16H9.017C8.46472 16 8.017 15.5523 8.017 15V9C8.017 8.44772 8.46472 8 9.017 8H14.017V5H9.017C6.80786 5 5.017 6.79086 5.017 9V15C5.017 17.2091 6.80786 19 9.017 19H12.017V21H14.017Z"/></svg>
            </div>
            <p className="font-serif italic text-lg mb-4">"{msg.message}"</p>
            <div className="flex justify-between items-center border-t border-[#5e4f3e]/20 pt-4">
              <span className="font-bold text-xs uppercase tracking-widest">— {msg.name}</span>
              <span className="text-[10px] opacity-60 uppercase tracking-tighter">{msg.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Guestbook;
