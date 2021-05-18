<script context="module" lang="ts">
  import { Board } from '$lib/type/board';
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ page, fetch, session, context }) {
    let url = `/index.json`;
    const res = await fetch(url);
    if (res.ok) {
      let data = await res.json();
      return {
        props: {
          project: new Board(data)
        }
      };
    }
    return {
      status: res.status,
      error: new Error(`Could not load ${url}`)
    };
  }
</script>

<script>
  import { Card, List, CardEdit } from '../components/issue/';
  import { board } from '$lib/data';
  import { ItemFrontend } from '$lib/type/item/itemFrontend';
  import { Item } from '$lib/type/item/item';
  import { Button } from '../components/form';

  export let project;

  board.set(project);

  let newItem = false;
</script>

<div class="p-4">
  <Button color="blue" on:click={() => (newItem = true)}>new item</Button>
  {#if $board}
    {#each $board.getStatuses() || [] as status}
      <List title={status} color={$board.getStatusList(status).color}>
        {#each $board.getStatusList(status).items as item}
          <div id="p{item.id}">
            <Card item={new ItemFrontend(item)} color={$board.getStatusList(status).color} />
          </div>
        {/each}
      </List>
    {/each}
  {/if}
  {#if newItem}
    <CardEdit
      item={new ItemFrontend()}
      onSave={() => (newItem = false)}
      onCancel={() => (newItem = false)}
    />
  {/if}
</div>
