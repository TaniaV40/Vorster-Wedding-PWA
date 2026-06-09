
import React, { useEffect, useState } from 'react';

interface InvitationProps {
  onRSVPClick: () => void;
}

const Invitation: React.FC<InvitationProps> = ({ onRSVPClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0a] font-sans">
      {/* Cinematic Background with Slow Zoom */}
      <div 
        className={`absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[10000ms] ease-out ${isLoaded ? 'scale-103' : 'scale-100'}`}
        style={{ 
          backgroundImage: `url('https://lh3.googleusercontent.com/d/1flSP6onVXaKdGyuW3qHZ53vxlhxPItQM')`,
          backgroundPosition: '50% 0%'
        }}
      />
      
      {/* Artistic Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/65 via-black/50 to-black/95" />
      
      {/* Floating Gold Particles */}
      <div className="absolute inset-0 z-15 pointer-events-none opacity-40">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-[#e1b382] rounded-full blur-[1px] animate-float-particle"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDuration: (Math.random() * 10 + 12) + 's',
              animationDelay: (Math.random() * -20) + 's',
            }}
          />
        ))}
      </div>

      {/* Decorative Border Frame */}
      <div className="absolute inset-6 md:inset-10 z-30 border border-[#e1b382]/20 pointer-events-none">
        <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#e1b382]/60" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[#e1b382]/60" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[#e1b382]/60" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#e1b382]/60" />
      </div>

      {/* Main Content Container - Adjusted padding for bottom navigation clearance */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-6 text-center pt-28 md:pt-36 pb-32">
        
        <div className={`transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
          
          {/* Combined "We Do" & Heart Graphic */}
          <div className="relative mb-3 flex justify-center items-center">
            <img 
              src="https://lh3.googleusercontent.com/d/1rdd9eE5X_BzuL59BdYDyTNh9WBqwU2Ol" 
              alt="We Do" 
              className="w-44 md:w-64 h-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
            />
          </div>

          {/* Invitation Details */}
          <div className="max-w-md space-y-4 mx-auto">
            <div className="space-y-1">
              <p className="text-[#e1b382] text-[7.5px] md:text-[8.5px] uppercase tracking-[0.5em] font-bold drop-shadow-md">
                Together with their families
              </p>
              
              <h1 
                className="text-[24px] md:text-[34px] font-serif text-white tracking-[0.12em] leading-tight drop-shadow-lg"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                JESSICA <span className="text-[14px] md:text-[18px] italic font-serif text-[#e1b382] block md:inline md:mx-2 drop-shadow-sm lowercase" style={{ fontFamily: "'Cormorant Garamond', serif" }}>and</span> JUAN
              </h1>
            </div>

            <div className="flex flex-col items-center py-1">
              <p className="text-white text-[8.5px] uppercase tracking-[0.4em] whitespace-nowrap font-semibold drop-shadow-md">
                Invite You
              </p>
              <p className="text-white/80 text-[7px] uppercase tracking-[0.25em] font-bold mt-1">
                to their wedding celebration
              </p>
            </div>

            {/* Date Section */}
            <div className="flex flex-col items-center space-y-1 py-1">
              <span className="text-white text-[8.5px] uppercase tracking-[0.4em] font-semibold drop-shadow-md">Saturday</span>
              <div className="flex items-center gap-4 py-1">
                <div className="h-[0.5px] w-8 bg-[#e1b382]/40"></div>
                <div className="text-center flex items-center gap-3">
                  <span className="text-[#e1b382] text-[10px] uppercase tracking-[0.3em] font-bold">July</span>
                  <span className="text-white text-3xl font-serif leading-none font-bold">2</span>
                  <span className="text-[#e1b382] text-[10px] uppercase tracking-[0.3em] font-bold">2027</span>
                </div>
                <div className="h-[0.5px] w-8 bg-[#e1b382]/40"></div>
              </div>
              <span className="text-white text-[8.5px] uppercase tracking-[0.3em] font-semibold drop-shadow-md">At 3:00 PM</span>
            </div>

            {/* Venue and Action */}
            <div className="pt-2 space-y-4">
              <p className="text-white text-[8px] md:text-[9px] tracking-[0.15em] leading-relaxed uppercase font-medium drop-shadow-md max-w-xs mx-auto">
                Bell and Blossom<br />
                721 Klippan Street, Montana, Pretoria
              </p>

              <div className="space-y-1 pb-1">
                <p className="text-[#e1b382] text-[7px] uppercase tracking-[0.3em] font-bold">Kindly Respond by May 15th, 2027</p>
                <p className="text-white/60 text-[6px] uppercase tracking-[0.2em]">We regret no children</p>
              </div>

              <button 
                onClick={onRSVPClick}
                className="group relative px-10 py-2.5 bg-gradient-to-b from-[#f1d592] via-[#c5a059] to-[#000000] text-white text-[8px] font-bold uppercase tracking-[0.4em] overflow-hidden transition-all duration-300 hover:brightness-125 shadow-[0_8px_16px_rgba(0,0,0,0.8)] active:scale-95 rounded-[5px]"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                <span className="relative z-10 text-black group-hover:text-white transition-colors duration-300">RSVP Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(40px) rotate(360deg); opacity: 0; }
        }
        .animate-float-particle {
          animation: float-particle linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Invitation;
