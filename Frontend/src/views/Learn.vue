<template>
  <div class="container">
    <div v-if="loading" class="text-center">
      <b-spinner variant="primary" label="Spinner"></b-spinner>
    </div>
    <div v-else>
      <b-card class="outer_box">
        <b-card class="no_border">
          <h2>Frage</h2>
          <b-card-text>
            <h5 v-html="cardsToLearn[randomLearnNumber].question"></h5>
          </b-card-text>
          <b-button v-if="!showAnswer" variant="primary" @click="showAnswer = true">Antwort anzeigen</b-button>
        </b-card>
        <div v-if="showAnswer">
          <div class="border_bottom"></div>
          <b-card class="no_border">
            <h2>Anwort</h2>
            <b-card-text>
              <h5 v-html="cardsToLearn[randomLearnNumber].answer"></h5>
            </b-card-text>
            <b-button-group>
              <b-button variant="success" @click="known(cardsToLearn[randomLearnNumber])">Gewusst</b-button>
              <!-- <b-button variant="primary" @click="showAnswer = true">Nicht gewusst</b-button> -->
              <b-button
                variant="danger"
                @click="repeat(repeat(cardsToLearn[randomLearnNumber]))"
              >Wiederholen</b-button>
            </b-button-group>
          </b-card>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { VueEditor } from "vue2-editor";

export default {
  components: {
    VueEditor
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
      cardsToLearn: [],
      knownCards: [],
      repeatCards: [],
      randomLearnNumber: 0,
      showAnswer: false,
      loading: true
    };
  },
  mounted() {
    this.fetchDeck();
  },
  methods: {
    fetchDeck() {
      this.loading = true;
      this.$store
        .dispatch("fetchDeck", this.$route.params.id)
        .then(response => {
          this.deck = response.data;
          this.cardsToLearn.push(...this.deck.cards);
          this.randomLearnNumber = Math.floor(
            Math.random() * this.cardsToLearn.length
          );
          this.loading = false;
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
    known(card) {
      // put cards into knownCards Array for Statics
      this.knownCards.push(card);
      // filter card out of possible nextcards
      this.cardsToLearn = this.cardsToLearn.filter(tmp => tmp._id !== card._id);
      // calculate next random card
      if (this.cardsToLearn.length > 0) {
        this.randomLearnNumber = Math.floor(
          Math.random() * this.cardsToLearn.length
        );
      } else {
        // if last card was learned
        this.$bvToast.toast(`Alle Karten wurden gerlent.`, {
          title: "Lernen beendet!",
          variant: "success",
          toaster: "b-toaster-top-center",
          autoHideDelay: 1500,
          appendToast: true
        });
        // get back

        let that = this;
        this.loading = true;
        setTimeout(function() {
          that.$router.push({ name: "mydecks" });
        }, 3000);
      }
      this.showAnswer = false;
    },
    repeat(card) {
      // put cards into repeatCards Array for Statics
      this.repeatCards.push(card);
      // calculate next random card
      this.randomLearnNumber = Math.floor(
        Math.random() * this.cardsToLearn.length
      );
      this.showAnswer = false;
    }
  }
};
</script>

<style>
.outer_box {
  max-width: 100%;
  min-height: 200px;
  max-height: 600px;
  overflow: auto;
}
.border_bottom {
  border-bottom: 1px solid;
}
.align_left {
  float: left;
}
.no_border {
  border: none;
}
</style>

