import React, { useCallback } from 'react';
import { Container, Sprite, Text, Graphics } from './PixiComponents';
import * as PIXI from 'pixi.js';
import { Card, CardRarity } from '../types';
import { useDraggable } from '../hooks/useDraggable';

interface CardSpriteProps {
  card: Card;
  isSelected: boolean;
  onSelect: (cardId: string) => void;
  onPickUp: (cardId: string) => void;
}

// 卡牌稀有度对应的颜色
const rarityColors = {
  common: 0xffffff,
  uncommon: 0x00ff00,
  rare: 0x0088ff,
  epic: 0xff8800,
  legendary: 0xffcc00,
};

const CardSprite: React.FC<CardSpriteProps> = ({ card, isSelected, onSelect, onPickUp }) => {
  const initialPosition = card.position || { x: 100, y: 100 };
  
  const { position, isDragging, handleDragStart, handleDragMove, handleDragEnd } = useDraggable(
    initialPosition,
    {
      onDragEnd: () => {
        // 如果拖动到了特定区域（如交易区），可以在这里处理
      },
    }
  );
  
  // 处理点击事件
  const handleClick = useCallback(() => {
    if (!isDragging) {
      onSelect(card.id);
    }
  }, [card.id, isDragging, onSelect]);
  
  // 处理双击事件
  const handleDoubleClick = useCallback(() => {
    onPickUp(card.id);
  }, [card.id, onPickUp]);
  
  // 获取卡牌颜色
  const getCardColor = useCallback(() => {
    return rarityColors[card.rarity] || 0xffffff;
  }, [card.rarity]);
  
  // 绘制卡牌背景
  const drawCardBackground = useCallback((g: PIXI.Graphics) => {
    const color = getCardColor();
    const borderColor = isSelected ? 0x33ff33 : color;
    const borderWidth = isSelected ? 3 : 1;
    
    g.clear();
    
    // 绘制卡牌背景
    g.beginFill(0x111111, 0.8);
    g.lineStyle(borderWidth, borderColor, 1);
    g.drawRoundedRect(0, 0, 100, 140, 5);
    g.endFill();
    
    // 如果是资源卡牌且有耐久度，绘制耐久度条
    if ('durability' in card && card.durability !== undefined) {
      const durabilityPercentage = card.durability / 3; // 假设最大耐久度为3
      
      g.beginFill(0x333333);
      g.drawRect(10, 120, 80, 10);
      g.endFill();
      
      g.beginFill(0x33ff33);
      g.drawRect(10, 120, 80 * durabilityPercentage, 10);
      g.endFill();
    }
    
    // 如果是村民卡牌，绘制饥饿度条
    if ('hunger' in card && card.hunger !== undefined) {
      const hungerPercentage = card.hunger / 10; // 假设最大饥饿度为10
      
      g.beginFill(0x333333);
      g.drawRect(10, 100, 80, 10);
      g.endFill();
      
      g.beginFill(0xff3333);
      g.drawRect(10, 100, 80 * hungerPercentage, 10);
      g.endFill();
    }
  }, [card, isSelected, getCardColor]);
  
  return (
    <Container
      position={[position.x, position.y]}
      interactive={true}
      pointerdown={handleDragStart}
      pointermove={handleDragMove}
      pointerup={handleDragEnd}
      pointerupoutside={handleDragEnd}
      click={handleClick}
      doubleclick={handleDoubleClick}
      cursor="pointer"
    >
      {/* 卡牌背景 */}
      <Graphics draw={drawCardBackground} />
      
      {/* 卡牌名称 */}
      <Text
        text={card.name}
        anchor={0.5}
        position={[50, 30]}
        style={
          new PIXI.TextStyle({
            fontFamily: 'PixelFont',
            fontSize: 14,
            fill: getCardColor(),
            align: 'center',
          })
        }
      />
      
      {/* 卡牌类型 */}
      <Text
        text={card.type}
        anchor={0.5}
        position={[50, 50]}
        style={
          new PIXI.TextStyle({
            fontFamily: 'PixelFont',
            fontSize: 10,
            fill: 0xcccccc,
            align: 'center',
          })
        }
      />
      
      {/* 卡牌价格 */}
      <Text
        text={`${card.price}G`}
        anchor={[1, 0]}
        position={[90, 10]}
        style={
          new PIXI.TextStyle({
            fontFamily: 'PixelFont',
            fontSize: 10,
            fill: 0xffcc00,
            align: 'right',
          })
        }
      />
    </Container>
  );
};

export default CardSprite; 