import { Card, CardType, CardRarity, GameEra } from '../types';
import { generateId } from '../utils/helpers';

// 初始卡牌数据
export const initialCards: Card[] = [
  // 村民卡牌
  {
    id: generateId(),
    name: '村民',
    type: CardType.VILLAGER,
    rarity: CardRarity.COMMON,
    description: '一个普通的村民，需要食物维持生存。',
    era: GameEra.STONE,
    price: 5,
    health: 10,
    hunger: 10,
  },
  
  // 石头卡牌
  {
    id: generateId(),
    name: '石头',
    type: CardType.RESOURCE,
    rarity: CardRarity.COMMON,
    description: '一块普通的石头，可用于制作工具。',
    era: GameEra.STONE,
    price: 1,
    durability: 3,
  },
  
  // 第二块石头
  {
    id: generateId(),
    name: '石头',
    type: CardType.RESOURCE,
    rarity: CardRarity.COMMON,
    description: '一块普通的石头，可用于制作工具。',
    era: GameEra.STONE,
    price: 1,
    durability: 3,
  },
  
  // 苹果树
  {
    id: generateId(),
    name: '苹果树',
    type: CardType.RESOURCE,
    rarity: CardRarity.UNCOMMON,
    description: '一棵结满苹果的树，可以采集食物。',
    era: GameEra.STONE,
    price: 3,
    durability: 3,
  },
  
  // 土地
  {
    id: generateId(),
    name: '土地',
    type: CardType.RESOURCE,
    rarity: CardRarity.COMMON,
    description: '一块肥沃的土地，可以用来种植作物。',
    era: GameEra.STONE,
    price: 2,
    durability: 3,
  },
]; 