<template>
  <AskAnnaToolbar
    v-if="variableCreate"
    density="compact"
  >
    <div class="flex w-full items-center justify-between">
      <div class="sm:w-9/12 md:w-6/12 xl:w-4/12">
      </div>
      <div class="flex items-center justify-end sm:w-9/12 md:w-6/12 xl:w-4/12 text-end">
        <AskAnnaButton
          @click="handleOpenVariablePopup()"
          variant="elevated"
          colorIcon="primary"
          prependIcon="mdi-plus"
          class="mr-3 rounded-full"
        >New variable</AskAnnaButton>
      </div>
    </div>
  </AskAnnaToolbar>
</template>

<script setup lang="ts">
const emits = defineEmits(['openVariablePopup'])

const permission = useAskAnnaPermission()
const variableCreate = computed(() => permission.getFor(permission.labels.variableCreate))

const handleOpenVariablePopup = () => emits('openVariablePopup')
</script>
