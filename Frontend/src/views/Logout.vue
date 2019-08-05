<template>
  <div></div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch("destroyToken").then(response => {
      // eslint-disable-next-line
      this.$router.push({ name: "login" });
    });
  }
};
</script>

<style>
</style>
