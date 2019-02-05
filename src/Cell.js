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
    this._offset = 0;
    this._byteArray = byteArray;
    this._colTypes = [];

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
          .then(cur => this.getPayload(cur))
          .then(cur => this.updateOffset(cur));
        break;
      default:
    }
  }

  updateOffset(cur) {
    this._offset += cur;
  }

  getPayload(cur) {
    return new Promise((resolve) => {
      let runningCur = cur;
      this._payload = this._colTypes.map((colType) => {
        let res = null;
        switch (colType) {
          case 0: {
            runningCur += 1;
            break;
          }
          case 1:
          case 2:
          case 3:
          case 4: {
            res = b.intFromHexArray(this._byteArray.slice(runningCur, runningCur + colType));
            runningCur += colType;
            break;
          }
          case 5: {
            res = b.intFromHexArray(this._byteArray.slice(runningCur, runningCur + 6));
            runningCur += 6;
            break;
          }
          case 6: {
            res = b.intFromHexArray(this._byteArray.slice(runningCur, runningCur + 8));
            runningCur += 8;
            break;
          }
          case 7: {
            res = b.floatFromHexArray(this._byteArray.slice(runningCur, runningCur + 8));
            runningCur += 8;
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
              res = b.strFromHexArray(this._byteArray.slice(runningCur, runningCur + length));
              runningCur += length;
              break;
            }
          }
        }
        return res;
      });
      resolve(runningCur);
    });
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
        this._colTypes.push(colType);
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
