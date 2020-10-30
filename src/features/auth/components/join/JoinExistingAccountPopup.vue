<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline primary white--text">
          AskAnna warning
          <v-spacer />
          <v-btn color="secondary" class="ml-4" small icon>
            <v-icon color="white" left @click="handleClose">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pt-1">
          This account is already a member of the <b>{{ workspaceName }}</b> workspace.
          <br />
          Do you want to login and open the workspace?"
        </v-card-text>

        <v-card-actions class="mx-4">
          <v-btn color="primary" text outlined small class="mr-4" @click.stop="handleLogin(true)">
            YES
          </v-btn>
          <v-btn class="mr-4" text outlined small @click.stop="handleLogin(false)">
            NO, I WANT TO USE ANOTHER ACCOUNT
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JoinExistingAccountPopup',

  props: {
    value: {
      type: Boolean,
      default: () => false
    },
    workspaceName: {
      type: String,
      default: () => ''
    }
  },

  setup(props, context) {
    const dialog = computed({
      get: () => {
        return props.value
      },
      set: val => {
        context.emit('changeValue', val)
      }
    })

    const handleLogin = val => context.emit('changeValue', val)
    const handleClose = () => context.emit('closeDialog')

    return { dialog, handleLogin, handleClose }
  }
})
</script>
