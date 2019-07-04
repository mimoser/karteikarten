<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <vue-editor v-model="content"></vue-editor>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { VueEditor } from "vue2-editor";

export default {
  components: {
    VueEditor
  },

  data() {
    return {
      content: "<h1>Some initial content</h1>"
    };
  },

  methods: {
    
  }
};
</script>

<style>
</style>
