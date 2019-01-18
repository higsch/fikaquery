export default cond => new Promise((resolve, reject) => {
  if (cond) {
    resolve('all right');
  } else {
    reject(new Error('Error'));
  }
});
