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
          [cell[COL.NAME]]: this.makeCellObj(cell),
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
      tblName: cell[COL.TBL_NAME],
      name: cell[COL.NAME],
      type: cell[COL.TYPE],
      rootPage: cell[COL.ROOTPAGE],
      sql: cell[COL.SQL],
      [cell[COL.TYPE] === 'table' ? 'cols' : 'on']: this.parseColsFromSQL(cell),
    };
  }

  parseColsFromSQL(cell) {
    let cols = [];
    if (cell[COL.SQL]) {
      let r = '';
      if (cell[COL.TYPE] === 'index') {
        r = /\([A-Za-z_]+\)/g;
      }
      if (cell[COL.TYPE] === 'table') {
        r = /[\s(][A-Za-z0-9_]+\s[A-Z_\s]+[,)]/g;
      }
      const match = cell[COL.SQL].match(r);
      if (match) {
        cols = match.map((e) => {
          const sub = e.slice(1, -1);
          return {
            name: sub.split(' ')[0],
            type: sub.split(' ')[1] || null,
          };
        });
      }
    }
    return cols;
  }
};

export default SqliteMaster;
