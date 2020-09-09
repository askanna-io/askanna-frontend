<template>
  <v-toolbar color="grey lighten-4" flat dense class="br-r5">
    <v-toolbar-title> {{ title }} - People</v-toolbar-title>
    <v-spacer />
    <v-spacer />
    <v-spacer />
    <v-menu
      v-model="sortMenu"
      class="workspace-menu"
      data-test="workspace-menu"
      transition="slide-y-transition"
      bottom
      :close-on-content-click="false"
      :nudge-width="100"
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" small data-test="workspace-menu-activate-btn"> <v-icon>mdi-sort</v-icon> Sort </v-btn>
      </template>

      <v-list>
        <v-list-item v-for="(item, index) in sortItems" :key="index" @click="handleMenuClick(item)">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-menu
      v-model="sortMenu"
      class="workspace-menu"
      data-test="workspace-menu"
      transition="slide-y-transition"
      bottom
      :close-on-content-click="false"
      :nudge-width="100"
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-btn class="ml-1" v-on="on" small data-test="workspace-menu-activate-btn">
          <v-icon> mdi-filter-variant </v-icon> Filters
        </v-btn>
      </template>

      <v-list>
        <v-list-item v-for="(item, index) in sortItems" :key="index" @click="handleMenuClick(item)">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-spacer />
  </v-toolbar>
</template>
<script>
import { ref, reactive, defineComponent } from '@vue/composition-api'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'

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

  setup(props, context) {
    const workspaceStore = useWorkspaceStore()

    const sortMenu = ref(false)

    const state = reactive({
      menu: false,
      sortMenu: false
    })

    const items = [{ title: 'People', to: 'workspace-people' }]
    const sortItems = [
      { title: 'A-Z', to: 'workspace-people' },
      { title: 'Z-A', to: 'workspace-people' }
    ]

    const handleMenuClick = item => {
      context.root.$router.push({
        name: item.to,
        params: context.root.$route.params
      })
    }
    const handleChangeProjectView = projectView => workspaceStore.changeSettings({ projectView })

    return {
      items,
      sortItems,
      sortMenu,
      handleMenuClick,
      menu: state.menu,
      handleChangeProjectView
    }
  }
})
</script>
