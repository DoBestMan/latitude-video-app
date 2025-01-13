<script lang="ts">
  import VideoControls from './VideoControls.svelte';

  let duration = 0;
  let currentTime = 0;
  let isPlaying = false;
  let volume = 1;
</script>

<div class="relative bg-background group">
  <video
    src="/videos/example.mp4"
    class="w-full aspect-video"
  />
  
  <div class="absolute bottom-0 left-0 right-0 transition-opacity duration-300 bg-gradient-to-t from-background/80 to-transparent">
    <VideoControls
      {duration}
      {currentTime}
      {isPlaying}
      {volume}
    />
  </div>
</div> 