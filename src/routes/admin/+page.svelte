<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '$lib/firebase/config';
  import { collection, getDocs } from 'firebase/firestore';
  import VideoPlayer from '$lib/components/VideoPlayer/VideoPlayer.svelte';

  let watchData = [];

  onMount(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'watchSegments'));
      watchData = querySnapshot.docs.map(doc => doc.data().segments).flat();
      console.log(watchData);
    } catch (error) {
      console.error('Error loading watch data:', error);
    }
  });
</script>

<div class="container mx-auto px-8 py-12">
  <VideoPlayer readOnly={true} />
</div> 