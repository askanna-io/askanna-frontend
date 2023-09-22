<template>
  <VDataTable
    :items="data"
    :search="search"
    :row-height="40"
    :headers="headers"
    :items-per-page="-1"
    :mobile-breakpoint="0"
    class="askanna-table askanna-table--no-wrap"
    :group-by="activeGroup?.value || []"
  >
    <template
      v-slot:headers
      v-if="isNoHeaderPresent"
    >
    </template>
    <template v-slot:top>
      <div
        v-if="headers.length && !isNoHeaderPresent"
        class="flex justify-end mt-4 gap-x-4"
      >
        <div class="flex w-full px-4 sm:px-0 sm:w-52">
          <AskAnnaSelect
            width="100px"
            return-object
            label="Group by"
            :items="groupItems"
            v-model="activeGroup"
            :isTweakLabelStyles="false"
          />
        </div>
        <div
          v-if="!$vuetify.display.xs"
          class="flex flex-grow-0 w-56"
        >
          <AskAnnaTextField
            single-line
            hide-details
            label="Search"
            v-model="search"
            variant="underlined"
            append-inner-icon="mdi-magnify"
          />
        </div>
      </div>
    </template>
    <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
      <tr>
        <td :colspan="columns.length">
          <AskAnnaButton
            variant="text"
            @click="toggleGroup(item)"
            :icon="isGroupOpen(item) ? 'mdi-minus' : 'mdi-plus'"
          />
          {{ item.key }}: {{ item.value }}
        </td>
      </tr>
    </template>
    <template v-slot:bottom>
    </template>

    <template
      v-if="isNoHeaderPresent"
      v-slot:body="{ items, columns }"
    >
      <template
        v-for="(item, index) in items"
        :key="index"
      >
        <tr class="pointer hover:bg-third max-w-max">
          <template v-for="(val) in Object.values(item.raw)">
            <AskAnnaTableItem class="whitespace-nowrap">{{ val }}</AskAnnaTableItem>
          </template>
        </tr>
      </template>
    </template>
  </VDataTable>
</template>
<script setup lang="ts">
import { VDataTable } from 'vuetify/labs/VDataTable'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  headers: {
    type: Array,
    default: () => []
  },
  isNoHeaderPresent: {
    type: Boolean,
    default: false
  }
})

const search = ref()
const activeGroup = ref()
const defaultGroupValue = { name: 'No group by', value: [{ key: '', order: '' }] }

const groupItems = computed(() => {
  const items = props.headers.map(el => ({ name: el.title, value: [{ key: el.key, order: 'asc' }] }))

  return [defaultGroupValue, ...items]
})

</script>