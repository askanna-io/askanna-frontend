<template>
  <AskAnnaCard
    :to="to"
    class="mx-auto"
    :elevation="hover ? 12 : 6"
  >
    <AskAnnaCardTitle class="pr-0 md:pr-2">
      <div class="flex items-center justify-between h-10">
        <div class="truncate">
          <AskAnnaIcon
            color="on-surface"
            :icon="getIcon()"
          />
          {{ name }}
        </div>
      </div>
    </AskAnnaCardTitle>

    <AskAnnaCardText class="h-20">
      <p class="line-clamp-3 ">{{ description }}</p>
    </AskAnnaCardText>
  </AskAnnaCard>
</template>

<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    default: () => ''
  },
  visibility: {
    type: String,
    default: () => 'PRIVATE'
  },
  hover: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: () => ''
  },
  to: {
    type: Object,
    default: () => {
      return {
        name: '',
        params: {}
      }
    }
  }
})

const getIcon = () => (props.visibility === 'PUBLIC' ? 'mdi-package-variant' : 'mdi-package-variant-closed')
</script>