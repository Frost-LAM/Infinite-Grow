import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { GameState, Card, GameEra, Recipe, CardType } from '../types';
import { initialCards } from '../data/initialCards';
import { initialRecipes } from '../data/initialRecipes';
import { initialCardPacks } from '../data/initialCardPacks';
import { saveGameState, loadGameState } from '../utils/storage';

// 初始游戏状态
const initialState: GameState = {
  inventory: {},
  gold: 0,
  era: GameEra.STONE,
  turn: 1,
  maxCards: 20,
  recipes: [],
  discoveredRecipes: [],
  availableCardPacks: [],
  activeCards: [],
  selectedCards: [],
  processingRecipe: null,
};

// 游戏操作类型
type GameAction =
  | { type: 'INITIALIZE_GAME' }
  | { type: 'ADD_CARD'; card: Card; count?: number }
  | { type: 'REMOVE_CARD'; cardId: string; count?: number }
  | { type: 'PLACE_CARD'; cardId: string; position: { x: number; y: number } }
  | { type: 'PICK_UP_CARD'; cardId: string }
  | { type: 'SELECT_CARD'; cardId: string }
  | { type: 'DESELECT_CARD'; cardId: string }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'START_RECIPE_PROCESSING'; recipeId: string }
  | { type: 'UPDATE_RECIPE_PROGRESS'; progress: number }
  | { type: 'COMPLETE_RECIPE' }
  | { type: 'CANCEL_RECIPE' }
  | { type: 'ADD_RECIPE'; recipe: Recipe }
  | { type: 'DISCOVER_RECIPE'; recipeId: string }
  | { type: 'ADD_GOLD'; amount: number }
  | { type: 'SPEND_GOLD'; amount: number }
  | { type: 'ADVANCE_TURN' }
  | { type: 'ADVANCE_ERA'; era: GameEra }
  | { type: 'UNLOCK_CARD_PACK'; cardPackId: string }
  | { type: 'INCREASE_MAX_CARDS'; amount: number };

