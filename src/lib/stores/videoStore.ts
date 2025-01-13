import { writable } from 'svelte/store';
import type { WatchSegment } from '$lib/types';

function createVideoStore() {
  const { subscribe, set, update } = writable({
    segments: [] as WatchSegment[],
    currentSegmentStart: 0,
  });

  return {
    subscribe,
    addSegment: (start: number, end: number) => update(state => ({
      ...state,
      segments: [...state.segments, { start, end }],
    })),
    clearSegments: () => update(state => ({ ...state, segments: [] })),
    setCurrentStart: (time: number) => update(state => ({
      ...state,
      currentSegmentStart: time,
    })),
  };
}

export const videoStore = createVideoStore(); 