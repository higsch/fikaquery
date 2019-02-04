/* eslint-disable no-bitwise */
const getHexArrayFromUintArray = (arrayCollection) => {
  const arr = new Uint8Array(arrayCollection);
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

export default {
  getHexArrayFromUintArray,
  intFromHexArray,
  intArrayFromHexArray,
  strFromHexArray,
};
