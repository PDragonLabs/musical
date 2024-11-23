import React, { useMemo } from 'react';
import { TimerIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon } from '@radix-ui/react-icons';

interface TimelineProps {
  images: string[];
  currentTime: number;
  duration: number;
  onRemoveImage?: (index: number) => void;
  onReorderImages?: (startIndex: number, endIndex: number) => void;
}

interface ClipSegment {
  image: string;
  startTime: number;
  endTime: number;
  transition: 'fade' | 'slide' | 'zoom' | 'dissolve';
}

export default function Timeline({ 
  images, 
  currentTime, 
  duration,
  onRemoveImage,
  onReorderImages 
}: TimelineProps) {
  const transitions: Array<'fade' | 'slide' | 'zoom' | 'dissolve'> = [
    'fade', 'slide', 'zoom', 'dissolve'
  ];

  const clips = useMemo(() => {
    if (!duration || images.length === 0) return [];
    
    const segmentDuration = duration / images.length;
    return images.map((image, index): ClipSegment => ({
      image,
      startTime: index * segmentDuration,
      endTime: (index + 1) * segmentDuration,
      transition: transitions[index % transitions.length]
    }));
  }, [images, duration]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (onReorderImages) {
      onReorderImages(dragIndex, dropIndex);
    }
  };

  const getCurrentClip = () => {
    return clips.find(clip => 
      currentTime >= clip.startTime && currentTime < clip.endTime
    );
  };

  const getProgressInClip = (clip: ClipSegment) => {
    const clipProgress = (currentTime - clip.startTime) / (clip.endTime - clip.startTime);
    return Math.min(Math.max(clipProgress, 0), 1) * 100;
  };

  const currentClip = getCurrentClip();

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TimerIcon className="w-5 h-5" />
          <span className="font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative h-32 bg-gray-800 rounded-lg overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-6 border-b border-gray-700 flex">
          {clips.map((clip, index) => (
            <div
              key={`ruler-${index}`}
              className="flex-1 border-r border-gray-700 text-xs text-gray-400 px-1"
            >
              {formatTime(clip.startTime)}
            </div>
          ))}
        </div>

        <div className="absolute top-6 left-0 right-0 bottom-0 flex">
          {clips.map((clip, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className="relative flex-1 p-1"
            >
              <div className="group relative h-full rounded-md overflow-hidden border-2 border-transparent hover:border-purple-500 transition-colors cursor-move">
                <img
                  src={clip.image}
                  alt={`Timeline frame ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {currentClip?.image === clip.image && (
                  <div 
                    className="absolute bottom-0 left-0 h-1 bg-purple-500"
                    style={{ width: `${getProgressInClip(clip)}%` }}
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <span className="text-xs font-medium">
                    {clip.transition}
                  </span>
                </div>
                {onRemoveImage && (
                  <button
                    onClick={() => onRemoveImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <TrashIcon className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}