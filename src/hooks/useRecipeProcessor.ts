import { useState, useEffect, useCallback } from 'react';
import { useGame } from '../store/GameContext';
import { Card, Recipe } from '../types';
import { checkRecipeCombination } from '../services/llmService';

interface RecipeOutput {
  name: string;
  count: number;
  [key: string]: any;
}

/**
 * 配方处理钩子
 * 用于检查卡牌组合并处理配方合成
 */
export const useRecipeProcessor = () => {
  const { state, dispatch } = useGame();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 检查选中的卡牌是否匹配已知配方
  const checkExistingRecipe = useCallback((selectedCardIds: string[]): Recipe | null => {
    if (selectedCardIds.length < 2) return null;
    
    // 获取选中的卡牌
    const selectedCards = state.activeCards.filter(card => 
      selectedCardIds.includes(card.id)
    );
    
    // 检查是否匹配已知配方
    return state.recipes.find(recipe => {
      // 检查输入数量是否匹配
      if (recipe.inputs.length !== selectedCards.length) return false;
      
      // 检查每个输入是否都存在于选中的卡牌中
      return recipe.inputs.every(inputId => 
        selectedCards.some(card => card.id === inputId)
      );
    }) || null;
  }, [state.activeCards, state.recipes]);
  
  // 处理配方合成
  const processRecipe = useCallback(async (recipe: Recipe) => {
    if (state.processingRecipe) return;
    
    // 开始处理配方
    dispatch({ type: 'START_RECIPE_PROCESSING', recipeId: recipe.id });
    setIsProcessing(true);
    
    // 模拟合成进度
    const interval = setInterval(() => {
      if (!state.processingRecipe) {
        clearInterval(interval);
        return;
      }
      
      const newProgress = state.processingRecipe.progress + (100 / recipe.time);
      
      if (newProgress >= 100) {
        clearInterval(interval);
        dispatch({ type: 'COMPLETE_RECIPE' });
        setIsProcessing(false);
      } else {
        dispatch({ type: 'UPDATE_RECIPE_PROGRESS', progress: newProgress });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [state.processingRecipe, dispatch]);
  
  // 检查未知配方
  const checkNewRecipe = useCallback(async () => {
    if (state.selectedCards.length < 2 || isProcessing) return;
    
    // 先检查是否匹配已知配方
    const existingRecipe = checkExistingRecipe(state.selectedCards);
    
    if (existingRecipe) {
      // 处理已知配方
      processRecipe(existingRecipe);
    } else {
      // 获取选中的卡牌
      const selectedCards = state.activeCards.filter(card => 
        state.selectedCards.includes(card.id)
      );
      
      // 调用LLM服务检查是否可以创建新配方
      setIsProcessing(true);
      
      try {
        const response = await checkRecipeCombination(
          selectedCards,
          state.era,
          state.recipes
        );
        
        if (response.result === 'newRecipe' && response.payload.recipe) {
          // 创建新配方
          const newRecipe: Recipe = {
            id: `recipe_${Date.now()}`,
            inputs: selectedCards.map(card => card.id),
            time: response.payload.recipe.time,
            outputs: response.payload.recipe.outputs.map((output: RecipeOutput) => ({
              cardId: `${output.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
              count: output.count,
            })),
            era: state.era,
            discovered: true,
          };
          
          // 添加新配方
          dispatch({ type: 'ADD_RECIPE', recipe: newRecipe });
          
          // 处理新配方
          processRecipe(newRecipe);
        } else if (response.result === 'eraAdvance' && response.payload.newEra) {
          // 处理时代进步
          // 这里需要根据游戏逻辑实现时代进步的处理
          console.log('时代进步:', response.payload.newEra);
        } else {
          // 无效组合
          console.log('无效组合:', response.payload.reason);
          dispatch({ type: 'CLEAR_SELECTION' });
          setIsProcessing(false);
        }
      } catch (error) {
        console.error('检查配方失败:', error);
        setIsProcessing(false);
      }
    }
  }, [
    state.selectedCards,
    state.activeCards,
    state.era,
    state.recipes,
    isProcessing,
    checkExistingRecipe,
    processRecipe,
    dispatch,
  ]);
  
  // 当选中的卡牌变化时，检查配方
  useEffect(() => {
    if (state.selectedCards.length >= 2 && !isProcessing) {
      checkNewRecipe();
    }
  }, [state.selectedCards, isProcessing, checkNewRecipe]);
  
  return {
    isProcessing,
    processingRecipe: state.processingRecipe,
    cancelProcessing: () => {
      dispatch({ type: 'CANCEL_RECIPE' });
      setIsProcessing(false);
    },
  };
}; 