/*
*
* SQLite database page header representation
* Karolinska Institutet, 2019
*
* Matthias Stahl
*/

/* eslint-disable no-underscore-dangle */
import b from './binary_utils';

// db pages can have different types
const TYPE = {
  INTERIOR_INDEX: 0x02,
  INTERIOR_TABLE: 0x05,
  LEAF_INDEX: 0x0a,
  LEAF_TABLE: 0x0d,
};

// the header has fixed info byte positions
const pos = {
  type: [0, 1],
  firstFreeBlock: [1, 3],
  numCells: [3, 5],
  startCellContentArea: [5, 7],
  numFragmentedFreeBytes: [7, 8],
  rightMostPointer: [8, 12], // only in interior pages
};

const PageHeader = class {
  static get TYPE() {
    return TYPE;
  }

  // just build the thing
  constructor(byteArray) {
    this._type = b.intFromHexArray(byteArray.slice(...pos.type));
    this._firstFreeBlock = b.intFromHexArray(byteArray.slice(...pos.firstFreeBlock));
    this._numCells = b.intFromHexArray(byteArray.slice(...pos.numCells));
    this._startCellContentArea = b.intFromHexArray(byteArray.slice(...pos.startCellContentArea));
    this._numFragmentedFreeBytes = b.intFromHexArray(
      byteArray.slice(...pos.numFragmentedFreeBytes),
    );
    if (this._type === TYPE.INTERIOR_INDEX || this._type === TYPE.INTERIOR_TABLE) {
      this._rightMostPointer = b.intFromHexArray(byteArray.slice(...pos.rightMostPointer));
      [, this._size] = pos.rightMostPointer;
    } else {
      [, this._size] = pos.numFragmentedFreeBytes;
    }
  }

  get type() {
    return this._type;
  }

  get numCells() {
    return this._numCells;
  }

  get headerSize() {
    return this._size;
  }

  get startCellContentArea() {
    return this._startCellContentArea;
  }

  get rightMostPointer() {
    return this._rightMostPointer;
  }
};

export default PageHeader;
