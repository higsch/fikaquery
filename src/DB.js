/*
*
* SQLite database representation
* Karolinska Institutet, 2019
*
* Matthias Stahl
*/

/*
*
* Parser design according to the rules at https://sqlite.org/fileformat2.html
*
*/

/* eslint-disable no-underscore-dangle */
import b from './binary_utils';
import Header from './Header';
import Page from './Page';
import SqliteMaster from './SqliteMaster';
import QueryProcessor from './QueryProcessor';

const DB = class {
  // set FileReader from browser and set the db file
  constructor(FileReader, file) {
    this.FR = FileReader;
    this.file = file;
    this._pages = {}; // will hold loaded pages, not sure, if promising...
  }

  // core function to read a data chunk from file
  readChunk(byteNum, length) {
    // implemented as promise, disk reading takes time
    return new Promise((resolve, reject) => {
      // make a new FileReader instance for each job
      // if not, no double usage possible
      const fr = new this.FR();
      fr.onload = resolve;
      fr.onerror = reject;
      fr.readAsArrayBuffer(this.file.slice(byteNum, byteNum + length));
    });
  }

  // generate the overall db header
  async buildHeader() {
    const headerArray = (await this.readChunk(Header.start, Header.length)).target.result;
    // currently basic data is handled as hex array
    this._header = new Header(b.getHexArrayFromUintArray(headerArray));
  }

  // make the header public
  get header() {
    return this._header;
  }

  // load a db page
  async loadPage(pageNumber) {
    if (!this._header) {
      throw new Error('No header!');
    }
    // if the page has already been loaded, deliver it on the fly
    // this might be too slow for many pages in the object
    // deprecate if it slows down the loading process
    if (pageNumber in this._pages) {
      return this._pages[pageNumber];
    }
    const start = (pageNumber - 1) * this.header.pageSize;
    const pageArray = (await this.readChunk(start, this.header.pageSize)).target.result;
    // build a new page
    const page = new Page(pageNumber, b.getHexArrayFromUintArray(pageArray));
    this._pages = {
      [pageNumber.toString()]: page,
      ...this._pages,
    };
    return page;
  }

  // load the sqlite_master table to get a full
  // overview over tables and indices
  async loadSqliteMaster() {
    const page1 = await this.loadPage(1);
    const pointers = page1.cells.map(cell => cell.leftPointer);
    pointers.push(page1.header.rightMostPointer);

    // eslint-disable-next-line arrow-body-style
    const sqliteMasterPages = await Promise.all(pointers.map(async (pointer) => {
      const page = await this.loadPage(pointer);
      return page;
    }));

    this._sqliteMaster = new SqliteMaster(sqliteMasterPages);
  }

  // entry point for queries
  query(options) {
    return new QueryProcessor(this, options);
  }
};

export default DB;
