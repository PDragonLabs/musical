import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadIcon, ImageIcon, MusicIcon } from '@radix-ui/react-icons';

interface MediaUploadProps {
  type: 'image' | 'audio';
  onUpload: (files: File[]) => void;
}

export default function MediaUpload({ type, onUpload }: MediaUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: type === 'image' 
      ? { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }
      : { 'audio/*': ['.mp3', '.wav'] }
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative p-8 border-2 border-dashed rounded-xl
        ${isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}
        transition-colors cursor-pointer hover:border-purple-400
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center space-y-4">
        {type === 'image' ? (
          <ImageIcon className="w-8 h-8 text-purple-500" />
        ) : (
          <MusicIcon className="w-8 h-8 text-purple-500" />
        )}
        <div className="text-center">
          <p className="text-lg font-medium">
            {isDragActive ? (
              <span className="text-purple-600">Drop your files here</span>
            ) : (
              <>
                <span className="text-purple-600">Click to upload</span> or drag and drop
              </>
            )}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {type === 'image' 
              ? 'PNG, JPG, JPEG or WebP (max 10MB each)'
              : 'MP3 or WAV files (max 50MB)'}
          </p>
        </div>
        <UploadIcon className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
}