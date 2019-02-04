<template>
  <div class="content-wrapper">
    <b-form>
      <b-form-file v-model="file"
                   :state="Boolean(file)"
                   placeholder="Choose a fikaquery file..."
                   accept=".sql, .sqlite, .sqlite3"
                   class="file-input">
      </b-form-file>
    </b-form>
    <div class="data" v-if="db">
      <h4>Data</h4>
      <div class="db-header" v-if="db.header">
        Raw header: <pre>{{ formatBinArray(db.header.raw) }}</pre>
        Header string: <pre>{{ db.header.headerString }}</pre>
        File changes: <pre>{{ db.header.fileChangeCounter }}</pre>
        Number of pages: <pre>{{ db.header.numPages }}</pre>
        Page size: <pre>{{ db.header.pageSize }}</pre>
        Version <pre>{{ db.header.version }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import fikaquery from '../../../src/fikaquery';

export default {
  name: 'FikaContent',
  data() {
    return {
      file: null,
      db: null,
    };
  },
  watch: {
    async file() {
      this.db = await fikaquery.connect(FileReader, this.file);
    },
  },
  methods: {
    formatBinArray(obj) {
      let arr = Object.values(obj);
      arr = arr.map((e) => {
        if (e.toString().length === 1) {
          return `0${e}`;
        }
        return e;
      });
      const arrs = [];
      const size = 16;
      while (arr.length > 0) {
        arrs.push(arr.splice(0, size).join(' '));
      }
      return arrs.join('\n');
    },
  },
};
</script>

<style scoped>
.file-input {
  max-width: 500px;
  margin: 20px 0 0 0;
}

h4 {
  margin-top: 30px;
}

.db-header {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  border: 1px solid gray;
  border-radius: 5px;
}
</style>
