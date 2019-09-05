<template>
    <div>
        <h1>DeckEditor.vue</h1>
        <b-button v-b-modal.cardeditor-modal-center>Add new card</b-button>

        <b-modal id="cardeditor-modal-center" centered size="xl" title="New Card" @ok="onSave" ok-title="Save">
            <Cardeditor></Cardeditor>
        </b-modal>
    </div>
</template>

<script>
import Cardeditor from "../components/CardEditor";

export default {
    components: {
        Cardeditor
    },
    methods: {
        onSave(){

        }
    }
}
</script>

<style>

</style>
