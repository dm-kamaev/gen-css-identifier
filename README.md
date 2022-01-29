# Generation css identifier

[![Actions Status](https://github.com/dm-kamaev/gen-css-identifier/workflows/Build/badge.svg)](https://github.com/dm-kamaev/gen-css-identifier/actions)

Library for generation short and unique identifiers: class name or id. This package is allow can generation unlimited number of identifier with minimal costs of CPU. Length of identifier dependent of size alphabet. The more characters there are in the alphabet, the longer the identifier will remain the shortest.

This package is used in framework for creation [Server HTML Components](https://www.npmjs.com/package/@ignis-web/server-component)

### Install
```sh
npm i @ignis-web/gen-css-identifier -S
```

### How use

Generation class name of css:
```js
const GenCssIdentifier = require('@ignis-web/gen-css-identifier');

// by default, alphabet is 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
// this is characters safe  for generation class name of css
const genClassName = new GenCssIdentifier();

genClassName.next(); // a
genClassName.next(); // b
...
genClassName.next(); // aaad
```

You can set custom alphabet:
```js
const GenCssIdentifier = require('@ignis-web/gen-css-identifier');

const genClassName = new GenCssIdentifier('abcd'); // we set alphabet

genClassName.next(); // a
genClassName.next(); // b
...
genClassName.next(); // aaad
```

You set except filter. If you want filter specific identifier.
```js
const GenCssIdentifier = require('@ignis-web/gen-css-identifier');

// generator id for html
const genId = new GenCssIdentifier('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
  .except(['ga']); // skip id for resolve conflict with code of  Google Analytics

```

### Algorithm
In algorithm of work not contain magics or difficult cryptographic methods. Library is applies the approach as in calculus systems (for example, decimal system). The next identifier equals previous plus one, but instead of digits (0...9) we use characters of alphabet.

For example, for called 20 times  "next":
```js
// Jest test-runner

const generator = new GeneratorClassName('abcd');
test.each([
  ['a'], ['b'], ['c'], ['d'],
  ['aa'], ['ab'], ['ac'], ['ad'],
  ['ba'], ['bb'], ['bc'], ['bd'],
  ['ca'], ['cb'], ['cc'], ['cd'],
  ['da'], ['db'], ['dc'], ['dd'],
])('generation', expected => {
  expect(generator.next()).toBe(expected);
});
```

### Test
```sh
npm test
```