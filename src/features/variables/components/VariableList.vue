<template>
  <v-data-table
    class="variables-table ask-anna-table"
    :items="items"
    :headers="headers"
    hide-default-footer
    item-key="short_uuid"
    disable-pagination
    :mobile-breakpoint="0"
  >
    <template v-slot:top>
      <slot name="header" />
    </template>

    <template v-slot:item.short_uuid="{ item }">
      <ask-anna-copy :text="item.short_uuid" prefix="#" :show="4" />
    </template>
    <template v-slot:item.name="{ item }">
      <ask-anna-copy :text="item.name" smartSlice :width="35" />
    </template>
    <template v-slot:item.value="{ item }">
      <ask-anna-copy :text="item.value" smartSlice :width="35" :masked="item.is_masked" expanded />
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn
        v-if="projectVariableEdit"
        class="my-2 btn--hover"
        small
        outlined
        color="secondary"
        @click="handleEditItem(item)"
      >
        <v-icon color="secondary" left small class="mr-2">mdi-pencil</v-icon>Edit
      </v-btn>
    </template>
    <template v-slot:no-data>
      <template v-if="projectVariableEdit">
        There are no variables available for this project. In case you need a variable, you can easily create one with
        the option "+ new variable" above this table.
      </template>
      <template v-else> There are no variables available for this project. </template>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { ref, computed } from '@vue/composition-api'
import usePermission from '@/core/composition/usePermission'
import AskAnnaCopy from '@/core/components/shared/AskAnnaCopy.vue'

defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits('onEditItem')

const permission = usePermission()
const projectVariableEdit = computed(() => permission.getFor(permission.labels.projectVariableEdit))

const headers = ref([
  {
    text: 'SUUID',
    align: 'start',
    sortable: false,
    value: 'short_uuid',
    width: '10%',
    class: 'text-left text-subtitle-2 font-weight-bold h-20'
  },
  { text: 'Name', value: 'name', width: '35%', class: 'text-left text-subtitle-2 font-weight-bold h-20 text-no-wrap' },
  {
    text: 'Value',
    value: 'value',
    width: '45%',
    sortable: true,
    class: 'text-left text-subtitle-2 font-weight-bold h-20'
  },
  {
    text: '',
    value: 'actions',
    width: '10%',
    sortable: false,
    class: 'text-left text-subtitle-2 font-weight-bold h-20'
  }
])

const handleEditItem = item => emits('onEditItem', item.short_uuid)
</script>
