import type { User } from './user';

export class Event {
  actor: User;
  timestamp: number;
  description: string;
  metadata: any;

  constructor(event: Event) {
    Object.assign(this, event);
    if (!this.timestamp) this.timestamp = Date.now();
  }
}
