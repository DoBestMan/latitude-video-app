// Add TypeScript interfaces for better type safety
export interface WatchSegment {
  start: number;
  end: number;
}

export interface VideoPlayerProps {
  readOnly?: boolean;
  history?: WatchSegment[];
}

export interface VideoControlsProps {
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
} 