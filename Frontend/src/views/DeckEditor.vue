<template>
  <div>
    <router-link to="/myDecks">Back</router-link>

    <b-card bg-variant="light">
      <b-form-group
        label-cols-lg="3"
        label="Deck data"
        label-size="lg"
        label-class="font-weight-bold pt-0"
        class="mb-0"
      >
        <b-form-group
          label-cols-sm="3"
          label="Title:"
          label-align-sm="right"
          label-for="nested-title"
        >
          <b-form-input id="nested-title" v-model="title"></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-sm="3"
          label="Public:"
          label-align-sm="right"
          label-for="nested-public"
          class="mb-0"
        >
          <b-form-checkbox id="nested-public" v-model="isPublic" switch></b-form-checkbox>
        </b-form-group>

        <b-form-group
          label-cols-sm="3"
          label="Tags:"
          label-align-sm="right"
          label-for="nested-tags"
          class="mb-0"
        >
          <vue-tags-input v-model="tag" :tags="tags" @tags-changed="newTags => tags = newTags" />
        </b-form-group>
      </b-form-group>
    </b-card>

    <b-button v-b-modal.cardeditor-modal-center>Add new card</b-button>

    <b-modal
      id="cardeditor-modal-center"
      centered
      size="xl"
      title="New Card"
      @ok="onSave"
      ok-title="Save"
    >
      <b-container fluid>
        <b-row>
          <b-col>
            <h4>Question</h4>
            <vue-editor
              id="question-editor"
              v-model="questionHtml"
              useCustomImageHandler
              @imageAdded="handleImageAdded"
            ></vue-editor>
            <h4>Answer</h4>
            <vue-editor
              id="answer-editor"
              v-model="answerHtml"
              useCustomImageHandler
              @imageAdded="handleImageAdded"
            ></vue-editor>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
  </div>
</template>

<script>
import Cardeditor from "../components/CardEditor";
import { VueEditor } from "vue2-editor";
import VueTagsInput from '@johmun/vue-tags-input';

export default {
  name: "deckEditor",
  components: {
    Cardeditor,
    VueEditor,
    VueTagsInput
  },
  data() {
    return {
      title: null,
      tag: '',
      tags: [],
      isPublic: false,
      cards: [],
      questionHtml: null,
      answerHtml: null
    };
  },
  methods: {
    onSave() {
      // create new card with question and answer and save it to the cards array
      // after saving clear question and answer variables
    },
    handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {
      // may be the image needs to be resized before getting added
      // or some file extensions may be not allowed
      let fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onloadend = function(evt) {
        Editor.insertEmbed(cursorLocation, "image", evt.target.result);
        resetUploader();
      };
    }
  }
};
</script>

<style>
</style>
