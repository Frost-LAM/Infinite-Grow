import { useEffect } from 'react';
import { useGame } from '../store/GameContext';
import { loadGameState } from '../utils/storage';

/**
 * 游戏初始化钩子
 * 负责在游戏启动时加载或初始化游戏状态
 */
export const useGameInitializer = () => {
  const { state, dispatch } = useGame();
  
  useEffect(() => {
    const initializeGame = async () => {
      // 尝试从本地存储加载游戏状态
      const savedState = await loadGameState();
      
      if (savedState) {
        console.log('从本地存储加载游戏状态');
        // 游戏状态已经在GameContext中加载
      } else {
        console.log('初始化新游戏');
        // 初始化新游戏
        dispatch({ type: 'INITIALIZE_GAME' });
      }
    };
    
    initializeGame();
  }, [dispatch]);
  
  return state;
}; 