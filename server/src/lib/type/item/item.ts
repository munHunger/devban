import type { Event } from '../event';

export abstract class Item {
  id: string;
  title: string;
  description: string;
  labels: Array<string>;
  status: string;
  events: Array<Event>;
}
