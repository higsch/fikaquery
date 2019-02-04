import FQ from './FQ';

const connect = (FileReader, file) => (new FQ(FileReader, file));

export default {
  connect,
};
