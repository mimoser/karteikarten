<template >
  <b-container>
    <div class="margin_bottom">
      <b-navbar toggleable="lg" type="light" variant="light">
        <b-navbar-brand>Karteikarten</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item v-if="user">
              <router-link active-class="active" class="nav-item nav-link" to="/dashboard">Dashboard</router-link>
            </b-nav-item>
            <b-nav-item v-if="!user">
              <router-link active-class="active" class="nav-item nav-link" to="/login">Login</router-link>
            </b-nav-item>
            <b-nav-item v-if="!user">
              <router-link active-class="active" class="nav-item nav-link" to="/register">Register</router-link>
            </b-nav-item>
            <b-nav-item v-if="user">
              <router-link active-class="active" class="nav-item nav-link" to="/mydecks">My Decks</router-link>
            </b-nav-item>
            <b-nav-item v-if="user">
              <router-link active-class="active" class="nav-item nav-link" to="/profile">Profile</router-link>
            </b-nav-item>
            <b-nav-item v-if="user">
              <router-link active-class="active" class="nav-item nav-link" to="/logout">Logout</router-link>
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
  </b-container>
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
