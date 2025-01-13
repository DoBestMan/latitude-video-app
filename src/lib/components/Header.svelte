<script lang="ts">
  import Logo from '$lib/assets/icons/Logo.svelte';
  
  export let currentPath: string;
  
  const navItems = [
    { path: '/', label: 'Watch Video' },
    { path: '/admin', label: 'Analyze Video' }
  ];
</script>

<header class="flex justify-between items-center px-8 py-12 bg-black">
  <Logo />
  
  <nav class="flex gap-6">
    {#each navItems as {path, label}}
      <a
        href={path}
        class="px-4 py-2 rounded-md transition-all duration-300 {currentPath === path ? 
          'bg-[#00A3FF] text-white' : 
          'text-gray-300 hover:text-[#00A3FF]'}"
      >
        {label}
      </a>
    {/each}
  </nav>
</header> 