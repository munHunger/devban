import { board } from '$lib/data';
import type { Client } from '$lib/client';
import { Item } from './item';
import pino from 'pino';
const logger = pino({
  browser: {
    write: (o) => {
      console.log(o);
    }
  }
});

export class ItemFrontend extends Item {
  constructor(data: Item) {
    super();
    Object.assign(this, data);
  }

  async save(client: Client) {
    logger.child({ item: this }).info('saving item');
    await client.put(`/item/${this.id}.json`, this).then((res) => {
      if (res.status === 204) logger.child({ item: this, res }).info('saved');
      else logger.child({ item: this, res }).error('error saving');
    });
  }

  async updateStatus(client: Client, status: string) {
    logger.child({ item: this, status }).info('updating status');
    await client
      .put('/item.json', {
        action: 'updateStatus',
        id: this.id,
        newStatus: status
      })
      .then(() => {
        this.status = status;

        board.update((b) => {
          Object.keys(b.status)
            .map((key) => b.status[key])
            .forEach((status) => {
              status.items = status.items.filter((i) => i.id != this.id);
            });
          b.status[status].items.push(this);
          return b;
        });
      });
  }
}
