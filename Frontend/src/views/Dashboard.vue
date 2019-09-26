<template>
  <div v-if="!loading" class="container">
    <div>
      <b-form-group>
        <b-input-group>
          <b-form-input
            v-model="search"
            placeholder="Search by tags"
            v-on:change="getPublicDecks()"
          ></b-form-input>
          <b-input-group-append>
            <b-button :disabled="!search" @click="search = ''">Clear</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
    </div>
    <!-- <div>
      <select name="filter" class="margin-bottom">
        <option value="Neueste">Neueste zuerst</option>
        <option value="beliebt">Am beliebtesten</option>
      </select>
    </div>-->
    <div>
      <table class="table" id="my-table">
        <tbody>
          <template v-for="deck in decks">
            <tr class="row" v-bind:key="deck.id">
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
        :total-rows="maxDecks"
        :per-page="pageSize"
        @input="getPublicDecks()"
        align="right"
      ></b-pagination>
    </div>
  </div>
  <div v-else>
    <b-spinner class="spinner" label="Spinning"></b-spinner>
  </div>
</template>

<script>
import Editor from "../components/CardEditor";
import StarRating from "vue-star-rating";
import axios from "axios";

export default {
  components: {
    Editor,
    StarRating
  },
  data() {
    return {
      currentPage: 1,
      maxDecks: 0,
      pageSize: 1,
      decks: null,
      search: null,
      loading: false
    };
  },
  mounted() {
    this.getPublicDecks();
  },
  methods: {
    save: function() {
      this.$bvToast.toast(`Karte wurde gespeichert`, {
        title: "BootstrapVue Toast",
        autoHideDelay: 3000,
        appendToast: true
      });
    },
    showCurrentRating: function(rating) {
      this.currentRating =
        rating === 0
          ? this.currentSelectedRating
          : "Click to select " + rating + " stars";
    },
    getPublicDecks: function() {
      this.loading = true;
      const token = localStorage.getItem("access_token");
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      axios
        .get(
          `http://localhost:3000/api/publicDecks?page=${this.currentPage}&pageSize=${this.pageSize}&search=${this.search}`
        )
        .then(response => {
          this.decks = response.data.decks;
          this.maxDecks = response.data.maxDecks;
          this.loading = false;
        });
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

