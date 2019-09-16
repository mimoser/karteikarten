<template>
  <!-- <div>
    <b-container fluid>
      <b-row>
        <b-col>
          <label>
            Frage
            <Editor></Editor>
          </label>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <label>
            Antwort
            <Editor></Editor>
          </label>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button variant="dark" @click="save()">Save</b-button>
        </b-col>
      </b-row>
    </b-container>
  </div> -->
    <b-container>
      <b-row>
        <b-col>
          <b-form-group>
            <b-input-group>
              <b-form-input v-model="filter" placeholder="Type to Search"></b-form-input>
              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-table
            id="my-table"
            :items="items"
            :fields="fields"
            :per-page="perPage"
            :filter="filter"
            :current-page="currentPage"
            small
            responsive
            striped
            thead-class="hidden_header"
            @filtered="onFiltered"
          >
          <span slot="html" slot-scope="data" v-html="data.value"></span></b-table>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="my-table"
            align="center"
          ></b-pagination>
        </b-col>
      </b-row>
    </b-container>
</template>

<script>
import Editor from "../components/CardEditor";
const fake = require('../fakedata/fakedata').fake;

export default {
  components: {
    Editor
  },
  data() {
    return {
      perPage: 3,
      currentPage: 1,
      items: fake.fakeData(),
      fields: [
        { key: "id", label: "", thClass: "d-none", tdClass: "d-none" },
        { key: "html", label: "" },
        // { key: "owner", label: "" },
        // { key: "numberOfCards", label: "" },
        // { key: "averageRating", label: "" }
      ],
      filter: null
    };
  },
  computed: {
    rows() {
      return this.items.length;
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
    }
  }
};
</script>

<style>
.hidden_header {
  display: none;
}
</style>

