<template>
  <AskAnnaDialog
    max-width="650px"
    v-model="valueModel"
    @onClose="close"
    @click:outside="close"
  >
    <template v-slot:title>
      <p
        v-if="$vuetify.display.xs"
        class="whitespace-pre-wrap sm:truncate"
      >
        Do you want to change the name of job <span class="text-primary">{{
          name
        }}</span>?</p>
      <div v-else>Do you want to change the name of job&nbsp;<span class="text-primary">{{ name }}</span>?</div>
    </template>
    <template v-slot:body>
      <p>
        You are about to change the name of job <b>{{ name }}</b>. If you want to run a job in AskAnna via a configuration
        in
        <span class="px-2 bg-primary text-white rounded">askanna.yml</span>, you need to
        make sure that you have specified a job with the same name in your config file.
      </p>
      <p>
        If you change the name of job <b>{{ name }}</b> and did not update the
        <span class="px-2 bg-primary text-white rounded">askanna.yml</span>
        configuration, you will not be able to run this job till you updated the config file.
      </p>
      <p>Please confirm that you want to change the name of job <b>{{ name }}</b>.</p>
    </template>
    <template v-slot:actions>
      <AskAnnaButton @click="close">Cancel</AskAnnaButton>
      <AskAnnaButton
        color="error"
        @click="confirmChange"
      >Change name {{ name }}</AskAnnaButton>
    </template>
  </AskAnnaDialog>
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

const name = computed(() => slicedText(props.jobName, 15))

const valueModel = computed({
  get: () => props.value,
  set: () => emit('onClose')
})

const close = () => emit('onClose')
const confirmChange = () => emit('onConfirmChangeName')
</script>