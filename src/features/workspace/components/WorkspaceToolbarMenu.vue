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
          <VListItemTitle :class="[item.color]">{{ item.title }}</VListItemTitle>
        </VListItem>
      </template>
    </VList>
  </VMenu>
</template>
<script setup lang="ts">
const props = defineProps({
  isMember: {
    type: Boolean,
    default: () => false
  },
  permission: {
    type: Object,
    default: () => ({})
  },
  workspaceUuid: {
    type: String,
    default: () => ''
  },
  usePermission: {
    type: Boolean,
    default: () => false
  }
})

const emit = defineEmits('onOpenWorkspaceRemove')

const permission = usePermission()
const context = getCurrentInstance()
const { routerPush } = useRouterAskAnna()

const menu = ref(false)

const menuItems = computed(() =>
  [
    {
      title: 'Create project',
      to: 'workspace-new-project',
      isVisible:
        permission.getFor(permission.labels.projectCreate || props.permission[permission.labels.projectCreate]) &&
        context?.proxy.$root.$vuetify.breakpoint.xsOnly
    },
    {
      title: 'Edit workspace',
      to: 'workspace-edit',
      isVisible:
        permission.getFor(permission.labels.workspaceInfoEdit) || props.permission[permission.labels.workspaceInfoEdit]
    },
    {
      title: 'Remove workspace',
      onClick: 'onOpenWorkspaceRemove',
      color: 'error--text',
      isVisible:
        permission.getFor(permission.labels.workspaceRemove) || props.permission[permission.labels.workspaceRemove]
    },
    { title: 'People', to: 'workspace-people', isVisible: props.isMember }
  ].filter(el => el.isVisible)
)

const handleMenuClick = item => {
  menu.value = false

  if (item.onClick) {
    emit(item.onClick)
    return
  }

  routerPush({
    name: item.to,
    params: { workspaceId: props.workspaceUuid }
  })
}
</script>
