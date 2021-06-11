<script context="module" lang="ts">
  import { setContext, getContext } from 'svelte';

  export const load = async ({ session, page, fetch }) => {
    let token = page.query.get('token');

    return {
      props: {
        token
      }
    };
  };
</script>

<script lang="ts">
  import Store from '$lib/store';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { session } from '$app/stores';
  export let token;
  const store = new Store($session);
  getContext<Store>('store');

  onMount(() => {
    if (token) {
      window
        .fetch(`/auth.json?token=${encodeURIComponent(token)}`)
        .then((data) => data.text())
        .then((token) => {
          console.log('setting state');
          store.changeAuthenticationState(token);
          goto('/');
        });
    }
  });
</script>
