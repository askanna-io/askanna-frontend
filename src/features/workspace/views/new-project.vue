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
      <v-icon large left>
        mdi-semantic-web
      </v-icon>
      <span class="title font-weight-light">New project</span>
    </v-card-title>

    <v-card-text class="font-weight-bold">
      <p>
        A project is where you house your files (repository), plan your work (issues), and publish your documentation
        (wiki), among other things.
      </p>
      <p>
        All features are enabled for blank projects, from templates, or when importing, but you can disable them
        afterward in the project settings.
      </p>
      <p>
        To only use CI/CD features for an external repository, choose CI/CD for external repo. Information about
        additional Pages templates and how to install them can be found in our Pages getting started guide. Tip: You can
        also create a project from the command line.
      </p></v-card-text
    >
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
  name: 'new-project',

  components: { Project },

  setup(props, context) {
    const project = useProject(context)
    const breadcrumbs = useBreadcrumbs(context, { start: 0, end: 3 })

    return {
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
