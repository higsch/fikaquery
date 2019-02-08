/*
*
* SQLite query processor
* Karolinska Institutet, 2019
*
* Matthias Stahl
*/

/* eslint-disable no-underscore-dangle */
import b from './binary_utils';
import Page from './Page';
import SqliteMaster from './SqliteMaster';

const Pager = class {
  constructor(diskIO, pageSize) {
    this._diskIO = diskIO;
    this._pageSize = pageSize;
  }

  // load a db page
  async loadPage(pageNumber) {
    const start = (pageNumber - 1) * this._pageSize;
    const pageArray = (await this._diskIO.readChunk(start, this._pageSize)).target.result;
    // build a new page
    const page = new Page(pageNumber, b.getHexArrayFromUintArray(pageArray));
    return page;
  }

  // load the sqlite_master table
  async loadSqliteMaster() {
    const page1 = await this.loadPage(1);
    const pointers = page1.cells.map(cell => cell.leftPointer);
    pointers.push(page1.header.rightMostPointer);

    // eslint-disable-next-line arrow-body-style
    const sqliteMasterPages = await Promise.all(pointers.map(async (pointer) => {
      const page = await this.loadPage(pointer);
      return page;
    }));

    return new SqliteMaster(sqliteMasterPages);
  }
};

export default Pager;
