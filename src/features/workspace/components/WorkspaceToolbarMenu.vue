<template>
  <AskAnnaToolbarMenu
    :items="menuItems"
    @onClick="handleMenuClick"
  />
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

const emit = defineEmits(['onOpenWorkspaceRemove'])

const display = useDisplay()
const permission = useAskAnnaPermission()
const { routerPush } = useRouterAskAnna()

const menuItems = computed(() =>
  [
    {
      title: 'Create project',
      to: 'workspace-new-project',
      isVisible:
        permission.getFor(permission.labels.projectCreate || props.permission[permission.labels.projectCreate]) &&
        display.xs.value
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
      color: 'text-error',
      isVisible:
        permission.getFor(permission.labels.workspaceRemove) || props.permission[permission.labels.workspaceRemove]
    },
    { title: 'People', to: 'workspace-people', isVisible: props.isMember }
  ].filter(el => el.isVisible)
)

const handleMenuClick = item => {
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