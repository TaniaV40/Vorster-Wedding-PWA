
import React from 'react';

export const WEDDING_DATE = new Date('2027-07-02T13:00:00');
export const COLORS = {
  GOLD: '#c39d6f',
  BLACK: '#161615',
  BROWN: '#5e4f3e',
};

export const MONOGRAM = (
  <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-24 md:h-24">
    <circle cx="50" cy="50" r="45" fill="none" stroke="#c39d6f" strokeWidth="1" />
    <text x="50" y="55" textAnchor="middle" fill="#c39d6f" className="font-serif text-3xl font-bold">J | J</text>
  </svg>
);

export const SUNFLOWER_ICON = (
  <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
  </svg>
);
