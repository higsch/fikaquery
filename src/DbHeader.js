/* eslint-disable no-underscore-dangle */
import b from './binary_utils';

const start = 0;
const length = 100;

// [offset, end + 1]
const pos = {
  headerString: [0, 17],
  pageSize: [16, 18],
  fileChangeCounter: [24, 28],
  numPages: [28, 32],
  version: [96, 100],
};

const DbHeader = class {
  static get start() {
    return start;
  }

  static get length() {
    return length;
  }

  constructor(byteArray) {
    this._pageSize = b.intFromHexArray(byteArray.slice(...pos.pageSize));
  }

  get pageSize() {
    return this._pageSize;
  }
};

export default DbHeader;
