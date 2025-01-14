<script lang="ts">
  import { onDestroy } from "svelte";
  import { videoStore } from '$lib/stores/videoStore';
  import { WatchSegmentService } from '$lib/services/firebase';
  import { VIDEO_PLAYER_CONFIG, VIDEO_CONTROLS_CONFIG } from '$lib/constants/index';
  import type { VideoPlayerProps } from '$lib/types';
  import { createHeatmapChart } from './chart';
  import { db } from "$lib/firebase/config";
  import { collection, addDoc } from "firebase/firestore";
  import VideoControls from "./VideoControls.svelte";
  import { Chart } from "chart.js/auto";

  export let config = VIDEO_PLAYER_CONFIG;
  export let controlsConfig = VIDEO_CONTROLS_CONFIG;
  export let readOnly = false;
  export let history: VideoPlayerProps['history'] = [];
  export let videoSrc = config.videoPath;

  let videoElement: HTMLVideoElement;
  let chartCanvas: HTMLCanvasElement;
  let chart: Chart | null = null;
  let duration = 0;
  let currentTime = 0;
  let isPlaying = false;
  let volume = config.defaultVolume;
  let isMuted = false;
  let previousVolume = config.defaultVolume;
  let saveInterval: number | null = null;
  let watchData = {
    segments: [],
    currentSegmentStart: 0,
  };

  function startTracking() {
    if (!readOnly && !saveInterval) {
      saveInterval = setInterval(async () => {
        if (isPlaying) {
          saveWatchSegment(watchData.currentSegmentStart, currentTime);
          watchData.currentSegmentStart = currentTime;

          if (watchData.segments.length > 0) {
            await saveToFirebase();
          }
        }
      }, controlsConfig.updateInterval);
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
      if (!readOnly) {
        saveWatchSegment(watchData.currentSegmentStart, currentTime);
        stopTracking();
        saveToFirebase();
      }
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
        timestamp: new Date().toISOString(),
      });
    }
  }

  async function saveToFirebase() {
    if (watchData.segments.length > 0) {
      try {
        const docRef = await addDoc(collection(db, "watchSegments"), {
          segments: watchData.segments,
          timestamp: new Date().toISOString(),
        });
        watchData.segments = [];
      } catch (error) {
        console.error("Error saving watch segments:", error);
      }
    }
  }

  $: if (videoElement && videoElement.readyState >= 1) {
    duration = videoElement.duration;
  }

  // Reactive statement for updating the chart when dependencies change
  $: if (chartCanvas && readOnly && history && duration) {
    const heatmapData = generateHeatmap(history, duration);

    if (chart) chart.destroy(); // Destroy previous chart

    chart = new Chart(chartCanvas, {
      type: "line",
      data: {
        labels: heatmapData.map((_, i) => i),
        datasets: [
          {
            data: heatmapData,
            fill: true,
            borderColor: config.chartConfig.borderColor,
            backgroundColor: config.chartConfig.backgroundColor,
            tension: config.chartConfig.lineTension,
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
    if (isPlaying && !readOnly) {
      saveWatchSegment(watchData.currentSegmentStart, currentTime);
      saveToFirebase();
    }
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

    if (isPlaying && !readOnly) {
      saveWatchSegment(watchData.currentSegmentStart, currentTime);
      watchData.currentSegmentStart = (position / 100) * duration;

    }

    videoElement.currentTime = (position / 100) * duration;
  }

  function generateHeatmap(segments: any[], videoDuration: number) {
    const viewsPerSecond = new Array(Math.ceil(videoDuration)).fill(0);

    segments.forEach((segment) => {
      const start = Math.floor(segment.startTime);
      const end = Math.ceil(segment.endTime);
      for (let i = start; i < end; i++) {
        if (i < viewsPerSecond.length) {
          viewsPerSecond[i]++;
        }
      }
    });

    const maxViews = Math.max(...viewsPerSecond, 1);
    return viewsPerSecond.map((count) => count / maxViews);
  }
</script>

<div class="relative bg-background group">
  {#if readOnly && history.length > 0 && duration > 0}
    <canvas bind:this={chartCanvas} class="heatmap-canvas" />
  {/if}

  <video
    bind:this={videoElement}
    src={videoSrc}
    class="w-full aspect-video"
    on:loadedmetadata={() => {
      duration = videoElement.duration; // Set duration on metadata load
    }}
    on:timeupdate={() => {
      currentTime = videoElement.currentTime;
    }}
    on:click={togglePlay}
  />

  <div
    class="absolute bottom-0 left-0 right-0 transition-opacity duration-300 bg-gradient-to-t from-background/80 to-transparent"
  >
    <VideoControls
      {duration}
      {currentTime}
      {isPlaying}
      {volume}
      {isMuted}
      config={controlsConfig}
      on:play={togglePlay}
      on:seek={(e) => seek(e.detail)}
      on:volumeChange={(e) => updateVolume(e.detail)}
      on:toggleMute={toggleMute}
      on:seekToPosition={(e) => seekToPosition(e.detail)}
    />
  </div>
</div>

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
