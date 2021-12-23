<template>
  <v-dialog v-model="valueModel" max-width="650px" @click:outside="closeDelete">
    <v-card class="AskAnna-card AskAnna-card--in-dialog">
      <v-app-bar flat dense white--text color="white">
        <div v-if="$vuetify.breakpoint.xsOnly" class="text-body-1 font-weight-bold">
          Do you want to resend the invitation?
        </div>
        <v-toolbar-title v-else class="px-0 toolbar-title">Do you want to resend the invitation?</v-toolbar-title>
        <v-spacer />

        <v-btn icon @click="closeDelete">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-card-text>
        You are about to resend the invitation for <b>{{ peopleName }}</b
        >. Here's what will happen when you continue with this action:
        <br />
        <br />
        <ul>
          <li>
            <b>{{ peopleName }}</b> will receive a new invitation to join this workspace
          </li>
        </ul>
      </v-card-text>
      <v-card-actions :class="{ 'px-3': $vuetify.breakpoint.xsOnly }">
        <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="closeDelete">Cancel</v-btn>
        <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="resendConfirm"
          >Resend invitation</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { computed } from '@vue/composition-api'
import useSlicedText from '@/core/composition/useSlicedText'

const props = defineProps({
  value: {
    type: Boolean,
    default: false
  },
  peopleName: {
    type: String,
    default: () => ''
  }
})

const emit = defineEmits(['onClose', 'onResendConfirm'])

const slicedText = useSlicedText()

const name = computed(() => slicedText(props.peopleName, 17))

const valueModel = computed({
  get: () => props.value,
  set: () => emit('onClose')
})

const closeDelete = () => emit('onClose')
const resendConfirm = () => emit('onResendConfirm')
</script>
<style scoped>
.break {
  white-space: break-spaces;
}
.mark {
  color: rgba(0, 0, 0, 0.87);
}
</style>
