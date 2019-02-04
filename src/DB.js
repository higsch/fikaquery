/*
*
* SQLite database representation
* Karolinska Institutet, 2019
*
*/

/* eslint-disable no-underscore-dangle */
import b from './binary_utils';
import Header from './Header';
import Page from './Page';

const DB = class {
  constructor(FileReader, file) {
    this.fr = new FileReader();
    this.file = file;
    this._pages = {};
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

  async loadPage(pageNumber) {
    if (!this._header) {
      throw new Error('No header!');
    }
    if (pageNumber in this._pages) {
      return this._pages[pageNumber];
    }
    const start = (pageNumber - 1) * this.header.pageSize;
    const pageArray = (await this.readChunk(start, this.header.pageSize)).target.result;
    const page = new Page(pageNumber, b.getHexArrayFromUintArray(pageArray));
    this._pages = {
      [pageNumber.toString()]: page,
      ...this._pages,
    };
    return page;
  }

  async buildSqliteMaster() {
    const page1 = await this.loadPage(1);
    return page1;
  }
};

export default DB;
