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
  constructor(pointer, byteArray, type) {
    this._pointer = pointer;
    this._cursor = 0;
    this._type = type;
    this._byteArray = byteArray;

    switch (this._type) {
      case PageHeader.TYPE.INTERIOR_INDEX:
      case PageHeader.TYPE.INTERIOR_TABLE:
        this.getLeftPagePointer();
        this.getKey();
        break;
      case PageHeader.TYPE.LEAF_INDEX:
      case PageHeader.TYPE.LEAF_TABLE:
        this.getPayloadLength();
        this.getRowId();
        break;
      default:
    }
  }

  getLeftPagePointer() {
    this._leftPagePointer = b.intFromHexArray(
      this._byteArray.slice(this._pointer, this._pointer + pagePointerLength),
    );
    this.updatePointer(pagePointerLength);
  }

  getKey() {
    [this._key, this._cursor] = b.readVarInt(
      this._byteArray.slice(this._pointer, this._pointer + maxVarInt),
    );
    this.updatePointer();
  }

  getPayloadLength() {
    [this._payloadLength, this._cursor] = b.readVarInt(
      this._byteArray.slice(this._pointer, this._pointer + maxVarInt),
    );
    this.updatePointer();
  }

  getRowId() {
    [this._rowId, this._cursor] = b.readVarInt(
      this._byteArray.slice(this._pointer, this._pointer + maxVarInt),
    );
    this.updatePointer();
  }

  updatePointer(cursor = this._cursor) {
    this._pointer += cursor;
  }
};

export default Cell;
