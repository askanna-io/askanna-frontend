<template>
  <v-dialog v-model="valueModel" max-width="450px">
    <v-card>
      <v-card-title
        >Are you sure you want to delete variable <span class="primary--text">{{ variableName }}</span
        >?</v-card-title
      >
      <v-card-actions class="ml-5">
        <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="deleteItemConfirm">Yes</v-btn>
        <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="closeDelete">No</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Variables',

  props: {
    value: {
      type: Boolean,
      default: false
    },
    variableName: {
      type: String,
      default: () => ''
    }
  },

  setup(props, context) {
    const valueModel = computed({
      get: () => props.value,
      set: () => context.emit('onCloseDeletePopup')
    })

    const deleteItemConfirm = () => context.emit('onDelete')
    const closeDelete = () => context.emit('onCloseDeletePopup')

    return {
      valueModel,
      closeDelete,
      deleteItemConfirm
    }
  }
})
</script>
