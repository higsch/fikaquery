/*
*
* SQLite query processor
* Karolinska Institutet, 2019
*
* Matthias Stahl
*/

/* eslint-disable no-underscore-dangle */
import PageHeader from './PageHeader';


const BTree = class {
  constructor(pager) {
    this._pager = pager;
  }

  async fetchFullIndex(pageNumber) {
    const pages = await this.fetchFullIndexRec(pageNumber);
    if (Array.isArray(pages)) {
      return [].concat(...pages);
    }
    return [pages];
  }

  async fetchFullIndexRec(pageNumber) {
    const page = await this._pager.loadPage(pageNumber);
    if (page.type === PageHeader.TYPE.INTERIOR_INDEX) {
      return Promise.all(page.getPointers().map(pointer => this.fetchFullIndexRec(pointer)));
    }
    return page;
  }

  async fetchFullTable(pageNumber) {
    const pages = await this.fetchFullTableRec(pageNumber);
    if (Array.isArray(pages)) {
      return [].concat(...pages);
    }
    return [pages];
  }

  async fetchFullTableRec(pageNumber) {
    const page = await this._pager.loadPage(pageNumber);
    if (page.type === PageHeader.TYPE.INTERIOR_TABLE) {
      return Promise.all(page.getPointers().map(pointer => this.fetchFullTableRec(pointer)));
    }
    return page;
  }
};

export default BTree;
