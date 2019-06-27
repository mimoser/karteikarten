<template></template>

<script>
export default {
  created() {
    debugger;
    this.$store.dispatch("destroyToken").then(response => {
      this.$router.push({ name: "login" });
    });
  }
};
</script>

<style>
</style>
