<template>
  <v-dialog v-model="valueModel" max-width="650px">
    <v-card class="AskAnna-card AskAnna-card--in-dialog">
      <v-toolbar flat dense white--text color="white">
        <v-toolbar-title class="px-0 toolbar-title">
          <div class="grid-container">
            <div class="pre">Do you want to remove&nbsp;</div>
            <div class="long primary--text">{{ peopleName }}</div>
            <div class="mark pre">&nbsp;?</div>
          </div>
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="closeDelete">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        You are about to remove the member <b>{{ peopleName }}</b
        >. Here's what will happen when you remove <b>{{ peopleName }}</b
        >:
        <br />
        <br />
        <ul>
          <li>
            <b>{{ peopleName }}</b> will be removed from this workspace and projects in this workspace
          </li>
          <li>
            <b>{{ peopleName }}</b> will not be able to open this workspace anymore
          </li>
          <li>
            If <b>{{ peopleName }}</b> has access to other workspaces, <b>{{ peopleName }}</b> will still have access to
            these workspaces
          </li>
          <li>
            Everything <b>{{ peopleName }}</b> has done will remain in place
          </li>
        </ul>
        <br />
        The removal action cannot be undone! Please confirm that you want to remove <b>{{ peopleName }}</b
        >:
      </v-card-text>
      <v-card-actions class="ml-5">
        <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="closeDelete">Cancel</v-btn>
        <v-btn small outlined text color="error" class="mr-1 btn--hover" @click="deleteItemConfirm"
          >Remove {{ name }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import useSlicedText from '@/core/composition/useSlicedText'
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'WorkspacePeopleConfirmDeletePopup',

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
      set: () => context.emit('onCloseDeletePopup')
    })

    const closeDelete = () => context.emit('onCloseDeletePopup')
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
<style>
.pre {
  white-space: pre;
}

.mark {
  color: rgba(0, 0, 0, 0.87);
}

.grid-container {
  display: grid;
  grid-template-columns: 0fr auto 0fr;
}

.long {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
