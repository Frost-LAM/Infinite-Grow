import { Recipe, GameEra } from '../types';
import { generateId } from '../utils/helpers';
import { initialCards } from './initialCards';

// 获取卡牌ID的辅助函数
const getCardIdByName = (name: string): string => {
  const card = initialCards.find(card => card.name === name);
  return card ? card.id : '';
};

// 初始配方数据
export const initialRecipes: Recipe[] = [
  // 石斧配方
  {
    id: generateId(),
    inputs: [
      getCardIdByName('石头'),
      getCardIdByName('石头'),
    ],
    time: 5,
    outputs: [
      {
        cardId: 'stone_axe', // 这个ID会在卡牌数据中定义
        count: 1,
      },
    ],
    era: GameEra.STONE,
    discovered: true,
  },
  
  // 采集苹果
  {
    id: generateId(),
    inputs: [
      getCardIdByName('村民'),
      getCardIdByName('苹果树'),
    ],
    time: 3,
    outputs: [
      {
        cardId: 'apple', // 这个ID会在卡牌数据中定义
        count: 2,
      },
    ],
    era: GameEra.STONE,
    discovered: true,
  },
  
  // 种植小麦
  {
    id: generateId(),
    inputs: [
      getCardIdByName('村民'),
      getCardIdByName('土地'),
    ],
    time: 8,
    outputs: [
      {
        cardId: 'wheat', // 这个ID会在卡牌数据中定义
        count: 1,
      },
    ],
    era: GameEra.STONE,
    discovered: true,
  },
]; 