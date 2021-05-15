import mongo from '$lib/mongo';
import { logger } from '$lib/logger';
import { Item } from '$lib/type/item';

async function getBoard(name) {
  return await mongo.collection(name, 'board').then((collection) =>
    collection.findOne({
      name: 'active'
    })
  );
}

export const get = async (page) => {
  let name = 'devban';
  let db = await mongo.db(name);
  logger.info(`fetching list=${name}`);
  let board = await getBoard(name);
  if (!board) {
    let db = await mongo.db(name);
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
                items: []
              },
              'in progress': {
                color: 'pink',
                items: []
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
    await Item.init(db);
    board = await getBoard(name);
  }
  await Promise.all(
    Object.keys(board.status)
      .filter((status) => board.status[status].items.length > 0)
      .map(async (status) => {
        board.status[status].items = await Item.getMany(db, board.status[status].items);
      })
  );
  console.log(board.status);
  return {
    body: board
  };
};
