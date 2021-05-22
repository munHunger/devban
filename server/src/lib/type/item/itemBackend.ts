import mongo from '$lib/mongo';
import { logger } from '$lib/logger';
import { Item } from './item';

export class ItemBackend extends Item {
  constructor(data: Item) {
    super();
    Object.assign(this, data);
  }

  async save(db) {
    if (!this.id) {
      this.id = await ItemBackend.getID(db);
      this.inititalizeNew();
    }
    logger.info(`saving item id=${this.id}`);
    return mongo
      .resolveCollection(db, 'items')
      .then((collection) =>
        collection.updateOne({ id: this.id }, { $set: this }, { upsert: true })
      );
  }

  static async getSingle(db, id: string): Promise<ItemBackend> {
    return mongo
      .resolveCollection(db, 'items')
      .then(
        async (collection) =>
          new ItemBackend(await collection.findOne({ id }, { projection: { _id: 0 } }))
      );
  }

  static async getMany(db, id: Array<string>) {
    return mongo
      .resolveCollection(db, 'items')
      .then((collection) =>
        collection.find({ id: { $in: id } }, { projection: { _id: 0 } }).toArray()
      );
  }

  static async init(db) {
    return mongo.resolveCollection(db, 'counters').then((collection) => {
      this.createCounter(collection);
    });
  }

  private static async getID(db) {
    logger.info('generating a new item ID');
    return mongo
      .resolveCollection(db, 'counters')
      .then((collection) =>
        collection.findAndModify({ name: 'item' }, {}, { $inc: { counter: 1 } }, { new: true })
      )
      .then((data) => data.value.counter);
  }

  private static async createCounter(collection) {
    collection.updateOne(
      {
        name: 'item'
      },
      {
        $set: {
          counter: 1
        }
      },
      { upsert: true }
    );
  }
}
