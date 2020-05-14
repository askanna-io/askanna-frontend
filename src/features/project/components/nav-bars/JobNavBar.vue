<template>
  <div>
    <v-toolbar
      dense
      color="white"
      v-sticky="true"
      class="br-r5 ma-3"
      on-stick="onStick"
      sticky-offset="{top: 52, bottom: 10}"
      :flat="!sticked"
    >
      <v-btn
        text
        icon
        class="align-self-center mr-4"
        :color="(isShowProjectBar && 'primary') || ''"
        @click="isShowProjectBar = !isShowProjectBar"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :to="item.to" exact>
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
      <v-spacer />
    </v-toolbar>
    <v-slide-y-transition>
      <div v-if="isShowProjectBar">
        <v-divider />
        <project-tool-bar :projectName="project.name" />
      </div>
    </v-slide-y-transition>
    <v-divider />
    <job-tool-bar :jobName="job.name" :projectName="project.name" />
  </div>
</template>
<script>
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'
import JobToolBar from './parts/JobToolBar'
import ProjectToolBar from './parts/ProjectToolBar'
import { defineComponent, onBeforeMount, computed, watch, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'JobNavBar',

  components: { JobToolBar, ProjectToolBar },

  props: {
    job: {
      type: Object,
      default: function () {
        return {
          name: ''
        }
      }
    },
    project: {
      type: Object,
      default: function () {
        return {
          name: ''
        }
      }
    }
  },

  setup(props, context) {
    const currentProjectTab = ref('')
    const isShowProjectBar = ref(false)
    const end = context.root.$route.name.indexOf('jobs-name') >= 1 ? 5 : 3
    const breadcrumbs = useBreadcrumbs(context, { start: 0, end: 5 })

    let sticked = ref(false)

    const onStick = data => {
      sticked = data.sticked
    }
    return {
      sticked,
      onStick,
      breadcrumbs,
      isShowProjectBar,
      currentProjectTab
    }
  }
})
</script>
