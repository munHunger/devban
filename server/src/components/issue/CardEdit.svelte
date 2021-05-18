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
  <div>
    #{item.id}
    <div class="inline-block" contenteditable bind:textContent={item.title} />
  </div>
  <textarea bind:value={item.description} />
  <div class="flex justify-end">
    <Button color="green" on:click={save}>save</Button>
    <Button color="red" on:click={onCancel}>cancel</Button>
  </div>
</Modal>
