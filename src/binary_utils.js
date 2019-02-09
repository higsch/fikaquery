/*
*
* Binary utility functions
* Karolinska Institutet, 2019
*
* Matthias Stahl
*/

/* eslint-disable no-bitwise */
const getUintArray = arrayCollection => (new Uint8Array(arrayCollection));

const getHexArrayFromUintArray = (arrayCollection) => {
  const arr = getUintArray(arrayCollection);
  const arrBase = [];
  arr.forEach((e) => {
    arrBase.push(e.toString(16));
  });
  return arrBase;
};

const intFromHexArray = (byteArray) => {
  const arr2 = byteArray.map(e => ((`0${e}`).slice(-2)));
  return parseInt(arr2.join(''), 16);
};

const intArrayFromHexArray = byteArray => (byteArray.map(e => parseInt(e, 16)));

const strFromHexArray = byteArray => (String.fromCharCode(...intArrayFromHexArray(byteArray)));

const floatFromHexArray = (byteArray) => {
  const buffer = new ArrayBuffer(byteArray.length);
  const dv = new DataView(buffer);
  const intArray = intArrayFromHexArray(byteArray);
  intArray.forEach((e, index) => {
    dv.setInt8(index, e);
  });
  return dv.getFloat64(0, false);
};

const readVarInt = (byteArray) => {
  const arr = [];
  while (arr.length < byteArray.length) {
    const b = byteArray[arr.length];
    if (arr.length === (9 - 1)) {
      arr.push(b.toString(2));
      break;
    } else {
      const bin = (Number(`0x${b}`) & 0x7F).toString(2);
      arr.push(`000000${bin}`.slice(-7));
    }
    if ((Number(`0x${b}`) >> 7) === 0) break;
  }
  const res = parseInt(arr.join(''), 2);
  return [res, arr.length];
};

export default {
  getUintArray,
  getHexArrayFromUintArray,
  intFromHexArray,
  intArrayFromHexArray,
  strFromHexArray,
  floatFromHexArray,
  readVarInt,
};
