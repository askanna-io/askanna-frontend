<template>
  <v-toolbar color="grey lighten-4" flat dense class="br-r5">
    <v-toolbar-title> {{ title }} test308</v-toolbar-title>
    <v-spacer />
    <v-spacer />
    <v-spacer />
    <v-spacer />

    <create-project-popup />

    <v-menu
      v-model="menu"
      class="workspace-menu"
      data-test="workspace-menu"
      transition="slide-y-transition"
      bottom
      :close-on-content-click="false"
      :nudge-width="100"
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" data-test="workspace-menu-activate-btn">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index" @click="handleMenuClick(item)">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>
<script>
import { reactive, defineComponent } from '@vue/composition-api'
import CreateProjectPopup from '@/features/project/components/CreateProjectPopup'
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

  components: { CreateProjectPopup },

  setup(props, context) {
    const workspaceStore = useWorkspaceStore()

    const state = reactive({
      menu: false
    })

    const items = [{ title: 'People', to: 'workspace-people' }]

    const handleMenuClick = item => {
      context.root.$router.push({
        name: item.to,
        params: context.root.$route.params
      })
    }
    const handleChangeProjectView = projectView => workspaceStore.changeSettings({ projectView })

    return {
      items,
      menu: state.menu,
      handleMenuClick,
      handleChangeProjectView
    }
  }
})
</script>
