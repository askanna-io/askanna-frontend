<template>
  <VDialog
    max-width="650px"
    v-model="valueModel"
    @click:outside="closeDelete"
  >
    <AskAnnaCard :class="{ 'pt-2': $vuetify.display.xs }">
      <AskAnnaCardTitle class="pl-6">
        <div class="flex items-center justify-between">
          <p class="whitespace-pre-wrap sm:truncate">
            Do you want to remove the <span class="text-primary">{{
              workspaceName }}</span>
            workspace
            <span class="sm:hidden">?</span>
          </p>
          <span class="grow hidden sm:flex">?</span>
          <AskAnnaButton
            variant="text"
            class="ml-4"
            icon="mdi-close"
            @click="closeDelete"
          />
        </div>
      </AskAnnaCardTitle>
      <AskAnnaCardText class="prose pt-0 max-w-full pr-7">
        You are about to remove the <b>{{ workspaceName }}</b> workspace. Here's what will happen when you remove the
        <b>{{ workspaceName }}</b> workspace:
        <ul>
          <li>
            All data related to the <b>{{ workspaceName }}</b> workspace will be removed.
          </li>
          <li>
            If other workspaces in AskAnna or external systems use projects, jobs, files or other parts of the
            {{ workspaceName }} workspace, they are not able to use it anymore.
          </li>
        </ul>
        After 30 days, the system will entirely delete the workspace from the backend. Within 30 days, you can
        <a
          href="mailto:support@askanna.io"
          target="_blank"
        >contact us</a>
        if you want to undo the removal.

        <p>Please confirm that you want to remove the <b>{{ workspaceName }}</b> workspace.</p>
      </AskAnnaCardText>
      <AskAnnaCardActions
        class="pl-6"
        :class="{ 'pl-3': $vuetify.display.xs }"
      >
        <AskAnnaButton
          class="mr-1"
          @click="closeDelete"
        >Cancel</AskAnnaButton>
        <AskAnnaButton
          class="mr-1"
          color="error"
          variant="outlined"
          @click="deleteItemConfirm"
        >Remove workspace{{ $vuetify.display.xs ? '' : `: ${name}` }}
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
  workspaceName: {
    type: String,
    default: () => ''
  }
})

const emit = defineEmits(['onClose', 'onDeleteConfirm'])

const slicedText = useSlicedText()

const name = computed(() => slicedText(props.workspaceName, 17))

const valueModel = computed({
  get: () => props.value,
  set: () => emit('onClose')
})

const closeDelete = () => emit('onClose')
const deleteItemConfirm = () => emit('onDeleteConfirm')
</script>