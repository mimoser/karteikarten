<template>
  <div class="container">
    <div>
      <b-form-group>
        <b-input-group>
          <b-form-input v-model="filter" placeholder="Search by tags"></b-form-input>
          <b-input-group-append>
            <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
    </div>
    <div>
      <select name="filter" class="margin-bottom">
        <option value="Neueste">Neueste zuerst</option>
        <option value="beliebt">Am beliebtesten</option>
      </select>
    </div>
    <div>
      <table class="table" id="my-table">
        <tbody>
          <template v-for="deck in decks">
            <tr
              class="row"
              v-bind:key="deck.id"
              :filter="filter"
              :per-page="perPage"
              :current-page="currentPage"
            >
              <td class="full_length border">
                <h4 class="align_center">{{deck.title}}</h4>
                <p>
                  Von {{deck.owner}}
                  <br />
                  {{deck.numberOfCards}} Karten
                </p>
                <div class="same-row">
                  <span>
                    <starRating
                      float="right"
                      :star-size="20"
                      :read-only="true"
                      :increment="0.01"
                      :rating="deck.averageRating"
                    ></starRating>
                  </span>
                  <span>{{deck.numberOfSubscribers}} Abonnenten</span>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div>
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
        align="right"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
import Editor from "../components/CardEditor";
import StarRating from "vue-star-rating";
const fake = require("../fakedata/fakedata").fake;

export default {
  components: {
    Editor,
    StarRating
  },
  data() {
    return {
      perPage: 10,
      currentPage: 1,
      decks: fake._decks,
      filter: null
    };
  },
  computed: {
    rows() {
      return this.decks.length;
    }
  },
  methods: {
    save: function() {
      this.$bvToast.toast(`Karte wurde gespeichert`, {
        title: "BootstrapVue Toast",
        autoHideDelay: 3000,
        appendToast: true
      });
    },
    onFiltered: function() {
      this.currentPage = 1;
    },
    showCurrentRating: function(rating) {
      this.currentRating =
        rating === 0
          ? this.currentSelectedRating
          : "Click to select " + rating + " stars";
    }
  }
};
</script>

<style>
.hidden_header {
  display: none;
}
.align_center {
  align-content: center;
}
.full_length {
  width: 100%;
}
.border {
  border-width: 5px;
}
.margin-bottom {
  margin-bottom: 1em;
}
.same-row {
  display: flex;
  justify-content: space-between;
}
</style>

