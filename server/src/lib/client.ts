import { board } from './data';
import type { Item } from './type/item';

export function updateStatus(item: Item, newStatus: string) {
	window
		.fetch('/item.json', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				item,
				newStatus
			})
		})
		.then((data) => {
			console.log(data);
		});
	board.update((b) => {
		Object.keys(b.status)
			.map((key) => b.status[key])
			.forEach((status) => {
				status.items = status.items.filter((i) => i.id != item.id);
			});
		b.status[newStatus].items.push(item);
		return b;
	});
}

export default {
	updateStatus
};
