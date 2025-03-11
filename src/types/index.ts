// 卡牌稀有度
export enum CardRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

// 卡牌类型
export enum CardType {
  RESOURCE = 'resource',
  MOB = 'mob',
  STRUCTURE = 'structure',
  FOOD = 'food',
  VILLAGER = 'villager',
}

// 游戏时代
export enum GameEra {
  STONE = 'stone',
  BRONZE = 'bronze',
  IRON = 'iron',
  INDUSTRIAL = 'industrial',
  ELECTRIC = 'electric',
  DIGITAL = 'digital',
  SPACE = 'space',
}

// 基础卡牌接口
export interface BaseCard {
  id: string;
  name: string;
  type: CardType;
  rarity: CardRarity;
  description: string;
  era: GameEra;
  price: number;
  image?: string;
  position?: { x: number; y: number };
}

// 资源卡牌
export interface ResourceCard extends BaseCard {
  type: CardType.RESOURCE;
  durability?: number;
}

// 生物卡牌
export interface MobCard extends BaseCard {
  type: CardType.MOB;
  health: number;
  dropRate?: number; // 如果是可驯服的动物，有掉落率
}

// 建筑卡牌
export interface StructureCard extends BaseCard {
  type: CardType.STRUCTURE;
}

// 食物卡牌
export interface FoodCard extends BaseCard {
  type: CardType.FOOD;
  hungerPoints: number;
}

// 村民卡牌
export interface VillagerCard extends BaseCard {
  type: CardType.VILLAGER;
  health: number;
  hunger: number;
}

// 卡牌联合类型
export type Card = ResourceCard | MobCard | StructureCard | FoodCard | VillagerCard;

// 卡包类型
export interface CardPack {
  id: string;
  name: string;
  price: number;
  era: GameEra;
  description: string;
  cards: Array<{
    cardId: string;
    dropRate: number; // 0-1之间的概率
  }>;
}

// 配方类型
export interface Recipe {
  id: string;
  inputs: string[]; // 输入卡牌ID数组
  time: number; // 合成时间（秒）
  outputs: Array<{
    cardId: string;
    count: number;
  }>;
  era: GameEra;
  discovered: boolean; // 是否已被发现
}

// 随机事件类型
export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  era: GameEra;
  effects: Array<{
    type: 'ADD_CARD' | 'REMOVE_CARD' | 'DAMAGE_VILLAGER' | 'ADD_GOLD' | 'REMOVE_GOLD';
    value: any;
  }>;
}

// 游戏状态
export interface GameState {
  inventory: {
    [cardId: string]: {
      card: Card;
      count: number;
    };
  };
  gold: number;
  era: GameEra;
  turn: number;
  maxCards: number;
  recipes: Recipe[];
  discoveredRecipes: string[];
  availableCardPacks: string[];
  activeCards: Card[]; // 当前在画布上的卡牌
  selectedCards: string[]; // 当前选中的卡牌ID
  processingRecipe: {
    recipeId: string;
    progress: number;
    totalTime: number;
    active: boolean;
  } | null;
}

// LLM响应类型
export interface LLMResponse {
  result: 'newRecipe' | 'invalid' | 'eraAdvance' | 'randomEvent';
  payload: any;
} 