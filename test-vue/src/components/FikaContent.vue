<template>
  <div class="content-wrapper">
    <b-form>
      <b-form-file v-model="file"
                   :state="Boolean(file)"
                   placeholder="Choose a SQLite database file..."
                   accept=".sql, .sqlite, .sqlite3, .sql3"
                   class="file-input">
      </b-form-file>
    </b-form>
    <div class="data" v-if="db">
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
                <td><b-button class="query-btn"
                            @click="query(table.tblName)">
                      {{ table.tblName }}
                    </b-button></td>
                <td><pre>{{ table.cols.map(e => e.name).join(', ') }}</pre></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="answer">
        <h4>Query response</h4>
        <div class="inside-card">
          <pre>{{ answer }}</pre>
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
                <td><pre>{{ index.cols.map(e => e.name).join(', ') }}</pre></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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
      answer: null,
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
    async query(name) {
      this.answer = null;
      this.answer = (await this.db.query.table(name)).toString(20);
    },
  },
};
</script>

<style scoped>
h4 {
  width: 100%;
  font-size: 1.2rem;
  padding: 0 0 0 10px;
  line-height: 2rem;
  border-bottom: 1px solid gray;
}

thead, h5 {
  margin: 0;
  font-size: .9rem;
  font-weight: bold;
}

td {
  padding: 0 10px 0 0;
  vertical-align: top;
}

pre {
  margin: 2px 0 5px 0;
  line-height: 1rem;
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

.query-btn {
  width: 100%;
  height: 2rem;
  margin: 1px 0;
  padding: 0 2px;
  line-height: 1rem;
  color: white;
  background-color: purple;
  border: none;
}

.answer, .db-header, .master-tables, .master-indices {
  min-width: 200px;
  margin: 10px 10px 0 0;
  border: 1px solid gray;
  border-radius: 5px;
}

.inside-card {
  padding: 0 10px 5px 10px;
  overflow: scroll;
}
</style>
