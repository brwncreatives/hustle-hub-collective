import React from 'react';

const letters = [
  { char: 'H', color: '#ea384c' }, // Red
  { char: 'U', color: '#0EA5E9' }, // Blue
  { char: 'S', color: '#22c55e' }, // Green
  { char: 'T', color: '#eab308' }, // Yellow
  { char: 'L', color: '#F97316' }, // Orange
  { char: 'E', color: '#9b87f5' }, // Purple
];

const saturdayLetters = [
  { char: 'S', color: '#ea384c' },
  { char: 'A', color: '#0EA5E9' },
  { char: 'T', color: '#22c55e' },
  { char: 'U', color: '#eab308' },
  { char: 'R', color: '#F97316' },
  { char: 'D', color: '#9b87f5' },
  { char: 'A', color: '#ea384c' },
  { char: 'Y', color: '#0EA5E9' },
];

export function SubwayLogo() {
  return (
    <div className="flex flex-col items-center gap-4 mb-8">
      <div className="flex gap-2">
        {letters.map((letter, index) => (
          <div
            key={index}
            className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: letter.color }}
          >
            <span className="text-white font-bold text-xl md:text-2xl font-helvetica">
              {letter.char}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-1">
        {saturdayLetters.map((letter, index) => (
          <div
            key={index}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: letter.color }}
          >
            <span className="text-white font-bold text-sm md:text-base font-helvetica">
              {letter.char}
            </span>
          </div>
        ))}
      </div>
      <p className="text-muted-foreground text-sm md:text-base mt-2">Your Line to Accountability</p>
    </div>
  );
}