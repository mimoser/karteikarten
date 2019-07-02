<template>
  <div id="app">
    <div>
      <Navigation></Navigation>
    </div>
    <router-view />
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
// import {store} from './store/store'
import Navigation from "./components/Navigation";

export default {
  name: "app",
  components: {
    Navigation
  },
  computed: {},
  methods: {}
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 10px; */
}

#form {

}
</style>
