/*
*
* SQLite database page representation
* Karolinska Institutet, 2019
*
*/

/* eslint-disable no-underscore-dangle */
import Header from './Header';
import PageHeader from './PageHeader';

const Page = class {
  constructor(pageNumber, byteArray) {
    this._pageNumber = pageNumber;
    this._isRoot = (pageNumber === 1);
    this._offset = (this._isRoot) ? Header.length : 0;
    this._byteArray = byteArray.slice(this._offset, byteArray.length);
    this._header = new PageHeader(this._byteArray.slice(0, 12));
    console.log(this._header);
  }

  get header() {
    return this._header;
  }
};

export default Page;
