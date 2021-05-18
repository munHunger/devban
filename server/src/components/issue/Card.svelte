<script>
  import Modal from '../modal/Modal.svelte';
  import { Button } from '../form';
  import { getBG } from '$lib/colors';

  import { quintOut } from 'svelte/easing';
  import { crossfade } from 'svelte/transition';
  import { Client } from '$lib/client';

  export const fade = crossfade({
    duration: (d) => Math.sqrt(d * 200),

    fallback(node, params) {
      const style = getComputedStyle(node);
      let opacity = parseFloat(style.opacity);

      return {
        duration: 300,
        easing: quintOut,
        css: (t) => `
					opacity: ${opacity * t};
					transform: translateX(${(1 - t) * 10}px)
				`
      };
    }
  });
  const fadeIn = fade[0];
  const fadeOut = fade[1];

  /**
   * @type {import('$lib/type/item/itemFrontend').ItemFrontend}
   */
  export let item;
  export let color;
  $: bg = getBG(color);

  function handleDragStart(e) {
    console.log('Dragging the element ' + item.id);
    e.dataTransfer.dropEffect = 'move';
    e.dataTransfer.setData('item', JSON.stringify(item));
  }
  function handleDragEnd(e) {
    console.log('stopped dragging');
  }

  let openDetails = false;
  function onClick() {
    openDetails = true;
  }

  async function save() {
    await item.save(new Client());
    openDetails = false;
  }
</script>

<div
  class="p-2 shadow-md rounded-md bg-white mb-1 cursor-move select-none"
  on:click={onClick}
  on:dragstart={handleDragStart}
  on:dragend={handleDragEnd}
  draggable="true"
  id={item.id}
  in:fadeIn|local={{ key: item.id }}
  out:fadeOut|local={{ key: item.id }}
>
  <div class="w-1 h-1 {bg} inline-block relative" />
  {item.title}
</div>

{#if openDetails}
  <Modal>
    <div>
      #{item.id}
      <div class="inline-block" contenteditable bind:textContent={item.title} />
    </div>
    <textarea bind:value={item.description} />
    <div class="flex justify-end">
      <Button color="green" on:click={save}>save</Button>
      <Button color="red" on:click={() => (openDetails = false)}>cancel</Button>
    </div>
  </Modal>
{/if}
