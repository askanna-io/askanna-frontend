<template>
  <v-card class="mx-auto" outlined>
    <project-nav-bar :project="project" :routeName="routeName" :projectBreadcrumbs="projectBreadcrumbs" />
    <router-view />
  </v-card>
</template>

<script>
import useProject from '../composition/useProject'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'

import ProjectNavBar from '../components/nav-bars/ProjectNavBar'

export default {
  name: 'TheProject',

  components: { ProjectNavBar },

  setup(props, context) {
    const project = useProject(context)
    const jobEnd = context.root.$route.name.indexOf('jobs-name') >= 1 ? 5 : 3
    const end = context.root.$route.name === 'workspace-project-job-overiew' ? 6 : jobEnd
    const projectBreadcrumbs = useBreadcrumbs(context, { start: 0, end })
    const routeName = context.root.$route.name

    return { ...project, routeName, projectBreadcrumbs }
  },

  data() {
    return {}
  }
}
</script>
