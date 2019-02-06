/*
*
* SQLite database page representation
* Karolinska Institutet, 2019
*
* Matthias Stahl
*/

/* eslint-disable no-underscore-dangle */
import Header from './Header';
import PageHeader from './PageHeader';
import Cell from './Cell';
import b from './binary_utils';

// important byte coordinates
const pos = {
  header: [0, 12],
};

const Page = class {
  // build the db page
  constructor(pageNumber, byteArray) {
    this._pageNumber = pageNumber;
    this._isRoot = (pageNumber === 1);
    this._offset = (this._isRoot) ? Header.length : 0;
    this._byteArray = byteArray.slice(this._offset, byteArray.length);
    // header of the page in extra object
    this._header = new PageHeader(this._byteArray.slice(...pos.header));
    this._cellPointerArray = [];
    // load all the cells that are located here
    this.loadCells();
  }

  get number() {
    return this._pageNumber;
  }

  get header() {
    return this._header;
  }

  get type() {
    return this._header.type;
  }

  get cells() {
    return this._cells;
  }

  // core function: load all the cells on a page
  // Todo: implement overflow pointer
  loadCells() {
    // fetch info from header
    const { numCells, headerSize } = this.header;
    // get all the cell pointers
    // so that we can find the cells later
    const cellPointerBytes = this._byteArray.slice(headerSize, headerSize + numCells * 2);
    cellPointerBytes.forEach((byte, index, arr) => {
      if (index % 2 === 0) {
        this._cellPointerArray.push(b.intFromHexArray(arr.slice(index, index + 2)));
      }
    });
    // run through the sorted pointers, take us to the cell bytes
    // and build new cell objects
    // eslint-disable-next-line arrow-body-style
    this._cells = this._cellPointerArray.sort((x, y) => (y - x)).map((pointer, index, pointers) => {
      // eslint-disable-next-line max-len
      return new Cell(this._byteArray.slice(pointer - this._offset, pointers[index === 0 ? this._byteArray.length - 1 : index - 1]), this.header.type);
    });

    // kick out raw data when done
    delete this._byteArray;
  }

  getPointers() {
    const pointers = this._cells.map(cell => (cell.leftPointer));
    pointers.push(this._header.rightMostPointer);
    return pointers;
  }
};

export default Page;
