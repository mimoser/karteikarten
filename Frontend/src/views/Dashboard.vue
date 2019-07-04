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
  </div>-->
  <div>
    <b-container fluid>
      <b-row>
        <b-col>
          <b-form-group label="Filter">
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
            thead-class="hidden_header"
          ></b-table>
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
  </div>
</template>

<script>
import Editor from "../components/KartenEditor";
import fakedata from "../fakedata/fakedata";

export default {
  components: {
    Editor
  },
  data() {
    return {
      perPage: 3,
      currentPage: 1,
      items: fakedata,
      fields: [
        { key: "id", label: "", thClass: "d-none", tdClass: "d-none" },
        { key: "bezeichnung", label: "" },
        { key: "autor", label: "" },
        { key: "anzahl_karten", label: "" },
        { key: "bewertung", label: "" }
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
    }
  }
};
</script>

<style>
.hidden_header {
  display: none;
}
</style>

