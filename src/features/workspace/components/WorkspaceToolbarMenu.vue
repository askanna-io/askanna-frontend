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
      <v-btn icon v-bind="attrs" @click.stop.prevent="on.click" small>
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
<script>
import usePermission from '@/core/composition/usePermission'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'

import { ref, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'WorkspaceToolbarMenu',

  props: {
    isMember: {
      type: Boolean,
      default: () => false
    },
    workspaceUuid: {
      type: String,
      default: () => ''
    }
  },

  setup(props, context) {
    const permission = usePermission()
    const router = useRouterAskAnna()

    const menu = ref(false)
    const menuItems = computed(() =>
      [
        {
          title: 'Edit workspace',
          to: 'workspace-edit',
          isVisible: permission.getFor(permission.labels.workspaceInfoEdit)
        },
        {
          title: 'Remove workspace',
          onClick: 'onOpenWorkspaceRemove',
          isVisible: permission.getFor(permission.labels.workspaceRemove)
        },
        { title: 'People', to: 'workspace-people', isVisible: props.isMember }
      ].filter(el => el.isVisible)
    )

    const handleMenuClick = item => {
      menu.value = false

      if (item.onClick) {
        context.emit(item.onClick)
        return
      }

      router.push({
        name: item.to,
        params: { workspaceId: props.workspaceUuid }
      })
    }

    return {
      menu,
      menuItems,
      handleMenuClick
    }
  }
})
</script>
