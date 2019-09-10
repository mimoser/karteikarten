<template>
  <div v-if="loading">
    <div class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
  </div>
  <div v-else>
    <b-container fluid>
      <b-row>
        <router-link to="/mydecks">Back</router-link>
      </b-row>
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
            <b-form-input id="nested-title" v-model="deck.title"></b-form-input>
          </b-form-group>

          <b-form-group
            label-cols-sm="3"
            label="Public:"
            label-align-sm="right"
            label-for="nested-public"
            class="mb-0"
          >
            <b-form-checkbox id="nested-public" v-model="deck.isPublic" switch></b-form-checkbox>
          </b-form-group>

          <b-form-group
            label-cols-sm="3"
            label="Tags:"
            label-align-sm="right"
            label-for="nested-tags"
            class="mb-0"
          >
            <vue-tags-input
              v-model="tag"
              :tags="deck.tags"
              @tags-changed="newTags => deck.tags = newTags"
            />
          </b-form-group>
        </b-form-group>
      </b-card>
    </b-container>
    <!-- cards list -->
    <b-container fluid>
      <!-- <b-row>
        <b-col>
          <b-form-group>
            <b-input-group>
              <b-form-input v-model="cardsTableProps.filter" placeholder="Type to Search"></b-form-input>
              <b-input-group-append>
                <b-button :disabled="!cardsTableProps.filter" @click="cardsTableProps.filter = ''">Clear</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>-->
      <b-row>
        <b-col>
          <b-table
            id="cards-table"
            :items="cardsTableProps.items"
            :fields="cardsTableProps.fields"
            :per-page="cardsTableProps.perPage"
            :current-page="cardsTableProps.currentPage"
            small
            responsive
            striped
          >
            <!-- <template v-slot:cell(index)="data">{{ data.index + 1 }}</template> -->

            <span slot="question" slot-scope="data" v-html="wrapInIframe(data.value)"></span>

            <span slot="answer" slot-scope="data" v-html="wrapInIframe(data.value)"></span>
          </b-table>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-pagination
            v-model="cardsTableProps.currentPage"
            :total-rows="rows"
            :per-page="cardsTableProps.perPage"
            aria-controls="cards-table"
            align="center"
          ></b-pagination>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button @click="onSaveDeck">Save Deck</b-button>
        </b-col>
        <b-col>
          <b-button @click="onDeleteDeck">Delete Deck</b-button>
        </b-col>
        <b-col>
          <b-button v-b-modal.cardeditor-modal-center right>Add new card</b-button>
        </b-col>
      </b-row>
    </b-container>
    <!-- cards list end -->

    <b-modal
      id="cardeditor-modal-center"
      centered
      size="xl"
      title="New Card"
      @ok="onAddCard"
      ok-title="OK"
    >
      <b-container fluid>
        <b-row>
          <b-col>
            <h4>Question</h4>
            <vue-editor
              id="question-editor"
              :editorOptions="editorSettings"
              v-model="questionHtml"
              useCustomImageHandler
              @imageAdded="handleImageAdded"
            ></vue-editor>
            <h4>Answer</h4>
            <vue-editor
              id="answer-editor"
              :editorOptions="editorSettings"
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
import VueTagsInput from "@johmun/vue-tags-input";

import Quill from "quill";

import { VueEditor } from "vue2-editor";
import { ImageDrop } from "quill-image-drop-module";
import ImageResize from "quill-image-resize-module";

Quill.register("modules/imageDrop", ImageDrop);
Quill.register("modules/imageResize", ImageResize);

export default {
  name: "deck",
  components: {
    Cardeditor,
    VueEditor,
    VueTagsInput
  },
  data() {
    return {
      loading: true,
      editorSettings: {
        modules: {
          imageDrop: true,
          imageResize: {}
        }
      },
      deck: {
        title: null,
        tags: [],
        isPublic: false,
        averageRating: null,
        cards: [],
        _id: null
      },
      cardsTableProps: {
        perPage: 10,
        currentPage: 1,
        items: [],
        fields: [
          { key: "question", label: "Question" },
          { key: "answer", label: "Answer" },
          { key: "difficulty", label: "Difficulty" }
        ]
      },
      tag: "",
      questionHtml: "",
      answerHtml: ""
    };
  },
  computed: {
    rows() {
      return this.cardsTableProps.items.length;
    }
  },
  created() {
    if (this.$route.params.id) {
      this.fetchDeck();
    } else {
      this.loading = false;
    }
    this.cardsTableProps.items = this.deck.cards;
  },
  methods: {
    fetchDeck() {
      let that = this;
      this.$store
        .dispatch("fetchDeck", this.$route.params.id)
        .then(response => {
          that.deck = response.data;
          that.cardsTableProps.items = that.deck.cards;
          that.loading = false;
        })
        .catch(error => {
          this.$bvToast.toast(`Couldn't fetch deck`, {
            title: "Problem fetching deck",
            variant: "warning",
            toaster: "b-toaster-top-center",
            autoHideDelay: 3000,
            appendToast: true
          });
        });
    },
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      // may be the image needs to be resized before getting added
      // or some file extensions may be not allowed
      let fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onloadend = function(evt) {
        Editor.insertEmbed(cursorLocation, "image", evt.target.result);
        resetUploader();
      };
    },
    onAddCard() {
      // let qHtml = `<iframe>${this.questionHtml}</iframe>`;
      // let aHtml = `<iframe>${this.answerHtml}</iframe>`;
      this.deck.cards.push({
        question: this.questionHtml,
        answer: this.answerHtml,
        difficulty: 2.5
      });
      this.questionHtml = "";
      this.answerHtml = "";
    },
    onTableRowClicked() {
      console.log("sakldfjaslk");
    },
    onSaveDeck() {
      this.$store
        .dispatch("saveDeck", this.deck)
        .then(response => {
          if (response.data._id) {
            this.deck._id = response.data._id;
            this.$router.push({ name: "deck", params: { id: this.deck._id } });
          }
          this.$bvToast.toast(`Deck saved`, {
            title: "Deck saved",
            variant: "info",
            toaster: "b-toaster-top-center",
            autoHideDelay: 3000,
            appendToast: true
          });
          // let that = this;
          //   setTimeout(function() {
          //     that.$router.push({ name: "deck", params: { id: that.deck._id } });
          //   }, 3000);
        })
        .catch(error => {
          this.$bvToast.toast(`Couldn't save deck`, {
            title: "Problem saving deck",
            variant: "warning",
            toaster: "b-toaster-top-center",
            autoHideDelay: 3000,
            appendToast: true
          });
        });
    },
    onDeleteDeck() {
      alert("Muss noch implementiert werden!");
    },
    wrapInIframe(html) {
      return `<iframe srcdoc='${html}'></iframe>`;
    }
  }
};
</script>

<style>
</style>