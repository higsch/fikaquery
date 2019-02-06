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
    <div class="custom-content-btn" v-if="db">
      <b-button @click="loadPage(1)">Load page</b-button>
    </div>
    <div class="data" v-if="db">
      <div class="db-header" v-if="db.header">
        Header string: <pre>{{ db.header.headerString }}</pre>
        File changes: <pre>{{ db.header.fileChangeCounter }}</pre>
        Number of pages: <pre>{{ db.header.numPages }}</pre>
        Page size: <pre>{{ db.header.pageSize }}</pre>
        Version <pre>{{ db.header.version }}</pre>
      </div>
      <div class="master" v-if="master">
        Master tables:
        <li v-for="table in master" :key="table.name">
          {{ table.tblName }} ({{ table.rootPage }})
        </li>
      </div>
      <div class="custom-content" v-if="customContent">
        Page: <pre>{{ customContent }}</pre>
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
      customContent: null,
    };
  },
  watch: {
    async file() {
      this.db = await fikaquery.connect(FileReader, this.file);
      this.master = this.db.master.tables;
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
    async loadPage(pageNumber) {
      const customContent = (await this.db.loadPage(pageNumber)).raw;
      this.customContent = this.formatBinArray(customContent);
    },
  },
};
</script>

<style scoped>
.file-input {
  max-width: 500px;
  margin: 20px 0 0 0;
}

.data {
  display: flex;
  align-items: flex-start;
}

.custom-content-btn {
  margin: 10px 0;
}

.db-header, .master, .custom-content {
  display: inline-block;
  min-width: 400px;
  margin: 0 10px 0 0;
  padding: 10px 20px;
  border: 1px solid gray;
  border-radius: 5px;
}
</style>
