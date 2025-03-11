import { CardPack, GameEra } from '../types';
import { generateId } from '../utils/helpers';

// 初始卡包数据
export const initialCardPacks: CardPack[] = [
  // 基础资源卡包
  {
    id: generateId(),
    name: '基础资源卡包',
    price: 3,
    era: GameEra.STONE,
    description: '包含基础的资源卡牌，如木材、浆果、燧石、水等。',
    cards: [
      { cardId: 'wood', dropRate: 0.3 },
      { cardId: 'berries', dropRate: 0.3 },
      { cardId: 'flint', dropRate: 0.2 },
      { cardId: 'water', dropRate: 0.2 },
    ],
  },
  
  // 家畜卡包
  {
    id: generateId(),
    name: '家畜卡包',
    price: 5,
    era: GameEra.STONE,
    description: '包含各种可驯养的动物卡牌，如鸡、兔子、羊、牛、山羊等。',
    cards: [
      { cardId: 'chicken', dropRate: 0.3 },
      { cardId: 'rabbit', dropRate: 0.3 },
      { cardId: 'sheep', dropRate: 0.2 },
      { cardId: 'cow', dropRate: 0.1 },
      { cardId: 'goat', dropRate: 0.1 },
    ],
  },
  
  // 青铜时代卡包
  {
    id: generateId(),
    name: '青铜时代卡包',
    price: 8,
    era: GameEra.BRONZE,
    description: '包含青铜时代的资源和工具卡牌。',
    cards: [
      { cardId: 'copper_ore', dropRate: 0.3 },
      { cardId: 'tin_ore', dropRate: 0.3 },
      { cardId: 'clay', dropRate: 0.2 },
      { cardId: 'bronze_ingot', dropRate: 0.1 },
      { cardId: 'pottery', dropRate: 0.1 },
    ],
  },
  
  // 铁器时代卡包
  {
    id: generateId(),
    name: '铁器时代卡包',
    price: 12,
    era: GameEra.IRON,
    description: '包含铁器时代的资源和工具卡牌。',
    cards: [
      { cardId: 'iron_ore', dropRate: 0.3 },
      { cardId: 'coal', dropRate: 0.3 },
      { cardId: 'iron_ingot', dropRate: 0.2 },
      { cardId: 'steel', dropRate: 0.1 },
      { cardId: 'wheel', dropRate: 0.1 },
    ],
  },
]; 