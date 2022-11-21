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
    <template v-slot:activator="{ on, attrs }">
      <AskAnnaButton icon v-bind="attrs" @click.stop.prevent="on.click" small class="">
        <AskAnnaIcon>mdi-dots-vertical</AskAnnaIcon>
      </AskAnnaButton>
    </template>

    <VList>
      <template v-for="(item, index) in menuItems">
        <VListItem v-if="item.isVisible" @click="handleMenuClick(item)" :key="index">
          <VListItemTitle>{{ item.title }}</VListItemTitle>
        </VListItem>
      </template>
    </VList>
  </VMenu>
</template>
<script setup lang="ts">
const context = getCurrentInstance()
const { routerPush } = useRouterAskAnna()

const menu = ref(false)

const menuItems = computed(() =>
  [
    {
      title: 'Create workspace',
      to: 'workspace-new',
      isVisible: context?.proxy.$root.$vuetify.breakpoint.xsOnly
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
