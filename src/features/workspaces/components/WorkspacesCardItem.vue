<template>
  <v-card
    class="mx-auto h-100"
    :elevation="hover ? 16 : 2"
    :to="{
      name: 'workspace',
      params: {
        workspaceId: workspace.short_uuid,
        title: `${workspace.name}}`
      }
    }"
  >
    <v-toolbar flat dense white--text color="white" class="AskAnna-app-bar">
      <v-toolbar-title class="pl-4 pt-5 title font-weight-light">
        <v-icon large>
          {{ icon }}
        </v-icon>
        {{ workspace.name }}
      </v-toolbar-title>
      <v-spacer />

      <v-spacer />
      <div class="text-center">
        <WorkspaceToolbarMenu :isMember="workspace.is_member" :workspaceUuid="workspace.short_uuid" />
      </div>
    </v-toolbar>

    <v-card-text class="font-weight-bold project--description">
      {{ description }}
    </v-card-text>
  </v-card>
</template>

<script>
import usePermission from '@/core/composition/usePermission'
import { computed, defineComponent } from '@vue/composition-api'
import WorkspaceToolbarMenu from '@/features/workspace/components/WorkspaceToolbarMenu'

export default defineComponent({
  name: 'WorkspacesCardItem',

  components: {
    WorkspaceToolbarMenu
  },

  props: {
    workspace: {
      type: Object,
      default: function () {
        return {
          created: '',
          description: '',
          is_member: true,
          modified: '',
          name: '',
          short_uuid: '',
          uuid: '',
          visibility: 'PRIVATE'
        }
      }
    },
    description: {
      type: String,
      default: () => ''
    },

    hover: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const permission = usePermission()
    const workspaceInfoEdit = computed(() => permission.getFor(permission.labels.workspaceInfoEdit))

    const icon = computed(() =>
      props.workspace.visibility === 'PUBLIC' ? 'mdi-package-variant' : 'mdi-package-variant-closed'
    )

    return { icon, workspaceInfoEdit }
  }
})
</script>
<style scoped>
.h-100 {
  height: 100%;
}
.project--description {
  min-height: 82px;
  max-height: 86px;
  overflow: hidden;
}
</style>
