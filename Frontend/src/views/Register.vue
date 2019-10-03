<template>
  <b-container fluid>
    <h2>Register</h2>
    <b-form-row class="justify-content-center">
      <b-col md="auto">
        <b-form @submit.stop.prevent="register">
          <b-form-group
            :invalid-feedback="veeErrors.first('email')"
            :state="!veeErrors.has('email')"
          >
            <b-form-input
              type="text"
              name="email"
              v-model="email"
              v-validate="'required|email'"
              placeholder="Email"
              :state="!veeErrors.has('email')"
            />
          </b-form-group>
          <b-form-group
            :invalid-feedback="veeErrors.first('username')"
            :state="!veeErrors.has('username')"
          >
            <b-form-input
              type="text"
              name="username"
              v-model="username"
              placeholder="Username"
              v-validate="{required: true, min: 3}"
              :state="!veeErrors.has('username')"
            />
          </b-form-group>
          <b-form-group
            :invalid-feedback="veeErrors.first('password')"
            :state="!veeErrors.has('password')"
          >
            <b-form-input
              v-validate="{required: true, min: 8, regex:'(?=.*[0-9])'}"
              type="password"
              name="password"
              v-model="password"
              placeholder="Password"
              ref="password"
              :state="!veeErrors.has('password')"
            />
          </b-form-group>
          <b-form-group
            :invalid-feedback="veeErrors.first('passwordConfirm')"
            :state="!veeErrors.has('passwordConfirm')"
          >
            <b-form-input
              type="password"
              name="PpasswordConfirm"
              v-model="passwordConfirm"
              v-validate="{required: true, confirmed: 'password'}"
              placeholder="Confirm password"
              :state="!veeErrors.has('passwordConfirm')"
            />
          </b-form-group>
          <b-button type="submit" variant="dark" :disabled="veeErrors.any()">Register</b-button>
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
      password: "",
      passwordConfirm: "",
      username: ""
    };
  },
  methods: {
    register(e) {
      e.preventDefault();
      this.$validator.validateAll().then(result => {
        if (!result) {
          return;
        }
        this.$store
          .dispatch("register", {
            email: this.email,
            password: this.password,
            username: this.username
          })
          .then(response => {
            // alert(response.data.access_token);
            this.$bvToast.toast(`Account created successfully`, {
              title: "Registration succeeded",
              variant: "info",
              toaster: "b-toaster-top-center",
              autoHideDelay: 3000,
              appendToast: true
            });
            let that = this;
            setTimeout(function() {
              that.$router.push({ name: "login" });
            }, 3000);
          })
          .catch(error => {
            this.$bvToast.toast(`${error.response.data.error}`, {
              title: "Registration failed",
              variant: "warning",
              toaster: "b-toaster-top-center",
              autoHideDelay: 5000,
              appendToast: true
            });

            // eslint-disable-next-line
            console.log(error);
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
