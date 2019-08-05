<template>
  <b-container fluid>
    <h2>Password reset</h2>
    <b-form-row class="justify-content-center">
      <b-col md="auto">
        <b-form v-on:submit="resetPassword">
          <b-form-group>
            <b-form-input type="email" name="email" v-model="email" placeholder="Enter your email" />
            <br />
            <b-button type="submit" variant="dark">Reset</b-button>
          </b-form-group>
        </b-form>
      </b-col>
    </b-form-row>
  </b-container>
</template>

<script>
import router from "../router";
import axios from "axios";

export default {
  name: "ForgotPassword",
  data() {
    return {
      email: ""
    };
  },
  methods: {
    resetPassword(e) {
      e.preventDefault();
      axios
        .post("http://localhost:3000/resetPassword", { email: this.email })
        .then(response => {
          this.$bvToast.toast('New password will be sent to the email you specified. Please make sure you change it after successefully logging in!', {
            title: "Password reset",
            variant: "info",
            toaster: "b-toaster-top-center",
            autoHideDelay: 5000,
            appendToast: true
          });
          let that = this;
          setTimeout(function() { that.$router.push({ name: "login" }); }, 5000);
          
        });
    }
  }
};
</script>

<style>
</style>
