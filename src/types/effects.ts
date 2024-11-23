export type TransitionType = 'fade' | 'slide' | 'zoom' | 'dissolve' | 'blur' | 'rotate' | 'flip';

export interface Effect {
  type: TransitionType;
  duration: number;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  direction?: 'left' | 'right' | 'up' | 'down';
  intensity?: number;
}

export interface Clip {
  image: string;
  startTime: number;
  endTime: number;
  effect: Effect;
}