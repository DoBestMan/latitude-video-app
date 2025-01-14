<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '$lib/firebase/config';
  import { collection, getDocs } from 'firebase/firestore';
  import VideoPlayer from '$lib/components/VideoPlayer/VideoPlayer.svelte';

  let history = [];

  onMount(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'watchSegments'));
      history = querySnapshot.docs.map(doc => doc.data().segments).flat();
    } catch (error) {
      console.error('Error loading watch data:', error);
    }
  });
</script>

<div class="flex items-center justify-center h-[calc(100vh-248px)]">
  <div class="w-[85%] max-w-[1600px]">
      <VideoPlayer readOnly={true} {history} />
  </div>
</div>
