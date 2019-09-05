<template>
  <b-container fluid>
    <b-row>
      <b-col>
          <h4>Question</h4>
          <vue-editor id="question-editor" v-model="questionHtml" useCustomImageHandler @imageAdded="handleImageAdded"></vue-editor>
          <h4>Answer</h4>
          <vue-editor id="answer-editor" v-model="answerHtml" useCustomImageHandler @imageAdded="handleImageAdded"></vue-editor>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { VueEditor } from "vue2-editor";

export default {
  name: "Cardeditor",
  components: {
    VueEditor
  },

  data() {
    return {
      questionHtml: "<h1>Input a question here...</h1>",
      answerHtml: "<h1>Input the answer to the above question...</h1>"
    };
  },

  methods: {
    handleImageAdded: function (file, Editor, cursorLocation, resetUploader){
      // may be the image needs to be resized before getting added
      // or some file extensions may be not allowed
      let fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onloadend = function(evt){
        Editor.insertEmbed(cursorLocation, "image", evt.target.result);
        resetUploader();
      }
    },
    onSave(){
          console.log("saved!");
          // handle 
          
      }
  }
};
</script>

<style>
</style>
