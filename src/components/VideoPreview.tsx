import React, { useEffect, useRef } from 'react';
import { PlayIcon } from '@radix-ui/react-icons';
import type { Effect } from '../types/effects';

interface VideoPreviewProps {
  currentClip: {
    image: string;
    effect: Effect;
    startTime: number;
    endTime: number;
  } | null;
  nextClip?: {
    image: string;
  };
  isPlaying: boolean;
  progress: number;
}

export default function VideoPreview({ currentClip, nextClip, isPlaying, progress }: VideoPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !currentClip) return;
    const container = containerRef.current;
    container.style.setProperty('--progress', `${progress}%`);
  }, [progress, currentClip]);

  if (!currentClip) {
    return (
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="p-4 bg-gray-800 rounded-full">
          <PlayIcon className="w-8 h-8 text-gray-400" />
        </div>
      </div>
    );
  }

  const getTransitionStyle = () => {
    const { effect } = currentClip;
    const duration = `${effect.duration}s`;
    const easing = effect.easing;
    
    switch (effect.type) {
      case 'fade':
        return `transition-opacity duration-${duration} ${easing}`;
      case 'slide':
        return `transition-transform duration-${duration} ${easing}`;
      case 'zoom':
        return `transition-transform duration-${duration} ${easing}`;
      case 'dissolve':
        return `transition-all duration-${duration} ${easing}`;
      case 'blur':
        return `transition-[filter] duration-${duration} ${easing}`;
      case 'rotate':
        return `transition-transform duration-${duration} ${easing} transform-gpu`;
      case 'flip':
        return `transition-transform duration-${duration} ${easing} transform-gpu`;
      default:
        return '';
    }
  };

  const getTransformStyle = () => {
    const { effect } = currentClip;
    const p = progress / 100;

    switch (effect.type) {
      case 'slide':
        const direction = effect.direction || 'right';
        const offset = 100;
        switch (direction) {
          case 'left': return `translateX(${-offset * p}%)`;
          case 'right': return `translateX(${offset * p}%)`;
          case 'up': return `translateY(${-offset * p}%)`;
          case 'down': return `translateY(${offset * p}%)`;
        }
        break;
      case 'zoom':
        const scale = 1 + ((effect.intensity || 5) / 10) * p;
        return `scale(${scale})`;
      case 'rotate':
        const angle = ((effect.direction === 'left' ? -180 : 180) * p);
        return `rotate3d(0, 1, 0, ${angle}deg)`;
      case 'flip':
        const flipAngle = 180 * p;
        const axis = effect.direction === 'up' || effect.direction === 'down' ? 'X' : 'Y';
        return `perspective(1000px) rotate${axis}(${flipAngle}deg)`;
      default:
        return '';
    }
  };

  const getFilterStyle = () => {
    const { effect } = currentClip;
    if (effect.type === 'blur') {
      const blurAmount = ((effect.intensity || 5) * progress / 100) * 10;
      return `blur(${blurAmount}px)`;
    }
    return '';
  };

  return (
    <div 
      ref={containerRef}
      className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative perspective-1000"
    >
      <div 
        className={`absolute inset-0 ${getTransitionStyle()}`}
        style={{
          transform: getTransformStyle(),
          filter: getFilterStyle(),
          opacity: currentClip.effect.type === 'fade' ? 1 - (progress / 100) : 1
        }}
      >
        <img
          src={currentClip.image}
          alt="Current frame"
          className="w-full h-full object-cover"
        />
      </div>

      {nextClip && (
        <div 
          className={`absolute inset-0 ${getTransitionStyle()}`}
          style={{
            opacity: currentClip.effect.type === 'fade' ? progress / 100 : 1,
            filter: getFilterStyle()
          }}
        >
          <img
            src={nextClip.image}
            alt="Next frame"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600">
          <div 
            className="h-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}