<script lang="ts">
  import Header from './Header.svelte';
  import { page } from '$app/stores';
</script>

<div class="min-h-screen bg-black">
  <div class="max-w-[1600px] mx-auto">
    <Header currentPath={$page.url.pathname} />
    <main class="px-8 py-12">
      <slot />
    </main>
  </div>
</div> 