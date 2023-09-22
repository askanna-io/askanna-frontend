<template>
  <VDialog
    v-model="dialog"
    width="500"
  >
    <AskAnnaCard>
      <AskAnnaCardTitle>
        <div class="flex items-center justify-between">
          AskAnna warning
          <AskAnnaButton
            class="ml-4"
            variant="text"
            icon="mdi-close"
            @click="handleClose"
          />
        </div>
      </AskAnnaCardTitle>
      <AskAnnaCardText class="pt-1">
        This account is already a member of the <b>{{ workspaceName }}</b> workspace.
        <br />
        Do you want to login and open the workspace?"
      </AskAnnaCardText>
      <AskAnnaCardActions class="mx-4">
        <AskAnnaButton
          class="mr-4"
          color="primary"
          variant="elevated"
          @click.stop="handleLogin(true)"
        >
          YES
        </AskAnnaButton>
        <AskAnnaButton
          class="mr-4"
          @click.stop="handleLogin(false)"
        >
          NO, I WANT TO USE ANOTHER ACCOUNT
        </AskAnnaButton>
      </AskAnnaCardActions>
    </AskAnnaCard>
  </VDialog>
</template>

<script setup lang="ts">
const props = defineProps({
  value: {
    type: Boolean,
    default: () => false
  },
  workspaceName: {
    type: String,
    default: () => ''
  }
})

const emit = defineEmits(['changeValue', 'closeDialog'])

const dialog = computed({
  get: () => {
    return props.value
  },
  set: val => {
    emit('changeValue', val)
  }
})

const handleClose = () => emit('closeDialog')
const handleLogin = val => emit('changeValue', val)
</script>