// 游戏状态reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'INITIALIZE_GAME': {
      // 初始化游戏，添加起始卡牌
      const newState = { ...initialState };
      
      // 添加初始卡牌到库存
      initialCards.forEach(card => {
        newState.inventory[card.id] = {
          card,
          count: 1,
        };
      });
      
      // 设置初始配方
      newState.recipes = initialRecipes;
      
      // 设置初始可用卡包
      newState.availableCardPacks = initialCardPacks
        .filter(pack => pack.era === GameEra.STONE)
        .map(pack => pack.id);
      
      return newState;
    }
    
    case 'ADD_CARD': {
      const { card, count = 1 } = action;
      const newInventory = { ...state.inventory };
      
      if (newInventory[card.id]) {
        newInventory[card.id] = {
          ...newInventory[card.id],
          count: newInventory[card.id].count + count,
        };
      } else {
        newInventory[card.id] = {
          card,
          count,
        };
      }
      
      return {
        ...state,
        inventory: newInventory,
      };
    }
    
    case 'REMOVE_CARD': {
      const { cardId, count = 1 } = action;
      const newInventory = { ...state.inventory };
      
      if (newInventory[cardId]) {
        if (newInventory[cardId].count <= count) {
          delete newInventory[cardId];
        } else {
          newInventory[cardId] = {
            ...newInventory[cardId],
            count: newInventory[cardId].count - count,
          };
        }
      }
      
      return {
        ...state,
        inventory: newInventory,
      };
    }
    
    case 'PLACE_CARD': {
      const { cardId, position } = action;
      const card = state.inventory[cardId]?.card;
      
      if (!card) return state;
      
      // 检查是否超过最大卡牌数量
      if (state.activeCards.length >= state.maxCards) {
        return state;
      }
      
      // 从库存中移除一张卡牌
      const newState = gameReducer(state, { type: 'REMOVE_CARD', cardId, count: 1 });
      
      // 添加到活动卡牌中
      const newCard = { ...card, position };
      
      return {
        ...newState,
        activeCards: [...newState.activeCards, newCard],
      };
    }
    
    case 'PICK_UP_CARD': {
      const { cardId } = action;
      const cardIndex = state.activeCards.findIndex(card => card.id === cardId);
      
      if (cardIndex === -1) return state;
      
      const card = state.activeCards[cardIndex];
      
      // 添加回库存
      const newState = gameReducer(state, { type: 'ADD_CARD', card });
      
      // 从活动卡牌中移除
      return {
        ...newState,
        activeCards: newState.activeCards.filter((_, index) => index !== cardIndex),
        selectedCards: newState.selectedCards.filter(id => id !== cardId),
      };
    }
    
    case 'SELECT_CARD': {
      const { cardId } = action;
      
      if (state.selectedCards.includes(cardId)) {
        return state;
      }
      
      return {
        ...state,
        selectedCards: [...state.selectedCards, cardId],
      };
    }
    
    case 'DESELECT_CARD': {
      const { cardId } = action;
      
      return {
        ...state,
        selectedCards: state.selectedCards.filter(id => id !== cardId),
      };
    }
    
    case 'CLEAR_SELECTION': {
      return {
        ...state,
        selectedCards: [],
      };
    }
    
    case 'START_RECIPE_PROCESSING': {
      const { recipeId } = action;
      const recipe = state.recipes.find(r => r.id === recipeId);
      
      if (!recipe) return state;
      
      return {
        ...state,
        processingRecipe: {
          recipeId,
          progress: 0,
          totalTime: recipe.time,
          active: true,
        },
      };
    }
    
    case 'UPDATE_RECIPE_PROGRESS': {
      const { progress } = action;
      
      if (!state.processingRecipe) return state;
      
      return {
        ...state,
        processingRecipe: {
          ...state.processingRecipe,
          progress,
        },
      };
    }
    
    case 'COMPLETE_RECIPE': {
      if (!state.processingRecipe) return state;
      
      const recipe = state.recipes.find(r => r.id === state.processingRecipe?.recipeId);
      
      if (!recipe) return state;
      
      // 移除选中的卡牌
      let newState = { ...state };
      
      // 从活动卡牌中移除输入卡牌
      const inputCardIds = new Set(recipe.inputs);
      const remainingActiveCards = state.activeCards.filter(card => !inputCardIds.has(card.id));
      
      newState = {
        ...newState,
        activeCards: remainingActiveCards,
        selectedCards: [],
      };
      
      // 添加输出卡牌到库存
      recipe.outputs.forEach(output => {
        const outputCard = state.inventory[output.cardId]?.card;
        
        if (outputCard) {
          newState = gameReducer(newState, {
            type: 'ADD_CARD',
            card: outputCard,
            count: output.count,
          });
        }
      });
      
      // 如果配方未被发现，则标记为已发现
      if (!recipe.discovered) {
        newState = gameReducer(newState, {
          type: 'DISCOVER_RECIPE',
          recipeId: recipe.id,
        });
      }
      
      return {
        ...newState,
        processingRecipe: null,
      };
    }
    
    case 'CANCEL_RECIPE': {
      return {
        ...state,
        processingRecipe: null,
      };
    }
    
    case 'ADD_RECIPE': {
      const { recipe } = action;
      
      // 检查是否已存在相同的配方
      const existingRecipe = state.recipes.find(r => 
        r.inputs.length === recipe.inputs.length && 
        r.inputs.every(input => recipe.inputs.includes(input))
      );
      
      if (existingRecipe) return state;
      
      return {
        ...state,
        recipes: [...state.recipes, recipe],
      };
    }
    
    case 'DISCOVER_RECIPE': {
      const { recipeId } = action;
      
      if (state.discoveredRecipes.includes(recipeId)) {
        return state;
      }
      
      // 更新配方为已发现
      const updatedRecipes = state.recipes.map(recipe => 
        recipe.id === recipeId ? { ...recipe, discovered: true } : recipe
      );
      
      return {
        ...state,
        recipes: updatedRecipes,
        discoveredRecipes: [...state.discoveredRecipes, recipeId],
      };
    }
    
    case 'ADD_GOLD': {
      const { amount } = action;
      
      return {
        ...state,
        gold: state.gold + amount,
      };
    }
    
    case 'SPEND_GOLD': {
      const { amount } = action;
      
      if (state.gold < amount) {
        return state;
      }
      
      return {
        ...state,
        gold: state.gold - amount,
      };
    }
    
    case 'ADVANCE_TURN': {
      let newState = {
        ...state,
        turn: state.turn + 1,
      };
      
      // 村民消耗饥饿值
      const villagers = newState.activeCards.filter(card => card.type === CardType.VILLAGER);
      
      villagers.forEach(villager => {
        // 类型断言，因为我们已经过滤了类型
        const villagerCard = villager as Card & { hunger: number };
        
        // 减少饥饿值
        villagerCard.hunger = Math.max(0, villagerCard.hunger - 2);
        
        // 如果饥饿值为0，村民死亡
        if (villagerCard.hunger <= 0) {
          newState = gameReducer(newState, {
            type: 'PICK_UP_CARD',
            cardId: villager.id,
          });
        }
      });
      
      // 每5回合触发随机事件
      if (newState.turn % 5 === 0) {
        // 随机事件逻辑将在另一个地方处理
      }
      
      return newState;
    }
    
    case 'ADVANCE_ERA': {
      const { era } = action;
      
      // 解锁新时代的卡包
      const newCardPacks = initialCardPacks
        .filter(pack => pack.era === era)
        .map(pack => pack.id);
      
      return {
        ...state,
        era,
        availableCardPacks: [...state.availableCardPacks, ...newCardPacks],
      };
    }
    
    case 'UNLOCK_CARD_PACK': {
      const { cardPackId } = action;
      
      if (state.availableCardPacks.includes(cardPackId)) {
        return state;
      }
      
      return {
        ...state,
        availableCardPacks: [...state.availableCardPacks, cardPackId],
      };
    }
    
    case 'INCREASE_MAX_CARDS': {
      const { amount } = action;
      
      return {
        ...state,
        maxCards: state.maxCards + amount,
      };
    }
    
    default:
      return state;
  }
};

// 创建游戏上下文
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// 游戏提供者组件
interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  // 尝试从本地存储加载游戏状态
  const savedState = loadGameState();
  const [state, dispatch] = useReducer(gameReducer, savedState || initialState);
  
  // 当状态变化时保存到本地存储
  useEffect(() => {
    saveGameState(state);
  }, [state]);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// 自定义钩子，用于访问游戏上下文
export const useGame = () => {
  const context = useContext(GameContext);
  
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  
  return context;
}; 