'use strict';

module.exports = class GeneratorClassName {
  /**
   *
   * @param {[string || string[]]} alphabet - ['a', 'b', 'c', 'd'] || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
   * @param {[string]} prefix - something prefix
   */
  constructor(alphabet, prefix) {
    if (!alphabet) {
      alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (typeof alphabet === 'string') {
      alphabet = alphabet.split('');
    }

    this._prefix = prefix ?? '';

    this._link_list = new Link_list(alphabet.map(el => el+''));
    this._curr = [];
    this._pos = 0;

    this._except = new Set([]);
    this._cache = {};
  }

  next() {
    let result;
    do {
      result = this._next();
    } while (this._except.has(result));
    return this._prefix+result;
  }

  getFor(key) {
    const result = this._cache[key];
    if (result) {
      return result;
    }
    return this._cache[key] = this.next();
  }

  _next() {
    const link_list = this._link_list;

    const value = this._curr[this._pos];
    if (link_list.has_next(value)) {
      this._curr[this._pos] = link_list.next(value);
      return this._to_str();
    } else if (!link_list.has_next(value) && this._curr[this._pos - 1]) { // if current letter is last in alphabet, but you have another digit
      const pos = this._findPos();
      if (pos === null) { // all letter
        this._addLetter();
        return this._to_str();
      }
      this._curr.forEach((_, i) => {
        if (i <= pos) { return; }
        this._curr[i] = link_list.get_head();
      });
      // set next letter
      this._curr[pos] = link_list.next(this._curr[pos]);
      this._pos = this._curr.length - 1;
      return this._to_str();
    } else {
      this._addLetter();
      return this._to_str();
    }
  }

  except(except) {
    this._except = new Set(except);
    return this;
  }

  _addLetter() {
    const link_list = this._link_list;
    this._curr.unshift(link_list.get_head());
    this._curr.forEach((el, i) => {
      if (i === 0) {
        return;
      }
      this._curr[i] = link_list.get_head();
    });
    this._pos = this._curr.length - 1;
    // console.log('[end]: ', this._to_str(), this._pos);
  }

  _findPos() {
    let pos = this._pos;
    while (pos >= 0) {
      const val = this._curr[pos];
      // console.log({ pos }, val, this._link_list.has_next(val));
      if (this._link_list.has_next(val)) {
        return pos;
      }
      pos--;
    }
    return null;
  }

  _to_str() {
    return this._curr.join('');
  }
};


class Link_list {
  constructor(list) {
    this._hash = {};
    list.forEach((el, i) => {
      this._hash[el] = list[i+1] || null;
    });
    this._head_el = list[0];
  }

  get_head() {
    return this._head_el;
  }

  has_next(el) {
    return Boolean(this._hash[el]);
  }

  next(el) {
    return this._hash[el];
  }
}

// const gen = new module.exports();
// let i = 100;
// const hash = {};
// while (i) {
//   // console.time('call');
//   let val = gen.get();
//   console.log(val);
//   // console.timeEnd('call');
//   if (hash[val]) {
//     throw new Error('duplicate value '+val);
//   }
//   // hash[val] = true;
//   i--;
// }
// console.log(new Link_list(['a', 'b', 'c', 'd']));


