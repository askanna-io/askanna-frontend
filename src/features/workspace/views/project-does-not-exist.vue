<template>
  <ask-anna-page-does-not-exist pageTitle="project" outlined>
    <template v-slot:header>
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
import useWorkSpaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import AskAnnaPageDoesNotExist from '@/core/components/shared/AskAnnaPageDoesNotExist'
import { computed, reactive, onBeforeMount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'project-does-not-exist',

  components: { AskAnnaPageDoesNotExist },

  setup(props, context) {
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
      breadcrumbs
    }
  }
})
</script>
