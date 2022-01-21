'use strict';

const GeneratorClassName = require('./index');

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
    generator = new GeneratorClassName(['a', 'b', 'c', 'd']);
  });

  // afterEach(() => {
  //   generator = new GeneratorClassName(['a', 'b', 'c', 'd']);
  // });

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
    const generator = new GeneratorClassName('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789').except(['ga']);
    while (i) {
      list.push(generator.next());
      i--;
    }
    expect(list).toBeDistinct();
    expect(list).not.toEqual(expect.arrayContaining(['ga']));
  });


});