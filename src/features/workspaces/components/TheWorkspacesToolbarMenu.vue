<template>
  <VMenu
    v-if="menuItems.length"
    bottom
    offset-y
    v-model="menu"
    class="workspace-menu"
    data-test="workspace-menu"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ props }">
      <AskAnnaButton
        v-bind="props"
        variant="text"
        @click.stop.prevent
        icon="mdi-dots-vertical"
      />
    </template>
    <VList>
      <template v-for="(item, index) in menuItems">
        <VListItem
          v-if="item.isVisible"
          @click="handleMenuClick(item)"
          :key="index"
        >
          <VListItemTitle>{{ item.title }}</VListItemTitle>
        </VListItem>
      </template>
    </VList>
  </VMenu>
</template>
<script setup lang="ts">
const display = useDisplay()
const { routerPush } = useRouterAskAnna()

const menu = ref(false)

const menuItems = computed(() =>
  [
    {
      title: 'Create workspace',
      to: 'workspace-new',
      isVisible: display.xs
    }
  ].filter(el => el.isVisible)
)

const handleMenuClick = item => {
  menu.value = false

  routerPush({
    name: item.to
  })
}
</script>
