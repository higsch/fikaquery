/*
*
* FIKAVIEW
* Entry point for all fikaview tasks
* Karolinska Institutet, 2019
*
* Matthias Stahl
*/

import DB from './DB';

// the DB build sequence, nothing else
const connect = async (FileReader, file) => {
  const db = new DB(FileReader, file);
  await db.start();
  return db;
};

export default {
  connect,
};
