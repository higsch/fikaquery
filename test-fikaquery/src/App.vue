<template>
  <div id="app">
    <b-container>
      <h1>fikaquery test</h1>
      <h5>Quick tester for the merge between database and JSON.</h5>
      <fika-content />
    </b-container>
  </div>
</template>

<script>
import FikaContent from './components/FikaContent.vue';

export default {
  name: 'app',
  components: {
    FikaContent,
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Asar|Domine');

html, body {
  font-size: 15px;
}

h1 {
  font-family: "Domine", serif;
  font-size: 3rem;
}

h4, h5 {
  font-family: "Asar", serif;
}

#app {
  padding: 20px 0 0 0;
}
</style>
