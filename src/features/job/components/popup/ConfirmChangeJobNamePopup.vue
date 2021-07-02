<template>
  <v-dialog v-model="valueModel" max-width="650px" @click:outside="close">
    <v-card class="AskAnna-card AskAnna-card--in-dialog">
      <v-toolbar flat dense white--text color="white">
        <v-toolbar-title class="px-0"
          >Do you want to change the name of job <span class="primary--text">{{ name }}</span
          >?</v-toolbar-title
        >
        <v-spacer />

        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        You are about to change the name of job <b>{{ name }}</b
        >. If you want to run a job in AskAnna via a configuration in
        <ask-anna-copy-text styleClasses="px-2 primary text--white" :showTooltip="false" text="askanna.yml" />, you need
        to make sure that you have specified a job with the same name in your config file.
        <br />
        <br />
        If you change the name of job <b>{{ name }}</b> and did not update the
        <ask-anna-copy-text styleClasses="px-2 primary text--white" :showTooltip="false" text="askanna.yml" />
        configuration, you will not be able to run this job till you updated the config file.
        <br />
        <br />
        Please confirm that you want to change the name of job <b>{{ name }}</b
        >.
      </v-card-text>
      <v-card-actions class="ml-5">
        <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="confirmChange"
          >Change job {{ name }}
        </v-btn>
        <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="close">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import useSlicedText from '@/core/composition/useSlicedText'
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'ConfirmChangeJobNamePopup',

  props: {
    value: {
      type: Boolean,
      default: false
    },
    jobName: {
      type: String,
      default: () => ''
    }
  },

  setup(props, context) {
    const slicedText = useSlicedText()

    const name = computed(() => slicedText(props.jobName, 17))

    const valueModel = computed({
      get: () => props.value,
      set: () => context.emit('onClose')
    })

    const close = () => context.emit('onClose')
    const confirmChange = () => context.emit('onConfirmChangeName')

    return {
      name,
      valueModel,

      close,
      confirmChange
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
