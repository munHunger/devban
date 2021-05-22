import { Event } from '../event';
import { User } from '../user';

export abstract class Item {
  id: string;
  title: string;
  description: string;
  labels: Array<string>;
  status: string;
  events: Array<Event>;

  addEvent(event: Event) {
    this.events = this.events.concat([event]);
  }

  inititalizeNew() {
    this.events = [
      new Event({
        actor: User.getDevbanServiceAccount(),
        description: 'Created item'
      } as Event)
    ];
  }

  diff(other: Item) {
    let diff = {} as any;
    ['title', 'description', 'status'].forEach((key) => {
      diff[key] = this.diffKey(key, other);
    });
    return diff;
  }
  private diffKey(key: string, other: Item) {
    if (this[key] !== other[key]) return { a: this[key], b: other[key] };
  }
}
