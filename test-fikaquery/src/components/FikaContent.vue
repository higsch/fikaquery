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
    <div v-if="file">
      <!-- <b-button class="mt-2 mr-2" @click="readIndex">Read __</b-button>
      <b-button class="mt-2 mr-2" @click="readIndex">Read __index</b-button> -->
    </div>
    <div class="data" v-if="db.loaded">
      <h4>Data</h4>
      <div class="db-header">
        <h5>Database header</h5>
        <pre>{{ db.header }}</pre>
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
      fq: null,
      db: {
        loaded: false,
        header: null,
      },
    };
  },
  watch: {
    file() {
      this.fq = fikaquery.connect(FileReader, this.file);
      if (this.fq) {
        this.db.loaded = true;
        this.fq.getDbHeader().then((res) => {
          this.db.header = this.formatBinArray(res);
        });
      } else {
        this.db.loaded = false;
      }
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

h5 {
  font-size: 1rem;
}
</style>
