<template>
  <v-card class="mx-auto" outlined>
    <v-card-title>
      <v-icon large left>
        mdi-semantic-web
      </v-icon>
      <span class="title font-weight-light">{{ project.name }}</span>
    </v-card-title>

    <v-card-text class="font-weight-bold"> {{ project.description }}</v-card-text>
    <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="updateProject(project.short_uuid)">
      Create s
    </v-btn>
    <v-divider />

    <project />
  </v-card>
</template>

<script>
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'

import useProject from '@/features/project/composition/useProject'
import Project from '@/features/project/components/Project'
import { computed, reactive, onBeforeMount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'uuid-project',

  components: { Project },

  setup(props, context) {
    const project = useProject(context)
    const breadcrumbs = useBreadcrumbs(context, { start: 0, end: 3 })

    return {
      ...project,
      stickedVal: false,
      menu: false,
      projectView: 0,
      project: {
        name: 'Project title 1',
        id: 1,
        description:
          'Turns out semicolon-less style is easier and safer in TS because most gotcha edge cases are type invalid as well.'
      },
      breadcrumbs,
      currentTab: 0,
      projectTools: [
        {
          id: 0,
          name: 'Blank project',
          component: 'BlankProject'
        }
      ]
    }
  }
})
</script>
