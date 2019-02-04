/*
*
* SQLite database cell representation
* Karolinska Institutet, 2019
*
*/

/* eslint-disable no-underscore-dangle */
import b from './binary_utils';

const pos = {
  payloadLength: [0, 10],
};

const Cell = class {
  constructor(pointer, byteArray) {
    this._pointer = pointer;
    this._byteArray = byteArray;
    this._payloadLength = b.readVarInt(this._byteArray.slice(...pos.payloadLength));
  }
};

export default Cell;
