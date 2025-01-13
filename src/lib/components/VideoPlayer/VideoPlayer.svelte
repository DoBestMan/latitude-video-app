<script lang="ts">
  import VideoControls from './VideoControls.svelte';

  let videoElement: HTMLVideoElement;
  let duration = 0;
  let currentTime = 0;
  let isPlaying = false;
  let volume = 1;
  let isMuted = false;

  // Play/Pause
  function togglePlay() {
    if (videoElement.paused) {
      videoElement.play();
      isPlaying = true;
    } else {
      videoElement.pause();
      isPlaying = false;
    }
  }

  // Forward/Backward
  function seek(seconds: number) {
    videoElement.currentTime = Math.max(0, Math.min(videoElement.currentTime + seconds, duration));
  }

  // Volume control
  function toggleMute() {
    isMuted = !isMuted;
    videoElement.muted = isMuted;
  }

  function updateVolume(value: number) {
    volume = value;
    videoElement.volume = value;
  }

  // Progress bar
  function onTimeUpdate() {
    currentTime = videoElement.currentTime;
    duration = videoElement.duration;
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
    on:timeupdate={onTimeUpdate}
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