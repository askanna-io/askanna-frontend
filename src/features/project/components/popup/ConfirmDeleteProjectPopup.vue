<template>
  <v-dialog v-model="valueModel" max-width="650px" @click:outside="closeDelete">
    <v-card class="AskAnna-card AskAnna-card--in-dialog">
      <v-toolbar flat dense white--text color="white">
        <v-toolbar-title class="px-0"
          >Do you want to remove the <span class="primary--text">{{ title }}</span> project ?</v-toolbar-title
        >
        <v-spacer />

        <v-btn icon @click="closeDelete">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        You are about to remove the <b>{{ projectName }}</b> project. Here's what will happen when you remove the
        <b>{{ projectName }}</b> project:
        <br />
        <br />
        <ul>
          <li>
            The <b>{{ projectName }}</b> project will be removed from this workspace
          </li>
          <li>
            All data related to the <b>{{ projectName }}</b> will be removed
          </li>
          <li>
            If other projects or systems use jobs, files or other parts of the <b>{{ projectName }}</b> project, they
            are not able to use it anymore
          </li>
        </ul>
        <br />
        The removal action cannot be undone! Please confirm that you want to remove the
        <b>{{ projectName }}</b> project.
      </v-card-text>
      <v-card-actions class="ml-5">
        <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="closeDelete">Cancel</v-btn>
        <v-btn small outlined text color="error" class="mr-1 btn--hover" @click="deleteItemConfirm"
          >Remove project: {{ name }}
        </v-btn>
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
    projectName: {
      type: String,
      default: () => ''
    }
  },

  setup(props, context) {
    const slicedText = useSlicedText()

    const name = computed(() => slicedText(props.projectName, 17))
    const title = computed(() => slicedText(props.projectName, 27))

    const valueModel = computed({
      get: () => props.value,
      set: () => context.emit('onClose')
    })

    const closeDelete = () => context.emit('onClose')
    const deleteItemConfirm = () => context.emit('onDeleteConfirm')

    return {
      title,
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
