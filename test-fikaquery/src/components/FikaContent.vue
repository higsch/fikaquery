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
  </div>
</template>

<script>
import fq from '../../../src/fikaquery';

export default {
  name: 'FikaContent',
  data() {
    return {
      file: null,
    };
  },
  watch: {
    file(file) {
      fq.readIndex(file, (index) => {
        console.log(index);
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
