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
  import { Card, List } from '../components/issue/';
  import { board } from '$lib/data';
  import { ItemFrontend } from '$lib/type/item/itemFrontend';

  export let project;

  board.set(project);
</script>

<div class="p-4">
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
</div>
