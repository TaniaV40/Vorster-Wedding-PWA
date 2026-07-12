import React, { useEffect, useState } from 'react';

const SaveTheDate: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0a] font-sans">
      {/* Cinematic Background with Slow Zoom */}
      <div 
        className={`absolute inset-0 z-0 bg-cover bg-center grayscale brightness-[0.35] contrast-[1.1] transition-transform duration-[10000ms] ease-out ${isLoaded ? 'scale-110' : 'scale-100'}`}
        style={{ 
          backgroundImage: `url('https://lh3.googleusercontent.com/d/1KqKnvzGPKPjVxnIQUxvQeG4RAfK3GrOI')`,
          backgroundPosition: '50% 40%'
        }}
      />
      
      {/* Artistic Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-transparent to-black" />
      
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

      {/* Main Content Container */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-6 text-center pt-8 pb-32">
        
        <div className={`transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
          
          <div className="relative mb-8 flex justify-center items-center">
            <h2 className="text-[#e1b382] font-cursive text-[56px] md:text-[76px] relative z-20 leading-none drop-shadow-[0_0_12px_rgba(225,179,130,0.5)]" style={{ fontFamily: "'Great Vibes', cursive" }}>
              Save the Date
            </h2>
          </div>

          <div className="max-w-md space-y-6 mx-auto">
            <div className="space-y-2">
              <p className="text-white text-[10px] uppercase tracking-[0.4em] font-medium drop-shadow-md">
                For the wedding of
              </p>
              
              <h1 
                className="text-[28px] md:text-[40px] font-serif text-white tracking-[0.15em] leading-tight drop-shadow-lg"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                JESSICA <span className="text-[18px] md:text-[24px] italic font-serif text-[#e1b382] block md:inline md:mx-3 drop-shadow-sm" style={{ fontFamily: "'Cormorant Garamond', serif" }}>&</span> JUAN
              </h1>
            </div>

            <div className="flex items-center justify-center gap-4 py-4">
              <div className="h-[0.5px] w-12 bg-[#e1b382]/40"></div>
              <div className="text-center">
                <span className="block text-[#e1b382] text-[12px] uppercase tracking-[0.4em] font-bold drop-shadow-sm mb-2">02 . 07 . 2027</span>
                <span className="block text-white text-[10px] uppercase tracking-[0.3em] font-medium drop-shadow-md">Pretoria, South Africa</span>
              </div>
              <div className="h-[0.5px] w-12 bg-[#e1b382]/40"></div>
            </div>

            <div className="pt-4 space-y-4">
              <a 
                href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Jessica+%26+Juan%27s+Wedding&dates=20270702T130000/20270702T210000&details=We+can%27t+wait+to+celebrate+with+you!&location=Bell+and+Blossom,+Montana,+Pretoria,+South+Africa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-transparent border border-[#e1b382]/50 text-[#e1b382] hover:bg-[#e1b382] hover:text-black transition-all duration-300 rounded-[3px] text-[9px] uppercase tracking-[0.3em] font-bold group"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Add to Calendar
              </a>
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

export default SaveTheDate;
