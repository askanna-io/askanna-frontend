<template>
  <div class="text-center">
    <VDialog v-model="dialog" width="500">
      <AskAnnaCard>
        <AskAnnaCardTitle class="headline primary white--text">
          AskAnna warning
          <AskAnnaSpacer />
          <AskAnnaButton color="secondary" class="ml-4" small icon>
            <AskAnnaIcon color="white" left @click="handleClose">mdi-close</AskAnnaIcon>
          </AskAnnaButton>
        </AskAnnaCardTitle>

        <AskAnnaCardText class="pt-1">
          This account is already a member of the <b>{{ workspaceName }}</b> workspace.
          <br />
          Do you want to login and open the workspace?"
        </AskAnnaCardText>

        <AskAnnaCardActions class="mx-4">
          <AskAnnaButton color="primary" text outlined small class="mr-4" @click.stop="handleLogin(true)">
            YES
          </AskAnnaButton>
          <AskAnnaButton class="mr-4" text outlined small @click.stop="handleLogin(false)">
            NO, I WANT TO USE ANOTHER ACCOUNT
          </AskAnnaButton>
        </AskAnnaCardActions>
      </AskAnnaCard>
    </VDialog>
  </div>
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

const handleLogin = val => emit('changeValue', val)
const handleClose = () => emit('closeDialog')
</script>
