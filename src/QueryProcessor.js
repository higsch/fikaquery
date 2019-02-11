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
import BTreeRunner from './BTreeRunner';
import Table from './Table';

const QueryProcessor = class {
  constructor(pager, master) {
    this._pager = pager;
    this._master = master;
    this._bTree = new BTreeRunner(pager);
  }

  // table query entry point
  async table(tblName, options = { where: { set_id: 1 } }) {
    const table = await this.execute(tblName, options);
    return table;
  }

  async execute(tblName, options) {
    const tblRootPage = this._master.getTableRootPage(tblName);
    if (options) {
      const indices = await this.getIndicesFromOptions(tblName, options);
      console.log(indices);
    }
    const fullTablePages = await this._bTree.fetchTree(tblRootPage);
    const table = this.makeTable(tblName, fullTablePages);
    return table;
  }

  makeTable(tblName, pages) {
    const table = new Table(tblName, this._master.getTableCols(tblName));
    table.addRows(pages);
    return table;
  }

  makeIndex(indexName, pages) {
    const index = new Table(indexName, this._master.getIndexCols(indexName));
    index.addRows(pages);
    return index;
  }

  async getIndicesFromOptions(tblName, options) {
    const indices = {
      where: null,
      sort: null,
    };
    if (options) {
      if (options.where) {
        const indexCol = Object.keys(options.where)[0];
        if (this._master.hasIndex(tblName, indexCol)) {
          const indexInfo = this._master.getIndexInfo(tblName, indexCol);
          const indexPages = await this._bTree.fetchTree(indexInfo.rootPage);
          const index = this.makeIndex(indexInfo.name, indexPages);
          indices.where = index;
        }
      }
      if (options.sort) {
        const indexCol = options.sort[0];
        if (this._master.hasIndex(tblName, indexCol)) {
          const indexInfo = this._master.getIndexInfo(tblName, indexCol);
          const indexPages = await this._bTree.fetchTree(indexInfo.rootPage);
          const index = this.makeIndex(indexInfo.name, indexPages);
          indices.sort = index;
        }
      }
    }
    return indices;
  }
};

export default QueryProcessor;
