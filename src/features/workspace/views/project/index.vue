<template>
  <v-card class="mx-auto" outlined sticky-container>
    <project-nav-bar
      :job="job"
      :sticked="menu.sticked"
      :isShowProjectBar="menu.isShowProjectBar"
      :handleOnStick="handleOnStick"
      :handleShowProjectBar="handleShowProjectBar"
      :project="project"
      :routeName="routeName"
      :projectBreadcrumbs="projectBreadcrumbs"
    />
    <router-view />
  </v-card>
</template>

<script>
import useProject from '@project/composition/useProject'
import { defineComponent } from '@vue/composition-api'
import useJobStore from '@job/composition/useJobStore'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'
import ProjectNavBar from '@project/components/nav-bars/ProjectNavBar'

export default defineComponent({
  name: 'index',

  components: { ProjectNavBar },

  setup(props, context) {
    const project = useProject(context)
    const jobStore = useJobStore(context)
    const routeName = context.root.$route.name
    const jobEnd = context.root.$route.name.indexOf('jobs-name') >= 1 ? 5 : 3
    const end = context.root.$route.name === 'workspace-project-job-overiew' ? 6 : jobEnd
    const projectBreadcrumbs = useBreadcrumbs(context, { start: 0, end })

    const handleShowProjectBar = () =>
      project.setMenu({ name: 'menu.isShowProjectBar', value: !project.menu.value.isShowProjectBar })

    const handleOnStick = value => {
      project.setMenu({ name: 'menu.isSticked', value })
      if (!value) project.setMenu({ name: 'menu.sticked', value: false })
    }

    return { ...project, ...jobStore, routeName, projectBreadcrumbs, handleShowProjectBar, handleOnStick }
  }
})
</script>
