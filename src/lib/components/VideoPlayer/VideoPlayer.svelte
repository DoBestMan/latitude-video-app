<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { db } from '$lib/firebase/config';
  import { collection, addDoc } from 'firebase/firestore';
  import VideoControls from './VideoControls.svelte';

  let videoElement: HTMLVideoElement;
  let duration = 0;
  let currentTime = 0;
  let isPlaying = false;
  let volume = 1;
  let isMuted = false;
  let previousVolume = 1;

  // Analytics tracking
  let watchData = {
    segments: [],
    currentSegmentStart: 0
  };

  let saveInterval: number | null = null;

  // Start interval when playing
  function startTracking() {
    if (!saveInterval) {
      saveInterval = setInterval(async () => {
        if (isPlaying) {
          // Save current segment
          saveWatchSegment(watchData.currentSegmentStart, currentTime);
          watchData.currentSegmentStart = currentTime;
          
          // Send to DB if we have segments
          if (watchData.segments.length > 0) {
            await saveToFirebase();
          }
        }
      }, 5000);
    }
  }

  // Clear interval when pausing
  function stopTracking() {
    if (saveInterval) {
      clearInterval(saveInterval);
      saveInterval = null;
    }
  }

  // Play/Pause
  function togglePlay() {
    if (videoElement.paused) {
      videoElement.play();
      isPlaying = true;
      watchData.currentSegmentStart = currentTime;
      startTracking();
    } else {
      videoElement.pause();
      isPlaying = false;
      saveWatchSegment(watchData.currentSegmentStart, currentTime);
      stopTracking();
      saveToFirebase(); // Save immediately on pause
    }
  }

  // Forward/Backward
  function seek(seconds: number) {
    if (isPlaying) {
      saveWatchSegment(watchData.currentSegmentStart, currentTime);
    }
    const seekTo = Math.max(0, Math.min(currentTime + seconds, duration));
    videoElement.currentTime = seekTo;
    watchData.currentSegmentStart = seekTo;
  }

  // Save segment
  function saveWatchSegment(start: number, end: number) {
    if (end > start) {
      watchData.segments.push({
        startTime: Math.floor(start),
        endTime: Math.floor(end),
        duration: Math.floor(end - start),
        timestamp: new Date().toISOString()
      });
    }
  }

  // Save to Firebase
  async function saveToFirebase() {
    if (watchData.segments.length > 0) {
      try {
        const docRef = await addDoc(collection(db, 'watchSegments'), {
          segments: watchData.segments,
          timestamp: new Date().toISOString()
        });
        console.log('Saved to DB with ID: ', docRef.id);
        console.log('Saved segments: ', watchData.segments);
        watchData.segments = [];
      } catch (error) {
        console.error('Error saving watch segments:', error);
      }
    }
  }

  // Cleanup on destroy
  onDestroy(() => {
    stopTracking();
    if (isPlaying) {
      saveWatchSegment(watchData.currentSegmentStart, currentTime);
    }
    saveToFirebase();
  });

  // Volume control
  function toggleMute() {
    isMuted = !isMuted;
    if (isMuted) {
      previousVolume = volume;
      volume = 0;
    } else {
      volume = previousVolume;
    }
    videoElement.volume = volume;
    videoElement.muted = isMuted;
  }

  function updateVolume(value: number) {
    volume = value;
    videoElement.volume = value;
    if (value === 0) {
      isMuted = true;
    } else {
      isMuted = false;
      previousVolume = value;
    }
  }

  function seekToPosition(position: number) {
    videoElement.currentTime = (position / 100) * duration;
  }
</script>

<div class="relative bg-background group">
  <video
    bind:this={videoElement}
    src="/videos/example.mp4"
    class="w-full aspect-video"
    on:timeupdate={() => {
      currentTime = videoElement.currentTime;
      duration = videoElement.duration;
    }}
    on:click={togglePlay}
  />
  
  <div class="absolute bottom-0 left-0 right-0 transition-opacity duration-300 bg-gradient-to-t from-background/80 to-transparent">
    <VideoControls
      {duration}
      {currentTime}
      {isPlaying}
      {volume}
      {isMuted}
      on:play={togglePlay}
      on:seek={e => seek(e.detail)}
      on:volumeChange={e => updateVolume(e.detail)}
      on:toggleMute={toggleMute}
      on:seekToPosition={e => seekToPosition(e.detail)}
    />
  </div>
</div> 