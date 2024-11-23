import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MediaUpload from './components/MediaUpload';
import Timeline from './components/Timeline';
import WaveformDisplay from './components/WaveformDisplay';
import VideoPreview from './components/VideoPreview';
import EffectsPanel from './components/EffectsPanel';
import type { Effect } from './types/effects';

function App() {
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80',
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80'
  ]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState<Effect>({
    type: 'fade',
    duration: 0.5,
    easing: 'ease-in-out',
    direction: 'right',
    intensity: 5
  });

  const clips = images.map((image, index) => ({
    image,
    startTime: (duration / images.length) * index,
    endTime: (duration / images.length) * (index + 1),
    effect: selectedEffect
  }));

  const getCurrentClip = () => {
    const currentClip = clips.find(
      clip => currentTime >= clip.startTime && currentTime < clip.endTime
    );
    if (!currentClip) return null;

    const currentIndex = clips.indexOf(currentClip);
    const nextClip = clips[currentIndex + 1];
    const progress = ((currentTime - currentClip.startTime) / 
      (currentClip.endTime - currentClip.startTime)) * 100;

    return {
      currentClip,
      nextClip,
      progress
    };
  };

  const handleImageUpload = (files: File[]) => {
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleAudioUpload = (files: File[]) => {
    if (files[0]) {
      setAudioFile(files[0]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleReorderImages = (startIndex: number, endIndex: number) => {
    setImages(prev => {
      const result = [...prev];
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const clipInfo = getCurrentClip();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              <VideoPreview
                currentClip={clipInfo?.currentClip ?? null}
                nextClip={clipInfo?.nextClip}
                isPlaying={isPlaying}
                progress={clipInfo?.progress ?? 0}
              />
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Upload Media</h2>
              <div className="space-y-4">
                <MediaUpload type="image" onUpload={handleImageUpload} />
                <MediaUpload type="audio" onUpload={handleAudioUpload} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Audio Waveform</h2>
              <WaveformDisplay 
                audioFile={audioFile}
                onTimeUpdate={setCurrentTime}
                onDurationChange={setDuration}
                onPlayPause={setIsPlaying}
              />
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Timeline</h2>
              <Timeline
                images={images}
                currentTime={currentTime}
                duration={duration}
                onRemoveImage={handleRemoveImage}
                onReorderImages={handleReorderImages}
              />
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Effects & Transitions</h2>
              <EffectsPanel
                selectedEffect={selectedEffect}
                onEffectChange={setSelectedEffect}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;