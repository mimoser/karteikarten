<template>
  <b-container fluid>
    <h2>Register</h2>
    <b-form-row class="justify-content-center">
      <b-col md="auto">
        <b-form v-on:submit="register">
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
            <b-button type="submit" variant="primary">Register</b-button>
          </b-form-group>
        </b-form>
      </b-col>
    </b-form-row>
  </b-container>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    register(e) {
        e.preventDefault();
        this.$store
          .dispatch("register", {
            email: this.email,
            password: this.password
          })
          .then(response => {
            // alert(response.data.access_token);
            this.$router.push({ name: "dashboard" });
          })
          .catch(error => {
            // eslint-disable-next-line
          });
    }
  }
};
</script>

<style>
</style>
