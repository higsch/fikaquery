/*
*
* SQLite database page representation
* Karolinska Institutet, 2019
*
*/

/* eslint-disable no-underscore-dangle */
import Header from './Header';
import PageHeader from './PageHeader';
import Cell from './Cell';
import b from './binary_utils';

const pos = {
  header: [0, 12],
};

const Page = class {
  constructor(pageNumber, byteArray) {
    this._pageNumber = pageNumber;
    this._isRoot = (pageNumber === 1);
    this._offset = (this._isRoot) ? Header.length : 0;
    this._byteArray = byteArray.slice(this._offset, byteArray.length);
    this._header = new PageHeader(this._byteArray.slice(...pos.header));

    this._cellPointerArray = [];
    this._cells = [];
    this.loadCells();
  }

  get raw() {
    return this._byteArray;
  }

  get number() {
    return this._pageNumber;
  }

  get header() {
    return this._header;
  }

  loadCells() {
    // determine cell pointer array
    const { numCells, headerSize } = this.header;
    const cellPointerBytes = this._byteArray.slice(headerSize, headerSize + numCells * 2);
    cellPointerBytes.forEach((byte, index, arr) => {
      if (index % 2 === 0) {
        this._cellPointerArray.push(b.intFromHexArray(arr.slice(index, index + 2)));
      }
    });

    // create cells
    this._cells = this._cellPointerArray.map(
      pointer => (new Cell(pointer - this._offset, this._byteArray, this.header.type)),
    );
  }
};

export default Page;
