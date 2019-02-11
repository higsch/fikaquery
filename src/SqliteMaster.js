/*
*
* SQLite sqlite_master table representation
* Karolinska Institutet, 2019
*
* Matthias Stahl
*/

/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */

// column types of the sqlite_master table
const COL = {
  TYPE: 0,
  NAME: 1,
  TBL_NAME: 2,
  ROOTPAGE: 3,
  SQL: 4,
};

const SqliteMaster = class {
  // build it and parse the rows/cells
  constructor(sqliteMasterPages) {
    this._sqliteMasterPages = sqliteMasterPages;
    this._tables = {};
    this._indices = [];
    this.parseEntities();
  }

  // here you go
  parseEntities() {
    // collect all cells from pages
    const allCells = [];
    this._sqliteMasterPages.forEach((page) => {
      page.cells.forEach((cell) => {
        allCells.push(cell.payload);
      });
    });

    // parse the cells and sort them by index or table
    allCells.forEach((cell) => {
      if (cell[COL.TYPE] === 'index') {
        this._indices[cell[COL.NAME]] = this.makeCellObj(cell);
      }
      if (cell[COL.TYPE] === 'table') {
        this._tables[cell[COL.TBL_NAME]] = this.makeCellObj(cell);
      }
    });
  }

  // make a cell representing object
  makeCellObj(cell) {
    return {
      tblName: cell[COL.TBL_NAME],
      name: cell[COL.NAME],
      type: cell[COL.TYPE],
      rootPage: cell[COL.ROOTPAGE],
      sql: cell[COL.SQL],
      cols: this.parseColsFromSQL(cell),
    };
  }

  // parse the sql create strings in order to get the column names
  // of all tables in the database
  parseColsFromSQL(cell) {
    let cols = [];
    // is there an sql string present?
    // some internal indices do not have such a thing
    if (cell[COL.SQL]) {
      let r = '';
      if (cell[COL.TYPE] === 'index') {
        // if we have an index, parse the coulmn name on which the index goes
        r = /\([A-Za-z_]+\)/g;
      }
      if (cell[COL.TYPE] === 'table') {
        // if it's a table, just get all the column names
        r = /[\s(][A-Za-z0-9_]+[A-Z_\s]+[,)]/g;
      }
      const match = cell[COL.SQL].match(r);
      if (match) {
        // we have at least one match
        cols = match.map((e) => {
          const sub = e.slice(1, -1);
          // split it to name and type
          const subSplit = sub.split(' ');
          return {
            name: (cell[COL.TYPE] === 'table') ? subSplit[0] : sub,
            type: (cell[COL.TYPE] === 'table') ? subSplit.slice(1).join(' ') : null,
          };
        });
        if (cell[COL.TYPE] === 'index') {
          cols.push({
            name: 'rowId',
            type: null,
          });
        }
      }
    }
    return cols;
  }

  get tables() {
    return this._tables;
  }

  get indices() {
    return this._indices;
  }

  hasIndex(tblName, col) {
    const index = this.getIndexInfo(tblName, col);
    if (index) {
      return true;
    }
    return false;
  }

  getIndexInfo(tblName, col) {
    const indices = [];
    Object.entries(this._indices).forEach(([, index]) => {
      if (index.tblName === tblName && index.sql && index.cols[0].name === col) {
        indices.push(index);
      }
    });
    if (indices.length > 0) {
      return indices[0];
    }
    return [];
  }

  getTableRootPage(tblName) {
    return this._tables[tblName].rootPage;
  }

  getTableCols(tblName) {
    return this._tables[tblName].cols;
  }

  getIndexCols(indexName) {
    return this._indices[indexName].cols;
  }
};

export default SqliteMaster;
