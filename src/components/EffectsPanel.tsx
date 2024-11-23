import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import * as Select from '@radix-ui/react-select';
import {
  MagicWandIcon,
  MoveIcon,
  ZoomInIcon,
  MixerHorizontalIcon,
  ShadowIcon,
  RotateClockwiseIcon,
  FlipHorizontalIcon
} from '@radix-ui/react-icons';
import type { TransitionType, Effect } from '../types/effects';

interface EffectsPanelProps {
  selectedEffect: Effect;
  onEffectChange: (effect: Effect) => void;
}

export default function EffectsPanel({ selectedEffect, onEffectChange }: EffectsPanelProps) {
  const effects = [
    { type: 'fade', name: 'Fade', description: 'Smooth opacity transition', icon: <MagicWandIcon className="w-4 h-4" /> },
    { type: 'slide', name: 'Slide', description: 'Directional movement', icon: <MoveIcon className="w-4 h-4" />, hasDirection: true },
    { type: 'zoom', name: 'Zoom', description: 'Scale animation', icon: <ZoomInIcon className="w-4 h-4" />, hasIntensity: true },
    { type: 'dissolve', name: 'Dissolve', description: 'Gradual blend', icon: <MixerHorizontalIcon className="w-4 h-4" /> },
    { type: 'blur', name: 'Blur', description: 'Blur transition', icon: <ShadowIcon className="w-4 h-4" />, hasIntensity: true },
    { type: 'rotate', name: 'Rotate', description: '3D rotation', icon: <RotateClockwiseIcon className="w-4 h-4" />, hasDirection: true },
    { type: 'flip', name: 'Flip', description: 'Flip animation', icon: <FlipHorizontalIcon className="w-4 h-4" />, hasDirection: true }
  ];

  const easings = [
    { value: 'linear', label: 'Linear' },
    { value: 'ease-in', label: 'Ease In' },
    { value: 'ease-out', label: 'Ease Out' },
    { value: 'ease-in-out', label: 'Ease In Out' }
  ];

  const directions = [
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' },
    { value: 'up', label: 'Up' },
    { value: 'down', label: 'Down' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {effects.map(effect => (
          <button
            key={effect.type}
            onClick={() => onEffectChange({ ...selectedEffect, type: effect.type as TransitionType })}
            className={`p-4 rounded-lg transition-colors ${
              selectedEffect.type === effect.type
                ? 'bg-purple-100 ring-2 ring-purple-500'
                : 'bg-purple-50 hover:bg-purple-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="text-purple-600">
                {effect.icon}
              </div>
              <div className="text-left">
                <span className="block text-purple-600 font-medium">
                  {effect.name}
                </span>
                <span className="text-sm text-gray-500">
                  {effect.description}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (seconds)
          </label>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[selectedEffect.duration]}
            onValueChange={([value]) => onEffectChange({
              ...selectedEffect,
              duration: value
            })}
            max={2}
            min={0.1}
            step={0.1}
          >
            <Slider.Track className="bg-gray-200 relative grow rounded-full h-[3px]">
              <Slider.Range className="absolute bg-purple-500 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-5 h-5 bg-white shadow-lg rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Duration"
            />
          </Slider.Root>
          <div className="text-sm text-gray-500 mt-1">
            {selectedEffect.duration}s
          </div>
        </div>

        <Select.Root
          value={selectedEffect.easing}
          onValueChange={(value) => onEffectChange({
            ...selectedEffect,
            easing: value as Effect['easing']
          })}
        >
          <Select.Trigger className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
            <Select.Value placeholder="Select easing" />
          </Select.Trigger>

          <Select.Portal>
            <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg">
              <Select.Viewport className="p-1">
                {easings.map((easing) => (
                  <Select.Item
                    key={easing.value}
                    value={easing.value}
                    className="relative flex items-center px-8 py-2 text-sm text-gray-900 rounded-md select-none hover:bg-purple-50 focus:bg-purple-50"
                  >
                    <Select.ItemText>{easing.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        {effects.find(e => e.type === selectedEffect.type)?.hasDirection && (
          <Select.Root
            value={selectedEffect.direction}
            onValueChange={(value) => onEffectChange({
              ...selectedEffect,
              direction: value as Effect['direction']
            })}
          >
            <Select.Trigger className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              <Select.Value placeholder="Select direction" />
            </Select.Trigger>

            <Select.Portal>
              <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg">
                <Select.Viewport className="p-1">
                  {directions.map((direction) => (
                    <Select.Item
                      key={direction.value}
                      value={direction.value}
                      className="relative flex items-center px-8 py-2 text-sm text-gray-900 rounded-md select-none hover:bg-purple-50 focus:bg-purple-50"
                    >
                      <Select.ItemText>{direction.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        )}

        {effects.find(e => e.type === selectedEffect.type)?.hasIntensity && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intensity
            </label>
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              value={[selectedEffect.intensity ?? 5]}
              onValueChange={([value]) => onEffectChange({
                ...selectedEffect,
                intensity: value
              })}
              max={10}
              min={1}
              step={1}
            >
              <Slider.Track className="bg-gray-200 relative grow rounded-full h-[3px]">
                <Slider.Range className="absolute bg-purple-500 rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb
                className="block w-5 h-5 bg-white shadow-lg rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Intensity"
              />
            </Slider.Root>
            <div className="text-sm text-gray-500 mt-1">
              {selectedEffect.intensity ?? 5}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}