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
      <div class="db-header" v-if="db.header">
        <h4>Database header</h4>
        <div class="inside-card">
          <h5>Header string</h5><pre>{{ db.header.headerString }}</pre>
          <h5>File changes</h5><pre>{{ db.header.fileChangeCounter }}</pre>
          <h5>Number of pages</h5><pre>{{ db.header.numPages }}</pre>
          <h5>Page size</h5><pre>{{ db.header.pageSize }}</pre>
          <h5>Version</h5><pre>{{ db.header.version }}</pre>
        </div>
      </div>
      <div class="master-tables" v-if="masterTables">
        <h4>Tables</h4>
        <div class="inside-card">
          <table>
            <thead>
              <tr>
                <td>Page</td><td>Table</td><td>Columns</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="table in masterTables" :key="table.name">
                <td><pre>{{ table.rootPage }}</pre></td>
                <td><pre>{{ table.tblName }}</pre></td>
                <td><pre>{{ table.cols.map(e => e.name).join(', ') }}</pre></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="master-indices" v-if="masterIndices">
        <h4>Indices</h4>
        <div class="inside-card">
          <table>
            <thead>
              <tr>
                <td>Page</td><td>Index</td><td>On table</td><td>On column</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="index in masterIndices" :key="index.name">
                <td><pre>{{ index.rootPage }}</pre></td>
                <td><pre>{{ index.name }}</pre></td>
                <td><pre>{{ index.tblName }}</pre></td>
                <td><pre>{{ index.on.map(e => e.name).join(', ') }}</pre></td>
              </tr>
            </tbody>
          </table>
        </div>
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
      masterTables: null,
      masterIndices: null,
    };
  },
  watch: {
    async file() {
      this.db = await fikaquery.connect(FileReader, this.file);
      this.masterTables = this.db.master.tables;
      this.masterIndices = this.db.master.indices;
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
h4 {
  font-size: 1.2rem;
  padding: 0 0 0 10px;
  line-height: 2rem;
  border-bottom: 1px solid gray;
}

thead, h5 {
  font-size: .9rem;
  font-weight: bold;
}

td {
  padding: 0 10px 0 0;
  vertical-align: top;
}

pre {
  margin: 3px 0;
  line-height: .9rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.file-input {
  max-width: 500px;
  margin: 20px 0 0 0;
}

.data {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
}

.custom-content-btn {
  margin: 10px 0;
}

.db-header, .master-tables, .master-indices {
  min-width: 200px;
  margin: 10px 10px 0 0;
  border: 1px solid gray;
  border-radius: 5px;
}

.inside-card {
  padding: 0 10px 5px 10px;
}
</style>
