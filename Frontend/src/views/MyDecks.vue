<template>
  <b-container>
    <div v-if="!decks" class="text-center">
      <b-spinner variant="primary" label="Spinner"></b-spinner>
    </div>
    <div v-else>
      <b-row>
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
                <b-row align-h="between" align-v="center">
                  <fa-rating
                    :glyph="thumbsUp"
                    :read-only="(deck.owner===$store.getters.user.id)?true:false"
                    :increment="1"
                    :item-size="15"
                    :rating="deck.averageRating"
                    @rating-selected="setRating($event, deck.id)"
                  ></fa-rating>
                  <!-- <starRating
                    float="right"
                    :star-size="20"
                    :read-only="(deck.owner!=$store.getters.user.id)?true:false"
                    :increment="1"
                    :rating="deck.averageRating"
                    @rating-selected="setRating($event, deck.id)"
                  ></starRating>-->

                  <fa-rating
                    :glyph="fire"
                    :read-only="true"
                    :item-size="15"
                    :max-rating="3"
                    :active-color="fireColor"
                    :rating="deck.difficulty"
                  ></fa-rating>
                  <!-- <b-col>
                  {{difficulty(deck.difficulty)}}
                  </b-col>-->
                </b-row>
              </div>
            </template>
            <template v-slot:footer>
              <b-container>
                <b-row align-h="between">
                  <b-button
                    v-if="deck.owner == $store.getters.user.id"
                    size="sm"
                    pill
                    variant="outline-secondary"
                    @click="onClick(deck.id)"
                  >Edit</b-button>
                  <b-button
                    v-if="deck.owner != $store.getters.user.id"
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
      <b-row align-h="end">
        <form enctype="multipart/form-data">
          <div>
            <b-button size="lg" pill variant="outline-secondary">
              <input
                accept="application/json, .json"
                type="file"
                name="file"
                id="file"
                class="inputfile"
                @change="importDeck()"
                ref="file"
              />
              <label for="file" class="margin_null cursor">Import deck</label>
            </b-button>
          </div>
        </form>
        <!--         
        <b-button size="lg" pill variant="outline-secondary">
          Import deck
           <router-link to="/mydecks/deck">Add Deck</router-link> 
        </b-button>-->
        <b-button size="lg" pill variant="outline-secondary" @click="onAddNewDeck()">
          Add new deck
          <!-- <router-link to="/mydecks/deck">Add Deck</router-link> -->
        </b-button>
      </b-row>
    </div>
    {{file}}
  </b-container>
</template>

<script>
import DeckEditor from "../views/DeckEditor";
import { FaRating } from "vue-rate-it";
import ThumbsUp from "vue-rate-it/glyphs/thumbs-up";
import Fire from "vue-rate-it/glyphs/fire";
import axios from "axios";

export default {
  components: {
    DeckEditor,
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
    },
    setRating(rating, deckId) {
      //TODO: make axios call
      console.log(`${deckId} -> ${rating}`);
      this.$store
        .dispatch("rateDeck", { deckId: deckId, rating: rating })
        .then(res => {console.log(res);})
        .catch(error => {console.log(error);});
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
        .then(response => {
          // reset input form
          this.file = "";
          this.$refs.file.value = "";
        })
        .catch(error => {
          console.log(error);
          this.file = "";
          this.$refs.file.value = "";
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
</style>
