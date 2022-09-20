<template>
  <v-list>
    <v-list-item-group :value="state.ordering" @change="handleChange" color="primary">
      <v-list-item dense v-for="(item, i) in items" :key="i" :value="item.sort">
        <v-list-item-icon>
          <v-icon v-text="item.icon"></v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title v-text="item.text" />
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
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
