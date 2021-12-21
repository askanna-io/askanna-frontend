<template>
  <v-menu
    v-if="menuItems.length"
    bottom
    offset-y
    v-model="menu"
    class="workspace-menu"
    data-test="workspace-menu"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" @click.stop.prevent="on.click" small class="">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>

    <v-list>
      <template v-for="(item, index) in menuItems">
        <v-list-item v-if="item.isVisible" @click="handleMenuClick(item)" :key="index">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>
<script setup lang="ts">
import usePermission from '@/core/composition/usePermission'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { ref, computed, getCurrentInstance } from '@vue/composition-api'

const props = defineProps({
  isMember: {
    type: Boolean,
    default: () => false
  },
  workspaceUuid: {
    type: String,
    default: () => ''
  },
  onlyShowPeople: {
    type: Boolean,
    default: () => false
  }
})

const router = useRouterAskAnna()
const permission = usePermission()
const context = getCurrentInstance()

const menu = ref(false)

const menuItems = computed(() =>
  [
    {
      title: 'Create project',
      to: 'workspace-new-project',
      isVisible:
        permission.getFor(permission.labels.workspaceProjectCreate) &&
        !props.onlyShowPeople &&
        context.root.proxy.$vuetify.breakpoint.xsOnly
    },
    {
      title: 'Edit workspace',
      to: 'workspace-edit',
      isVisible: permission.getFor(permission.labels.workspaceInfoEdit) && !props.onlyShowPeople
    },
    {
      title: 'Remove workspace',
      onClick: 'onOpenWorkspaceRemove',
      isVisible: permission.getFor(permission.labels.workspaceRemove) && !props.onlyShowPeople
    },
    { title: 'People', to: 'workspace-people', isVisible: props.isMember }
  ].filter(el => el.isVisible)
)

const handleMenuClick = item => {
  menu.value = false

  router.push({
    name: item.to,
    params: { workspaceId: props.workspaceUuid }
  })
}
</script>
