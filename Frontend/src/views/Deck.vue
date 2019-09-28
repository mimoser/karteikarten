<template>
  <b-container>
    <div v-if="loading">
      <div class="text-center">
        <b-spinner variant="primary" label="Text Centered"></b-spinner>
      </div>
    </div>
    <div v-else>
      <b-row>
        <b-col cols="12">
          <b-card bg-variant="light">
            <b-row>
              <b-col cols="4">
                <b-form-group
                  v-bind="deck"
                  :label="deck.title"
                  label-size="lg"
                  label-class="font-weight-bold pt-0"
                  class="mb-0"
                ></b-form-group>
              </b-col>
              <b-col cols="8">
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
              </b-col>
            </b-row>
            <b-row align-h="start">
              <b-button size="sm" pill variant="outline-secondary" @click="onSaveDeck">Save Deck</b-button>
              <b-button size="sm" pill variant="outline-secondary" @click="onDeleteDeck">Delete Deck</b-button>
              <b-button size="sm" pill variant="outline-secondary" @click="exportDeck">Export Deck</b-button>
              <b-button
                size="sm"
                pill
                variant="outline-secondary"
                v-b-modal.cardeditor-modal-center
              >Add new card</b-button>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
      <b-container>
        <b-row align-h="between">
          <b-card-group columns>
            <b-card
              v-for="card in deck.cards"
              v-bind="card"
              v-bind:key="card.id"
              bg-variant="light"
              text-variant="black"
              class="text-center"
              header-tag="header"
              footer-tag="footer"
              style="max-width: 20rem;"
            >
              <template v-slot:header>
                <div>Hier stehen Statistiken zur Karte</div>
              </template>

              <b-card-text style="min-height: 10rem; max-height: 10rem; overflow: hidden;">
                <div v-html="card.question"></div>
                <!-- <iframe style="-webkit-transform:scale(0.5);-moz-transform-scale(0.5);" :srcdoc="card.question"></iframe> -->
              </b-card-text>

              <template v-slot:footer>
                <b-container>
                  <b-row align-h="between">
                    <b-button
                      size="sm"
                      pill
                      variant="outline-secondary"
                      @click="onEditCard(card)"
                      v-b-modal.update-cardeditor-modal-center
                    >Edit</b-button>
                    <b-button
                      size="sm"
                      pill
                      variant="outline-secondary"
                      @click="onDeleteCard(card)"
                    >Delete</b-button>
                  </b-row>
                </b-container>
              </template>
            </b-card>
          </b-card-group>
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
                :editorToolbar="editorSettings.toolbar"
              ></vue-editor>
              <h4>Answer</h4>
              <vue-editor
                id="answer-editor"
                :editorOptions="editorSettings"
                v-model="answerHtml"
                useCustomImageHandler
                @imageAdded="handleImageAdded"
                :editorToolbar="editorSettings.toolbar"
              ></vue-editor>
            </b-col>
          </b-row>
        </b-container>
      </b-modal>

      <b-modal
        id="update-cardeditor-modal-center"
        centered
        size="xl"
        title="Update card"
        @ok="onUpdateCard()"
        @close="clearCurrentlySelectedCard()"
        @cancel="clearCurrentlySelectedCard()"
        ok-title="OK"
      >
        <b-container fluid>
          <b-row>
            <b-col>
              <h4>Question</h4>
              <vue-editor
                id="question-editor"
                :editorOptions="editorSettings"
                :editorToolbar="editorSettings.toolbar"
                v-model="questionHtml"
                useCustomImageHandler
                @imageAdded="handleImageAdded"
              ></vue-editor>
              <h4>Answer</h4>
              <vue-editor
                id="answer-editor"
                :editorOptions="editorSettings"
                :editorToolbar="editorSettings.toolbar"
                v-model="answerHtml"
                useCustomImageHandler
                @imageAdded="handleImageAdded"
              ></vue-editor>
            </b-col>
          </b-row>
        </b-container>
      </b-modal>
    </div>
  </b-container>
</template>

