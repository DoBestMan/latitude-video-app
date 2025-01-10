<script lang="ts">
  import Header from './Header.svelte';
  import { page } from '$app/stores';
</script>

<div class="min-h-screen bg-gray-50">
  <Header currentPath={$page.url.pathname} />
  <main class="container mx-auto px-4 py-8">
    <slot />
  </main>
</div> 