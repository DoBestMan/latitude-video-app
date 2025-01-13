<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { db } from '$lib/firebase/config';
  import { collection, addDoc } from 'firebase/firestore';

  import VideoControls from './VideoControls.svelte';
  import { Chart } from 'chart.js/auto';

  export let readOnly = false;
  export let history = [];

  let videoElement: HTMLVideoElement;
  let duration = 0;
  let currentTime = 0;
  let isPlaying = false;
  let volume = 1;
  let isMuted = false;
  let previousVolume = 1;

  let watchData = {
    segments: [],
    currentSegmentStart: 0
  };

  let saveInterval: number | null = null;

  let chartCanvas: HTMLCanvasElement;
  let chart: Chart | null = null;

  function startTracking() {
    if (!saveInterval) {
      saveInterval = setInterval(async () => {
        if (isPlaying) {
          saveWatchSegment(watchData.currentSegmentStart, currentTime);
          watchData.currentSegmentStart = currentTime;

          if (watchData.segments.length > 0) {
            await saveToFirebase();
          }
        }
      }, 5000);
    }
  }

  function stopTracking() {
    if (saveInterval) {
      clearInterval(saveInterval);
      saveInterval = null;
    }
  }

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
      saveToFirebase();
    }
  }

  function seek(seconds: number) {
    if (isPlaying) {
      saveWatchSegment(watchData.currentSegmentStart, currentTime);
    }
    const seekTo = Math.max(0, Math.min(currentTime + seconds, duration));
    videoElement.currentTime = seekTo;
    watchData.currentSegmentStart = seekTo;
  }

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

  async function saveToFirebase() {
    if (watchData.segments.length > 0) {
      try {
        const docRef = await addDoc(collection(db, 'watchSegments'), {
          segments: watchData.segments,
          timestamp: new Date().toISOString()
        });
        console.log('Saved to DB with ID: ', docRef.id);
        watchData.segments = [];
      } catch (error) {
        console.error('Error saving watch segments:', error);
      }
    }
  }

  $: if (chartCanvas && heatmapData.length > 0 && readOnly) {
    if (chart) chart.destroy();

    chart = new Chart(chartCanvas, {
      type: 'line',
      data: {
        labels: heatmapData.map((_, i) => i),
        datasets: [
          {
            data: heatmapData,
            fill: true,
            borderColor: 'rgba(0, 123, 255, 1)',
            backgroundColor: 'rgba(0, 123, 255, 0.3)',
            tension: 0.4,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        scales: {
          x: { display: false },
          y: { display: false },
        },
        animation: false,
        interaction: { intersect: false },
        elements: { line: { borderWidth: 2 } },
      },
    });
  }

  onDestroy(() => {
    if (chart) chart.destroy();
    stopTracking();
    if (isPlaying) {
      saveWatchSegment(watchData.currentSegmentStart, currentTime);
    }
    saveToFirebase();
  });

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
    isMuted = value === 0;
    if (value > 0) previousVolume = value;
  }

  function seekToPosition(position: number) {
    videoElement.currentTime = (position / 100) * duration;
  }

  $: heatmapData = readOnly && history && duration ? generateHeatmap(history, duration) : [];

  function generateHeatmap(segments: any[], videoDuration: number) {
    const viewsPerSecond = new Array(Math.ceil(videoDuration)).fill(0);

    segments.forEach(segment => {
      const start = Math.floor(segment.startTime);
      const end = Math.ceil(segment.endTime);
      for (let i = start; i < end; i++) {
        if (i < viewsPerSecond.length) {
          viewsPerSecond[i]++;
        }
      }
    });

    const maxViews = Math.max(...viewsPerSecond, 1);
    return viewsPerSecond.map(count => count / maxViews);
  }
</script>

<style>
  .heatmap-canvas {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    pointer-events: none; /* Allow clicks to pass through the canvas */
  }
</style>

<div class="relative bg-background group">
  {#if readOnly && heatmapData.length > 0}
    <canvas
      bind:this={chartCanvas}
      class="heatmap-canvas"
    />
  {/if}

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
