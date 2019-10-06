<template>
  <b-container>
    <div v-if="loading">
      <div class="text-center">
        <b-spinner variant="primary" label="Text Centered"></b-spinner>
      </div>
    </div>
    <div v-else>
      <b-row class="margin_bottom">
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
                  <b-form-input
                    id="nested-title"
                    v-model="deck.title"
                    :disabled="deck.owner != $store.getters.user.id && !creatingNew"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  label-cols-sm="3"
                  label="Public:"
                  label-align-sm="right"
                  label-for="nested-public"
                  class="mb-0"
                >
                  <b-form-checkbox
                    id="nested-public"
                    v-model="deck.isPublic"
                    switch
                    :disabled="deck.owner != $store.getters.user.id && !creatingNew"
                  ></b-form-checkbox>
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
                    :disabled="deck.owner != $store.getters.user.id && !creatingNew"
                  />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row align-h="start" v-if="deck.owner === $store.getters.user.id">
              <b-button
                size="sm"
                pill
                variant="outline-secondary"
                @click="onSaveDeck"
                :disabled="(deck.owner !== $store.getters.user.id && deck._id)  || (deck.title === null || deck.title === '') "
              >Deck speichern</b-button>
              <b-button
                size="sm"
                pill
                variant="outline-secondary"
                @click="onDeleteDeck"
                :disabled="(deck.owner !== $store.getters.user.id && creatingNew)  || (deck.title === null || deck.title === '') "
              >Deck löschen</b-button>
              <b-button
                size="sm"
                pill
                variant="outline-secondary"
                v-b-modal.cardeditor-modal-center
                :disabled="deck.owner != $store.getters.user.id  && !creatingNew"
              >Neue Karte hinzufügen</b-button>
            </b-row>
            <b-row v-else>
              <span class="margin_right">Abonnieren</span>
              <b-form-checkbox id="sub" v-model="sub" switch @change="subscription()"></b-form-checkbox>
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
              style="max-width: 20rem;"
            >
              <template v-slot:header>
                <div>
                  <b-row align-h="between">
                    <fa-rating
                      :glyph="fire"
                      :read-only="true"
                      :item-size="15"
                      :max-rating="3"
                      :active-color="fireColor"
                      :rating="card.difficulty"
                    ></fa-rating>

                    <b-dropdown id="options-dropdown" text="Card actions" class="m-md-2">
                      <b-dropdown-item
                        @click="onEditCard(card)"
                        :disabled="deck.owner != $store.getters.user.id && !creatingNew"
                        v-b-modal.update-cardeditor-modal-center
                      >Edit</b-dropdown-item>
                      <b-dropdown-item
                        v-b-modal.copy-cards-modal
                        @click="onCopyOneCard(card._id)"
                      >Copy to another Deck</b-dropdown-item>
                      <b-dropdown-item
                        v-b-modal.copy-cards-modal
                        @click="onCopyAllCards(deck.cards)"
                      >Copy ALL to another Deck</b-dropdown-item>
                      <b-dropdown-divider></b-dropdown-divider>
                      <b-dropdown-item
                        @click="onDeleteCard(card)"
                        :disabled="deck.owner != $store.getters.user.id && !creatingNew"
                      >Delete</b-dropdown-item>
                    </b-dropdown>
                  </b-row>
                </div>
              </template>

              <b-card-text style="min-height: 10rem; max-height: 10rem; overflow: hidden;">
                <div v-html="card.question"></div>
              </b-card-text>
            </b-card>
          </b-card-group>
        </b-row>
      </b-container>
      <!-- cards list end -->

      <!-- ADD CARD MODAL-->
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
          <b-row align-h="end">
            Schwierigkeit:
            <fa-rating
              :glyph="fire"
              :read-only="false"
              :item-size="15"
              :max-rating="3"
              :active-color="fireColor"
              :rating="difficulty"
              @rating-selected="ratingSelected"
            ></fa-rating>
          </b-row>
        </b-container>
      </b-modal>

      <!-- UPDATE CARDS MODAL -->
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
          <b-row align-h="end">
            Schwierigkeit:
            <fa-rating
              :glyph="fire"
              :read-only="false"
              :item-size="15"
              :max-rating="3"
              :active-color="fireColor"
              :rating="difficulty"
              @rating-selected="ratingSelected"
            ></fa-rating>
          </b-row>
        </b-container>
      </b-modal>

      <!-- COPY CARDS MODAL -->
      <b-modal
        id="copy-cards-modal"
        centered
        size="xl"
        title="Copy card(s)"
        @ok="onSendCardsToAnotherDeck()"
        @close="clearCardsToCopy()"
        @cancel="clearCardsToCopy()"
        ok-title="OK"
      >
        <b-container fluid>
          <b-dropdown id="select-deck-dropdown" text="Select deck" class="m-md-2">
            <b-dropdown-item
              v-for="deck in getOwnerDecks()"
              v-bind:key="deck.id"
              @click="onDeckToCopySelected(deck)"
            >{{deck.title}}</b-dropdown-item>
          </b-dropdown>
          {{deckToCopyTo.title}}
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

