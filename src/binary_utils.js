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
    if (arr.length === (9 - 1)) {
      arr.push(b);
      break;
    } else {
      arr.push(((`0x${(`0${b}`).slice(-2)}` & 0x7F)).toString(16));
    }
    if ((b >> 7) === 0) break;
  }
  return [intFromHexArray(arr), arr.length];
};

export default {
  getUintArray,
  getHexArrayFromUintArray,
  intFromHexArray,
  intArrayFromHexArray,
  strFromHexArray,
  readVarInt,
};
