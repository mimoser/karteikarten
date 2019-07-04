<template>
  <div></div>
</template>

<script>
export default {
  created() {
    if(confirm("Willst du dich wirklich ausloggen?")){
      this.$store.dispatch('destroyToken').then(response => {
        // eslint-disable-next-line
        this.$router.push({ name: "login" });
      });
    } 
  }
};
</script>

<style>
</style>
