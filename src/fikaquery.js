import DB from './DB';

const connect = async (FileReader, file) => {
  const db = new DB(FileReader, file);
  await db.buildHeader();
  return db;
};

export default {
  connect,
};
