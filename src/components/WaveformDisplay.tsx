import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformDisplayProps {
  audioFile: File | null;
  onTimeUpdate?: (time: number) => void;
  onDurationChange?: (duration: number) => void;
  onPlayPause?: (isPlaying: boolean) => void;
}

export default function WaveformDisplay({ 
  audioFile, 
  onTimeUpdate,
  onDurationChange,
  onPlayPause
}: WaveformDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    wavesurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#9333ea',
      progressColor: '#4f46e5',
      cursorColor: '#818cf8',
      barWidth: 2,
      barGap: 1,
      height: 64,
      normalize: true,
    });

    wavesurferRef.current.on('timeupdate', (time) => {
      onTimeUpdate?.(time);
    });

    wavesurferRef.current.on('ready', () => {
      const duration = wavesurferRef.current?.getDuration() ?? 0;
      onDurationChange?.(duration);
    });

    wavesurferRef.current.on('play', () => {
      setIsPlaying(true);
      onPlayPause?.(true);
    });

    wavesurferRef.current.on('pause', () => {
      setIsPlaying(false);
      onPlayPause?.(false);
    });

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (audioFile && wavesurferRef.current) {
      wavesurferRef.current.loadBlob(audioFile);
    }
  }, [audioFile]);

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <div 
        ref={containerRef} 
        className="cursor-pointer"
        onClick={togglePlayPause}
      />
      <div className="flex justify-center mt-2">
        <button
          onClick={togglePlayPause}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </div>
  );
}