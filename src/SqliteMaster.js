/*
*
* SQLite database representation
* Karolinska Institutet, 2019
*
* Matthias Stahl
*/

/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */

const COL = {
  TYPE: 0,
  NAME: 1,
  TBL_NAME: 2,
  ROOTPAGE: 3,
  SQL: 4,
};

const SqliteMaster = class {
  constructor(sqliteMasterPages) {
    this._sqliteMasterPages = sqliteMasterPages;
    this._tables = {};
    this._indices = {};
    this.parseEntities();
  }

  parseEntities() {
    const allCells = [];
    this._sqliteMasterPages.forEach((page) => {
      page.cells.forEach((cell) => {
        allCells.push(cell.payload);
      });
    });

    allCells.forEach((cell) => {
      if (cell[COL.TYPE] === 'index') {
        this._indices = {
          [cell[COL.TBL_NAME]]: this.makeCellObj(cell),
          ...this._indices,
        };
      }
      if (cell[COL.TYPE] === 'table') {
        this._tables = {
          [cell[COL.TBL_NAME]]: this.makeCellObj(cell),
          ...this._tables,
        };
      }
    });
  }

  makeCellObj(cell) {
    return {
      name: cell[COL.NAME],
      rootPage: cell[COL.ROOTPAGE],
      sql: cell[COL.SQL],
      cols: this.parseColsFromSQL(cell[COL.SQL]),
    };
  }

  parseColsFromSQL(sql) {
    return sql;
  }
};

export default SqliteMaster;
