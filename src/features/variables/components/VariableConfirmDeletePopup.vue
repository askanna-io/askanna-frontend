<template>
  <VDialog v-model="valueModel" max-width="450px">
    <AskAnnaCard>
      <AskAnnaCardTitle
        >Are you sure you want to delete variable<span class="primary--text break"
          >{{ ` ${variableName}` }}<span class="mark">?</span></span
        ></AskAnnaCardTitle
      >
      <AskAnnaCardActions class="ml-5">
        <AskAnnaButton small outlined text color="secondary" class="mr-1 btn--hover" @click="deleteItemConfirm"
          >Yes</AskAnnaButton
        >
        <AskAnnaButton small outlined text color="secondary" class="mr-1 btn--hover" @click="closeDelete"
          >No</AskAnnaButton
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
  variableName: {
    type: String,
    default: () => ''
  }
})

const emit = defineEmits(['onDelete', 'onCloseDeletePopup'])

const valueModel = computed({
  get: () => props.value,
  set: () => emit('onCloseDeletePopup')
})

const deleteItemConfirm = () => emit('onDelete')
const closeDelete = () => emit('onCloseDeletePopup')
</script>
<style scoped>
.break {
  white-space: break-spaces;
}
.mark {
  color: rgba(0, 0, 0, 0.87);
}
</style>
