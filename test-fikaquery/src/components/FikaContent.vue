<template>
  <div class="content-wrapper">
    <b-form>
      <b-form-file v-model="file"
                   :state="Boolean(file)"
                   placeholder="Choose a fikaquery file..."
                   accept=".json, .JSON"
                   class="file-input">
      </b-form-file>
    </b-form>
    <div v-if="file">
      <b-button class="mt-2 mr-2" @click="readByte(1, 16)">Read __</b-button>
      <b-button class="mt-2 mr-2" @click="readByte(20, 242)">Read __index</b-button>
    </div>
    <div>
      {{ message }}
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
      message: null,
    };
  },
  watch: {
    file() {
      this.fq = fikaquery.init(FileReader, this.file);
    },
  },
  methods: {
    readByte(byteNum, length) {
      this.fq.readSlice(byteNum, length).then((res) => {
        this.message = res.target.result;
      });
    },
  },
};
</script>

<style scoped>
.file-input {
  max-width: 500px;
  margin: 20px 0 0 0;
}
</style>
