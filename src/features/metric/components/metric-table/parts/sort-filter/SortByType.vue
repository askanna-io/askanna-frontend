<template>
  <VList>
    <VListItemGroup :value="state.ordering" @change="handleChange" color="primary">
      <VListItem dense v-for="(item, i) in items" :key="i" :value="item.sort">
        <VListItemIcon>
          <AskAnnaIcon>{{ item.icon }}</AskAnnaIcon>
        </VListItemIcon>

        <VListItemContent>
          <VListItemTitle v-text="item.text" />
        </VListItemContent>
      </VListItem>
    </VListItemGroup>
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

const handleChange = value => changeState({ path: 'ordering', value })
</script>
