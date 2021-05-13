import mongo from '$lib/mongo';
import { logger } from '$lib/logger';
let name = 'devban';
async function getBoard(name) {
	return await mongo.collection(name, 'board').then((collection) =>
		collection.findOne({
			name: 'active'
		})
	);
}
export let put = async (req) => {
	let body = req.body;

	let board = await getBoard(name);
	let oldStatus = Object.keys(board.status).find((status) =>
		board.status[status].items.find((item) => item.id === body.item.id)
	);
	logger.info(
		`updating item=${body.item.id}, setting status='${body.newStatus}' from oldStatus='${oldStatus}'`
	);
	let push = {};
	push[`status.${body.newStatus}.items`] = body.item;
	let pull = {};
	pull[`status.${oldStatus}.items`] = body.item;

	await mongo.collection(name, 'board').then((collection) =>
		collection.updateOne(
			{
				name: 'active'
			},
			{
				$push: { ...push },
				$pull: { ...pull }
			}
		)
	);
	return {
		status: 204
	};
};
