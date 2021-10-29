<template>
  <div>
    <div v-sticky="true" on-stick="onStick" :sticky-margin-width="0" sticky-offset="{top: 52, bottom: 10}">
      <v-toolbar v-if="sticked" dense color="white" class="br-r5 ma-3" :flat="!sticked">
        <v-breadcrumbs :items="breadcrumbs" class="pl-0">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item :to="item.to" :exact="item.exact">
              {{ item.title }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
        <v-spacer />
      </v-toolbar>

      <v-card :flat="!sticked" v-if="sticked" :class="{ 'ma-3': sticked }">
        <v-divider v-if="!sticked" />
        <v-slide-y-transition>
          <project-tool-bar v-if="sticked" :projectName="project.name" />
        </v-slide-y-transition>
        <v-slide-y-transition>
          <v-divider v-if="sticked" />
        </v-slide-y-transition>
        <job-tool-bar :jobName="job.name" :projectName="project.name" />
      </v-card>
    </div>
    <v-breadcrumbs v-if="!sticked" :items="breadcrumbs">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :to="item.to" :exact="item.exact">
          {{ item.title }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <v-divider />
    <v-card flat>
      <v-card-title v-if="!sticked">
        <span class="title font-weight-light">Job:{{ job.name }} </span>
      </v-card-title>

      <v-divider />
      <v-row>
        <v-col cols="12" v-if="!sticked">
          <v-toolbar dense color="white" flat class="br-r5 ma-3">
            <job-tool-bar
              v-if="!sticked"
              :showTitle="false"
              :jobName="job.name"
              :projectName="project.name"
              :isEditJobView="isEditJobView"
            />

            <v-spacer />

            <job-menu-popup v-if="!isEditJobView && projectJobEdit" :job="job" />
          </v-toolbar>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
import JobToolBar from './parts/JobToolBar'
import JobMenuPopup from './parts/JobMenuPopup'
import ProjectToolBar from './parts/ProjectToolBar'
import usePermission from '@/core/composition/usePermission'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'
import { ref, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobNavBar',

  components: { JobToolBar, JobMenuPopup, ProjectToolBar },

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
    },
    sticked: {
      type: Boolean,
      default: false
    },

    handleOnStick: {
      type: Function,
      default: () => {}
    }
  },

  setup(props, context) {
    const permission = usePermission()

    const currentProjectTab = ref('')
    const isShowProjectBar = ref(false)
    const breadcrumbs = useBreadcrumbs(context, { start: 0, end: 5 })

    const projectJobEdit = computed(() => permission.getFor(permission.labels.projectJobEdit))

    const onStick = data => props.handleOnStick(data.sticked)

    const isEditJobView = computed(() => context.root.$route.name === 'workspace-project-job-edit')

    return {
      onStick,
      breadcrumbs,
      isEditJobView,
      projectJobEdit,
      isShowProjectBar,
      currentProjectTab
    }
  }
})
</script>
