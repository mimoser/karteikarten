<template>
  <div>
    <h2>Login</h2>
    <form v-on:submit="login">
      <input type="email" name="email" v-model="email">
      <br>
      <input type="password" name="password" v-model="password">
      <br>
      <input type="submit" value="Login">
    </form>
  </div>
</template>

<script>
import router from "../router";
import axios from "axios";
// import store from '../store/store';

export default {
  name: "Login",
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login() {
      this.$store
        .dispatch("retrieveToken", {
          email: this.email,
          password: this.password
        })
        .then(response => {
          this.$router.push({ name: "dashboard" });
        }).catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style>
</style>
