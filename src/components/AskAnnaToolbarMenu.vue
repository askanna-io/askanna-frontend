<template>
  <VMenu
    v-if="items.length"
    v-model="menu"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ props }">
      <AskAnnaButton
        class="mr-1"
        v-bind="props"
        variant="text"
        @click.stop.prevent
        icon="mdi-dots-vertical"
      />
    </template>

    <VList base-color="main">
      <template v-for="(item, index) in items">
        <VListItem
          v-if="item.isVisible"
          :key="index"
          @click="handleMenuClick(item)"
        >
          <VListItemTitle
            :class="[item.color]"
            class="cursor-pointer"
            :disabled="item.disabled"
          >{{ item.title }}</VListItemTitle>
        </VListItem>
      </template>
    </VList>
  </VMenu>
</template>
<script setup lang="ts">
defineProps({
  items: {
    type: Object,
    default: () => ([])
  }
})

const emit = defineEmits(['onClick'])

const menu = ref(false)

const handleMenuClick = item => {
  menu.value = false

  emit('onClick', item)
}
</script>