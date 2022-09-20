<template>
  <v-dialog v-model="valueModel" max-width="450px">
    <v-card>
      <v-card-title
        >Are you sure you want to delete variable<span class="primary--text break"
          >{{ ` ${variableName}` }}<span class="mark">?</span></span
        ></v-card-title
      >
      <v-card-actions class="ml-5">
        <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="deleteItemConfirm">Yes</v-btn>
        <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="closeDelete">No</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
