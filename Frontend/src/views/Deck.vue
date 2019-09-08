<template>
  <div>
    <router-link to="/mydecks">Back</router-link>
    {{$route.params.id}}
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
            :filter="cardsTableProps.filter"
            :current-page="cardsTableProps.currentPage"
            small
            responsive
            striped
            @filtered="onFiltered"
          >
            <span slot="html" slot-scope="data" v-html="data.value"></span>
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
    </b-container>
    <!-- cards list end -->

    <b-button @click="onSaveDeck">Save Deck</b-button>
    <b-button v-b-modal.cardeditor-modal-center>Add new card</b-button>

    <b-modal
      id="cardeditor-modal-center"
      centered
      size="xl"
      title="New Card"
      @ok="onAddCard"
      ok-title="Add"
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
import VueTagsInput from "@johmun/vue-tags-input";

export default {
  name: "deck",
  components: {
    Cardeditor,
    VueEditor,
    VueTagsInput
  },
  data() {
    return {
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
        fields: ["question", "answer", "difficulty"],
        filter: null
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
    onFiltered: function() {
      this.currentPage = 1;
    },
    onAddCard() {
      this.deck.cards.push({
        question: this.questionHtml,
        answer: this.answerHtml,
        difficulty: 2.5
      });
      this.questionHtml = "";
      this.answerHtml = "";
    },
    onSaveDeck() {
      this.$store
        .dispatch("saveDeck", this.deck)
        .then(response => {
          this.$bvToast.toast(`Deck saved`, {
            title: "Deck saved",
            variant: "info",
            toaster: "b-toaster-top-center",
            autoHideDelay: 3000,
            appendToast: true
          });
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
    }
  }
};
</script>

<style>
</style>