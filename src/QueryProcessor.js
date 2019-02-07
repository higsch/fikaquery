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
import PageHeader from './PageHeader';

const QueryProcessor = class {
  constructor(db = null) {
    if (!db) throw new Error('No database provided!');
    this._db = db;
  }

  // table query entry point
  async table(name, options = { limit: 1000 }) {
    const tableHeader = this._db.master.tables[name];
    const table = new Table(tableHeader);
    // parse options, basically get the interesting rowids

    // look for an appropriate index
    // only, if options are defined
    if (options) {
      const indexCol = 'protein_acc';
      const indexHeader = this._db.master.getIndicesForTable(name, indexCol);
      const index = [].concat(...await this.fetchFullIndex(indexHeader[0].rootPage));
      console.log(index);
    }

    const pages = [].concat(...await this.fetchFullTable(table.rootPage));
    console.log(pages);
    return pages;
  }

  async fetchFullIndex(pageNumber) {
    const page = await this._db.loadPage(pageNumber);
    if (page.type === PageHeader.TYPE.INTERIOR_INDEX) {
      return Promise.all(page.getPointers().map(pointer => this.fetchFullIndex(pointer)));
    }
    return [page];
  }

  async fetchFullTable(pageNumber) {
    const page = await this._db.loadPage(pageNumber);
    if (page.type === PageHeader.TYPE.INTERIOR_TABLE) {
      return Promise.all(page.getPointers().map(pointer => this.fetchFullTable(pointer)));
    }
    return [page];
  }

  // output type modifier to get a json instead of Table
  json(options = null) {

  }
};

export default QueryProcessor;
