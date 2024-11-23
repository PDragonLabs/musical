import React from 'react';
import { MusicIcon, ImageIcon, Share2Icon } from '@radix-ui/react-icons';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MusicIcon className="w-6 h-6" />
            <h1 className="text-2xl font-bold">ImgSyncTune</h1>
          </div>
          <nav className="flex items-center space-x-6">
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <ImageIcon className="w-4 h-4" />
              <span>Import Media</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <Share2Icon className="w-4 h-4" />
              <span>Share</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}