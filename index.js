'use strict';

module.exports = class Generator {
  /**
   *
   * @param {[string || string[]]} alphabet - ['a', 'b', 'c', 'd'] || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
   * @param {{ [prefix]: string; [notStartsWith]: string[]; }} prefix - something prefix for indentifier, notStartsWith - identifier can't starts with this symbols from alphabet
   */
  constructor(alphabet, { prefix, notStartsWith } = {}) {
    if (!alphabet) {
      alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (typeof alphabet === 'string') {
      alphabet = alphabet.split('');
    }

    this._prefix = prefix ?? '';

    if (typeof notStartsWith === 'string') {
      notStartsWith = notStartsWith.split('');
    }

    this._not_starts_with = new Set(notStartsWith ?? []);

    this._link_list = new Link_list(alphabet.map(el => el+''));

    if (this._not_starts_with.size) {
      this._add_decorator_for_link_list();
    }

    this._curr = [];
    this._pos = 0;

    this._except = new Set();
    this._cache = {};
  }

  except(except) {
    this._except = new Set(except);
    return this;
  }

  next() {
    if (this._except.size) {
      let result;
      do {
        result = this._next();
      } while (this._except.has(result));
      return this._prefix+result;
    } else {
      return this._prefix + this._next();
    }
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
      const pos = this._find_pos();
      // Not found higher digit of number which has next value therefore we add new letter
      if (pos === null) {
        this._add_letter();
        return this._to_str();
      }
      this._curr.forEach((_, i) => {
        if (i <= pos) { return; }
        this._curr[i] = link_list.get_head();
      });

      this._curr[pos] = link_list.next(this._curr[pos]);
      this._pos = this._curr.length - 1;
      return this._to_str();
    } else {
      this._add_letter();
      return this._to_str();
    }
  }


  _add_letter() {
    const link_list = this._link_list;
    const head_el = link_list.get_head();
    this._curr.unshift(head_el);
    this._curr.forEach((el, i) => {
      if (i === 0) {
        return;
      }
      this._curr[i] = head_el;
    });
    this._pos = this._curr.length - 1;
  }

  /**
   * _find_pos - This method for finding higher digit of number which one has next value from alphabet
   * @returns null | number
   */
  _find_pos() {
    let pos = this._pos;
    while (pos >= 0) {
      const val = this._curr[pos];
      if (this._link_list.has_next(val)) {
        return pos;
      }
      pos--;
      // This statement is very important for correct work in situation when "notStartsWith" is used
      this._pos = pos;
    }
    return null;
  }

  /**
   * add_decorator_for_link_list - if you define "notStartsWith" when call constructor then you must call this method
   * This method will decorated methods "hasNext" and "next" of "link_list" in order to  exclude situation when identifier starts with symbols from list "notStartsWith"
   */
  _add_decorator_for_link_list() {
    const me = this;

    const has_next = me._link_list.has_next.bind(me._link_list);
    me._link_list.has_next = function (el) {
      if (me._pos === 0) {
        if (!has_next(el)) {
          return false;
        }

        let temp = el;
        do {
          const value = me._link_list.get_next(temp);
          if (value === null) {
            return false;
          }
          temp = value;
        } while (me._not_starts_with.has(temp));
        return true;
      } else {
        return has_next(el);
      }
    };

    const next = me._link_list.next.bind(me._link_list);
    me._link_list.next = function (el) {
      if (me._pos === 0) {
        let value = el;
        do {
          // eslint-disable-next-line callback-return
          value = next(value);
        } while (me._not_starts_with.has(value));
        return value;
      } else {
        return next(el);
      }
    };
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

  get_next(el) {
    return this._hash[el];
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
