<template>
  <div>
    <h2>Your Decks</h2>
    <div v-if="!decks" class="text-center">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>
    <div
      v-else
      v-for="deck in decks.decks"
      v-bind:key="deck.id"
      @click="onClick(deck.id)"
      class="deck bg-light"
    >{{deck.title}}</div>
    <router-link to="/mydecks/deck">Add Deck</router-link>
  </div>
</template>

<script>
import DeckEditor from "../views/DeckEditor";

export default {
  components: {
    DeckEditor
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
      console.log(deckId);
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
    }
  }
};
</script>

<style>
.deck {
  margin: 10px;
}
</style>
