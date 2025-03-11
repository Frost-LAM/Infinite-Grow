# 无限生长 (Infinite Grow)

一个基于LLM的卡牌堆叠生存游戏，模拟人类文明的发展进程。

## 游戏概述

- **类型**：单人卡牌堆叠 + 生存经营 + 资源管理  
- **风格**：Terminal 风格，模拟早期电脑窗口，复古像素感  
- **核心特色**：  
  1) 拖拽卡牌进行资源采集、建筑合成、文明发展  
  2) LLM 动态配方，实时计算生成  
  3) 模拟社会文明进程，既有自由探索又具教育意义  

## 核心玩法

1. **卡牌合成**  
   - 将不同卡牌（资源、建筑、村民、食物等）叠放，若满足配方，则显示进度条，产出新卡牌  
   - 每回合村民消耗 2 hunger points；资源用于建造/交易  

2. **Card Pack**  
   - 可用金币购买，内含随机卡牌  
   - 初始仅 2个卡包；随时代(era)解锁，每时代额外开放 2 种卡包  

3. **随机事件**  
   - 每 5 回合触发，与当前时代匹配，可能带来自然灾害、战斗、探索等内容  

## 技术栈

- TypeScript
- React
- PixiJS (用于游戏画布和交互)
- OpenAI API (用于LLM动态配方生成)

## 安装与运行

1. 克隆仓库
```bash
git clone https://github.com/yourusername/infinite-grow.git
cd infinite-grow
```

2. 安装依赖
```bash
npm install
```

3. 设置环境变量
创建一个`.env`文件，添加你的OpenAI API密钥：
```
OPENAI_API_KEY=your_api_key_here
```

4. 启动开发服务器
```bash
npm run dev
```

5. 构建生产版本
```bash
npm run build
```

## 游戏时代

游戏分为以下几个时代，每个时代都有不同的科技和资源：

1. 石器时代 (Stone Age)
2. 青铜时代 (Bronze Age)
3. 铁器时代 (Iron Age)
4. 工业时代 (Industrial Age)
5. 电气时代 (Electric Age)
6. 数字时代 (Digital Age)
7. 太空时代 (Space Age)

## 卡牌类型

1. **Resources**：基础资源，如木材、石头、金属等
2. **Mobs**：生物，如动物、怪物等
3. **Structures**：建筑，如房屋、工厂等
4. **Food**：食物，用于维持村民生存
5. **Villager**：村民，游戏中的劳动力

## 许可证

MIT 