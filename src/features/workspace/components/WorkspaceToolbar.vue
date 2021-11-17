<template>
  <v-toolbar color="grey lighten-4" flat dense class="br-r5">
    <v-toolbar-title v-if="isSignIn"> {{ title }}{{ isEditWorkspaceView ? ' - Edit mode' : '' }}</v-toolbar-title>
    <v-toolbar-title v-else-if="isWorkspacePublic && !isEditWorkspaceView"> {{ title }}</v-toolbar-title>
    <v-toolbar-title v-else>Not allowed</v-toolbar-title>

    <v-spacer />
    <v-spacer />
    <v-spacer />
    <v-spacer />

    <create-project-popup v-if="!isEditWorkspaceView" />

    <WorkspaceToolbarMenu :isMember="isMember" :workspaceUuid="workspaceUuid" />
  </v-toolbar>
</template>
<script>
import WorkspaceToolbarMenu from './WorkspaceToolbarMenu'
import usePermission from '@/core/composition/usePermission'
import { computed, defineComponent } from '@vue/composition-api'
import CreateProjectPopup from '@/features/project/components/CreateProjectPopup'

export default defineComponent({
  name: 'WorkspaceToolbar',

  props: {
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
  },

  components: { CreateProjectPopup, WorkspaceToolbarMenu },

  setup(props, context) {
    const permission = usePermission()

    const isEditWorkspaceView = computed(() => context.root.$route.name === 'workspace-edit')

    return {
      isEditWorkspaceView,
      isSignIn: permission.token
    }
  }
})
</script>
