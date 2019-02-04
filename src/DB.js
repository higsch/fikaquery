/* eslint-disable no-underscore-dangle */
import b from './binary_utils';
import Header from './Header';

const DB = class {
  constructor(FileReader, file) {
    this.fr = new FileReader();
    this.file = file;
  }

  readChunk(byteNum, length) {
    return new Promise((resolve, reject) => {
      this.fr.onload = resolve;
      this.fr.onerror = reject;
      this.fr.readAsArrayBuffer(this.file.slice(byteNum, byteNum + length));
    });
  }

  async buildHeader() {
    const headerArray = (await this.readChunk(Header.start, Header.length)).target.result;
    this._header = new Header(b.getHexArrayFromUintArray(headerArray));
  }

  get header() {
    return this._header;
  }
};

export default DB;
