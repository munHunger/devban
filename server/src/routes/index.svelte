<script context="module">
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
          project: new Board(data),
          session
        }
      };
    }
    return {
      status: res.status,
      error: new Error(`Could not load ${url}`)
    };
  }
</script>

<script lang="ts">
  import { Card, List, CardEdit } from '../components/issue/';
  import { board } from '$lib/data';
  import { ItemFrontend } from '$lib/type/item/itemFrontend';
  import { Item } from '$lib/type/item/item';
  import { Button } from '../components/form';
  import { goto } from '$app/navigation';
  import md5 from 'md5';

  export let project, session;

  board.set(project);

  let newItem = false;

  function login() {
    console.log('logging in');
    window
      .fetch('/login.json')
      .then((data) => data.json())
      .then((data) => (window.location = data.url));
  }
</script>

<div class="p-4">
  <div class="flex flex-row">
    <div class="flex-auto">
      {#if !session.authenticated}
        <Button color="blue" on:click={login}>login</Button>
      {:else}
        <img
          class="w-12 h-12 rounded-full ring ring-offset-2 ring-primary-300 ring-offset-primary-200'"
          src={`https://www.gravatar.com/avatar/${md5(session.user.email)}?d=${encodeURIComponent(
            'https://freepikpsd.com/wp-content/uploads/2019/10/default-profile-image-png-1-Transparent-Images.png'
          )}`}
          alt="profileImage"
        />
        {session.user.username}
      {/if}
    </div>
    <div class="">
      <Button color="blue" on:click={() => (newItem = true)}>new item</Button>
    </div>
  </div>
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
