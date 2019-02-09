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
import Table from './Table';

const STRATEGY = {
  NO_STRATEGY: 0,
  TABLE_FULL_SCAN: 1,
};

const QueryProcessor = class {
  constructor(pager, master) {
    this._pager = pager;
    this._master = master;
    this._bTree = new BTree(pager);
  }

  // table query entry point
  async table(tblName, options = { limit: 100 }) {
    // general procedure
    // 1) plan query
    // 2) execute btree search(es)
    // 3) parse returning pages
    // 4) makte table and process table

    // 1) plan the query
    // const strategy = this.plan(tblName, options);

    // 2) execute it
    const tblRootPage = this._master.getTableRootPage(tblName);
    // const pages = this.execute(STRATEGY.TABLE_FULL_SCAN, tblName, options, tblRootPage);
    const pages = await this.execute(STRATEGY.TABLE_FULL_SCAN, tblName, options, tblRootPage);
    // console.log(pages);

    // 3) + 4) parse pages, make table
    const table = new Table(tblName, tblRootPage, this._master.getTableCols(tblName));
    table.addRows(pages);
    return table;
  }

  plan(tblName, options) {

  }

  execute(strategy, tblName, options, tableRootPage) {
    switch (strategy) {
      case STRATEGY.TABLE_FULL_SCAN:
        return this._bTree.fetchFullTable(tableRootPage);
      default:
        return [];
    }
  }
};

export default QueryProcessor;
