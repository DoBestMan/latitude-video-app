<script lang="ts">
  import { formatTime } from './utils';
  import IconButton from '../common/IconButton.svelte';
  import PlayIcon from '$lib/assets/icons/PlayIcon.svelte';
  import PauseIcon from '$lib/assets/icons/PauseIcon.svelte';
  import BackwardIcon from '$lib/assets/icons/BackwardIcon.svelte';
  import VolumeIcon from '$lib/assets/icons/VolumeIcon.svelte';
  
  export let duration: number = 0;
  export let currentTime: number = 0;
  export let isPlaying: boolean = false;
  export let volume: number = 1;
</script>

<div class="px-4 py-3 text-white">
  <!-- Progress bar -->
  <div class="relative h-1 mb-4 cursor-pointer bg-white/30">
    <div 
      class="absolute h-full bg-primary"
      style="width: {(currentTime / duration) * 100}%"
    />
  </div>

  <div class="flex items-center justify-between">
    <!-- Left controls -->
    <div class="flex items-center gap-4">
      <!-- Play/Pause -->
      <IconButton>
        {#if isPlaying}
          <PauseIcon />
        {:else}
          <PlayIcon />
        {/if}
      </IconButton>

      <!-- Backward/Forward -->
      <IconButton>
        <BackwardIcon />
      </IconButton>
      <IconButton>
        <div class="rotate-180">
          <BackwardIcon />
        </div>
      </IconButton>

      <!-- Time -->
      <div class="text-sm">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>

    <!-- Right controls -->
    <div class="flex items-center gap-4">
      <!-- Volume -->
      <IconButton>
        <VolumeIcon />
      </IconButton>
    </div>
  </div>
</div> 