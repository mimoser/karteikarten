<template>
  <div id="app">
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand>
           Karteikarten
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item >
              <router-link class="nav-item nav-link active" to="/">Dashboard</router-link>
            </b-nav-item>
            <b-nav-item>
              <router-link class="nav-item nav-link" to="/login">Login</router-link>
            </b-nav-item>
            <b-nav-item>
              <router-link class="nav-item nav-link" to="/register">Register</router-link>
            </b-nav-item>
            <b-nav-item>
              <router-link class="nav-item nav-link" to="/about">About</router-link>
            </b-nav-item>
             <b-nav-item>
              <router-link class="nav-item nav-link" to="/logout">Logout</router-link>
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <router-view/>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
// import {store} from './store/store'

export default {
  name: "app",
  components: {
    // HelloWorld
  },
  computed: {
    user(){
      return this.$store.getters.user;
    }
  },
  methods: {
  }
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
</style>
