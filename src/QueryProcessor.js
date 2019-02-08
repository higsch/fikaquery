/*
*
* SQLite query processor
* Karolinska Institutet, 2019
*
* Matthias Stahl
*/

/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
import Table from './Table';
import BTree from './BTree';

const QueryProcessor = class {
  constructor(pager, master) {
    this._pager = pager;
    this._master = master;
    this._btree = new BTree(pager);
  }

  // table query entry point
  async table(name, options = null) {
    // general procedure
    // 1) plan query
    // 2) execute btree search(es)
    // 3) parse returning pages
    // 4) makte table and process table
  }

  // output type modifier to get a json instead of Table
  json(options = null) {

  }
};

export default QueryProcessor;
