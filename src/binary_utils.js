/* eslint-disable no-bitwise */

const getHexArray = (arrayCollection) => {
  const arr = new Uint8Array(arrayCollection);
  const arrBase = [];
  arr.forEach((e) => {
    arrBase.push(e.toString(16));
  });
  console.log(arr[31], arrBase[31]);
  return arrBase;
};

export default {
  getHexArray,
};
