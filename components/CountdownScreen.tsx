
import React, { useRef, useState, useEffect } from 'react';
import { WEDDING_DATE } from '../constants';

interface CountdownScreenProps {
  initialSection?: 'top' | 'venue' | 'schedule' | 'dresscode';
}

const venueImages = [
  'https://lh3.googleusercontent.com/d/1VfB1ST5ZzBv_aawPoERY0m0e8dSVUab6',
  'https://lh3.googleusercontent.com/d/1qwbEkDUv8_0t1_8hm9_WuMLwM4NpbNOQ',
  'https://lh3.googleusercontent.com/d/1BtqvD38CdufbZDZJzW9NwX4B-XC3ZHLQ',
  'https://lh3.googleusercontent.com/d/1w8k6Udo9fPiOvT-1TtVoe3z9ddG222zd',
  'https://lh3.googleusercontent.com/d/1b4_eDUFZeWn-pSO84CmRCIgnStPtDnbH',
  'https://lh3.googleusercontent.com/d/1Ch-UH3XA0dFQf1hOrEy-xza2Dwxi3m2q'
];

const CountdownScreen: React.FC<CountdownScreenProps> = ({ initialSection = 'top' }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [venueIndex, setVenueIndex] = useState(0);

  const topRef = useRef<HTMLDivElement>(null);
  const venueRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const dressCodeRef = useRef<HTMLDivElement>(null);

  const isDirectionsOnly = initialSection === 'venue';

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = WEDDING_DATE.getTime() - new Date().getTime();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    const venueTimer = setInterval(() => {
      setVenueIndex((prev) => (prev + 1) % venueImages.length);
    }, 5000);

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);

    const handleCustomScroll = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail === 'venue') scrollToSection(venueRef);
      if (customEvent.detail === 'schedule') scrollToSection(scheduleRef);
      if (customEvent.detail === 'dresscode') scrollToSection(dressCodeRef);
    };
    window.addEventListener('scrollToSection', handleCustomScroll);

    if (initialSection === 'venue') scrollToSection(venueRef);
    if (initialSection === 'schedule') scrollToSection(scheduleRef);
    if (initialSection === 'dresscode') scrollToSection(dressCodeRef);

    return () => {
      clearInterval(timer);
      clearInterval(venueTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scrollToSection', handleCustomScroll);
    };
  }, [initialSection]);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => {
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextVenueImage = () => {
    setVenueIndex((prev) => (prev + 1) % venueImages.length);
  };

  const prevVenueImage = () => {
    setVenueIndex((prev) => (prev - 1 + venueImages.length) % venueImages.length);
  };

  const openGoogleMaps = () => {
    window.open('https://www.google.com/maps/dir/?api=1&destination=Bell+%26+Blossom+Montana+Pretoria', '_blank');
  };

  return (
    <div ref={topRef} className="min-h-screen bg-[#161615] text-white font-sans overflow-x-hidden">
      {/* Hero Section - Hidden on Directions page */}
      {!isDirectionsOnly && (
        <section className="relative h-[80vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000 brightness-[0.55]"
            style={{ backgroundImage: `url('https://lh3.googleusercontent.com/d/1e-zAHQ0367rjevd6PnGyRLxP1r34HcML')` }}
          />
          
          <div className="relative z-10 max-w-xl w-full flex flex-col items-center pt-12">
            <h3 className="text-[10px] uppercase tracking-[0.6em] text-[#e1b382] mb-12 font-bold drop-shadow-md">
              Counting down to the big day
            </h3>
            
            <div className="w-full flex justify-center items-center gap-2 sm:gap-6 bg-black/40 backdrop-blur-xl p-8 sm:p-10 rounded-2xl border border-white/5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]">
              <div className="flex-1 text-center">
                <span className="block text-4xl sm:text-6xl font-serif text-white mb-2 tabular-nums">{timeLeft.days}</span>
                <span className="block text-[9px] uppercase tracking-[0.4em] text-[#e1b382] font-bold">Days</span>
              </div>
              <div className="w-[1px] h-14 bg-white/10" />
              <div className="flex-1 text-center">
                <span className="block text-4xl sm:text-6xl font-serif text-white mb-2 tabular-nums">{timeLeft.hours}</span>
                <span className="block text-[9px] uppercase tracking-[0.4em] text-[#e1b382] font-bold">Hours</span>
              </div>
              <div className="w-[1px] h-14 bg-white/10" />
              <div className="flex-1 text-center">
                <span className="block text-4xl sm:text-6xl font-serif text-white mb-2 tabular-nums">{timeLeft.minutes}</span>
                <span className="block text-[9px] uppercase tracking-[0.4em] text-[#e1b382] font-bold">Mins</span>
              </div>
              <div className="w-[1px] h-14 bg-white/10" />
              <div className="flex-1 text-center">
                <span className="block text-4xl sm:text-6xl font-serif text-[#e1b382] mb-2 tabular-nums transition-all duration-300 drop-shadow-[0_0_8px_rgba(225,179,130,0.4)]">{timeLeft.seconds}</span>
                <span className="block text-[9px] uppercase tracking-[0.4em] text-white font-bold opacity-80">Secs</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 w-full">
            <button 
              onClick={() => scrollToSection(venueRef)}
              className="text-[#e1b382] animate-bounce p-2 hover:text-white transition-colors mb-2"
            >
              <svg className="w-12 h-12 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
            <div className="flex items-center justify-center gap-3 md:gap-6">
              <button onClick={() => scrollToSection(venueRef)} className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[#e1b382] hover:text-white transition-colors font-bold drop-shadow-md">Venue</button>
              <span className="text-[#e1b382]/50 text-[10px]">•</span>
              <button onClick={() => scrollToSection(scheduleRef)} className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[#e1b382] hover:text-white transition-colors font-bold drop-shadow-md">Schedule</button>
              <span className="text-[#e1b382]/50 text-[10px]">•</span>
              <button onClick={() => scrollToSection(dressCodeRef)} className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[#e1b382] hover:text-white transition-colors font-bold drop-shadow-md">Dress Code</button>
            </div>
          </div>
        </section>
      )}

      <div className="bg-gradient-to-b from-[#161615] via-[#1a1a1a] to-[#161615]">
        {/* Venue Section with Carousel and Map - Map/Directions Button conditionally rendered */}
        <section ref={venueRef} className={`scroll-mt-24 py-16 md:py-24 px-8 max-w-4xl mx-auto text-center ${isDirectionsOnly ? '' : 'border-b border-white/5'}`}>
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#e1b382] mb-3 font-bold">The Setting</h2>
          <h3 className="text-5xl md:text-7xl font-cursive mb-10 text-white drop-shadow-md" style={{ fontFamily: "'Great Vibes', cursive" }}>
            Bell and Blossom
          </h3>
          
          <div className={`grid grid-cols-1 ${isDirectionsOnly ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'} gap-8 mb-12`}>
            {/* Carousel Side */}
            <div className="relative aspect-[4/3] w-full bg-stone-900 rounded-lg overflow-hidden border border-[#e1b382]/30 shadow-2xl group">
              <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${venueIndex * 100}%)` }}>
                {venueImages.map((src, i) => (
                  <img 
                    key={i}
                    src={src} 
                    alt={`Venue view ${i + 1}`} 
                    className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-1000 shrink-0" 
                  />
                ))}
              </div>
              
              <button 
                onClick={prevVenueImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white hover:text-[#e1b382] transition-colors rounded-full backdrop-blur-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button 
                onClick={nextVenueImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white hover:text-[#e1b382] transition-colors rounded-full backdrop-blur-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            {/* Map Side - Only visible on Directions screen */}
            {isDirectionsOnly && (
              <div className="relative aspect-[4/3] w-full bg-stone-900 rounded-lg overflow-hidden border border-[#e1b382]/30 shadow-2xl">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3596.168923485309!2d28.243572376269666!3d-25.6657159774128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e95646f906f3633%3A0x6a2c33250529497e!2sBell%20%26%20Blossom!5e0!3m2!1sen!2sza!4v1715600000000!5m2!1sen!2sza"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale contrast-[1.2] brightness-90 hover:grayscale-0 transition-all duration-700"
                />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-white uppercase tracking-[0.4em] text-[11px] font-bold drop-shadow-md">721 Klippan Street,</p>
              <p className="text-white uppercase tracking-[0.4em] text-[11px] font-bold drop-shadow-md">Montana, Pretoria</p>
            </div>
            
            {/* Directions Button - Only visible on Directions screen */}
            {isDirectionsOnly && (
              <button 
                onClick={openGoogleMaps}
                className="px-10 py-3 bg-gradient-to-b from-[#f1d592] via-[#c5a059] to-[#000000] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-[5px] hover:brightness-110 transition-all shadow-xl active:scale-95 group"
              >
                <span className="flex items-center gap-2 group-hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  Get Directions
                </span>
              </button>
            )}
          </div>
        </section>

        {/* The following blocks are hidden if this is exclusively the Directions page */}
        {!isDirectionsOnly && (
          <>
            {/* Schedule Section */}
            <section ref={scheduleRef} className="scroll-mt-24 py-12 px-8 max-w-lg mx-auto min-h-[70vh] flex flex-col justify-center border-b border-white/5">
              <div className="flex items-center justify-center gap-3 mb-10">
                 <svg className="w-7 h-7 text-[#e1b382]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                 <h2 className="text-4xl font-serif italic text-white drop-shadow-md" style={{ fontFamily: "'Playfair Display', serif" }}>The Day's Journey</h2>
              </div>

              <div className="relative pl-12 border-l border-[#e1b382]/40 space-y-10">
                {[
                  { title: 'The Vows', desc: 'Ceremony under the Great Baobab', time: '13:00' },
                  { title: 'Sundowners', desc: 'Cocktails & African Hors d\'oeuvres', time: '15:00' },
                  { title: 'The Feast', desc: 'The primary dinner event', time: '17:45' },
                  { title: 'Celebration', desc: 'Dancing under the winter stars', time: '19:00' }
                ].map((item, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[57px] top-1.5 w-5 h-5 rounded-full border border-[#e1b382] bg-black flex items-center justify-center transition-all group-hover:scale-125 group-hover:bg-[#e1b382]">
                      <div className="w-2 h-2 rounded-full bg-[#e1b382] group-hover:bg-black transition-colors"></div>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xl font-serif text-[#e1b382] mb-0.5 group-hover:translate-x-1 transition-transform font-bold drop-shadow-sm">{item.title}</h4>
                        <p className="text-[13px] text-gray-300 italic font-serif tracking-wider">{item.desc}</p>
                      </div>
                      <span className="text-[11px] font-bold text-white tracking-[0.2em] mt-1.5 drop-shadow-md">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Portrait */}
            <div className="flex justify-center py-20 bg-black/10">
               <div className="max-w-[240px] aspect-[3/4] rounded-sm overflow-hidden border border-[#e1b382]/40 shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] rotate-1 hover:rotate-0 transition-all duration-700">
                  <img 
                    src="https://lh3.googleusercontent.com/d/1SyhJ0sjpa6zrpVVsflU9rB-M19ib5-qK" 
                    alt="Wedding Couple" 
                    className="w-full h-full object-cover grayscale brightness-95 contrast-110 hover:grayscale-0 hover:scale-105 transition-all duration-1000" 
                  />
               </div>
            </div>

            {/* More Details */}
            <section ref={dressCodeRef} className="scroll-mt-24 py-24 px-8 max-w-lg mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-16">
                 <h2 className="text-4xl font-serif italic text-white drop-shadow-md" style={{ fontFamily: "'Playfair Display', serif" }}>More Details</h2>
              </div>
              
              <div className="relative pl-12 text-left border-l border-[#e1b382]/40 space-y-16">
                <div className="relative group">
                  <div className="absolute -left-[54.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#e1b382] shadow-[0_0_15px_rgba(225,179,130,0.6)] group-hover:scale-150 transition-transform"></div>
                  <h4 className="text-[11px] uppercase tracking-[0.6em] font-bold text-[#e1b382] mb-4 drop-shadow-sm">Dress Code</h4>
                  <p className="text-[15px] leading-relaxed text-white font-serif drop-shadow-md">
                    Dress formal and elegant. We kindly ask guests to avoid denim and to leave white for the bride.
                  </p>
                </div>

                <div className="relative group">
                  <div className="absolute -left-[54.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#e1b382] shadow-[0_0_15px_rgba(225,179,130,0.6)] group-hover:scale-150 transition-transform"></div>
                  <h4 className="text-[11px] uppercase tracking-[0.6em] font-bold text-[#e1b382] mb-4 drop-shadow-sm">Note for Parents</h4>
                  <p className="text-[15px] leading-relaxed text-white font-serif drop-shadow-md">
                    We've chosen for our wedding day to be an adult-only occasion. We regret no children.
                  </p>
                </div>

                <div className="relative group">
                  <div className="absolute -left-[54.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#e1b382] shadow-[0_0_15px_rgba(225,179,130,0.6)] group-hover:scale-150 transition-transform"></div>
                  <h4 className="text-[11px] uppercase tracking-[0.6em] font-bold text-[#e1b382] mb-4 drop-shadow-sm">Accommodation</h4>
                  <p className="text-[15px] leading-relaxed text-white font-serif drop-shadow-md">
                    Planning to stay the night? We'd be happy to help you book a room at the venue or nearby guest houses. Just let us know in your RSVP!
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
      
      <div className="h-32"></div>

      {showBackToTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-50 p-4 bg-[#e1b382] text-black rounded-full shadow-2xl animate-fade-in hover:scale-110 active:scale-90 transition-all md:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default CountdownScreen;
