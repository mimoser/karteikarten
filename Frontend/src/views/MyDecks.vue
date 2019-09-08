<template>
  <div>
    
      <h2>Your Decks</h2>
      <p v-for='deck in decks.decks' v-bind:key="deck.id" @click="onClick(deck.id)" style="border: solid; background-color: green">
        {{deck.title}}
      </p>
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
      decks: []
    };
  },
  created() {
    this.fetchDecks();
  },
  methods: {
    onSave() {

    },
    onClick(deckId) {
      console.log(deckId);
      this.$router.push({ name: "deck", params: {id: deckId } });
    },
    fetchDecks() {
      let that = this;
      this.$store.dispatch('fetchUserDecks').then(response => {
        this.decks = that.$store.getters.userDecks;
      }).catch(error => {
        this.$bvToast.toast(
              `Couldn't fetch user decks`,
              {
                title: "Problem fetching user decks",
                variant: "warning",
                toaster: "b-toaster-top-center",
                autoHideDelay: 3000,
                appendToast: true
              }
            );
      });
    }
  }
};
</script>

<style>
</style>
