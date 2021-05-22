import mongo from '$lib/mongo';
import { logger } from '$lib/logger';
import type { Item } from '$lib/type/item/item';
import { ItemBackend } from '$lib/type/item/itemBackend';
import { User } from '$lib/type/user';
import { Event } from '$lib/type/event';

let name = 'devban';
async function getBoard(name) {
  return await mongo.collection(name, 'board').then((collection) =>
    collection.findOne({
      name: 'active'
    })
  );
}
export let put = async (req) => {
  let db = await mongo.db(name);
  let body = req.body;

  let board = await getBoard(name);
  let oldStatus = Object.keys(board.status).find((status) =>
    board.status[status].items.find((item) => item === body.id)
  );
  logger.info(
    `updating item=${body.id}, setting status='${body.newStatus}' from oldStatus='${oldStatus}'`
  );
  let push = {};
  push[`status.${body.newStatus}.items`] = body.id;
  let pull = {};
  pull[`status.${oldStatus}.items`] = body.id;

  let item = await ItemBackend.getSingle(db, body.id);
  item.addEvent(
    new Event({
      actor: new User({
        name: 'munhunger',
        serviceAccount: false
      }),
      description: 'moved item',
      metadata: { status: { a: oldStatus, b: body.newStatus } }
    } as Event)
  );

  await item.save(db);

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

export let post = async (req) => {
  let body = req.body;
  let db = await mongo.db(name);
  let item = new ItemBackend(body as Item);
  await item.save(db);
  let push = {};
  push[`status.${item.status}.items`] = item.id;
  await mongo.collection(name, 'board').then((collection) =>
    collection.updateOne(
      {
        name: 'active'
      },
      {
        $push: { ...push }
      }
    )
  );
  return {
    status: 204
  };
};
