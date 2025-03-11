import React, { useState } from 'react';
import { useGame } from '../store/GameContext';
import { CardType, GameEra } from '../types';

const InfoPanel: React.FC = () => {
  const { state, dispatch } = useGame();
  const [selectedTab, setSelectedTab] = useState<'inventory' | 'cardPacks' | 'recipes'>('inventory');
  
  // 计算村民总数
  const villagerCount = Object.values(state.inventory)
    .filter(item => item.card.type === CardType.VILLAGER)
    .reduce((sum, item) => sum + item.count, 0);
  
  // 计算食物总数
  const foodCount = Object.values(state.inventory)
    .filter(item => item.card.type === CardType.FOOD)
    .reduce((sum, item) => sum + item.count, 0);
  
  // 获取时代名称
  const getEraName = (era: GameEra): string => {
    switch (era) {
      case GameEra.STONE:
        return '石器时代';
      case GameEra.BRONZE:
        return '青铜时代';
      case GameEra.IRON:
        return '铁器时代';
      case GameEra.INDUSTRIAL:
        return '工业时代';
      case GameEra.ELECTRIC:
        return '电气时代';
      case GameEra.DIGITAL:
        return '数字时代';
      case GameEra.SPACE:
        return '太空时代';
      default:
        return '未知时代';
    }
  };
  
  // 处理回合结束
  const handleEndTurn = () => {
    dispatch({ type: 'ADVANCE_TURN' });
  };
  
  // 处理卡牌出售
  const handleSellCard = (cardId: string) => {
    const card = state.inventory[cardId]?.card;
    if (card) {
      dispatch({ type: 'REMOVE_CARD', cardId, count: 1 });
      dispatch({ type: 'ADD_GOLD', amount: Math.floor(card.price * 0.7) }); // 卖出价格为原价的70%
    }
  };
  
  // 处理购买卡包
  const handleBuyCardPack = (cardPackId: string) => {
    // 这里需要实现卡包购买逻辑
    console.log('购买卡包:', cardPackId);
  };
  
  return (
    <div className="info-panel" style={{ flex: 1, padding: '10px', borderRight: '2px solid #33ff33' }}>
      {/* 顶部信息区 */}
      <div className="top-info" style={{ marginBottom: '20px' }}>
        <div className="era-info" style={{ marginBottom: '10px' }}>
          <h3>{getEraName(state.era)} - 回合 {state.turn}</h3>
        </div>
        
        <div className="resources-info" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <span>金币: {state.gold}</span>
          </div>
          <div>
            <span>村民: {villagerCount}</span>
          </div>
          <div>
            <span>食物: {foodCount}</span>
          </div>
        </div>
        
        <div className="card-limit" style={{ marginTop: '10px' }}>
          <span>卡牌: {state.activeCards.length}/{state.maxCards}</span>
        </div>
        
        <button 
          className="pixel-button" 
          style={{ width: '100%', marginTop: '10px' }}
          onClick={handleEndTurn}
        >
          结束回合
        </button>
      </div>
      
      {/* 标签页切换 */}
      <div className="tabs" style={{ display: 'flex', marginBottom: '10px' }}>
        <button 
          className={`tab ${selectedTab === 'inventory' ? 'active' : ''}`}
          style={{ 
            flex: 1, 
            padding: '5px', 
            background: selectedTab === 'inventory' ? '#33ff33' : '#111', 
            color: selectedTab === 'inventory' ? '#000' : '#33ff33',
            border: '1px solid #33ff33'
          }}
          onClick={() => setSelectedTab('inventory')}
        >
          库存
        </button>
        <button 
          className={`tab ${selectedTab === 'cardPacks' ? 'active' : ''}`}
          style={{ 
            flex: 1, 
            padding: '5px', 
            background: selectedTab === 'cardPacks' ? '#33ff33' : '#111', 
            color: selectedTab === 'cardPacks' ? '#000' : '#33ff33',
            border: '1px solid #33ff33'
          }}
          onClick={() => setSelectedTab('cardPacks')}
        >
          卡包
        </button>
        <button 
          className={`tab ${selectedTab === 'recipes' ? 'active' : ''}`}
          style={{ 
            flex: 1, 
            padding: '5px', 
            background: selectedTab === 'recipes' ? '#33ff33' : '#111', 
            color: selectedTab === 'recipes' ? '#000' : '#33ff33',
            border: '1px solid #33ff33'
          }}
          onClick={() => setSelectedTab('recipes')}
        >
          配方
        </button>
      </div>
      
      {/* 内容区 */}
      <div className="content" style={{ height: 'calc(100% - 200px)', overflowY: 'auto' }}>
        {selectedTab === 'inventory' && (
          <div className="inventory">
            <h4>库存</h4>
            <div className="card-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {Object.entries(state.inventory).map(([cardId, { card, count }]) => (
                <div 
                  key={cardId} 
                  className="card-item pixel-border"
                  style={{ 
                    width: '80px', 
                    height: '100px', 
                    padding: '5px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSellCard(cardId)}
                >
                  <div className="card-name" style={{ textAlign: 'center' }}>
                    {card.name}
                  </div>
                  <div className="card-type" style={{ fontSize: '10px' }}>
                    {card.type}
                  </div>
                  <div className="card-count" style={{ marginTop: 'auto' }}>
                    x{count}
                  </div>
                  <div className="card-price" style={{ fontSize: '10px', color: '#ffcc00' }}>
                    售价: {Math.floor(card.price * 0.7)}G
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {selectedTab === 'cardPacks' && (
          <div className="card-packs">
            <h4>可用卡包</h4>
            <div className="pack-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {state.availableCardPacks.map(packId => (
                <div 
                  key={packId} 
                  className="pack-item pixel-border"
                  style={{ 
                    width: '120px', 
                    height: '150px', 
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleBuyCardPack(packId)}
                >
                  <div className="pack-name" style={{ textAlign: 'center' }}>
                    {packId}
                  </div>
                  <button className="pixel-button" style={{ width: '100%', marginTop: 'auto' }}>
                    购买
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {selectedTab === 'recipes' && (
          <div className="recipes">
            <h4>已发现配方</h4>
            <div className="recipe-list">
              {state.recipes
                .filter(recipe => recipe.discovered)
                .map(recipe => (
                  <div 
                    key={recipe.id} 
                    className="recipe-item pixel-border"
                    style={{ 
                      padding: '10px',
                      marginBottom: '10px'
                    }}
                  >
                    <div className="recipe-inputs" style={{ marginBottom: '5px' }}>
                      输入: {recipe.inputs.join(' + ')}
                    </div>
                    <div className="recipe-outputs">
                      输出: {recipe.outputs.map(output => `${output.cardId} x${output.count}`).join(', ')}
                    </div>
                    <div className="recipe-time" style={{ fontSize: '10px', marginTop: '5px' }}>
                      时间: {recipe.time}秒
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPanel; 