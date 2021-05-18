import type { User } from './user';

export class Event {
  actor: User;
  timestamp: Date;
  description: string;
}
