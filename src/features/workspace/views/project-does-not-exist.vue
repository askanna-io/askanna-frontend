<template>
  <ask-anna-page-does-not-exist pageTitle="project" outlined :isUserLoggedIn="isUserLoggedIn">
    <template v-slot:header v-if="isUserLoggedIn">
      <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :to="item.to" exact>
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </template>
  </ask-anna-page-does-not-exist>
</template>

<script>
import usePermission from '@/core/composition/usePermission'
import { computed, defineComponent } from '@vue/composition-api'
import useWorkSpaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import AskAnnaPageDoesNotExist from '@/core/components/shared/AskAnnaPageDoesNotExist'

export default defineComponent({
  name: 'project-does-not-exist',

  components: { AskAnnaPageDoesNotExist },

  setup(_, context) {
    const permission = usePermission()
    const workSpaceStore = useWorkSpaceStore(context)

    const breadcrumbs = computed(() => [
      {
        title: workSpaceStore.workspace.value.name,
        to: `/${workSpaceStore.workspace.value.short_uuid}`,
        disabled: false
      },
      {
        title: 'Project does not exist',
        to: '',
        disabled: true
      }
    ])

    return {
      breadcrumbs,
      isUserLoggedIn: permission.isUserLoggedIn
    }
  }
})
</script>
