<template>
  <AskAnnaDialog
    v-model="valueModel"
    max-width="650px"
    @onClose="handleClose"
    @click:outside="handleClose"
  >
    <template v-slot:title>
      <p
        v-if="$vuetify.display.xs"
        class="whitespace-pre-wrap sm:truncate"
      >
        Do you want to remove the job <span class="text-primary">{{
          title
        }}</span>?</p>
      <div v-else> Do you want to remove the job&nbsp;<span class="text-primary">{{ title }}</span>?</div>
    </template>

    <template v-slot:body>
      <p>You are about to remove the job <b>{{ jobName }}</b>. Here's what will happen when you remove the job:</p>
      <ul>
        <li>
          The job <b>{{ jobName }}</b> will be removed
        </li>
        <li>
          All data related to the job <b>{{ jobName }}</b>, including runs, will be removed
        </li>
        <li>
          If other projects, systems or jobs use information or files from the job <b>{{ jobName }}</b> and related
          runs, they are not able to use it anymore
        </li>
      </ul>
      <p>After 30 days, the system will entirely delete the job from the backend. Within 30 days, you can
        <a
          href="mailto:support@askanna.io"
          target="_blank"
        >contact us</a> if you want to undo the removal.
      </p>
      <p>Please confirm that you want to remove the job <b>{{ jobName }}</b>.</p>
    </template>

    <template v-slot:actions>
      <AskAnnaButton @click="handleClose">Cancel</AskAnnaButton>
      <AskAnnaButton
        color="error"
        @click="deleteItemConfirm"
      >Remove job{{ $vuetify.display.xs ? '' : `: ${name}` }}
      </AskAnnaButton>
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

const emit = defineEmits(['onClose', 'onDeleteConfirm'])

const slicedText = useSlicedText()

const name = computed(() => slicedText(props.jobName, 17))
const title = computed(() => slicedText(props.jobName, 27))

const valueModel = computed({
  get: () => props.value,
  set: () => emit('onClose')
})

const handleClose = () => emit('onClose')
const deleteItemConfirm = () => emit('onDeleteConfirm')
</script>