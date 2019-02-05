/*
*
* FIKAVIEW
* Entry point for all fikaview tasks
* Karolinska Institutet, 2019
*
* Matthias Stahl
*/

import DB from './DB';

// the DB build sequence
const connect = async (FileReader, file) => {
  const db = new DB(FileReader, file);
  await db.buildHeader();
  await db.buildSqliteMaster();
  return db;
};

export default {
  connect,
};
