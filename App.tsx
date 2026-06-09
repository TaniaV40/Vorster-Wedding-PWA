
import React, { useState, useEffect } from 'react';
import Envelope from './components/Envelope';
import Invitation from './components/Invitation';
import CountdownScreen from './components/CountdownScreen';
import RSVP from './components/RSVP';
import Gallery from './components/Gallery';
import Guestbook from './components/Guestbook';
import Admin from './components/Admin';
import SaveTheDate from './components/SaveTheDate';

type Screen = 'HOME' | 'DETAILS' | 'RSVP' | 'PHOTOS' | 'GUESTBOOK' | 'ADMIN' | 'MAP' | 'SAVE_THE_DATE';

const App: React.FC = () => {
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [activeScreen, setActiveScreen] = useState<Screen>('HOME');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toUpperCase() as Screen;
      const validScreens: Screen[] = ['HOME', 'DETAILS', 'RSVP', 'PHOTOS', 'GUESTBOOK', 'ADMIN', 'MAP', 'SAVE_THE_DATE'];
      if (validScreens.includes(hash)) {
        setActiveScreen(hash);
        setShowEnvelope(false);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (screen: Screen) => {
    window.location.hash = screen.toLowerCase();
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showEnvelope) {
    return <Envelope onOpen={() => setShowEnvelope(false)} />;
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'HOME': return <Invitation onRSVPClick={() => navigate('RSVP')} />;
      case 'DETAILS': return <CountdownScreen initialSection="top" />;
      case 'MAP': return <CountdownScreen initialSection="venue" />;
      case 'RSVP': return <RSVP />;
      case 'PHOTOS': return <Gallery />;
      case 'GUESTBOOK': return <Guestbook />;
      case 'ADMIN': return <Admin />;
      case 'SAVE_THE_DATE': return <SaveTheDate />;
      default: return <Invitation onRSVPClick={() => navigate('RSVP')} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#161615]">
      {/* Navigation - Top Bar with Home Icon and Gold RSVP Button */}
      {activeScreen !== 'ADMIN' && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#e1b382]/20 px-6 py-4 flex justify-between items-center shadow-lg">
           <div className="font-serif text-[#e1b382] tracking-widest text-lg font-bold drop-shadow-sm">J | J</div>
           <div className="flex items-center gap-4">
             <button 
                onClick={() => navigate('RSVP')}
                className="px-5 py-2 bg-[#e1b382] text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-[5px] hover:bg-white hover:text-black transition-all shadow-xl active:scale-95"
             >
               RSVP
             </button>
             <button 
              onClick={() => navigate('HOME')}
              className={`transition-colors p-1 ${activeScreen === 'HOME' ? 'text-[#e1b382]' : 'text-white/80 hover:text-[#e1b382]'}`}
             >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
               </svg>
             </button>
           </div>
        </div>
      )}

      <main>
        {renderScreen()}
      </main>

      {/* Persistent Bottom Mobile Nav */}
      {activeScreen !== 'ADMIN' && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-[#e1b382]/30 flex justify-around items-center py-4 px-2 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
          <NavButton active={activeScreen === 'SAVE_THE_DATE'} onClick={() => navigate('SAVE_THE_DATE')} label="Save Date" icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          <NavButton active={activeScreen === 'DETAILS'} onClick={() => navigate('DETAILS')} label="Details" icon="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <NavButton active={activeScreen === 'GUESTBOOK'} onClick={() => navigate('GUESTBOOK')} label="Wishes" icon="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          <NavButton active={activeScreen === 'PHOTOS'} onClick={() => navigate('PHOTOS')} label="Gallery" icon="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          <NavButton active={activeScreen === 'MAP'} onClick={() => navigate('MAP')} label="Directions" icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </nav>
      )}
    </div>
  );
};

const NavButton = ({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: string }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1 group">
    <svg 
      className={`w-6 h-6 transition-all duration-300 ${active ? 'text-[#e1b382] drop-shadow-[0_0_5px_rgba(225,179,130,0.6)] scale-110' : 'text-gray-400'}`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={icon} />
    </svg>
    <span className={`text-[9px] uppercase tracking-widest font-bold transition-colors ${active ? 'text-[#e1b382]' : 'text-gray-400'}`}>{label}</span>
  </button>
);

export default App;
