<template>
  <v-dialog v-model="valueModel" max-width="650px">
    <v-card class="AskAnna-card AskAnna-card--in-dialog">
      <v-toolbar flat dense white--text color="white">
        <v-toolbar-title class="px-0 toolbar-title">
          <div class="grid-container">
            <div class="pre">Do you want to {{ roleAction }} admin powers to&nbsp;</div>
            <div class="long primary--text">{{ peopleName }}</div>
            <div class="mark pre">?</div>
          </div>
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="closeDelete">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        You are about to {{ roleAction }} admin powers to <b>{{ peopleName }}</b
        >. When you {{ roleAction }} these powers, then <b>{{ peopleName }}</b> {{ canTitle }}:
        <br />
        <br />
        <ul>
          <li>
            Remove workspace members
          </li>
          <li>
            Grant or revoke workspace admin powers
          </li>
        </ul>
        <br />
        <template v-if="isPeopleAdmin"
          >When you revoke the admin powers of <b>{{ peopleName }}</b
          >, he/she will become a workspace member.</template
        >
      </v-card-text>
      <v-card-actions class="ml-5">
        <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="closeDelete">Cancel</v-btn>
        <v-btn small outlined text :color="colorBtn" class="mr-1 btn--hover" @click="changeRoleConfirm"
          >{{ roleAction }} admin powers</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import useSlicedText from '@/core/composition/useSlicedText'
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'WorkspacePeopleConfirmChangeRolePopup',

  props: {
    role: {
      type: String,
      default: () => 'WM'
    },
    value: {
      type: Boolean,
      default: false
    },
    peopleName: {
      type: String,
      default: () => ''
    },
    isPeopleAdmin: {
      type: Boolean,
      default: false
    },
    roleAction: {
      type: String,
      default: () => 'revoke'
    }
  },

  setup(props, context) {
    const slicedText = useSlicedText()
    const canTitle = computed(() => (props.isPeopleAdmin ? 'can no longer' : 'can'))

    const valueModel = computed({
      get: () => props.value,
      set: () => context.emit('onClose')
    })

    const colorBtn = computed(() => (props.isPeopleAdmin ? 'error' : 'secondary'))

    const closeDelete = () => context.emit('onClose')
    const changeRoleConfirm = () => context.emit('onChangeRoleConfirm')

    return {
      name,
      colorBtn,
      canTitle,
      valueModel,
      closeDelete,
      changeRoleConfirm
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
