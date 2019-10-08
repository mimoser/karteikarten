<template>
  <div class="container">
    <div v-if="loading" class="text-center">
      <b-spinner variant="primary" label="Spinner"></b-spinner>
    </div>
    <div v-else>
      <b-card class="outer_box">
        <b-card-header>
          <b-row align-h="between">
            <b-col>Karten insgesamt: {{cardsToLearn.length}}</b-col>
            <b-col>Karten zu wiederholen: {{repeatCards.length}}</b-col>
            <b-col>Karten gewusst: {{knownCards.length}}</b-col>
          </b-row>
        </b-card-header>
        <b-card class="no_border">
          <h2>Frage</h2>
          <b-card-text>
            <h5 v-html="currentCardToLearn.question"></h5>
          </b-card-text>
          <b-button v-if="!showAnswer" variant="primary" @click="showAnswer = true">Antwort anzeigen</b-button>
        </b-card>
        <div v-if="showAnswer">
          <div class="border_bottom"></div>
          <b-card class="no_border">
            <h2>Anwort</h2>
            <b-card-text>
              <h5 v-html="currentCardToLearn.answer"></h5>
            </b-card-text>
            <b-button-group>
              <b-button variant="success" @click="known(currentCardToLearn)">Gewusst</b-button>
              <!-- <b-button variant="primary" @click="showAnswer = true">Nicht gewusst</b-button> -->
              <b-button variant="danger" @click="repeat(currentCardToLearn)">Wiederholen</b-button>
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
      currentCardToLearn: {},
      showAnswer: false,
      loading: true
    };
  },
  created() {
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
          this.currentCardToLearn = this.cardsToLearn[
            Math.floor(Math.random() * this.cardsToLearn.length)
          ];
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
      if (this.cardsToLearn.length > 0) {
        this.cardsToLearn = this.cardsToLearn.filter(
          tmp => tmp._id !== card._id
        );
      } else {
        this.repeatCards = this.repeatCards.filter(tmp => tmp._id !== card._id);
      } 
      if(this.cardsToLearn.length===0 && this.repeatCards.length===0) {
        this.$bvToast.toast(`Alle Karten wurden gelernt.`, {
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
      this.knownCards.push(card);
      this.setNextCardToLearn();
      this.showAnswer = false;
    },
    repeat(card) {
      this.showAnswer = false;
      if (this.cardsToLearn.length > 0) {
        this.cardsToLearn = this.cardsToLearn.filter(
          tmp => tmp._id !== card._id
        );
        this.repeatCards.push(card);
      }
      this.setNextCardToLearn();
    },
    setNextCardToLearn() {
      if (this.cardsToLearn.length > 0) {
        this.currentCardToLearn = this.cardsToLearn[
          Math.floor(Math.random() * this.cardsToLearn.length)
        ];
      } else if (this.repeatCards.length > 0) {
        this.currentCardToLearn = this.repeatCards[
          Math.floor(Math.random() * this.repeatCards.length)
        ];
      }
    }
  }
};
</script>

<style>
.outer_box {
  max-width: 100%;
  min-height: 200px;
  min-height: 600px;
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

