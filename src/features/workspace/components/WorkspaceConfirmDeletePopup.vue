<template>
  <v-dialog v-model="valueModel" max-width="650px" @click:outside="closeDelete">
    <AskAnnaCard class="AskAnna-card AskAnna-card--in-dialog" :class="{ 'pt-2': $vuetify.breakpoint.xsOnly }">
      <AskAnnaToolbar
        flat
        white--text
        color="white"
        :dense="!$vuetify.breakpoint.xsOnly"
        :class="{ 'mb-2': $vuetify.breakpoint.xsOnly }"
      >
        <AskAnnaToolbarTitle v-if="!$vuetify.breakpoint.xsOnly" class="px-0"
          >Do you want to remove the <span class="primary--text">{{ title }}</span> workspace?</AskAnnaToolbarTitle
        >
        <div v-else class="text-body-1 font-weight-bold">
          Do you want to remove the <span class="primary--text">{{ title }}</span> workspace?
        </div>
        <AskAnnaSpacer />

        <AskAnnaButton icon @click="closeDelete">
          <AskAnnaIcon>mdi-close</AskAnnaIcon>
        </AskAnnaButton>
      </AskAnnaToolbar>
      <AskAnnaCardText>
        You are about to remove the <b>{{ workspaceName }}</b> workspace. Here's what will happen when you remove the
        <b>{{ workspaceName }}</b> workspace:
        <br />
        <br />
        <ul>
          <li>
            All data related to the <b>{{ workspaceName }}</b> workspace will be removed
          </li>
          <li>
            If other workspaces in AskAnna or external systems use projects, jobs, files or other parts of the
            {{ workspaceName }} workspace, they are not able to use it anymore
          </li>
        </ul>
        <br />
        After 30 days, the system will entirely delete the workspace from the backend. Within 30 days, you can
        <a href="mailto:support@askanna.io" target="_blank">contact us</a>
        if you want to undo the removal.
        <br />
        <br />
        Please confirm that you want to remove the <b>{{ workspaceName }}</b> workspace.
      </AskAnnaCardText>
      <AskAnnaCardActions :class="{ 'px-3': $vuetify.breakpoint.xsOnly }">
        <AskAnnaButton small outlined text color="secondary" class="mr-1 btn--hover" @click="closeDelete"
          >Cancel</AskAnnaButton
        >
        <AskAnnaButton small outlined text color="error" class="mr-1 btn--hover" @click="deleteItemConfirm"
          >Remove workspace{{ $vuetify.breakpoint.xsOnly ? '' : `: ${name}` }}
        </AskAnnaButton>
      </AskAnnaCardActions>
    </AskAnnaCard>
  </v-dialog>
</template>
<script setup lang="ts">
const props = defineProps({
  value: {
    type: Boolean,
    default: false
  },
  workspaceName: {
    type: String,
    default: () => ''
  }
})

const emit = defineEmits(['onClose', 'onDeleteConfirm'])

const slicedText = useSlicedText()

const name = computed(() => slicedText(props.workspaceName, 17))
const title = computed(() => slicedText(props.workspaceName, 27))

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
