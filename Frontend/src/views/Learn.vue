<template>
<div class= "container">
    <!-- <div class="learn_field" v-if="cardsToLearn.length > 0">
        <p>{{cardsToLearn[randomLearnNumber].question}} </p>
        <p>{{cardsToLearn[randomLearnNumber].answer}}</p> 
        <p>{{randomLearnNumber}}</p>
    </div> -->
<div>
  <b-card
    style="max-width: 100%;"
  >
   <vue-editor v-model="cardsToLearn[randomLearnNumber].question">
     <!-- Question {{cardsToLearn[randomLearnNumber].question}} -->
     </vue-editor>
    <vue-editor>
    <b-card-text v-if="showAnswer">
    Answer:{{cardsToLearn[randomLearnNumber].answer}}
    </b-card-text>
    </vue-editor>
    <b-button v-if="!showAnswer" href="#" variant="primary" @click="showAnswer = true">Antwort anzeigen</b-button>
  </b-card>
</div>
</div>
</template>

<script>
import Editor from "../components/CardEditor";
import axios from "axios";

export default {
  components: {
    Editor
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
      learnLimit: 5,
      randomLearnNumber: 0,
      showAnswer: false
    };
  },
  mounted() {
    this.fetchDeck();
  },
  methods: {
      fetchDeck() {
      this.$store
        .dispatch("fetchDeck", this.$route.params.id)
        .then(response => {
          this.deck = response.data;
          console.log(this.deck);
          this.fillCardsToLearn();
          this.randomLearnNumber = Math.floor(Math.random()*this.cardsToLearn.length)
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
    fillCardsToLearn() {
        if (this.deck.cards.length < this.learnLimit) {
            this.cardsToLearn.push(...this.deck.cards);
            console.log('cards', this.cardsToLearn);
        } else {
            for (let i = 0; i < this.learnLimit; i++ ) {
                let card = this.deck.cards[Math.floor(Math.random() * this.deck.cards.length)];
                this.cardsToLearn.push(card);
            }
            console.log('Cards to Learn', this.cardsToLearn);
        }
    }, 
    
  }
};
</script>

<style>
.learn_field {
    height: 100px;
    width: 200px;
}
</style>

