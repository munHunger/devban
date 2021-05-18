export function getBG(color, border = false) {
  switch (color) {
    case 'pink':
      return border ? 'border-pink-700' : 'bg-pink-500';
    case 'blue':
      return border ? 'border-blue-700' : 'bg-blue-500';
    case 'green':
      return border ? 'border-green-700' : 'bg-green-500';
    case 'red':
      return border ? 'border-red-700' : 'bg-red-500';
    default:
      break;
  }
}

export default { getBG };
