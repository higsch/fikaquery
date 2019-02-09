<template>
  <div id="app">
    <b-container fluid>
      <div class="header">
        <h1>fikaQuery</h1>
        <img class="logo" src="https://lehtiolab.github.io/img/logo_big.png" alt="group logo" />
      </div>
      <h5>SQLite loader to test the fikaquery parser.</h5>
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
@import url('https://fonts.googleapis.com/css?family=Asar|Lobster+Two');

html, body {
  font-size: 15px;
}

h1 {
  font-family: "Lobster Two", sans-serif;
  font-size: 4rem;
}

h4 {
  font-family: "Asar", serif;
}

#app {
  padding: 20px 0 20px 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  width: 100%;
  height: 6rem;
}

img.logo {
  height: 2.3rem;
}
</style>
