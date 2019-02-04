/*
*
* SQLite database header representation
* Karolinska Institutet, 2019
*
*/

/* eslint-disable no-underscore-dangle */
import b from './binary_utils';

const start = 0;
const length = 100;

// [offset, end + 1]
const pos = {
  headerString: [0, 16],
  pageSize: [16, 18],
  fileChangeCounter: [24, 28],
  numPages: [28, 32],
  version: [96, 100],
};

const Header = class {
  static get start() {
    return start;
  }

  static get length() {
    return length;
  }

  constructor(byteArray) {
    this._headerString = b.strFromHexArray(byteArray.slice(...pos.headerString));
    this._pageSize = b.intFromHexArray(byteArray.slice(...pos.pageSize));
    this._fileChangeCounter = b.intFromHexArray(byteArray.slice(...pos.fileChangeCounter));
    this._numPages = b.intFromHexArray(byteArray.slice(...pos.numPages));
    const intVersion = b.intFromHexArray(byteArray.slice(...pos.version)).toString();
    this._version = `${intVersion.slice(0, 1)}.${intVersion.slice(1, 4)}.${intVersion.slice(4, 7)}`;
  }

  get headerString() {
    return this._headerString;
  }

  get pageSize() {
    return this._pageSize;
  }

  get fileChangeCounter() {
    return this._fileChangeCounter;
  }

  get numPages() {
    return this._numPages;
  }

  get version() {
    return this._version;
  }
};

export default Header;
