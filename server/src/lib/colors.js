export function getBG(color) {
	switch (color) {
		case 'pink':
			return 'bg-pink-500';
		case 'blue':
			return 'bg-blue-500';
		case 'green':
			return 'bg-green-500';
		default:
			break;
	}
}

export default { getBG };
