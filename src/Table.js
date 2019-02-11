/*
*
* SQLite query processor table representation
* Karolinska Institutet, 2019
*
* Matthias Stahl
*/

/* eslint-disable no-underscore-dangle */
/* eslint-disable arrow-body-style */
const INT_PRIM_KEY = 'INTEGER PRIMARY KEY';

const Table = class {
  constructor(tblName, cols) {
    this._name = tblName;
    this._cols = cols;
    this._intPrimKey = this.colTypes.indexOf(INT_PRIM_KEY);
  }

  addRows(pages) {
    const rows = {};
    pages.forEach((page) => {
      page.cells.forEach((cell) => {
        const { payload } = cell;
        if (this._intPrimKey !== -1) {
          payload[this._intPrimKey] = cell.rowId;
        }
        rows[cell.rowId || cell.payload[0]] = cell.payload;
      });
    });
    this._rows = rows;
  }

  filter(col, value) {

  }

  // make some properties public
  get name() {
    return this._name;
  }

  get rootPage() {
    return this._rootPage;
  }

  get colNames() {
    return this._cols.map(col => col.name);
  }

  get colTypes() {
    return this._cols.map(col => col.type);
  }

  toString(maxRows = Object.keys(this._rows).length) {
    const rowIds = Object.keys(this._rows);
    let output = `${this.colNames.join(' | ')}\n`;
    output += `${this.colTypes.join(' | ')}\n`;
    output += '------------------------------------------------\n';
    for (let i = 0; i < maxRows; i += 1) {
      if (rowIds.length <= i) break;
      output += `${this._rows[rowIds[i]].join(' | ')}\n`;
    }
    return output;
  }
};

export default Table;
