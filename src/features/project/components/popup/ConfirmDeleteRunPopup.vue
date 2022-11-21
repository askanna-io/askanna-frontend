<template>
  <VDialog v-model="valueModel" max-width="650px" @click:outside="closeDelete">
    <AskAnnaCard class="AskAnna-card AskAnna-card--in-dialog" :class="{ 'pt-2': $vuetify.breakpoint.xsOnly }">
      <AskAnnaToolbar
        flat
        white--text
        color="white"
        :dense="!$vuetify.breakpoint.xsOnly"
        :class="{ 'mb-2': $vuetify.breakpoint.xsOnly }"
      >
        <AskAnnaToolbarTitle v-if="!$vuetify.breakpoint.xsOnly" class="px-0"
          >Do you want to remove the run <span class="primary--text">{{ title }}</span
          >?</AskAnnaToolbarTitle
        >
        <div v-else class="text-body-1 font-weight-bold">
          Do you want to remove the run <span class="primary--text">{{ title }}</span
          >?
        </div>
        <AskAnnaSpacer />

        <AskAnnaButton icon @click="closeDelete">
          <AskAnnaIcon>mdi-close</AskAnnaIcon>
        </AskAnnaButton>
      </AskAnnaToolbar>
      <AskAnnaCardText>
        You are about to remove the run <b>{{ fullNameOrId }}</b
        >. Here's what will happen when you remove the run:
        <br />
        <br />
        <ul>
          <li>
            The run <b>{{ fullNameOrId }}</b> will be removed
          </li>
          <li>
            All data related to the run <b>{{ fullNameOrId }}</b> will be removed
          </li>
          <li>
            If other projects, systems or jobs use information or files from the run <b>{{ fullNameOrId }}</b
            >, they are not able to use it anymore
          </li>
        </ul>
        <br />
        After 30 days, the system will entirely delete the run from the backend. Within 30 days, you can
        <a href="mailto:support@askanna.io" target="_blank">contact us</a> if you want to undo the removal.
        <br />
        <br />
        Please confirm that you want to remove the run <b>{{ name }}</b
        >.
      </AskAnnaCardText>
      <AskAnnaCardActions :class="{ 'px-3': $vuetify.breakpoint.xsOnly }">
        <AskAnnaButton small outlined text color="secondary" class="mr-1 btn--hover" @click="closeDelete"
          >Cancel</AskAnnaButton
        >
        <AskAnnaButton small outlined text color="error" class="mr-1 btn--hover" @click="deleteItemConfirm"
          >Remove run{{ $vuetify.breakpoint.xsOnly ? '' : `: ${name}` }}
        </AskAnnaButton>
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

const closeDelete = () => emit('onClose')
const deleteItemConfirm = () => emit('onDeleteConfirm')
</script>
<style scoped>
.break {
  white-space: break-spaces;
}
.mark {
  color: rgba(0, 0, 0, 0.87);
}
</style>
