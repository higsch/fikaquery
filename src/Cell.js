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

// maximum byte size of a VarInt
const maxVarInt = 9 + 1;

// length of a page pointer
const pagePointerLength = 4;

const Cell = class {
  // build a cell
  constructor(byteArray, type) {
    this._cur = 0;
    this._type = type;
    this._byteArray = byteArray;
    this._colTypes = [];
    this.parseCell();
  }

  // parse the cell depending on page type
  // the cursor is running through the singe function calls
  parseCell() {
    switch (this._type) {
      case PageHeader.TYPE.INTERIOR_INDEX:
        this.getLeftPagePointer()
          .getPayloadLength()
          .getPayloadHeaderLength()
          .getPayloadHeader()
          .getPayload();
        break;
      case PageHeader.TYPE.INTERIOR_TABLE:
        this.getLeftPagePointer()
          .getKey();
        break;
      case PageHeader.TYPE.LEAF_INDEX:
        this.getPayloadLength()
          .getPayloadHeaderLength()
          .getPayloadHeader()
          .getPayload();
        break;
      case PageHeader.TYPE.LEAF_TABLE:
        this.getPayloadLength()
          .getRowId()
          .getPayloadHeaderLength()
          .getPayloadHeader()
          .getPayload();
        break;
      default:
    }

    // kick out raw data, when done
    delete this._byteArray;
  }

  // retrieve the payload based on information from the payload header
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

  // fetch the VarInts of the payload header
  getPayloadHeader() {
    // the number of total columns in a cell
    // is dependent on the payload header length and the length byte
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

  // retrieve the length of the payload header
  // this is later used to parse the payload header
  getPayloadHeaderLength() {
    [this._payloadHeaderLength, this._payloadHeaderLengthSize] = b.readVarInt(
      this._byteArray.slice(this._cur, this._cur + maxVarInt),
    );
    this._cur += this._payloadHeaderLengthSize;
    return this;
  }

  // the pointer left to the key
  getLeftPagePointer() {
    this._leftPagePointer = b.intFromHexArray(
      this._byteArray.slice(this._cur, this._cur + pagePointerLength),
    );
    this._cur += pagePointerLength;
    return this;
  }

  // the key
  getKey() {
    let length = 0;
    [this._key, length] = b.readVarInt(
      this._byteArray.slice(this._cur, this._cur + maxVarInt),
    );
    this._cur += length;
    return this;
  }

  // determine the total payload length
  getPayloadLength() {
    let length = 0;
    [this._payloadLength, length] = b.readVarInt(
      this._byteArray.slice(this._cur, this._cur + maxVarInt),
    );
    this._cur += length;
    return this;
  }

  // fetch the rowid
  getRowId() {
    let length = 0;
    [this._rowId, length] = b.readVarInt(
      this._byteArray.slice(this._cur, this._cur + maxVarInt),
    );
    this._cur += length;
    return this;
  }

  // make some properties public
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
