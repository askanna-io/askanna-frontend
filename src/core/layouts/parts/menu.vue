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
      <v-btn small dark class="white--text" exact exact-path :to="{ name: 'projects' }" text> Projects </v-btn>
    </v-flex>
    <v-flex v-if="isNotBeta">
      <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="400" offset-y nudge-bottom="10">
        <template v-slot:activator="{ on }">
          <v-btn small dark class="white--text" text v-on="on"> Workspaces </v-btn>
        </template>
        <v-row class="pr-2 white">
          <v-col cols="4">
            <v-list dense>
              <v-list-item-group v-model="project" color="primary">
                <v-list-item v-for="(item, i) in projects" :key="i">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
          <v-col cols="8">
            <v-alert dense border="left" colored-border color="primary">
              <v-text-field
                hide-details
                dense
                append-icon="fas fa-search"
                :height="10"
                label="Search"
                single-line
                outlined
              />
              <div class="pt-1 subtitle-2">Frequently visited</div>
              <v-list two-line dense subheader>
                <v-list-item v-for="item in projectsList" :key="item.title">
                  <v-list-item-avatar>
                    <v-icon :class="[item.iconClass]" v-text="item.icon"></v-icon>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                    <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-btn icon>
                      <v-icon color="grey lighten-1">fas fa-info-circle</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-alert>
          </v-col>
        </v-row>
      </v-menu>
      <v-btn small dark class="white--text" text v-on="on" :to="{ paht: '/projects/' }"> Projects </v-btn>
    </v-flex>
  </div>
</template>

<script setup lang="ts">
import useTitle from '@/core/composition/useTitle'
import { ref, computed } from '@vue/composition-api'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { useWorkspaceStore } from '@/features/workspace/useWorkspaceStore'
import { useWorkspacesStore } from '@/features/workspaces/useWorkspacesStore'

useTitle()
const workspaceStore = useWorkspaceStore()
const { route, router } = useRouterAskAnna()
const workspacesStore = useWorkspacesStore()

const project = ref('')
const menu = ref(false)
const projects = [
  { text: 'Your workspaces', icon: 'fas fa-project-diagram' },
  { text: 'Shared workspaces', icon: '  ' }
]
const projectsList = [
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

const workspaces = computed(() => workspacesStore.workspaces.results)
const workspaceShortUuid = computed(() => workspaceStore.workspace.short_uuid)

const handleChangeWorkspace = ({ short_uuid }) => {
  if (workspaceShortUuid.value === short_uuid && route.value.name !== 'projects') return
  router.push({ path: `/${short_uuid}`, params: { workspace: short_uuid } })
}
</script>
