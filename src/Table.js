/*
*
* SQLite query processor table representation
* Karolinska Institutet, 2019
*
* Matthias Stahl
*/

/* eslint-disable no-underscore-dangle */
const Table = class {
  constructor({ tblName, cols, rootPage }) {
    this._name = tblName;
    this._cols = cols;
    this._rootPage = rootPage;
  }

  // make some properties public
  get name() {
    return this._name;
  }

  get rootPage() {
    return this._rootPage;
  }
};

export default Table;
