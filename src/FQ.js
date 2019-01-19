/* eslint-disable no-underscore-dangle */
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

  set__(__) {
    this.__ = __;
  }

  setHeader(__header) {
    this.__header = __header;
  }

  setDefinitions(__definitions) {
    this.__definitions = __definitions;
  }

  readSlice(byteNum, length) {
    return new Promise((resolve, reject) => {
      this.fr.onload = resolve;
      this.fr.onerror = reject;
      this.fr.readAsText(this.file.slice(byteNum, byteNum + length));
    });
  }

  getProtein(proteinId, { includeChildren = false }) {

  }

  getPeptide(peptideId, { includeChildren = false }) {
    //
  }
};

export default FQ;
