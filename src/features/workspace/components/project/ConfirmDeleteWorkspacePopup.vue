<template>
  <v-dialog v-model="valueModel" max-width="650px" @click:outside="closeDelete">
    <v-card class="AskAnna-card AskAnna-card--in-dialog">
      <v-toolbar flat dense white--text color="white">
        <v-toolbar-title class="px-0"
          >Do you want to remove the <span class="primary--text">{{ title }}</span> workspace ?</v-toolbar-title
        >
        <v-spacer />

        <v-btn icon @click="closeDelete">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        You are about to remove the <b>{{ workspaceName }}</b> workspace. Here's what will happen when you remove the
        <b>{{ workspaceName }}</b> workspace:
        <br />
        <br />
        <ul>
          <li>
            All data related to the <b>{{ workspaceName }}</b> workspace will be removed
          </li>
          <li>
            If other workspaces in AskAnna or external systems use projects, jobs, files or other parts of the
            {{ workspaceName }} workspace, they are not able to use it anymore
          </li>
        </ul>
        <br />
        After 30 days, the system will entirely delete the workspace from the backend. Within 30 days, you can
        <a href="mailto:support@askanna.io" target="_blank">contact us</a>
        if you want to undo the removal.
        <br />
        <br />
        Please confirm that you want to remove the <b>{{ workspaceName }}</b> workspace.
      </v-card-text>
      <v-card-actions class="ml-5">
        <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="closeDelete">Cancel</v-btn>
        <v-btn small outlined text color="error" class="mr-1 btn--hover" @click="deleteItemConfirm"
          >Remove workspace: {{ name }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import useSlicedText from '@/core/composition/useSlicedText'
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'ConfirmDeleteWorkspacePopup',

  props: {
    value: {
      type: Boolean,
      default: false
    },
    workspaceName: {
      type: String,
      default: () => ''
    }
  },

  setup(props, context) {
    const slicedText = useSlicedText()

    const name = computed(() => slicedText(props.workspaceName, 17))
    const title = computed(() => slicedText(props.workspaceName, 27))

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
