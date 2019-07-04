<template>
  <b-container fluid>
    <h2>Login</h2>
    <b-form-row class="justify-content-center">
      <b-col md="auto">
        <b-form v-on:submit="login">
          <b-form-group>
            <b-form-input type="email" name="email" v-model="email" placeholder="Enter your email" />
            <br />
            <b-form-input
              type="password"
              name="password"
              v-model="password"
              placeholder="Enter your password"
            />
            <br />
            <b-button type="submit" variant="dark">Login</b-button>
          </b-form-group>
        </b-form>
      </b-col>
    </b-form-row>
  </b-container>
</template>

<script>
import router from "../router";
import axios from "axios";

// import store from '../store/store';

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    login(e) {
      e.preventDefault();

      this.$store
        .dispatch("retrieveToken", {
          email: this.email,
          password: this.password
        })
        .then(response => {
          // alert(response.data.access_token);
          this.$router.push({ name: "dashboard" });
        })
        .catch(error => {
          // eslint-disable-next-line
            console.log(error);
        });
    }
  }
};
</script>

<style>
</style>
