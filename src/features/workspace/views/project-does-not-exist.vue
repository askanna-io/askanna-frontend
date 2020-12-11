<template>
  <v-card class="mx-auto" outlined>
    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :to="item.to" exact>
          {{ item.title }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <v-divider />
    <v-card-title>
      <span class="title font-weight-light">Oops...we cannot find this project</span>
    </v-card-title>

    <v-card-text>
      <p>
        We cannot find the project you just tried to open. Maybe the project is removed, or you don't have access to
        open the project (anymore). For support you can always check with your team, or reach out to us on
        <a href="mailto:support@askanna.io" target="_blank">support@askanna.io</a>.
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'
import useWorkSpaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import { computed, reactive, onBeforeMount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'project-does-not-exist',

  setup(props, context) {
    const workSpaceStore = useWorkSpaceStore(context)

    const breadcrumbs = computed(() => [
      {
        title: workSpaceStore.workspace.value.title,
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
