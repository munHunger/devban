import mongo from '$lib/mongo';
import { logger } from '$lib/logger';
import auth from 'munhunger-auth-api';

export const devbanHost = process.env['DEVBAN_HOST'] || 'http://localhost:3000';
export const jwtSecret = process.env['JWT_SECRET'] || 'secret';
export const authServiceName = (process.env['DEVBAN_HOST'] && 'devban') || 'devban-dev';
export class Config {
  static version: number = 1;

  authSecret: AuthConfig;

  item: ItemConfig;

  constructor(config: Config) {
    Object.assign(this, config);
  }

  public static async setAuthSecret(db, auth) {
    logger.info('registering service secret');
    await mongo
      .resolveCollection(db, 'config')
      .then((collection) =>
        collection.updateOne({ name: 'auth' }, { $set: { authSecret: auth } }, { upsert: true })
      );
  }
  public static async readConfig(db): Promise<Config> {
    logger.info('reading config');
    return mongo.resolveCollection(db, 'config').then(async (collection) => {
      let itemConfig = await collection.findOne({ name: 'item' }, { projection: { _id: 0 } });
      if (!itemConfig) {
        logger.info('item configuration did not exist');
        await Config.createConfig(db);
        return this.readConfig(db);
      }
      let authSecret = await collection.findOne({ name: 'auth' });
      if (!authSecret) {
        logger.info('auth secret did not exist');
        let newAuth = await auth.registerService(authServiceName, devbanHost + '/auth');
        await Config.setAuthSecret(db, newAuth);
        return this.readConfig(db);
      }
      return new Config({ item: itemConfig, authSecret: authSecret } as any);
    });
  }
  private static async createConfig(db) {
    logger.info('creating configuration');
    mongo.resolveCollection(db, 'config').then(async (collection) => {
      await collection.updateOne(
        {
          name: 'item'
        },
        {
          $set: {
            version: Config.version
          }
        },
        { upsert: true }
      );
    });
  }
}

export class AuthConfig {
  authSecret: string;
}

export class ItemConfig {
  version: number;
}
