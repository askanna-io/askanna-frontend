<template>
  <v-card class="mx-auto" outlined sticky-container>
    <project-nav-bar
      :job="job"
      :project="project"
      :routeName="routeName"
      :sticked="menu.sticked"
      :handleOnStick="handleOnStick"
      :isShowProjectBar="menu.isShowProjectBar"
      :handleShowProjectBar="handleShowProjectBar"
      :projectBreadcrumbs="projectBreadcrumbs"
    />
    <router-view />
  </v-card>
</template>

<script>
import useJobStore from '@job/composition/useJobStore'
import useProject from '@project/composition/useProject'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'
import { computed, onUnmounted, defineComponent } from '@vue/composition-api'
import ProjectNavBar from '@project/components/nav-bars/ProjectNavBar'

export default defineComponent({
  name: 'index',

  components: { ProjectNavBar },

  setup(props, context) {
    const project = useProject(context)
    const jobStore = useJobStore(context)

    const routeName = computed(() => context.root.$route.name)
    const jobEnd = computed(() => (context.root.$route.name.indexOf('jobs-name') >= 1 ? 5 : 3))
    const end = computed(() => (context.root.$route.name === 'workspace-project-job-overiew' ? 6 : jobEnd.value))
    const projectBreadcrumbs = useBreadcrumbs(context, { start: 0, end: end.value })

    onUnmounted(() => {
      project.resetProjectData()
    })

    const handleShowProjectBar = () =>
      project.setMenu({ name: 'menu.isShowProjectBar', value: !project.menu.value.isShowProjectBar })

    const handleOnStick = value => {
      project.setMenu({ name: 'menu.isSticked', value })
      if (!value) project.setMenu({ name: 'menu.sticked', value: false })
    }

    return { ...project, ...jobStore, routeName, handleOnStick, projectBreadcrumbs, handleShowProjectBar }
  }
})
</script>
