<script>
  import { getBG } from '$lib/colors';
  export let color;
</script>

<div
  class="m-1 p-2 rounded-md {getBG(color)} border-b-4 {getBG(
    color,
    true
  )} text-gray-200 font-bold text-center cursor-pointer"
  on:click
>
  <slot />
</div>
