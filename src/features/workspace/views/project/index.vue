<template>
  <v-card class="mx-auto" :outlined="!$vuetify.breakpoint.xsOnly" :flat="$vuetify.breakpoint.xsOnly" sticky-container>
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

<script lang="ts">
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'
import useJobStore from '@/features/job/composition/useJobStore'
import { computed, defineComponent } from '@vue/composition-api'
import useProject from '@/features/project/composition/useProject'
import ProjectNavBar from '@/features/project/components/nav-bars/ProjectNavBar.vue'

export default defineComponent({
  name: 'index',

  components: { ProjectNavBar },

  setup(_, context) {
    const jobStore = useJobStore()
    const project = useProject(context)

    const routeName = computed(() => context.root.$route.name)
    const jobEnd = computed(() => (context.root.$route.name.indexOf('jobs-name') >= 1 ? 5 : 3))
    const end = computed(() => (context.root.$route.name === 'workspace-project-job-overiew' ? 6 : jobEnd.value))
    const projectBreadcrumbs = useBreadcrumbs({ start: 0, end: end.value })

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
