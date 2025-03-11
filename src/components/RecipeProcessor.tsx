import React from 'react';
import { Container, Graphics, Text } from './PixiComponents';
import * as PIXI from 'pixi.js';

interface RecipeProcessorProps {
  progress: number;
  totalTime: number;
}

const RecipeProcessor: React.FC<RecipeProcessorProps> = ({ progress, totalTime }) => {
  // 绘制进度条
  const drawProgressBar = (g: PIXI.Graphics) => {
    g.clear();
    
    // 背景
    g.beginFill(0x333333, 0.8);
    g.lineStyle(2, 0x33ff33, 1);
    g.drawRoundedRect(0, 0, 200, 30, 5);
    g.endFill();
    
    // 进度
    const progressWidth = (progress / 100) * 196; // 留出边距
    g.beginFill(0x33ff33, 0.8);
    g.drawRoundedRect(2, 2, progressWidth, 26, 3);
    g.endFill();
  };
  
  return (
    <Container position={[400, 300]}>
      <Graphics draw={drawProgressBar} />
      <Text
        text={`合成中... ${Math.floor(progress)}%`}
        anchor={0.5}
        position={[100, 15]}
        style={
          new PIXI.TextStyle({
            fontFamily: 'PixelFont',
            fontSize: 14,
            fill: 0xffffff,
            align: 'center',
          })
        }
      />
    </Container>
  );
};

export default RecipeProcessor; 