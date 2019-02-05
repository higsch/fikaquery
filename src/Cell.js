/*
*
* SQLite database cell representation
* Karolinska Institutet, 2019
*
*/

/* eslint-disable no-underscore-dangle */
import b from './binary_utils';
import PageHeader from './PageHeader';

const maxVarInt = 9 + 1;
const pagePointerLength = 4;

const Cell = class {
  constructor(byteArray, type) {
    this._offset = 0;
    this._byteArray = byteArray;
    this._cols = [];

    switch (type) {
      case PageHeader.TYPE.INTERIOR_INDEX:
      case PageHeader.TYPE.INTERIOR_TABLE:
        this.getLeftPagePointer(this._offset)
          .then(cur => this.getKey(cur))
          .then(cur => this.updateOffset(cur));
        break;
      case PageHeader.TYPE.LEAF_INDEX:
      case PageHeader.TYPE.LEAF_TABLE:
        this.getPayloadLength(this._offset)
          .then(cur => this.getRowId(cur))
          .then(cur => this.getPayloadHeaderLength(cur))
          .then(cur => this.getPayloadHeader(cur))
          .then(cur => this.updateOffset(cur));
        break;
      default:
    }
  }

  updateOffset(cur) {
    this._offset += cur;
  }

  getPayloadHeader(cur) {
    return new Promise((resolve) => {
      let totalCur = cur;
      const numCols = this._payloadHeaderLength - this._payloadHeaderLengthSize;
      for (let i = 0; i < numCols;) {
        let colType = 0;
        let length = 0;
        [colType, length] = b.readVarInt(
          this._byteArray.slice(totalCur, totalCur + maxVarInt),
        );
        this._cols.push(colType);
        totalCur += length;
        i += length;
      }
      resolve(totalCur);
    });
  }

  getPayloadHeaderLength(cur) {
    return new Promise((resolve) => {
      [this._payloadHeaderLength, this._payloadHeaderLengthSize] = b.readVarInt(
        this._byteArray.slice(cur, cur + maxVarInt),
      );
      resolve(cur + this._payloadHeaderLengthSize);
    });
  }

  getLeftPagePointer(cur) {
    return new Promise((resolve) => {
      this._leftPagePointer = b.intFromHexArray(
        this._byteArray.slice(cur, cur + pagePointerLength),
      );
      resolve(cur + pagePointerLength);
    });
  }

  getKey(cur) {
    return new Promise((resolve) => {
      let length = 0;
      [this._key, length] = b.readVarInt(
        this._byteArray.slice(cur, cur + maxVarInt),
      );
      resolve(cur + length);
    });
  }

  getPayloadLength(cur) {
    return new Promise((resolve) => {
      let length = 0;
      [this._payloadLength, length] = b.readVarInt(
        this._byteArray.slice(cur, cur + maxVarInt),
      );
      resolve(cur + length);
    });
  }

  getRowId(cur) {
    return new Promise((resolve) => {
      let length = 0;
      [this._rowId, length] = b.readVarInt(
        this._byteArray.slice(cur, cur + maxVarInt),
      );
      resolve(cur + length);
    });
  }

  get rowId() {
    return this._rowId;
  }

  get leftPointer() {
    return this._leftPagePointer;
  }
};

export default Cell;
