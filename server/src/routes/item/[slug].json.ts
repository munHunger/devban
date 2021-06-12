import mongo from '$lib/mongo';
import { logger } from '$lib/logger';
import type { Item } from '$lib/type/item/item';
import { ItemBackend } from '$lib/type/item/itemBackend';
import { Event } from '$lib/type/event';
import { User } from '$lib/type/user';

let name = 'devban';
async function getBoard(name) {
  return await mongo.collection(name, 'board').then((collection) =>
    collection.findOne({
      name: 'active'
    })
  );
}
export let put = async (req) => {
  let locals = req.locals;
  let body = req.body;
  let db = await mongo.db(name);

  let item = new ItemBackend(body);
  let old = await ItemBackend.getSingle(db, item.id);
  if (!locals.authenticated) {
    logger.warn('attempted update from unauthenticated user', {
      item: { id: item.id, title: item.title }
    });
    return {
      status: 403
    };
  }
  let user = locals.user;
  logger.info(`updating item=${item.id}`, { user, item: { id: item.id } });
  item.addEvent(
    new Event({
      actor: User.fromLocals(user),
      description: 'Updated item',
      metadata: old.diff(item)
    } as Event)
  );
  item.save(db);
  return {
    status: 204
  };
};
