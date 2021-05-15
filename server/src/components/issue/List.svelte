<script>
	import { getBG } from '$lib/colors';
	import { board } from '$lib/data';
	import client from '$lib/client';
	export let title, color;

	$: bg = getBG(color);

	function handleDragDrop(e) {
		e.preventDefault();
		var item = JSON.parse(e.dataTransfer.getData('item'));
		console.log(item);
		console.log('You droped ' + item.id + ' into drop zone');
		client.updateStatus(item, title);
		console.log($board);
	}
</script>

<div class="relative my-2" on:drop={handleDragDrop} ondragover="return false">
	<div class="{bg} inline-block px-2 text-white rounded-t-md">{title}</div>
	<div class="{bg} h-full top-0 absolute w-2 rounded-bl-md rounded-t-md" />
	<div class="pl-1 z-10 relative">
		<slot />
	</div>
</div>
