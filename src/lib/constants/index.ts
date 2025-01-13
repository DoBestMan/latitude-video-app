export const VIDEO_CONTROLS_CONFIG = {
  seekBackwardSeconds: -10,
  seekForwardSeconds: 10,
  volumeStep: 0.1,
  volumeMin: 0,
  volumeMax: 1,
  volumeDefaultValue: 1,
  progressBarHeight: '5px',
  volumeSliderWidth: '80px',
  updateInterval: 5000, // 5 seconds
} as const;

export const VIDEO_PLAYER_CONFIG = {
  defaultVolume: 1,
  videoPath: '/videos/example.mp4',
  chartConfig: {
    borderColor: 'rgba(0, 123, 255, 1)',
    backgroundColor: 'rgba(0, 123, 255, 0.3)',
    lineTension: 0.4,
    borderWidth: 2,
  },
} as const; 