import { FaRating } from "vue-rate-it";
import Fire from "vue-rate-it/glyphs/fire";

Quill.register("modules/imageDrop", ImageDrop);
Quill.register("modules/imageResize", ImageResize);

export default {
  name: "deck",
  components: {
    Cardeditor,
    VueEditor,
    VueTagsInput,
    FaRating
  },
  data() {
    return {
      loading: true,
      creatingNew: false,
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
        _id: null,
        owner: null,
        subscribers: []
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
      difficulty: 0,
      currentlySelectedCard: null,
      fire: "",
      fireColor: "#F5F03A",
      cardsToCopy: [],
      deckToCopyTo: {},
      sub: true
    };
  },
  computed: {
    rows() {
      return this.cardsTableProps.items.length;
    }
  },
  async created() {
    if (!this.$store.getters.userDecks) {
      await this.$store.dispatch("fetchUserDecks");
    }

    if (this.$route.params.id) {
      this.fetchDeck();
      this.creatingNew = false;
    } else {
      this.loading = false;
      this.creatingNew = true;
    }
    this.cardsTableProps.items = this.deck.cards;
    this.fire = Fire;
  },
  methods: {
    getOwnerDecks() {
      var that = this;
      var ownerDecks = [];
      for (var i = 0; i < this.$store.getters.userDecks.decks.length; i++) {
        var d = this.$store.getters.userDecks.decks[i];
        if (d.owner === this.$store.getters.user.id && d.id != this.deck._id) {
          ownerDecks.push(d);
        }
      }
      return ownerDecks;
    },
    fetchDeck() {
      let that = this;
      this.$store
        .dispatch("fetchDeck", this.$route.params.id)
        .then(response => {
          that.deck = response.data;
          this.sub = false;
          console.log(this.deck.subscribers);
          this.isSubriber();

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
    isSubriber() {
      console.log("here");
      // check is user is owner
      if (this.deck.owner !== this.$store.getters.user.id) {
        // check if user is subscriber of deck
        for (let sub of this.deck.subscribers) {
          if (sub._id === this.$store.getters.user.id) {
            this.sub = true;
          }
        }
      } else {
        this.sub = true;
      }
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
    },
    onAddCard() {
      this.deck.cards.push({
        question: this.questionHtml,
        answer: this.answerHtml,
        difficulty: this.difficulty
      });
      this.questionHtml = "";
      this.answerHtml = "";
      this.difficulty = 0;
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
            });
          }
        })
        .catch(error => {
          this.$bvToast.toast(`Das Deck konnte nicht gespeichert werden.`, {
            title: "Es gab ein Problem beim Speichern",
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
            this.$bvToast.toast(`Deck wurde gelöscht.`, {
              title: "Deck gelöscht!.",
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
          this.$bvToast.toast(
            `Es gab ein Problem beim Löschen. Bitte probieren Sie es erneut.`,
            {
              title: "Das Deck konnte nicht gelöscht werden.",
              variant: "warning",
              toaster: "b-toaster-top-center",
              autoHideDelay: 1500,
              appendToast: true
            }
          );
        });
    },
    wrapInIframe(html) {
      return `<iframe srcdoc='${html}'></iframe>`;
    },
    onEditCard(card) {
      this.currentlySelectedCard = card;
      this.questionHtml = card.question;
      this.answerHtml = card.answer;
      this.difficulty = card.difficulty;
    },
    onUpdateCard() {
      let i = this.deck.cards.indexOf(this.currentlySelectedCard);
      this.deck.cards[i].question = this.questionHtml;
      this.deck.cards[i].answer = this.answerHtml;
      this.deck.cards[i].difficulty = this.difficulty;
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
    cardDifficulty(index) {
      return this.deck.cards[index].difficulty;
    },
    ratingSelected(rating) {
      this.difficulty = rating;
    },
    onCopyOneCard(cardId) {
      console.log(cardId);
      this.cardsToCopy.push(cardId);
    },
    onCopyAllCards(cards) {
      console.log(cards);
      for (var i = 0; i < cards.length; i++) {
        this.cardsToCopy.push(cards[i]);
      }
    },
    onSendCardsToAnotherDeck() {
      console.log(this.cardsToCopy);
      // send cards
      this.$store
        .dispatch("copyCards", {
          deckId: this.deckToCopyTo.id,
          cards: this.cardsToCopy
        })
        .then(res => {})
        .catch(err => {});
      // empty cardsToCopy
      this.clearCardsToCopy();
    },
    clearCardsToCopy() {
      this.cardsToCopy = [];
      this.deckToCopyTo = {};
    },
    onDeckToCopySelected(deck) {
      this.deckToCopyTo = deck;
    },
    subscription() {
      console.log(this.sub);
      if (this.sub) {
        this.$store
          .dispatch("subscribeDeck", deckId)
          .then(res => {
            this.decks = this.$store.getters.userDecks;
          })
          .catch(error => {});
      } else {
        this.$store
          .dispatch("unsubscribeDeck", deckId)
          .then(res => {
            this.decks = this.$store.getters.userDecks;
          })
          .catch(error => {});
      }
    }
  }
};
</script>
<style>
h4 {
  text-align: center;
}
</style>