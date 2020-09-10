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
      v-model="filterMenu"
      :close-on-content-click="false"
      :nudge-width="200"
      :nudge-height="300"
      offset-y
      nudge-bottom="10"
    >
      <template v-slot:activator="{ on }">
        <v-btn class="ml-1" v-on="on" small data-test="workspace-menu-activate-btn">
          <v-icon> mdi-filter-variant </v-icon> Filters
        </v-btn>
      </template>
      <v-row class="pa-2 white">
        <v-col class="d-flex" cols="12">
          <v-select
            v-model="template"
            :items="projectTemplates"
            item-text="name"
            item-value="short_uuid"
            label="Template"
            no-data-text=""
            dense
          />
        </v-col>
      </v-row>
    </v-menu>
  </v-toolbar>
</template>
<script>
import { ref, computed, reactive, defineComponent } from '@vue/composition-api'
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
    const filterMenu = ref(false)

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

    const projects = [
      { text: 'Your projects', icon: 'fas fa-project-diagram' },
      { text: 'Shared projects', icon: 'mdi-account' },
      { text: 'Conversions', icon: 'mdi-flag' }
    ]

    const projectsList = [
      { icon: 'far fa-folder', iconClass: 'grey lighten-1 white--text', title: 'uiprototype', subtitle: 'AskAnna' },
      {
        icon: 'far fa-folder',
        iconClass: 'grey lighten-1 white--text',
        title: 'askanna-frontend',
        subtitle: 'AskAnna'
      },
      {
        icon: 'far fa-folder',
        iconClass: 'grey lighten-1 white--text',
        title: 'Git Lab Issue Reporter',
        subtitle: ' Andrii Shapovalov'
      }
    ]

    const template = computed({
      get: () => 2,
      set: value => context.emit('handleOnInput', { path: 'template', value })
    })

    const projectTemplates = [
      { short_uuid: 1, name: 'All type' },
      { short_uuid: 2, name: 'Admin' },
      { short_uuid: 3, name: 'Members' },
      { short_uuid: 3, name: 'Pending' }
    ]

    const project = ref('')

    return {
      template,
      filterMenu,
      projectTemplates,
      project,
      projects,
      projectsList,
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
