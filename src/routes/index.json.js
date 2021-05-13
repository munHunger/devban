import mongo from '$lib/mongo';
import { logger } from '$lib/logger';

async function getBoard(name) {
	return await mongo.collection(name, 'board').then((collection) =>
		collection.findOne({
			name: 'active'
		})
	);
}

export const get = async (page) => {
	let name = 'devban';
	logger.info(`fetching list=${name}`);
	let board = await getBoard(name);
	if (!board) {
		await mongo.collection(name, 'board').then((collection) =>
			collection.updateOne(
				{
					name: 'active'
				},
				{
					$set: {
						status: {
							'to-do': {
								color: 'blue',
								items: [
									{ id: 1, title: 'Add new items' },
									{ id: 2, title: 'Add new statuses' },
									{ id: 3, title: 'Make card moveable' },
									{ id: 4, title: 'Add assignee' }
								]
							},
							'in progress': {
								color: 'pink',
								items: [
									{ id: 5, title: 'List all cards' },
									{ id: 6, title: 'make it pretty' },
									{ id: 7, title: 'set different colors on statuses' }
								]
							},
							done: {
								color: 'green',
								items: []
							}
						}
					}
				},
				{ upsert: true }
			)
		);
		board = await getBoard(name);
	}
	return {
		body: board
	};
};
