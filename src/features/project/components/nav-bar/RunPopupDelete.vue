<template>
  <AskAnnaDialog
    @onClose="close"
    v-model="valueModel"
  >
    <template v-slot:title>
      <p
        v-if="$vuetify.display.xs"
        class="whitespace-pre-wrap sm:truncate"
      >Do you want to remove the run <span class="text-primary">{{ title
      }}</span>?</p>
      <div v-else>Do you want to remove the run&nbsp;<span class="text-primary">{{ title }}</span>?</div>
    </template>
    <template v-slot:body>
      <p>You are about to remove the run <b>{{ fullNameOrId }}</b>. Here's what will happen when you remove the run:</p>
      <ul>
        <li>
          The run <b>{{ fullNameOrId }}</b> will be removed
        </li>
        <li>
          All data related to the run <b>{{ fullNameOrId }}</b> will be removed
        </li>
        <li>
          If other projects, systems or jobs use information or files from the run <b>{{ fullNameOrId }}</b>, they are
          not able to use it anymore
        </li>
      </ul>
      <p>After 30 days, the system will entirely delete the run from the backend. Within 30 days, you can
        <a
          href="mailto:support@askanna.io"
          target="_blank"
        >contact us</a> if you want to undo the removal.
      </p>
      <p>Please confirm that you want to remove the run <b>{{ name }}</b>.</p>
    </template>
    <template v-slot:actions>
      <AskAnnaButton @click="close">Cancel</AskAnnaButton>

      <AskAnnaButton
        color="error"
        @click="deleteItemConfirm"
      >Remove run{{ $vuetify.display.xs ? '' : `: ${name}` }}
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
  runInfo: {
    type: Object,
    default: function () {
      return {
        name: '',
        suuid: '',
        description: ''
      }
    }
  }
})

const emit = defineEmits(['onClose', 'onDeleteConfirm'])

const slicedText = useSlicedText()

const fullNameOrId = computed(() => props.runInfo.name || props.runInfo.suuid)
const name = computed(() => slicedText(props.runInfo.name, 17) || props.runInfo.suuid)
const title = computed(() => slicedText(props.runInfo.name, 27) || props.runInfo.suuid)

const valueModel = computed({
  get: () => props.value,
  set: () => emit('onClose')
})

const close = () => emit('onClose')

const deleteItemConfirm = () => emit('onDeleteConfirm')
</script>
