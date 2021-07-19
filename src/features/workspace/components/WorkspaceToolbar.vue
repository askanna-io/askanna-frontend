<template>
  <v-toolbar color="grey lighten-4" flat dense class="br-r5">
    <v-toolbar-title> {{ title }}{{ isEditWorkspaceView ? ' - Edit mode' : '' }}</v-toolbar-title>
    <v-spacer />
    <v-spacer />
    <v-spacer />
    <v-spacer />

    <create-project-popup v-if="!isEditWorkspaceView" />

    <v-menu
      bottom
      offset-y
      v-model="menu"
      :nudge-width="100"
      class="workspace-menu"
      data-test="workspace-menu"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on }">
        <v-btn small icon v-on="on" data-test="workspace-menu-activate-btn">
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
  </v-toolbar>
</template>
<script>
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { ref, computed, defineComponent } from '@vue/composition-api'
import CreateProjectPopup from '@/features/project/components/CreateProjectPopup'

export default defineComponent({
  name: 'WorkspaceToolbar',

  props: {
    title: {
      type: String,
      default: ''
    },
    workspaceUuid: {
      type: String,
      default: ''
    },
    isCurrentUserAdmin: {
      type: Boolean,
      default: () => false
    }
  },

  components: { CreateProjectPopup },

  setup(props, context) {
    const router = useRouterAskAnna(context)

    const menu = ref(false)

    const menuItems = computed(() => [
      { title: 'Edit workspace', to: 'workspace-edit', isVisible: true },
      { title: 'Remove workspace', onClick: 'onOpenWorkspaceRemove', isVisible: props.isCurrentUserAdmin },
      { title: 'People', to: 'workspace-people', isVisible: true }
    ])

    const isEditWorkspaceView = computed(() => context.root.$route.name === 'workspace-edit')

    const handleMenuClick = item => {
      menu.value = false

      if (item.onClick) {
        context.emit(item.onClick)
        return
      }

      router.push({
        name: item.to,
        params: context.root.$route.params
      })
    }

    return {
      menu,
      menuItems,
      handleMenuClick,
      isEditWorkspaceView
    }
  }
})
</script>
