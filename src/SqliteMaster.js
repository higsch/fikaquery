/*
*
* SQLite database representation
* Karolinska Institutet, 2019
*
* Matthias Stahl
*/

/* eslint-disable no-underscore-dangle */

// const COL = {
//   TYPE: 0,
//   NAME: 1,
//   TBL_NAME: 2,
//   ROOTPAGE: 3,
//   SQL: 4,
// };

const SqliteMaster = class {
  constructor(sqliteMasterPages) {
    this._sqliteMasterPages = sqliteMasterPages;
    this._tables = {};
    this._indices = {};
    this.parseEntities();
  }

  parseEntities() {
    const allCells = [];
    for (let i = 0; i < this._sqliteMasterPages.length; i += 1) {
      for (let j = 0; j < this._sqliteMasterPages[i].cells.length; j += 1) {
        allCells.push(this._sqliteMasterPages[i].cells[j].payload);
      }
    }
    this._allCells = allCells;
  }
};

export default SqliteMaster;
