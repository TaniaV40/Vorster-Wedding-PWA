
import React, { useState } from 'react';
import { Button } from './ui/button';
import { MailOpen } from 'lucide-react';

interface EnvelopeProps {
  onOpen: () => void;
}

const Envelope: React.FC<EnvelopeProps> = ({ onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(onOpen, 1000); // Transition to home after animation
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a261f] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 pointer-events-none bg-cover bg-center" 
        style={{ 
          backgroundImage: `url('https://lh3.googleusercontent.com/d/1cdrktBsK0ll3VDB8b6br0JLIRU0dr6bC')`,
        }}
      ></div>
      <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>

      {/* Warm Golden Glow Behind Envelope */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] bg-[#e1b382]/40 blur-[100px] pointer-events-none rounded-full"></div>

      <div 
        onClick={handleOpen}
        className={`relative w-[340px] h-[220px] md:w-[480px] md:h-[310px] cursor-pointer transition-all duration-1000 ease-in-out transform 
          ${isOpen ? 'scale-150 opacity-0 -translate-y-full blur-lg' : 'scale-100'}`}
        style={{ perspective: '1800px' }}
      >
        {/* Outer Shadow for the Envelope */}
        <div className="absolute inset-0 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)] rounded-sm"></div>

        {/* Envelope Shell - Matte Charcoal/Black */}
        <div className="absolute inset-0 bg-[#161615] rounded-sm"></div>

        {/* Geometric Fold Panels */}
        <div className="absolute inset-0 z-30" style={{ 
          clipPath: 'polygon(0 0, 100% 0, 50% 50%)',
          backgroundColor: '#202020',
          borderBottom: '1px solid rgba(255,255,255,0.03)'
        }}></div>
        
        <div className="absolute inset-0 z-10" style={{ 
          clipPath: 'polygon(0 0, 50% 50%, 0 100%)',
          backgroundColor: '#181818'
        }}></div>

        <div className="absolute inset-0 z-10" style={{ 
          clipPath: 'polygon(100% 0, 100% 100%, 50% 50%)',
          backgroundColor: '#181818'
        }}></div>

        <div className="absolute inset-0 z-20" style={{ 
          clipPath: 'polygon(0 100%, 100% 100%, 50% 46%)',
          backgroundColor: '#121212',
          boxShadow: '0 -5px 25px rgba(0,0,0,0.6)'
        }}></div>

        {/* Realistic Wax Seal */}
        <div className="absolute top-[49%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex items-center justify-center">
          <div className="relative group transition-transform duration-500 hover:scale-105 active:scale-95">
            <svg width="120" height="120" viewBox="0 0 100 100" className="drop-shadow-[0_12px_20px_rgba(0,0,0,0.8)]">
              <defs>
                <linearGradient id="sealGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e8d4a3" />
                  <stop offset="20%" stopColor="#d4af37" />
                  <stop offset="40%" stopColor="#f9e29c" />
                  <stop offset="60%" stopColor="#c5a059" />
                  <stop offset="80%" stopColor="#b48b3b" />
                  <stop offset="100%" stopColor="#8c6a2e" />
                </linearGradient>
                <filter id="sealEmboss" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur"/>
                  <feOffset in="blur" dx="1" dy="1" result="offsetBlur"/>
                  <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.9" specularExponent="25" lightingColor="#ffffff" result="specOut">
                    <fePointLight x="-5000" y="-10000" z="20000"/>
                  </feSpecularLighting>
                  <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut"/>
                  <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litGraphic"/>
                </filter>
              </defs>
              
              <path 
                d="M50,4 C60,3 68,10 75,12 C85,15 94,18 97,28 C100,38 98,52 94,62 C90,75 84,86 72,92 C60,98 48,97 36,94 C24,91 12,85 7,72 C2,59 5,45 8,32 C11,20 20,12 32,8 C40,5 45,4 50,4Z" 
                fill="url(#sealGoldGradient)"
                filter="url(#sealEmboss)"
              />
              <circle cx="50" cy="51" r="34" fill="black" opacity="0.1" />
              <circle cx="50" cy="50" r="34" fill="url(#sealGoldGradient)" stroke="#6a5223" strokeWidth="0.3" />
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex items-center gap-2 md:gap-3 translate-y-[1px]">
                <span className="font-serif text-3xl md:text-4xl font-bold text-black/90 select-none tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>J</span>
                <div className="w-[1.5px] h-8 md:h-11 bg-black/80"></div>
                <span className="font-serif text-3xl md:text-4xl font-bold text-black/90 select-none tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>J</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Interaction Prompt - Shadcn Button Replacement */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 pointer-events-auto z-40">
          <div className="animate-bounce flex flex-col items-center gap-3">
            <div className="inline-flex -space-x-px divide-x divide-black/30 rounded-lg shadow-xl shadow-black/30 rtl:space-x-reverse">
              <Button
                className="rounded-none shadow-none first:rounded-s-[5px] last:rounded-e-[5px] focus-visible:z-10"
                size="icon"
                aria-label="Mail Open"
                onClick={(e) => { e.stopPropagation(); handleOpen(); }}
              >
                <MailOpen size={16} strokeWidth={2} aria-hidden="true" />
              </Button>
              <Button 
                className="rounded-none shadow-none first:rounded-s-[5px] last:rounded-e-[5px] focus-visible:z-10 uppercase tracking-[0.2em] font-bold text-[8px] md:text-[9px]"
                onClick={(e) => { e.stopPropagation(); handleOpen(); }}
              >
                Tap seal to open invitation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Envelope;
