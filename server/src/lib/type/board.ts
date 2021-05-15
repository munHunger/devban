import type { Item } from './item';

export class Board {
	name: string;
	status: any;

	constructor(data: any) {
		if (data) {
			Object.assign(this, data);
		}
	}

	getStatuses(): Array<string> {
		return Object.keys(this.status);
	}

	getStatusList(status: string): StatusList {
		return this.status[status];
	}
}

export class StatusList {
	color: string;
	items: Array<Item>;
}
