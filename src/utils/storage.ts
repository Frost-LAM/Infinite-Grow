import localforage from 'localforage';
import { GameState } from '../types';

const GAME_STATE_KEY = 'infinite-grow-game-state';

// 初始化本地存储
localforage.config({
  name: 'InfiniteGrow',
  storeName: 'gameData',
});

/**
 * 保存游戏状态到本地存储
 */
export const saveGameState = async (state: GameState): Promise<void> => {
  try {
    await localforage.setItem(GAME_STATE_KEY, state);
    console.log('游戏状态已保存');
  } catch (error) {
    console.error('保存游戏状态失败:', error);
  }
};

/**
 * 从本地存储加载游戏状态
 */
export const loadGameState = async (): Promise<GameState | null> => {
  try {
    const state = await localforage.getItem<GameState>(GAME_STATE_KEY);
    console.log('游戏状态已加载');
    return state;
  } catch (error) {
    console.error('加载游戏状态失败:', error);
    return null;
  }
};

/**
 * 清除游戏状态
 */
export const clearGameState = async (): Promise<void> => {
  try {
    await localforage.removeItem(GAME_STATE_KEY);
    console.log('游戏状态已清除');
  } catch (error) {
    console.error('清除游戏状态失败:', error);
  }
}; 