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
  constructor(master = null) {
    if (!master) throw new Error('No master tables provided!');
    this._master = master;
  }

  // table query entry point
  async table(name, options = { limit: 1000 }) {
    const tableHeader = this._master.tables[name];
    const table = new Table(tableHeader);
    // parse options, basically get the interesting rowids

    // look for an appropriate index
    // only, if options are defined
    if (options) {
      const indexCol = 'protein_acc';
      const indexHeader = this._master.getIndicesForTable(name, indexCol);
      const index = [].concat(...await BTree.fetchFullIndex(indexHeader[0].rootPage));
      console.log(index);
    }

    const pages = [].concat(...await BTree.fetchFullTable(table.rootPage));
    console.log(pages);
    return pages;
  }

  // output type modifier to get a json instead of Table
  json(options = null) {

  }
};

export default QueryProcessor;
