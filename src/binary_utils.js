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

const readVarInt = (byteArray) => {
  const arr = [];
  while (arr.length <= byteArray.length) {
    const b = byteArray[arr.length];
    if (arr.length === 8) {
      arr.push(b);
      break;
    } else {
      arr.push(b & 0x7F);
    }
    if ((b >> 7) === 0) break;
  }
  return intFromHexArray(arr);
};

export default {
  getUintArray,
  getHexArrayFromUintArray,
  intFromHexArray,
  intArrayFromHexArray,
  strFromHexArray,
  readVarInt,
};
