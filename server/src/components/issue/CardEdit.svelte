<script>
  import Modal from '../modal/Modal.svelte';
  import { Button } from '../form';
  import { Client } from '$lib/client';
  /**
   * @type {import('$lib/type/item/itemFrontend').ItemFrontend}
   */
  export let item;
  export let onSave;
  export let onCancel;

  async function save() {
    await item.save(new Client());
    if (onSave) onSave();
  }
</script>

<Modal>
  <div class="flex flex-row">
    <div class="flex-1">
      <div>
        #{item.id}
        <div class="inline-block" contenteditable bind:textContent={item.title} />
      </div>
      <textarea bind:value={item.description} />
    </div>
    <div class="flex-initial">
      <div class="p-2">
        {#each item.events || [] as event}
          <div class="flex flex-row">
            <div class="flex-1">
              {#if event.actor.serviceAccount}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              {/if}
            </div>
            <div class="flex-auto mx-4">
              {event.description}
              <div class="text-xs text-gray-400">{new Date(event.timestamp).toLocaleString()}</div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
  <div class="flex justify-end">
    <Button color="green" on:click={save}>save</Button>
    <Button color="red" on:click={onCancel}>cancel</Button>
  </div>
</Modal>
