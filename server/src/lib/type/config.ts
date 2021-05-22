import mongo from '$lib/mongo';
import { logger } from '$lib/logger';
export class Config {
  static version: number = 1;

  item: ItemConfig;

  constructor(config: Config) {
    Object.assign(this, config);
  }

  public static async readConfig(db) {
    return mongo.resolveCollection(db, 'config').then(async (collection) => {
      let itemConfig = await collection.findOne({ name: 'item' }, { projection: { _id: 0 } });
      if (!itemConfig) {
        await Config.createConfig(db);
        return this.readConfig(db);
      }
      return new Config(itemConfig);
    });
  }
  private static async createConfig(db) {
    mongo.resolveCollection(db, 'config').then((collection) =>
      collection.updateOne(
        {
          name: 'item'
        },
        {
          $set: {
            version: Config.version
          }
        },
        { upsert: true }
      )
    );
  }
}

export class ItemConfig {
  version: number;
}
