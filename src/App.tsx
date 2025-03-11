import React, { useState, useEffect } from 'react';
import { Stage } from './components/PixiComponents';
import GameCanvas from './components/GameCanvas';
import InfoPanel from './components/InfoPanel';
import { GameProvider } from './store/GameContext';
import { useGameInitializer } from './hooks/useGameInitializer';

const App: React.FC = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <GameProvider>
      <div className="game-container" style={{ display: 'flex', width: '100%', height: '100%' }}>
        <InfoPanel />
        <div className="canvas-container" style={{ flex: 4 }}>
          <Stage
            width={windowSize.width * 0.8}
            height={windowSize.height}
            options={{ backgroundColor: 0x0a0a0a }}
          >
            <GameCanvas />
          </Stage>
        </div>
      </div>
    </GameProvider>
  );
};

export default App; 