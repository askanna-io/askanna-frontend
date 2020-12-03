<template>
  <v-dialog v-model="valueModel" max-width="650px" @click:outside="closeDelete">
    <v-card class="AskAnna-card AskAnna-card--in-dialog">
      <v-app-bar flat dense white--text color="white">
        <v-card-title class="px-0">Do you want to delete the invitation? </v-card-title>
        <v-spacer />

        <v-btn icon @click="closeDelete">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-card-text>
        You are about to delete the invitation for <b>{{ peopleName }}</b
        >. Here's what happens when you continue with this action:
        <br />
        <br />
        <ul>
          <li>
            <b>{{ peopleName }}</b> cannot accept the send invite to join the workspace
          </li>
        </ul>
        <br />
        The action cannot be undone! Please confirm that you want to delete the invitation for <b>{{ peopleName }}</b
        >:
      </v-card-text>
      <v-card-actions class="ml-5">
        <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="closeDelete">Cancel</v-btn>
        <v-btn small outlined text color="error" class="mr-1 btn--hover" @click="deleteItemConfirm"
          >Delete invitation</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import useSlicedText from '@/core/composition/useSlicedText'
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'WorkspacePeopleConfirmDeleteInvitationPopup',

  props: {
    value: {
      type: Boolean,
      default: false
    },
    peopleName: {
      type: String,
      default: () => ''
    }
  },

  setup(props, context) {
    const slicedText = useSlicedText()

    const name = computed(() => slicedText(props.peopleName, 17))

    const valueModel = computed({
      get: () => props.value,
      set: () => context.emit('onClose')
    })

    const closeDelete = () => context.emit('onClose')
    const deleteItemConfirm = () => context.emit('onDeleteConfirm')

    return {
      name,
      valueModel,
      closeDelete,
      deleteItemConfirm
    }
  }
})
</script>
<style scoped>
.break {
  white-space: break-spaces;
}
.mark {
  color: rgba(0, 0, 0, 0.87);
}
</style>
