<template >
  <div class="margin_bottom">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand>Karteikarten</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="user">
            <router-link class="nav-item nav-link active" to="/dashboard">Dashboard</router-link>
          </b-nav-item>
          <b-nav-item v-if="!user">
            <router-link class="nav-item nav-link" to="/login">Login</router-link>
          </b-nav-item>
          <b-nav-item v-if="!user">
            <router-link class="nav-item nav-link" to="/register">Register</router-link>
          </b-nav-item>
          <b-nav-item v-if="user">
            <router-link class="nav-item nav-link" to="/mydecks">My Decks</router-link>
          </b-nav-item>
          <b-nav-item v-if="user">
            <router-link class="nav-item nav-link" to="/profile">Profile</router-link>
          </b-nav-item>
          <b-nav-item v-if="user">
            <router-link class="nav-item nav-link" to="/logout">Logout</router-link>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: "navigation",
  computed: {
    user() {
      return this.$store.state.accessToken;
    }
  }
};
</script>

<style>
.margin_bottom {
  margin-bottom: 1em;
}
</style>
