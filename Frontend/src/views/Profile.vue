<template>
  <div>
    <h1>Profile view !!</h1>
    <div>
      <b-tabs content-class="mt-3">
        <b-tab title="General Information" active>
            
        </b-tab>
        <b-tab title="Change Password">
          <p>I'm the second tab</p>
        </b-tab>
        <b-tab title="Change Email">
          <p>I'm a disabled tab!</p>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      oldPassword: null,
      newPassword: null,
      newPasswordConfirm: null
    };
  }
};
</script>

<style>
</style>

