<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { formatTime } from './utils';
  import IconButton from '../common/IconButton.svelte';
  import PlayIcon from '$lib/assets/icons/PlayIcon.svelte';
  import PauseIcon from '$lib/assets/icons/PauseIcon.svelte';
  import BackwardIcon from '$lib/assets/icons/BackwardIcon.svelte';
  import VolumeIcon from '$lib/assets/icons/VolumeIcon.svelte';
  import MuteIcon from '$lib/assets/icons/MuteIcon.svelte';
  
  export let duration: number = 0;
  export let currentTime: number = 0;
  export let isPlaying: boolean = false;
  export let volume: number = 1;
  export let isMuted: boolean = false;

  const dispatch = createEventDispatcher();

  // Control handlers
  function handlePlay() {
    dispatch('play');
  }

  function handleSeek(seconds: number) {
    dispatch('seek', seconds);
  }

  function handleVolumeChange(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    dispatch('volumeChange', value);
  }

  function handleToggleMute() {
    dispatch('toggleMute');
  }

  function handleProgressClick(event: MouseEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const position = ((event.clientX - rect.left) / rect.width) * 100;
    dispatch('seekToPosition', position);
  }
</script>

<div class="px-4 py-3 text-white">
  <!-- Progress bar -->
  <div 
    class="relative h-1 mb-4 cursor-pointer bg-white/30"
    on:click={handleProgressClick}
  >
    <div 
      class="absolute h-full bg-primary"
      style="width: {(currentTime / duration) * 100}%"
    />
  </div>

  <div class="flex items-center justify-between">
    <!-- Left controls -->
    <div class="flex items-center gap-4">
      <!-- Play/Pause -->
      <IconButton on:click={handlePlay}>
        {#if isPlaying}
          <PauseIcon />
        {:else}
          <PlayIcon />
        {/if}
      </IconButton>

      <!-- Backward/Forward -->
      <IconButton on:click={() => handleSeek(-10)}>
        <BackwardIcon />
      </IconButton>
      <IconButton on:click={() => handleSeek(10)}>
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
      <IconButton on:click={handleToggleMute}>
        {#if isMuted || volume === 0}
          <MuteIcon />
        {:else}
          <VolumeIcon />
        {/if}
      </IconButton>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        {volume}
        on:input={handleVolumeChange}
        class="w-20 accent-primary"
      />
    </div>
  </div>
</div>

<style>
  input[type="range"] {
    -webkit-appearance: none;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    height: 4px;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    background: theme(colors.primary);
    border-radius: 50%;
    cursor: pointer;
    height: 12px;
    width: 12px;
  }
</style> 