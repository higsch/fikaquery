/*
*
* FIKAVIEW
* Entry point for all fikaview tasks
* Karolinska Institutet, 2019
*
*/

import DB from './DB';

// the DB build sequence
const connect = async (FileReader, file) => {
  const db = new DB(FileReader, file);
  await db.buildHeader();
  return db;
};

export default {
  connect,
};
