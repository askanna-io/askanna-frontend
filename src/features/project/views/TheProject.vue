<template>
  <v-card class="mx-auto" outlined>
    <project-nav-bar :job="job" :project="project" :routeName="routeName" :projectBreadcrumbs="projectBreadcrumbs" />
    <router-view />
  </v-card>
</template>

<script>
import useProject from '../composition/useProject'
import { defineComponent } from '@vue/composition-api'
import useJobStore from '@job/composition/useJobStore'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'
import ProjectNavBar from '../components/nav-bars/ProjectNavBar'

export default defineComponent({
  name: 'TheProject',

  components: { ProjectNavBar },

  setup(props, context) {
    const project = useProject(context)
    const jobStore = useJobStore(context)
    const routeName = context.root.$route.name
    const jobEnd = context.root.$route.name.indexOf('jobs-name') >= 1 ? 5 : 3
    const end = context.root.$route.name === 'workspace-project-job-overiew' ? 6 : jobEnd
    const projectBreadcrumbs = useBreadcrumbs(context, { start: 0, end })

    return { ...project, ...jobStore, routeName, projectBreadcrumbs }
  }
})
</script>
