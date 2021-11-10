<template>
  <div class="text-sm-center ml-sm-6 ml-md-0 d-none d-sm-flex">
    <v-flex>
      <v-btn
        v-if="workspaces.length <= 1"
        small
        dark
        text
        exact
        exact-path
        class="white--text"
        :to="{ name: 'worksapce' }"
      >
        Workspace
      </v-btn>
      <v-menu v-else offset-y>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            small
            dark
            text
            class="mx-1 white--text"
            :class="{ 'v-btn--active': $route.name !== 'projects' }"
          >
            Workspaces
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in workspaces"
            :key="index"
            :class="{ 'v-btn--active': workspaceShortUuid === item.short_uuid }"
            @click="handleChangeWorkspace(item)"
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn small dark class="white--text" exact exact-path :to="{ name: 'projects' }" text>
        Projects
      </v-btn>
    </v-flex>
  </div>
</template>

<script>
import '@/core/plugins/intercom.js'
import useProjectStore from '@project/composition/useProjectStore'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'

import useTitle from '@/core/composition/useTitle'
import useAuthStore from '@/features/auth/composition/useAuthStore'
import { computed, defineComponent } from '@vue/composition-api'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'

export default defineComponent({
  name: 'AskAnnaMainMenu',

  setup(_, context) {
    useTitle(context)
    const authStore = useAuthStore()
    const router = useRouterAskAnna()
    const projectStore = useProjectStore()
    const workspaceStore = useWorkspaceStore()

    const logout = () => authStore.actions.logout()
    const workspaces = computed(() => workspaceStore.workspaces.value.results)

    const isMember = computed(() => workspaceStore.workspace.value.is_member)
    const showAppBarIcon = computed(() => !context.root.$route.meta?.hideAppBarIcon)
    const workspaceShortUuid = computed(() => workspaceStore.workspace.value.short_uuid)

    const profileRoute = computed(() => {
      if (isMember.value) {
        return { name: 'workspace-profile', params: { workspaceId: workspaceShortUuid.value } }
      }
      return { name: 'profile' }
    })

    const handleChangeWorkspace = ({ short_uuid }) => {
      if (workspaceShortUuid.value === short_uuid && context.root.$route.name !== 'projects') return
      router.push({ path: `/${short_uuid}`, params: { workspace: short_uuid } })
    }

    const handleOpen = name => router.push({ name })

    return {
      isMember,
      profileRoute,
      showAppBarIcon,
      ...projectStore,
      logout,
      workspaces,
      workspaceShortUuid,

      handleOpen,
      handleChangeWorkspace
    }
  },

  data: () => ({
    text: '',
    project: '',
    menu: false,
    items: [{ title: 'Workspace', name: 'workspace', icon: 'mdi-view-dashboard' }],
    projects: [
      { text: 'Your workspaces', icon: 'fas fa-project-diagram' },
      { text: 'Shared workspaces', icon: '  ' }
    ],
    projectsList: [
      {
        icon: 'mdi-semantic-web',
        iconClass: 'grey lighten-1 white--text',
        title: 'AskAnna startup',
        subtitle: 'AskAnna'
      },
      {
        icon: 'mdi-semantic-web',
        iconClass: 'grey lighten-1 white--text',
        title: 'AskAnna HQ',
        subtitle: 'Andrii Shapovalov'
      },
      {
        icon: 'mdi-semantic-web',
        iconClass: 'grey lighten-1 white--text',
        title: 'AskAnna Sandbox',
        subtitle: 'Andrii Shapovalov'
      }
    ]
  })
})
</script>
