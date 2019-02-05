/*
*
* SQLite database cell representation
* Karolinska Institutet, 2019
*
* Matthias Stahl
*/

/* eslint-disable no-underscore-dangle */
import b from './binary_utils';
import PageHeader from './PageHeader';

const maxVarInt = 9 + 1;
const pagePointerLength = 4;

const Cell = class {
  constructor(byteArray, type) {
    this._cur = 0;
    this._type = type;
    this._byteArray = byteArray;
    this._colTypes = [];
    this.parseCell();
  }

  parseCell() {
    switch (this._type) {
      case PageHeader.TYPE.INTERIOR_INDEX:
      case PageHeader.TYPE.INTERIOR_TABLE:
        this.getLeftPagePointer()
          .getKey();
        break;
      case PageHeader.TYPE.LEAF_INDEX:
      case PageHeader.TYPE.LEAF_TABLE:
        this.getPayloadLength()
          .getRowId()
          .getPayloadHeaderLength()
          .getPayloadHeader()
          .getPayload();
        break;
      default:
    }
  }

  getPayload() {
    this._payload = this._colTypes.map((colType) => {
      let res = null;
      switch (colType) {
        case 0: {
          this._cur += 1;
          break;
        }
        case 1:
        case 2:
        case 3:
        case 4: {
          res = b.intFromHexArray(this._byteArray.slice(this._cur, this._cur + colType));
          this._cur += colType;
          break;
        }
        case 5: {
          res = b.intFromHexArray(this._byteArray.slice(this._cur, this._cur + 6));
          this._cur += 6;
          break;
        }
        case 6: {
          res = b.intFromHexArray(this._byteArray.slice(this._cur, this._cur + 8));
          this._cur += 8;
          break;
        }
        case 7: {
          res = b.floatFromHexArray(this._byteArray.slice(this._cur, this._cur + 8));
          this._cur += 8;
          break;
        }
        case 8: {
          res = 0;
          break;
        }
        case 9: {
          res = 1;
          break;
        }
        case 10:
        case 11: {
          throw new Error('Internal use columns detected!');
        }
        default: {
          if (colType % 2 === 0) {
            const length = (colType - 12) / 2;
            if (length === 0) {
              throw new Error('BLOB field with size 0!');
            }
            throw new Error('BLOB reading not supported, yet!');
          } else {
            const length = (colType - 13) / 2;
            if (length === 0) {
              throw new Error('String field with size 0!');
            }
            res = b.strFromHexArray(this._byteArray.slice(this._cur, this._cur + length));
            this._cur += length;
            break;
          }
        }
      }
      return res;
    });
  }

  getPayloadHeader() {
    const numCols = this._payloadHeaderLength - this._payloadHeaderLengthSize;
    for (let i = 0; i < numCols;) {
      let colType = 0;
      let length = 0;
      [colType, length] = b.readVarInt(
        this._byteArray.slice(this._cur, this._cur + maxVarInt),
      );
      this._colTypes.push(colType);
      this._cur += length;
      i += length;
    }
    return this;
  }

  getPayloadHeaderLength() {
    [this._payloadHeaderLength, this._payloadHeaderLengthSize] = b.readVarInt(
      this._byteArray.slice(this._cur, this._cur + maxVarInt),
    );
    this._cur += this._payloadHeaderLengthSize;
    return this;
  }

  getLeftPagePointer() {
    this._leftPagePointer = b.intFromHexArray(
      this._byteArray.slice(this._cur, this._cur + pagePointerLength),
    );
    this._cur += pagePointerLength;
    return this;
  }

  getKey() {
    let length = 0;
    [this._key, length] = b.readVarInt(
      this._byteArray.slice(this._cur, this._cur + maxVarInt),
    );
    this._cur += length;
    return this;
  }

  getPayloadLength() {
    let length = 0;
    [this._payloadLength, length] = b.readVarInt(
      this._byteArray.slice(this._cur, this._cur + maxVarInt),
    );
    this._cur += length;
    return this;
  }

  getRowId() {
    let length = 0;
    [this._rowId, length] = b.readVarInt(
      this._byteArray.slice(this._cur, this._cur + maxVarInt),
    );
    this._cur += length;
    return this;
  }

  get rowId() {
    return this._rowId;
  }

  get leftPointer() {
    return this._leftPagePointer;
  }

  get payload() {
    return this._payload;
  }
};

export default Cell;
