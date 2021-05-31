<template>
  <v-toolbar color="grey lighten-4" flat dense class="br-r5">
    <v-toolbar-title> {{ title }}{{ isEditWorkspaceView ? ' - Edit mode' : '' }}</v-toolbar-title>
    <v-spacer />
    <v-spacer />
    <v-spacer />
    <v-spacer />

    <create-project-popup />

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
        <v-list-item v-for="(item, index) in menuItems" :key="index" @click="handleMenuClick(item)">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
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
    }
  },

  components: { CreateProjectPopup },

  setup(_, context) {
    const router = useRouterAskAnna(context)

    const menu = ref(false)

    const editItems = [{ title: 'People', to: 'workspace-people' }]
    const fulleItems = [
      { title: 'Edit workspace', to: 'workspace-edit' },
      { title: 'People', to: 'workspace-people' }
    ]

    const isEditWorkspaceView = computed(() => context.root.$route.name === 'workspace-edit')
    const menuItems = computed(() => (isEditWorkspaceView.value ? editItems : fulleItems))

    const handleMenuClick = item => {
      menu.value = false

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
