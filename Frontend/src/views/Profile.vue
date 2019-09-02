<template>
  <b-container fluid>
    <h2>{{$store.getters.user.name}}</h2>
    <b-form-row class="justify-content-center">
      <b-col md="md">
        <b-form @submit.stop.prevent="update">
          <b-form-group
            :invalid-feedback="veeErrors.first('email')"
            :state="!veeErrors.has('email')"
          >
            <b-form-input
              ref="emailInput"
              type="text"
              name="email"
              v-model="email"
              v-validate="'email'"
              :placeholder="email"
              :state="!veeErrors.has('email')"
            />
          </b-form-group>
          <b-form-group
            :invalid-feedback="veeErrors.first('username')"
            :state="!veeErrors.has('username')"
          >
            <b-form-input
              ref="usernameInput"
              type="text"
              name="username"
              v-model="username"
              placeholder="Username"
              v-validate="{min: 3}"
              :state="!veeErrors.has('username')"
            />
          </b-form-group>
          <b-form-group
            :invalid-feedback="veeErrors.first('password')"
            :state="!veeErrors.has('password')"
          >
            <b-form-input
              @click="onPasswordClicked"
              @blur="onPasswordBlured"
              ref="passwordInput"
              v-validate="{min: 8, regex:'(?=.*[0-9])'}"
              type="password"
              name="password"
              v-model="password"
              placeholder="Password"
              :state="!veeErrors.has('password')"
            />
          </b-form-group>
          <div ref="passwordConfirmFields" hidden>
            <b-form-group
              :invalid-feedback="veeErrors.first('passwordConfirm')"
              :state="!veeErrors.has('passwordConfirm')"
            >
              <b-form-input
                ref="passwordConfirmInput"
                type="password"
                name="passwordConfirm"
                v-model="passwordConfirm"
                v-validate="{confirmed: 'passwordInput'}"
                placeholder="Confirm password"
                :state="!veeErrors.has('passwordConfirm')"
              />
            </b-form-group>
            <b-form-group
              :invalid-feedback="veeErrors.first('oldPassword')"
              :state="!veeErrors.has('oldPassword')"
            >
              <b-form-input
                ref="oldPasswordInput"
                type="password"
                name="oldPasswordInput"
                v-model="oldPassword"
                placeholder="Your old password"
                :state="!veeErrors.has('oldPasswordInput')"
              />
            </b-form-group>
          </div>
          <b-button type="submit" variant="dark" :disabled="veeErrors.any()">Update</b-button>
        </b-form>
      </b-col>
    </b-form-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      username:
        this.$store.getters.user.name ||
        JSON.parse(localStorage.getItem("user")).name,
      email:
        this.$store.getters.user.email ||
        JSON.parse(localStorage.getItem("user")).email,
      username:
        this.$store.getters.user.name ||
        JSON.parse(localStorage.getItem("user")).name,
      oldPassword: null,
      password: null,
      passwordConfirm: null
    };
  },
  methods: {
    update(e) {
      e.preventDefault();
      this.$validator.validateAll().then(result => {
        if (!result) {
          return;
        }

        let profileData = {};

        if (this.username !== JSON.parse(localStorage.getItem("user")).name) {
          profileData.username = this.username;
        }
        if (this.email !== JSON.parse(localStorage.getItem("user")).email) {
          profileData.email = this.email;
        }
        if (this.password) {
          profileData.password = this.password;
          profileData.oldPassword = this.oldPassword;
        }
        if (Object.keys(profileData).length > 0) {
          this.$store
            .dispatch("updateProfile", profileData)
            .then(response => {
              console.log(response);
              this.$bvToast.toast(`Profile data successfully updated`, {
                title: "Update succeeded",
                variant: "info",
                toaster: "b-toaster-top-center",
                autoHideDelay: 3000,
                appendToast: true
              });
            })
            .catch(error => {
              console.log(error);
              this.$bvToast.toast(`${error.response.data.error}`, {
                title: "Update failed",
                variant: "warning",
                toaster: "b-toaster-top-center",
                autoHideDelay: 3000,
                appendToast: true
              });
            });
        }
      });
    },
    onPasswordClicked() {
      // console.log("onPasswordClicked");
      this.$refs.passwordConfirmFields.hidden = false;
    },
    onPasswordBlured() {
      if (!this.password) {
        this.$refs.passwordConfirmFields.hidden = true;
        this.password = null;
      }
    }
  }
};
</script>

<style>
</style>

