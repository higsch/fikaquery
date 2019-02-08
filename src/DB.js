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
import QueryProcessor from './QueryProcessor';
import DiskIO from './DiskIO';
import Pager from './Pager';

const DB = class {
  // set FileReader from browser and set the db file
  constructor(FileReader, file) {
    this._diskIO = new DiskIO(FileReader, file);
  }

  // start sequence
  // load the header, pager and sqlite_master
  async start() {
    // get the header array
    const headerArray = (await this._diskIO.readChunk(Header.start, Header.length)).target.result;
    // construct the header
    this._header = new Header(b.getHexArrayFromUintArray(headerArray));
    // build a pager
    this._pager = new Pager(this._diskIO, this._header.pageSize);
    // fetch the sqlite_master table with all tables and indices
    this._sqliteMaster = await this._pager.loadSqliteMaster();
  }

  // make the header public
  get header() {
    return this._header;
  }

  // and also the master, the user wants to know all tables
  get master() {
    return this._sqliteMaster;
  }

  // entry point for queries
  get query() {
    return new QueryProcessor(this._sqliteMaster);
  }
};

export default DB;
