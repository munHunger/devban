<script context="module" lang="ts">
  import Store from '$lib/store';
  import { getContext, setContext } from 'svelte';
</script>

<script lang="ts">
  import { session } from '$app/stores';
  const store = new Store($session);
  console.log('session:' + JSON.stringify($session));
  setContext<Store>('store', store);
</script>

<slot />

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
