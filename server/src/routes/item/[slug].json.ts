import mongo from '$lib/mongo';
import { logger } from '$lib/logger';
import type { Item } from '$lib/type/item/item';
import { ItemBackend } from '$lib/type/item/itemBackend';

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
  let db = await mongo.db(name);

  let item = new ItemBackend(body);
  console.log(body);
  let old = ItemBackend.getSingle(db, item.id);
  logger.info(`updating item=${item.id}`);
  console.log(item);
  item.save(db);
  return {
    status: 204
  };
};
