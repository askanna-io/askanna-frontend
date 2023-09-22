<template>
  <VList
    base-color="main"
    density="compact"
    :model-value="state.order_by"
    @click:select="handleChange"
  >
    <VListItem
      v-for="(item, i) in items"
      density="compact"
      :key="item.sort"
      :value="item.sort"
      :active="item.sort === state.order_by"
    >
      <template v-slot:prepend>
        <v-icon :icon="item.icon"></v-icon>
      </template>
      <div class="VListItemContent">
        <VListItemTitle v-text="item.text" />
      </div>
    </VListItem>
  </VList>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  sortBy: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: () => false
  }
})

const items = [
  {
    sort: `${props.sortBy}`,
    text: 'Sort A -> Z',
    icon: 'mdi-sort-alphabetical-ascending'
  },
  {
    sort: `-${props.sortBy}`,
    text: 'Sort Z -> A',
    icon: 'mdi-sort-alphabetical-descending'
  }
]

const state = inject('state')
const changeState = inject('changeState')

const handleChange = item => {
  const value = item.value ? item.id : undefined
  changeState({ path: 'order_by', value })
}
</script>
