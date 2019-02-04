/* eslint-disable no-underscore-dangle */
import b from './binary_utils';
import DbHeader from './DbHeader';

const FQ = class {
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

  get dbHeaderRaw() {
    if (!this._dbHeaderRaw) {
      return new Promise((resolve) => {
        this.readChunk(DbHeader.start, DbHeader.length).then((res) => {
          this._dbHeaderRaw = b.getHexArray(res.target.result);
          resolve(this._dbHeaderRaw);
        });
      });
    }
    return this._dbHeaderRaw;
  }

  get dbHeader() {
    if (!this._dbHeaderRaw) {
      this.dbHeaderRaw();
    }
    if (!this._dbHeader) {
      this._dbHeader = new DbHeader(this._dbHeaderRaw);
    }
    return this._dbHeader;
  }
};

export default FQ;
