<template>
  <AskAnnaCard
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
    <AskAnnaToolbar flat dense white--text color="white" class="AskAnna-app-bar">
      <AskAnnaToolbarTitle
        class="title font-weight-light"
        :class="{ 'px-0 pt-2': $vuetify.breakpoint.xsOnly, 'pl-4 pt-5': !$vuetify.breakpoint.xsOnly }"
      >
        <AskAnnaIcon large>
          {{ icon }}
        </AskAnnaIcon>
        {{ workspace.name }}
      </AskAnnaToolbarTitle>
      <AskAnnaSpacer />

      <AskAnnaSpacer />
      <div class="text-center">
        <WorkspaceToolbarMenu
          usePermission
          :isMember="workspace.is_member"
          :permission="workspace.permission"
          :workspaceUuid="workspace.short_uuid"
          @onOpenWorkspaceRemove="handleOpenConfirmRemoveWorkspace"
        />
      </div>
    </AskAnnaToolbar>

    <AskAnnaCardText class="font-weight-bold project--description">
      {{ description }}
    </AskAnnaCardText>
  </AskAnnaCard>
</template>

<script setup lang="ts">
const emit = defineEmits('onOpenWorkspaceRemove')

const handleOpenConfirmRemoveWorkspace = () => emit('onOpenWorkspaceRemove')

const props = defineProps({
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
})

const icon = computed(() =>
  props.workspace.visibility === 'PUBLIC' ? 'mdi-package-variant' : 'mdi-package-variant-closed'
)
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
