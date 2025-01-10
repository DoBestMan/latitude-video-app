<script lang="ts">
  import Logo from '$lib/assets/logo.svg';
  
  export let currentPath: string;
  
  const navItems = [
    { path: '/', label: 'Watch Video' },
    { path: '/admin', label: 'Analyze Video' }
  ];
</script>

<header class="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
  <div class="w-40">
    <img src={Logo} alt="Company Logo" class="w-full" />
  </div>
  
  <nav class="flex gap-4">
    {#each navItems as {path, label}}
      <a
        href={path}
        class="px-4 py-2 rounded-md transition-colors {currentPath === path ? 
          'bg-blue-500 text-white' : 
          'text-gray-600 hover:bg-gray-100'}"
      >
        {label}
      </a>
    {/each}
  </nav>
</header> 