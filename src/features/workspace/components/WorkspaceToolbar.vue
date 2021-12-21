<template>
  <v-toolbar color="grey lighten-4" flat dense class="br-r5 workspace-toolbar">
    <v-toolbar-title v-if="isSignIn"> {{ title }}{{ isEditWorkspaceView ? ' - Edit mode' : '' }}</v-toolbar-title>
    <v-toolbar-title v-else-if="isWorkspacePublic && !isEditWorkspaceView"> {{ title }}</v-toolbar-title>
    <v-toolbar-title v-else>Not allowed</v-toolbar-title>

    <v-spacer />
    <v-spacer />
    <v-spacer />
    <v-spacer />

    <create-project-popup v-if="!isEditWorkspaceView && !$vuetify.breakpoint.xsOnly" />

    <WorkspaceToolbarMenu :isMember="isMember" :workspaceUuid="workspaceUuid" />
  </v-toolbar>
</template>
<script setup lang="ts">
import { useRouter } from '@u3u/vue-hooks'
import { computed } from '@vue/composition-api'
import WorkspaceToolbarMenu from './WorkspaceToolbarMenu.vue'
import usePermission from '@/core/composition/usePermission'
import CreateProjectPopup from '@/features/project/components/CreateProjectPopup.vue'

defineProps({
  isMember: {
    type: Boolean,
    default: () => false
  },
  isWorkspacePublic: {
    type: Boolean,
    default: () => true
  },
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
})
const { route } = useRouter()
const permission = usePermission()

const isEditWorkspaceView = computed(() => route.value.name === 'workspace-edit')

const isSignIn = computed(() => permission.token.value)
</script>
<style lang="scss">
.mobile-view {
  .workspace-toolbar {
    .v-toolbar__content {
      padding-right: 19px;
    }
  }
}
</style>
