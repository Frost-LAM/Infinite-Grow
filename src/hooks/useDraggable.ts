import { useState, useCallback, useRef } from 'react';
import * as PIXI from 'pixi.js';

interface DraggableOptions {
  onDragStart?: () => void;
  onDragEnd?: (position: { x: number; y: number }) => void;
}

interface DraggableState {
  isDragging: boolean;
  position: { x: number; y: number };
  startPosition: { x: number; y: number } | null;
}

/**
 * 拖拽钩子
 * 用于实现卡牌的拖拽功能
 */
export const useDraggable = (initialPosition: { x: number; y: number }, options?: DraggableOptions) => {
  const [state, setState] = useState<DraggableState>({
    isDragging: false,
    position: initialPosition,
    startPosition: null,
  });
  
  // 用于存储鼠标偏移量
  const offsetRef = useRef({ x: 0, y: 0 });
  
  // 开始拖拽
  const handleDragStart = useCallback((event: PIXI.FederatedPointerEvent) => {
    const { x, y } = event.global;
    
    // 计算鼠标相对于元素的偏移量
    offsetRef.current = {
      x: x - state.position.x,
      y: y - state.position.y,
    };
    
    setState(prev => ({
      ...prev,
      isDragging: true,
      startPosition: { ...prev.position },
    }));
    
    options?.onDragStart?.();
  }, [state.position, options]);
  
  // 拖拽中
  const handleDragMove = useCallback((event: PIXI.FederatedPointerEvent) => {
    if (!state.isDragging) return;
    
    const { x, y } = event.global;
    
    // 计算新位置，考虑偏移量
    const newPosition = {
      x: x - offsetRef.current.x,
      y: y - offsetRef.current.y,
    };
    
    setState(prev => ({
      ...prev,
      position: newPosition,
    }));
  }, [state.isDragging]);
  
  // 结束拖拽
  const handleDragEnd = useCallback(() => {
    if (!state.isDragging) return;
    
    setState(prev => ({
      ...prev,
      isDragging: false,
    }));
    
    options?.onDragEnd?.(state.position);
  }, [state.isDragging, state.position, options]);
  
  return {
    position: state.position,
    isDragging: state.isDragging,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    setPosition: (position: { x: number; y: number }) => {
      setState(prev => ({
        ...prev,
        position,
      }));
    },
  };
}; 