<template>
  <v-dialog v-model="valueModel" max-width="650px">
    <v-card class="">
      <v-app-bar flat dense white--text color="white">
        <v-card-title class="px-0"
          >Do you want to remove<span class="primary--text break"
            >{{ ` ${peopleName}` }}<span class="mark">?</span></span
          >
        </v-card-title>
        <v-spacer />

        <v-btn icon @click="closeDelete">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
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
        <p>
          The removal action cannot be undone! Please confirm that you want to remove <b>{{ peopleName }}</b>
        </p>
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

    const name = computed(() => slicedText(props.peopleName || props.peopleName, 17))

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
<style scoped>
.break {
  white-space: break-spaces;
}
.mark {
  color: rgba(0, 0, 0, 0.87);
}
</style>
