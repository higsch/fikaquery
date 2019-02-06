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
      console.log(indexHeader[0].rootPage);
      const index = [].concat(...await this.fetchIndices(indexHeader[0].rootPage, options.limit));
      console.log(index);
    }

    const pages = [].concat(...await this.fetchPages(table.rootPage));
    console.log(pages);
    // promise all?
    return [];
  }

  async fetchIndices(pageNumber, limit) {
    console.log(limit);
    const page = await this._db.loadPage(pageNumber);
    const newLimit = limit - page.cells.length;
    if (page.type === PageHeader.TYPE.INTERIOR_INDEX) {
      // eslint-disable-next-line consistent-return
      return Promise.all(page.getPointers().map(
        pointer => this.fetchIndices(pointer, newLimit),
      ));
    }
    // eslint-disable-next-line consistent-return
    return [page];
  }

  async fetchPages(pageNumber) {
    const page = await this._db.loadPage(pageNumber);
    if (page.type === PageHeader.TYPE.INTERIOR_TABLE) {
      return Promise.all(page.getPointers().map(pointer => this.fetchPages(pointer)));
    }
    return [page];
  }

  // output type modifier to get a json instead of Table
  json(options = null) {

  }
};

export default QueryProcessor;
