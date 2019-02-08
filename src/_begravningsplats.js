/* eslint-disable */
const indexCol = 'protein_acc';
const indexHeader = this._master.getIndicesForTable(name, indexCol);
const index = /*await*/ this._btree.fetchFullIndex(indexHeader[0].rootPage);
console.log(index);

const pages = /*await*/ this._btree.fetchFullTable(table.rootPage);
console.log(pages);


const tableHeader = this._master.tables[name];
const table = new Table(tableHeader);