<script>
import Cardeditor from "../components/CardEditor";
import VueTagsInput from "@johmun/vue-tags-input";
import axios from "axios";
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
        },
        toolbar: [
          [{ header: [false, 1, 2, 3, 4, 5, 6] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ color: [] }, { background: [] }],
          ["image", "code-block"]
        ]
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
      answerHtml: "",
      currentlySelectedCard: null
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
            autoHideDelay: 1500,
            appendToast: true
          });
        });
    },
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      // may be the image needs to be resized before getting added
      // or some file extensions may be not allowed

      var canvas = document.createElement("canvas");

      var ctx = canvas.getContext("2d");

      var image = new Image();
      image.onload = function() {
        var maxWidth = 250;
        var maxHeight = 250;
        var ratio = Math.min(maxHeight / this.width, maxHeight / this.height);
        var width = this.width * ratio;
        var height = this.height * ratio;

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(image, 0, 0, width, height);
        Editor.insertEmbed(
          cursorLocation,
          "image",
          canvas.toDataURL("image/jpeg", 1.0)
        );
        URL.revokeObjectURL(image.src);
        resetUploader();
      };
      image.src = URL.createObjectURL(file);

      // let fileReader = new FileReader();
      // fileReader.readAsDataURL(file);
      // fileReader.onloadend = function(evt) {
      //   Editor.insertEmbed(cursorLocation, "image", evt.target.result);
      //   resetUploader();
      // };
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
            this.$store.dispatch("fetchUserDecks").then(response => {
              this.$bvToast.toast(`Deck saved`, {
                title: "Deck saved",
                variant: "info",
                toaster: "b-toaster-top-center",
                autoHideDelay: 1500,
                appendToast: true
              });
              // let that = this;
              // setTimeout(function() {
              //   that.$router.push({
              //     name: "deck",
              //     params: { id: that.deck._id }
              //   });
              // }, 1000);
            });
          }
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
      this.$store
        .dispatch("deleteDeck", this.deck._id)
        .then(response => {
          this.$store.dispatch("fetchUserDecks").then(response => {
              this.$bvToast.toast(`Deck deleted.`, {
                title: "Deck deleted.",
                variant: "info",
                toaster: "b-toaster-top-center",
                autoHideDelay: 1500,
                appendToast: true
              });
              let that = this;
              this.loading = true;
              setTimeout(function() {
                that.$router.push({ name: "mydecks" });
              }, 3000);
            });

        })
        .catch(error => {
          this.$bvToast.toast(`Couldn't delete deck`, {
            title: "Problem deleting deck",
            variant: "warning",
            toaster: "b-toaster-top-center",
            autoHideDelay: 1500,
            appendToast: true
          });
        });
    },
    wrapInIframe(html) {
      return `<iframe srcdoc='${html}'></iframe>`;
    },
    onEditCard(card) {
      this.currentlySelectedCard = card;
      this.questionHtml = card.question;
      this.answerHtml = card.answer;
    },
    onUpdateCard() {
      let i = this.deck.cards.indexOf(this.currentlySelectedCard);
      this.deck.cards[i].question = this.questionHtml;
      this.deck.cards[i].answer = this.answerHtml;
      this.questionHtml = "";
      this.answerHtml = "";
      this.currentlySelectedCard = null;
    },
    onDeleteCard(card) {
      for (var i = 0; i < this.deck.cards.length; i++) {
        if (this.deck.cards[i] === card) {
          this.deck.cards.splice(i, 1);
        }
      }
    },
    clearCurrentlySelectedCard() {
      this.currentlySelectedCard = null;
      this.answerHtml = "";
      this.questionHtml = "";
    },
    imageToDataUri(img, width, height) {
      // create an off-screen canvas
      var canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d");

      // set its dimension to target size
      canvas.width = width;
      canvas.height = height;

      // draw source image into the off-screen canvas:
      ctx.drawImage(img, 0, 0, width, height);

      // encode image to data-uri with base64 version of compressed image
      return canvas.toDataURL();
    },
    exportDeck() {
      const token = localStorage.getItem("access_token");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      axios({
        url: `http://localhost:3000/api/export?deckId=${this.deck._id}`,
        method: "GET",
        responseType: "blob" // important
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", this.deck.title + ".json"); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
    }
  }
};
</script>
<style>
h4 {
  text-align: center;
}
</style>