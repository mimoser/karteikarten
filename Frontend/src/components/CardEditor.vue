<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <vue-editor v-model="content" useCustomHandler @imageAdded="handleImageAdded"></vue-editor>
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
    handleImageAdded: function (file, Editor, cursorLocation, resetUploader){
      debugger;
      console.log(file);
    }
  }
};
</script>

<style>
</style>
