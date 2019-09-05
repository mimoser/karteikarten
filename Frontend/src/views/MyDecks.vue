<template>
  <div>
    <h1>My Decks view</h1>



        <b-button v-b-modal.deckeditor-modal-center>Add new deck</b-button>

        <b-modal id="deckeditor-modal-center" centered size="xl" title="New deck" @ok="onSave" ok-title="Save">
            <DeckEditor></DeckEditor>
        </b-modal>

  </div>
</template>

<script>
import DeckEditor from "../views/DeckEditor";

export default {
  components: {
    DeckEditor
  },
  data(){
    return {
      
    }
  },
  methods: {
      onSave() {

      }
  }
};
</script>

<style>
</style>
