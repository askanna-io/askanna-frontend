<template>
  <VDialog v-model="valueModel" max-width="650px" @click:outside="close">
    <AskAnnaCard class="AskAnna-card AskAnna-card--in-dialog">
      <AskAnnaToolbar flat dense white--text color="white">
        <AskAnnaToolbarTitle class="px-0"
          >Do you want to change the name of job <span class="primary--text">{{ name }}</span
          >?</AskAnnaToolbarTitle
        >
        <AskAnnaSpacer />

        <AskAnnaButton icon @click="close">
          <AskAnnaIcon>mdi-close</AskAnnaIcon>
        </AskAnnaButton>
      </AskAnnaToolbar>
      <AskAnnaCardText>
        You are about to change the name of job <b>{{ name }}</b
        >. If you want to run a job in AskAnna via a configuration in
        <AskAnnaCopyText styleClasses="px-2 primary text--white" :showTooltip="false" text="askanna.yml" />, you need to
        make sure that you have specified a job with the same name in your config file.
        <br />
        <br />
        If you change the name of job <b>{{ name }}</b> and did not update the
        <AskAnnaCopyText styleClasses="px-2 primary text--white" :showTooltip="false" text="askanna.yml" />
        configuration, you will not be able to run this job till you updated the config file.
        <br />
        <br />
        Please confirm that you want to change the name of job <b>{{ name }}</b
        >.
      </AskAnnaCardText>
      <AskAnnaCardActions class="ml-5">
        <AskAnnaButton small outlined text color="secondary" class="mr-1 btn--hover" @click="confirmChange"
          >Change job {{ name }}
        </AskAnnaButton>
        <AskAnnaButton small outlined text color="secondary" class="mr-1 btn--hover" @click="close"
          >Cancel</AskAnnaButton
        >
      </AskAnnaCardActions>
    </AskAnnaCard>
  </VDialog>
</template>
<script setup lang="ts">
const props = defineProps({
  value: {
    type: Boolean,
    default: false
  },
  jobName: {
    type: String,
    default: () => ''
  }
})

const emit = defineEmits(['onClose', 'onConfirmChangeName'])

const slicedText = useSlicedText()

const name = computed(() => slicedText(props.jobName, 17))

const valueModel = computed({
  get: () => props.value,
  set: () => emit('onClose')
})

const close = () => emit('onClose')
const confirmChange = () => emit('onConfirmChangeName')
</script>
<style scoped>
.break {
  white-space: break-spaces;
}
.mark {
  color: rgba(0, 0, 0, 0.87);
}
</style>
