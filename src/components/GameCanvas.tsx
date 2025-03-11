import React, { useCallback } from 'react';
import { Stage, Container, Graphics } from './PixiComponents';
import * as PIXI from 'pixi.js';
import { useGame } from '../store/GameContext';
import CardSprite from './CardSprite';
import RecipeProcessor from './RecipeProcessor';
import { useRecipeProcessor } from '../hooks/useRecipeProcessor';

const GameCanvas: React.FC = () => {
  const { state, dispatch } = useGame();
  const { isProcessing, processingRecipe } = useRecipeProcessor();
  
  // 绘制背景网格
  const drawGrid = useCallback((g: PIXI.Graphics) => {
    g.clear();
    g.lineStyle(1, 0x333333, 0.5);
    
    // 绘制水平线
    for (let y = 0; y < 1000; y += 50) {
      g.moveTo(0, y);
      g.lineTo(2000, y);
    }
    
    // 绘制垂直线
    for (let x = 0; x < 2000; x += 50) {
      g.moveTo(x, 0);
      g.lineTo(x, 1000);
    }
  }, []);
  
  // 处理卡牌选择
  const handleCardSelect = useCallback((cardId: string) => {
    if (isProcessing) return;
    
    if (state.selectedCards.includes(cardId)) {
      dispatch({ type: 'DESELECT_CARD', cardId });
    } else {
      dispatch({ type: 'SELECT_CARD', cardId });
    }
  }, [dispatch, state.selectedCards, isProcessing]);
  
  // 处理卡牌放置
  const handleCardPlace = useCallback((cardId: string, position: { x: number; y: number }) => {
    if (isProcessing) return;
    
    dispatch({ type: 'PLACE_CARD', cardId, position });
  }, [dispatch, isProcessing]);
  
  // 处理卡牌拾取
  const handleCardPickUp = useCallback((cardId: string) => {
    if (isProcessing) return;
    
    dispatch({ type: 'PICK_UP_CARD', cardId });
  }, [dispatch, isProcessing]);
  
  return (
    <Container>
      {/* 背景网格 */}
      <Graphics draw={drawGrid} />
      
      {/* 活动卡牌 */}
      {state.activeCards.map(card => (
        <CardSprite
          key={card.id}
          card={card}
          isSelected={state.selectedCards.includes(card.id)}
          onSelect={handleCardSelect}
          onPickUp={handleCardPickUp}
        />
      ))}
      
      {/* 配方处理器 */}
      {isProcessing && processingRecipe && (
        <RecipeProcessor
          progress={processingRecipe.progress}
          totalTime={processingRecipe.totalTime}
        />
      )}
    </Container>
  );
};

export default GameCanvas; 