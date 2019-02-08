/*
*
* SQLite query processor
* Karolinska Institutet, 2019
*
* Matthias Stahl
*/

/* eslint-disable no-underscore-dangle */

const DiskIO = class {
  constructor(FileReader, file) {
    this._FileReader = FileReader;
    this._file = file;
  }

  // core function to read a data chunk from file
  readChunk(byteNum, length) {
    // implemented as promise, disk reading takes time
    return new Promise((resolve, reject) => {
      // make a new FileReader instance for each job
      // if not, no double usage possible
      const fr = new this._FileReader();
      fr.onload = resolve;
      fr.onerror = reject;
      fr.readAsArrayBuffer(this._file.slice(byteNum, byteNum + length));
    });
  }
};

export default DiskIO;
