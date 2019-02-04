import b from './binary_utils';

const headerCoords = {
  start: 0,
  end: 100,
};

const FQ = class {
  constructor(FileReader, file) {
    this.setFileReader(FileReader);
    this.setFile(file);
  }

  setFileReader(FileReader) {
    this.fr = new FileReader();
  }

  setFile(file) {
    this.file = file;
  }

  getFile() {
    return this.file;
  }

  readChunk(byteNum, length) {
    return new Promise((resolve, reject) => {
      this.fr.onload = resolve;
      this.fr.onerror = reject;
      this.fr.readAsArrayBuffer(this.file.slice(byteNum, byteNum + length));
    });
  }

  getDbHeader() {
    if (!this.dbHeader) {
      return new Promise((resolve) => {
        this.readChunk(headerCoords.start, headerCoords.start + headerCoords.end).then((res) => {
          this.dbHeader = b.getHexArray(res.target.result);
          resolve(this.dbHeader);
        });
      });
    }
    return this.dbHeader;
  }
};

export default FQ;
