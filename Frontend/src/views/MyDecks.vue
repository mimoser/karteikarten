<template>
  <b-container>
    <div v-if="!decks" class="text-center">
      <b-spinner variant="primary" label="Spinner"></b-spinner>
    </div>
    <div v-else>
      <b-row class="margin_bottom">
        <form enctype="multipart/form-data">
          <div>
            <b-button class="margin_right" size="lg" pill variant="outline-secondary">
              <input
                accept="application/json, .json"
                type="file"
                name="file"
                id="file"
                class="inputfile"
                @change="importDeck()"
                ref="file"
              />
              <label for="file" class="margin_null cursor">Deck importieren</label>
            </b-button>
          </div>
        </form>
        <b-button
          size="lg"
          pill
          variant="outline-secondary"
          @click="onAddNewDeck()"
        >Neues Deck hinzufügen</b-button>
      </b-row>
      <b-row>
        <b-card-group columns>
          <b-card
            v-for="deck in decks.decks"
            v-bind:key="deck.id"
            bg-variant="light"
            text-variant="black"
            class="text-center"
            no-body
            header-tag="header"
            footer-tag="footer"
          >
            <b-card-title class="card-title link" @click="onClick(deck.id)">{{deck.title}}</b-card-title>
            <template v-slot:header>
              <div>
                <b-row align-h="between" align-v="center">
                  <fa-rating
                    :glyph="thumbsUp"
                    :read-only="(deck.owner===$store.getters.user.id)?true:false"
                    :increment="1"
                    :item-size="15"
                    :rating="deck.averageRating"
                    @rating-selected="setRating($event, deck.id)"
                  ></fa-rating>
                  <fa-rating
                    :glyph="fire"
                    :read-only="true"
                    :item-size="15"
                    :max-rating="3"
                    :active-color="fireColor"
                    :rating="deck.difficulty"
                  ></fa-rating>
                </b-row>
              </div>
            </template>
            <template v-slot:footer>
              <b-container>
                <b-row align-h="between">
                  <b-button
                    size="sm"
                    pill
                    variant="outline-secondary"
                    @click="moveToLearn(deck.id)"
                  >Lernen</b-button>
                  <b-button
                    size="sm"
                    pill
                    variant="outline-secondary"
                    @click="exportDeck(deck)"
                  >Export</b-button>
                </b-row>
              </b-container>
            </template>
          </b-card>
        </b-card-group>
      </b-row>
    </div>
  </b-container>
</template>

<script>
import { FaRating } from "vue-rate-it";
import ThumbsUp from "vue-rate-it/glyphs/thumbs-up";
import Fire from "vue-rate-it/glyphs/fire";
import axios from "axios";

export default {
  components: {
    FaRating
  },
  data() {
    return {
      decks: this.$store.getters.userDecks,
      thumbsUp: "",
      fire: "",
      fireColor: "#F5F03A",
      file: ""
    };
  },
  created() {
    this.thumbsUp = ThumbsUp;
    this.fire = Fire;
    if (!this.decks) {
      this.fetchDecks();
    }
  },
  methods: {
    onSave() {},
    onClick(deckId) {
      this.$router.push({ name: "deck", params: { id: deckId } });
    },
    moveToLearn(deckId) {
      this.$router.push({ name: "learn", params: { id: deckId } });
    },
    fetchDecks() {
      this.$store
        .dispatch("fetchUserDecks")
        .then(response => {
          this.decks = response.data;
        })
        .catch(() => {
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
    },
    setRating(rating, deckId) {
      this.$store
        .dispatch("rateDeck", { deckId: deckId, rating: rating })
        .then(() => {})
        .catch(() => {});
    },
    difficulty(difficultyNumber) {
      var difficultyString;
      switch (difficultyNumber) {
        case 0:
          difficultyString = "easy";
          break;
        case 1:
          difficultyString = "medium";
          break;
        case 2:
          difficultyString = "hard";
          break;
        default:
          difficultyString = "easy";
          break;
      }
      return difficultyString;
    },
    importDeck() {
      this.file = this.$refs.file.files[0];
      const token = localStorage.getItem("access_token");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      const formData = new FormData();
      formData.append("file", this.file);
      axios
        .post(`http://localhost:3000/api/import`, formData)
        .then(() => {
          // reset input form
          this.file = "";
          this.$refs.file.value = "";
          this.$bvToast.toast(`Datei wurde erfolgreich importiert!`, {
            title: "Import erfolgreich!",
            variant: "success",
            toaster: "b-toaster-top-center",
            autoHideDelay: 3000,
            appendToast: true
          });
        })
        .catch(error => {
          this.file = "";
          this.$refs.file.value = "";
          this.$bvToast.toast(`${error}`, {
            title: "Error!",
            variant: "warning",
            toaster: "b-toaster-top-center",
            autoHideDelay: 3000,
            appendToast: true
          });
        });
    },
    exportDeck(deck) {
      const token = localStorage.getItem("access_token");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      axios({
        url: `http://localhost:3000/api/export?deckId=${deck.id}`,
        method: "GET",
        responseType: "blob" // important
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", deck.title + ".json"); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
    }
  }
};
</script>

<style>
.deck {
  margin: 10px;
}
.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
  cursor: pointer;
}
.margin_null {
  margin-bottom: 0;
}
.addDeck {
  width: 10em;
  height: 10em;
}
.cursor {
  cursor: pointer;
}
.card-title {
  min-height: 2em;
  padding: 1em;
  cursor: pointer;
}
</style>
