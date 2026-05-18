import React, { useEffect, useState } from 'react';

const Preloader = () => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('INITIALIZING SHEHBAZ_DEV_PROTOCOLS...');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        if (prev === 30) setText('LOADING CORE MODULES...');
        if (prev === 70) setText('ESTABLISHING SECURE LINK...');
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="w-96 text-center font-mono">
        <div className="text-neon-green text-2xl mb-8 animate-pulse">
          {text}
        </div>
        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-neon-green transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-gray-400 mt-4 text-sm">{progress}%</div>
      </div>
    </div>
  );
};

export default Preloader;