<template>
  <b-container>
    <div v-if="!decks" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div v-else>
      <b-row align-h="between">
        <b-card-group columns>
          <b-card
            v-for="deck in decks.decks"
            v-bind:key="deck.id"
            bg-variant="light"
            text-variant="black"
            class="text-center"
            :title="deck.title"
            header-tag="header"
            footer-tag="footer"
          >
            <template v-slot:header>
              <div>
                <span>
                  <starRating
                    float="right"
                    :star-size="20"
                    :read-only="true"
                    :increment="0.01"
                    :rating="deck.averageRating"
                  ></starRating>
                </span>
              </div>
            </template>
            <template v-slot:footer>
              <b-container>
                <b-row align-h="between">
                  <b-button
                    v-if="deck.owner._id == $store.getters.user._id"
                    size="sm"
                    pill
                    variant="outline-secondary"
                    @click="onClick(deck.id)"
                  >Edit</b-button>
                  <b-button
                    v-if="deck.owner._id != $store.getters.user._id"
                    size="sm"
                    pill
                    variant="outline-secondary"
                  >Unsubscribe</b-button>
                  <!-- <b-button v-if="deck.owner._id == $store.getters.user._id" size="sm" pill variant="outline-secondary">Deactivate</b-button> -->
                  <b-button size="sm" pill variant="outline-secondary">Learn</b-button>
                </b-row>
              </b-container>
            </template>
          </b-card>
        </b-card-group>
      </b-row>
      <!-- <div
      v-else
      v-for="deck in decks.decks"
      v-bind:key="deck.id"
      @click="onClick(deck.id)"
      class="deck bg-light"
      >{{deck.title}}</div>-->
      <b-row align-h="between">
        <b-button size="lg" pill variant="outline-secondary" @click="onAddNewDeck()">
          Add new deck
          <!-- <router-link to="/mydecks/deck">Add Deck</router-link> -->
        </b-button>
      </b-row>
    </div>
  </b-container>
</template>

<script>
import DeckEditor from "../views/DeckEditor";
import StarRating from "vue-star-rating";

export default {
  components: {
    DeckEditor,
    StarRating
  },
  data() {
    return {
      decks: null
    };
  },
  created() {
    if (!this.decks) {
      this.fetchDecks();
    }
  },
  methods: {
    onSave() {},
    onClick(deckId) {
      this.$router.push({ name: "deck", params: { id: deckId } });
    },
    fetchDecks() {
      let that = this;
      this.$store
        .dispatch("fetchUserDecks")
        .then(response => {
          this.decks = response.data;
        })
        .catch(error => {
          this.$bvToast.toast(`Couldn't fetch user decks`, {
            title: "Problem fetching user decks",
            variant: "warning",
            toaster: "b-toaster-top-center",
            autoHideDelay: 3000,
            appendToast: true
          });
        });
    },
    onAddNewDeck() {
      this.$router.push({ name: "deck" });
    }
  }
};
</script>

<style>
.deck {
  margin: 10px;
}
</style>
