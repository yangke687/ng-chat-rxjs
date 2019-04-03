export function uuid () {
  let random;
  let result = '';

  for (let i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;  // tslint:disable-line
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      result += '-';
    }
    result += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16); // tslint:disable-line
  }
  return result;
}
