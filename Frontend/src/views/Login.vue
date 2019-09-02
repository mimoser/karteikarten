<template>
  <b-container fluid>
    <h2>Login</h2>
    <b-form-row class="justify-content-center">
      <b-col md="auto">
        <b-form v-on:submit="login">
          <b-form-group
            :invalid-feedback="veeErrors.first('email')"
            :state="!veeErrors.has('email')"
          >
            <b-form-input
              v-validate="{required: true, email: true}"
              type="text"
              name="email"
              v-model="email"
              placeholder="Enter your email"
              :state="!veeErrors.has('email')"
            />
          </b-form-group>
          <b-form-group
            :invalid-feedback="veeErrors.first('password')"
            :state="!veeErrors.has('password')"
          >
            <b-form-input
              v-validate="{required: true}"
              type="password"
              name="password"
              v-model="password"
              placeholder="Enter your password"
              :state="!veeErrors.has('password')"
            />
          </b-form-group>
          <b-button type="submit" variant="dark" :disabled="veeErrors.any()">Login</b-button>
          <router-link to="/forgotPassword">Forgot password?</router-link>
        </b-form>
      </b-col>
    </b-form-row>
  </b-container>
</template>

<script>
import router from "../router";
// import axios from "axios";

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
      this.$validator.validateAll().then(result => {
        if (!result) {
          return;
        }
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
            // console.log(error);
            this.$bvToast.toast(
              `Wrong Credentials! Please try with another credentials.`,
              {
                title: "Login failure",
                variant: "warning",
                toaster: "b-toaster-top-center",
                autoHideDelay: 3000,
                appendToast: true
              }
            );
            this.$store.commit('destroyToken');
          });
      });
    },
    validateState(ref) {
      if (
        this.veeFields[ref] &&
        (this.veeFields[ref].dirty || this.veeFields[ref].validated)
      ) {
        return !this.veeErrors.has(ref);
      }
      return null;
    }
  }
};
</script>

<style>
</style>
