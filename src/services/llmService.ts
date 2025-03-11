import OpenAI from 'openai';
import { Card, Recipe, GameEra, LLMResponse } from '../types';

// 创建OpenAI客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '', // 从环境变量获取API密钥
  dangerouslyAllowBrowser: true, // 允许在浏览器中使用（仅用于开发）
});

/**
 * 检查卡牌组合是否可以创建新配方
 */
export const checkRecipeCombination = async (
  cards: Card[],
  currentEra: GameEra,
  existingRecipes: Recipe[]
): Promise<LLMResponse> => {
  try {
    // 构建提示
    const prompt = buildRecipePrompt(cards, currentEra, existingRecipes);
    
    // 调用OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `你是一个游戏内的配方生成器，负责判断玩家放置的卡牌组合是否能够创造出新的物品或进步。
你需要遵循以下规则：
1. 配方必须符合物理和历史逻辑，不能跨越时代
2. 配方应该有创意但合理，考虑材料的特性和用途
3. 如果组合无效，明确说明原因
4. 如果组合可能导致时代进步，需要特别标注
5. 输出必须是严格的JSON格式`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });
    
    // 解析响应
    const content = response.choices[0]?.message.content || '';
    try {
      const jsonResponse = JSON.parse(content) as LLMResponse;
      return jsonResponse;
    } catch (error) {
      console.error('解析LLM响应失败:', error);
      return {
        result: 'invalid',
        payload: { reason: '无法解析响应' },
      };
    }
  } catch (error) {
    console.error('调用LLM服务失败:', error);
    return {
      result: 'invalid',
      payload: { reason: '服务调用失败' },
    };
  }
};

/**
 * 构建配方检查提示
 */
const buildRecipePrompt = (
  cards: Card[],
  currentEra: GameEra,
  existingRecipes: Recipe[]
): string => {
  // 卡牌信息
  const cardsInfo = cards.map(card => ({
    name: card.name,
    type: card.type,
    description: card.description,
  }));
  
  // 当前时代信息
  const eraInfo = {
    current: currentEra,
    available: getAvailableEras(currentEra),
  };
  
  // 已知配方信息（简化版本，避免提示过长）
  const recipesInfo = existingRecipes
    .filter(recipe => recipe.discovered)
    .map(recipe => ({
      inputs: recipe.inputs,
      outputs: recipe.outputs,
    }));
  
  return `
## 卡牌组合检查

### 当前卡牌
${JSON.stringify(cardsInfo, null, 2)}

### 当前时代
${JSON.stringify(eraInfo, null, 2)}

### 已知配方（部分）
${JSON.stringify(recipesInfo.slice(0, 5), null, 2)}

请判断这些卡牌是否可以组合成新的配方。如果可以，请提供详细信息；如果不可以，请说明原因。

输出格式必须是以下JSON结构：
{
  "result": "newRecipe" | "invalid" | "eraAdvance" | "randomEvent",
  "payload": {
    // 如果是新配方
    "recipe": {
      "inputs": ["输入卡牌1", "输入卡牌2", ...],
      "time": 数字（合成时间，秒）,
      "outputs": [
        {
          "name": "输出卡牌名称",
          "type": "resource|mob|structure|food|villager",
          "description": "卡牌描述",
          "rarity": "common|uncommon|rare|epic|legendary",
          "price": 数字,
          "durability": 数字（如果适用）,
          "hungerPoints": 数字（如果是食物）,
          "health": 数字（如果是生物）,
          "count": 数字（产出数量）
        }
      ],
      "era": "${currentEra}"
    }
  } 或 {
    // 如果无效
    "reason": "无效原因"
  } 或 {
    // 如果时代进步
    "newEra": "新时代名称",
    "description": "进步描述"
  }
}
`;
};

/**
 * 获取当前可用的时代
 */
const getAvailableEras = (currentEra: GameEra): GameEra[] => {
  const eras = Object.values(GameEra);
  const currentIndex = eras.indexOf(currentEra);
  return eras.slice(0, currentIndex + 1);
};

/**
 * 生成随机事件
 */
export const generateRandomEvent = async (
  currentEra: GameEra
): Promise<LLMResponse> => {
  try {
    const prompt = `
## 随机事件生成

### 当前时代
${currentEra}

请生成一个符合当前时代背景的随机事件。事件可以是自然灾害、发现、冲突等。

输出格式必须是以下JSON结构：
{
  "result": "randomEvent",
  "payload": {
    "title": "事件标题",
    "description": "事件描述",
    "effects": [
      {
        "type": "ADD_CARD|REMOVE_CARD|DAMAGE_VILLAGER|ADD_GOLD|REMOVE_GOLD",
        "value": 相应的值（卡牌ID、数量、伤害值等）
      }
    ]
  }
}
`;
    
    // 调用OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: '你是一个游戏内的随机事件生成器，负责创造有趣且符合时代背景的事件。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
    });
    
    // 解析响应
    const content = response.choices[0]?.message.content || '';
    try {
      const jsonResponse = JSON.parse(content) as LLMResponse;
      return jsonResponse;
    } catch (error) {
      console.error('解析LLM响应失败:', error);
      return {
        result: 'randomEvent',
        payload: {
          title: '神秘事件',
          description: '发生了一些奇怪的事情，但没有明显的影响。',
          effects: [],
        },
      };
    }
  } catch (error) {
    console.error('调用LLM服务失败:', error);
    return {
      result: 'randomEvent',
      payload: {
        title: '平静的一天',
        description: '今天没有特别的事情发生。',
        effects: [],
      },
    };
  }
}; 