<template>
  <div>
    <workspace-people-navbar />
    <workspace-people-list
      :loading="loading"
      :settings="workspaceSettings"
      :workspaceUuid="workspace.uuid"
      :workspaceName="workspace.title"
      :items="workspacePeople"
    />
  </div>
</template>
<script>
import { computed, onBeforeMount, defineComponent } from '@vue/composition-api'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import WorkspacePeopleList from '@/features/workspace/components/people/WorkspacePeopleList.vue'
import WorkspacePeopleNavbar from '@/features/workspace/components/people/WorkspacePeopleNavbar.vue'

export default defineComponent({
  name: 'workspace',

  components: { WorkspacePeopleList, WorkspacePeopleNavbar },

  setup(props, context) {
    const workspaceStore = useWorkspaceStore()
    const { workspaceId } = context.root.$route.params

    onBeforeMount(async () => await workspaceStore.getInitialWorkpacePeople({ workspaceId }))

    const workspacePeople = computed(() => {
      const {
        filter: { role, status },
        search,
        sorting: { sortBy, sort }
      } = workspaceStore.workspacePeopleParams.value

      let people = [...workspaceStore.workspacePeople.value]

      if (!people.length) return people

      if (role) {
        people = people.filter(item => item.role === role)
      }

      if (status) {
        people = people.filter(item => item.status === status)
      }

      if (sortBy && sort) {
        people = people.sort((a, b) => {
          const nameA = (a.name && a.name.toUpperCase()) || ''
          const nameB = (b.name && b.name.toUpperCase()) || ''

          if (nameA < nameB) return -sort
          if (nameA > nameB) return sort

          return 0
        })
      }

      return people
    })

    return {
      workspacePeople,
      workspace: workspaceStore.workspace,
      loading: workspaceStore.workspacePeopleLoading,
      workspaceSettings: workspaceStore.workspaceSettings
    }
  }
})
</script>
