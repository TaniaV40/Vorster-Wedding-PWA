
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { apiService } from '../services/apiService';

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [summary, setSummary] = useState('');
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiService.getAdminData(password);
      setRsvps(data.rsvps);
      setIsLoggedIn(true);
    } catch (err: any) {
      console.error('Admin login error:', err);
      alert(`Login Failed: ${err.message || 'Invalid admin token/password.'}`);
    } finally {
      setLoading(false);
    }
  };

  const generateAIBrief = async () => {
    setLoading(true);
    try {
      const messagesData = await apiService.getGuestbook();
      const texts = messagesData.map(m => `From ${m.name}: ${m.message}`);
      const brief = await geminiService.summarizeGuestbook(texts);
      setSummary(brief);
    } catch (err) {
      console.error('Failed to generate AI brief:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalRsvps = rsvps.length;
  const attendingCount = rsvps.filter(r => {
    const status = String(r.Attending || r.attending || '').toLowerCase();
    return status.startsWith('yes') || status.startsWith('accept') || status === 'attending';
  }).length;
  const declinedCount = rsvps.filter(r => {
    const status = String(r.Attending || r.attending || '').toLowerCase();
    return status.startsWith('no') || status.startsWith('decline') || status === 'declined';
  }).length;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-stone-900 border border-gold p-8 rounded shadow-2xl">
          <h2 className="text-xl font-serif text-gold mb-6 text-center uppercase tracking-widest">Admin Access</h2>
          <input 
            type="password" 
            placeholder="Enter Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full bg-black border border-gold/30 p-3 text-sm focus:outline-none focus:border-gold mb-4"
          />
          <button disabled={loading} className="w-full py-3 bg-gold text-black uppercase font-bold text-xs tracking-widest disabled:opacity-50">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl font-serif text-gold italic">Admin Dashboard</h2>
        <button onClick={() => setIsLoggedIn(false)} className="text-[10px] uppercase tracking-widest text-gray-500">Sign Out</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-stone-900 p-6 border border-gold/20 rounded-lg text-center">
          <p className="text-xs uppercase tracking-widest text-gold mb-2">Total RSVPs</p>
          <p className="text-4xl font-serif">{totalRsvps}</p>
        </div>
        <div className="bg-stone-900 p-6 border border-gold/20 rounded-lg text-center">
          <p className="text-xs uppercase tracking-widest text-green-500 mb-2">Attending</p>
          <p className="text-4xl font-serif">{attendingCount}</p>
        </div>
        <div className="bg-stone-900 p-6 border border-gold/20 rounded-lg text-center">
          <p className="text-xs uppercase tracking-widest text-red-500 mb-2">Declined</p>
          <p className="text-4xl font-serif">{declinedCount}</p>
        </div>
      </div>

      <div className="bg-stone-900 p-8 border border-gold/20 rounded-lg mb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif text-gold text-xl">Guestbook Insight (AI)</h3>
          <button 
            onClick={generateAIBrief}
            className="text-[10px] border border-gold px-4 py-1 rounded text-gold uppercase hover:bg-gold hover:text-black"
          >
            Generate Brief
          </button>
        </div>
        <p className="text-gray-300 italic text-sm leading-relaxed">
          {summary || "Click to see a summarized view of your guests' messages."}
        </p>
      </div>

      <div className="overflow-x-auto bg-stone-900 border border-gold/20 rounded-lg">
        <table className="w-full text-left text-xs uppercase tracking-widest">
          <thead>
            <tr className="border-b border-gold/20 text-gold bg-stone-800">
              <th className="p-4">Name</th>
              <th className="p-4">Status</th>
              <th className="p-4">Dietary</th>
              <th className="p-4">Guests</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {rsvps.map((r, idx) => (
              <tr key={r.ID || r.id || idx}>
                <td className="p-4 normal-case">
                  <div className="font-bold text-white uppercase tracking-wider">{r.Name || r.name}</div>
                  <div className="text-[10px] text-gray-400 lowercase">{r.Email || r.email} | {r.Phone || r.phone}</div>
                </td>
                <td className={`p-4 font-bold ${
                  String(r.Attending || r.attending || '').toLowerCase().startsWith('yes') || String(r.Attending || r.attending || '').toLowerCase().startsWith('accept') || r.Attending === 'attending'
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`}>
                  {r.Attending || r.attending}
                </td>
                <td className="p-4 normal-case text-gray-300">
                  <div className="text-xs">Diet: {r.Dietary || r.dietary || 'None'}</div>
                  {r.Comments || r.comments ? <div className="text-[10px] text-gray-400 italic mt-1">"{r.Comments || r.comments}"</div> : null}
                </td>
                <td className="p-4 text-center">{r.GuestCount ?? r.guestCount ?? 1}</td>
              </tr>
            ))}
            {rsvps.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">No RSVPs found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
