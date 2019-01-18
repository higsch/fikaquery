export default (FileReader, cond) => new Promise((resolve, reject) => {
  const fr = new FileReader();
  if (cond) {
    resolve(fr);
  } else {
    reject(new Error('Error'));
  }
});
