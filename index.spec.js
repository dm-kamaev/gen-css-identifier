'use strict';

const Generator = require('./index');

expect.extend({
  toBeDistinct(received) {
    const pass = Array.isArray(received) && new Set(received).size === received.length;
    if (pass) {
      return {
        message: () => `expected [${received}] array is unique`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected [${received}] array is not to unique`,
        pass: false,
      };
    }
  },
});

describe('[GeneratorClassName.js]', function () {
  let generator;

  beforeAll(() => {
    generator = new Generator(['a', 'b', 'c', 'd']);
  });


  test.each([
    ['a'], ['b'], ['c'], ['d'],
    ['aa'], ['ab'], ['ac'], ['ad'],
    ['ba'], ['bb'], ['bc'], ['bd'],
    ['ca'], ['cb'], ['cc'], ['cd'],
    ['da'], ['db'], ['dc'], ['dd'],
    ['aaa'], ['aab'], ['aac'], ['aad'],
    ['aba'], ['abb'], ['abc'], ['abd'],
    ['aca'], ['acb'], ['acc'], ['acd'],
    ['ada'], ['adb'], ['adc'], ['add'],
    ['baa'], ['bab'], ['bac'], ['bad'],
    ['bba'], ['bbb'], ['bbc'], ['bbd'],
    ['bca'], ['bcb'], ['bcc'], ['bcd'],
    ['bda'], ['bdb'], ['bdc'], ['bdd'],
    ['caa'], ['cab'], ['cac'], ['cad'],
    ['cba'], ['cbb'], ['cbc'], ['cbd'],
    ['cca'], ['ccb'], ['ccc'], ['ccd'],
    ['cda'], ['cdb'], ['cdc'], ['cdd'],
    ['daa'], ['dab'], ['dac'], ['dad'],
    ['dba'], ['dbb'], ['dbc'], ['dbd'],
    ['dca'], ['dcb'], ['dcc'], ['dcd'],
    ['dda'], ['ddb'], ['ddc'], ['ddd'],
    ['aaaa'], ['aaab'], ['aaac'], ['aaad'],
  ])('generate', expected => {
    expect(generator.next()).toBe(expected);
  });


  it('сheck unique', async function () {
    let i = 10000000;
    const list = [];
    while (i) {
      list.push(generator.next());
      i--;
    }
    expect(list).toBeDistinct();
  });


  it('сheck unique and test except: for string constructor', async function () {
    let i = 1000000;
    const list = [];
    const generator = new Generator('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789').except(['ga']);
    while (i) {
      list.push(generator.next());
      i--;
    }
    expect(list).toBeDistinct();
    expect(list).not.toEqual(expect.arrayContaining(['ga']));
  });


  it('generate minified name by key', async function () {
    let i = 10000;
    const generator = new Generator('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
    const result = generator.getFor('key');
    while (i) {
      generator.next();
      i--;
    }
    expect(result).toEqual(generator.getFor('key'));
  });

  it('set prefix', async function () {
    let i = 1000000;
    const list = [];
    const prefix = 'prefix-';
    const generator = new Generator('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', { prefix }).except(['ga']);
    while (i) {
      list.push(generator.next());
      i--;
    }
    expect(list).toBeDistinct();
    expect(list).not.toEqual(expect.arrayContaining(['ga']));
    list.forEach(el => expect(el.startsWith(prefix)).toBeTruthy());
  });


  it('not starts with: as array', async function () {
    let i = 1000000;
    const list = [];
    const generator = new Generator('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', { notStartsWith: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] });
    // const generator = new Generator('ab0123456789', { notStartsWith: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] });
    const not_start_with_digit = /^\d+/;
    while (i) {
      const value = generator.next();
      expect(value).not.toMatch(not_start_with_digit);
      list.push(value);
      i--;
    }
    // console.log(JSON.stringify(list, null, 2));
    expect(list).toBeDistinct();
  });

  it('not starts with: as string', async function () {
    let i = 1000;
    const list = [];
    const generator = new Generator('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', { notStartsWith: '0123456789' });
    const not_start_with_digit = /^\d+/;
    while (i) {
      const value = generator.next();
      expect(value).not.toMatch(not_start_with_digit);
      list.push(value);
      i--;
    }
    // console.log(JSON.stringify(list, null, 2));
    expect(list).toBeDistinct();
  });


});