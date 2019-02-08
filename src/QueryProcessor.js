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
import BTree from './BTree';

const STRATEGY = {
  NO_STRATEGY: 0,
  TABLE_FULL_SCAN: 1,
  INDEX_PARTIAL_SCAN_TABLE_SEARCH: 2,
  TABLE_FULL_SCAN_WITH_LIMIT: 3,
};

const QueryProcessor = class {
  constructor(pager, master) {
    this._pager = pager;
    this._master = master;
    this._btree = new BTree(pager);
  }

  // table query entry point
  async table(tblName, options = null) {
    // general procedure
    // 1) plan query
    // 2) execute btree search(es)
    // 3) parse returning pages
    // 4) makte table and process table

    // 1) plan the query
    const strategy = this.plan(tblName, options);

    // 2) execute it
    const pages = this.execute(strategy, tblName, options);
  }

  plan(tblName, options) {

  }

  execute(strategy, tblName, options) {

  }

  // output type modifier to get a json instead of Table
  json(options = null) {

  }
};

export default QueryProcessor;
