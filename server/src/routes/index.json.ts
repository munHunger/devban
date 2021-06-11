import mongo from '$lib/mongo';
import { logger } from '$lib/logger';
import type { Item } from '$lib/type/item/item';
import { ItemBackend } from '$lib/type/item/itemBackend';
import { Config } from '$lib/type/config';

async function getBoard(name) {
  return await mongo.collection(name, 'board').then((collection) =>
    collection.findOne({
      name: 'active'
    })
  );
}

export const get = async (req) => {
  let name = 'devban';
  let db = await mongo.db(name);
  Config.readConfig(db);
  logger.info(`fetching list`, { name });
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
    await ItemBackend.init(db);
    board = await getBoard(name);
  }
  await Promise.all(
    Object.keys(board.status)
      .filter((status) => board.status[status].items.length > 0)
      .map(async (status) => {
        board.status[status].items = await ItemBackend.getMany(db, board.status[status].items);
      })
  );
  return {
    body: board
  };
};
