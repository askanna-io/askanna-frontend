<template>
  <tbody>
    <template v-for="(item, index) in items">
      <tr :key="index + group" class="v-row-group__header">
        <td :colspan="headersLength - 1" class="text-start">
          <v-btn
            dark
            icon
            x-small
            color="secondary"
            @click="hadleTogle(index)"
            class="btn--hover btn--without-text mr-3 link-btn"
          >
            <v-icon>{{ getIcons(index) }}</v-icon>
          </v-btn>
          {{ group }}: {{ item.name }}
        </td>
      </tr>
      <template v-if="isExpanded(index)">
        <template v-for="(subItem, index2) in item.items">
          <tr :key="index + index2 + item.name">
            <template v-for="(value, index3) in subItem">
              <td v-if="index3 && group !== index3" class="text-start" :key="index3">{{ value }}</td>
            </template>
          </tr>
        </template>
      </template>
    </template>
  </tbody>
</template>
<script setup lang="ts">
import { ref, computed } from '@vue/composition-api'
const props = defineProps({
  groupBy: {
    type: Array,
    default: () => []
  },
  items: {
    type: Array,
    default: () => []
  },
  headersLength: {
    type: Number,
    default: () => 0
  }
})
const group = computed(() => (props.groupBy.length ? props.groupBy[0] : ''))

const notExpanded = ref([])

const getIcons = (index: number) => (notExpanded.value.includes(index) ? 'mdi-plus' : 'mdi-minus')

const hadleTogle = (index: number) => {
  notExpanded.value.includes(index)
    ? notExpanded.value.splice(notExpanded.value.indexOf(index), 1)
    : notExpanded.value.push(index)
}

const isExpanded = index => !notExpanded.value.includes(index)
</script>
