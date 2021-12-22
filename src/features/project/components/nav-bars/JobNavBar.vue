<template>
  <div>
    <div v-sticky="true" on-stick="onStick" :sticky-margin-width="0" sticky-offset="{top: 52, bottom: 10}">
      <v-toolbar v-if="sticked" dense color="white" class="br-r5 ma-3 askAnna-breadcrumbs" :flat="!sticked">
        <v-breadcrumbs :items="breadcrumbs" class="pl-0" :class="{ 'ma-0 pa-0': $vuetify.breakpoint.xsOnly }">
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
    <div class="askAnna-breadcrumbs" :class="{ 'mb-2': $vuetify.breakpoint.xsOnly }">
      <v-breadcrumbs v-if="!sticked" :items="breadcrumbs" :class="{ 'py-0 mt-0 pl-3': $vuetify.breakpoint.xsOnly }">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :to="item.to" :exact="item.exact">
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </div>
    <v-divider v-if="!$vuetify.breakpoint.xsOnly" />
    <v-card flat>
      <v-card-title v-if="!sticked" :class="{ 'py-1 pl-3 ': $vuetify.breakpoint.xsOnly }">
        <span class="title font-weight-light">Job: {{ job.name }} </span>
      </v-card-title>
      <v-divider v-if="!sticked" :class="{ 'py-1  ': $vuetify.breakpoint.xsOnly }" />

      <v-row>
        <v-col cols="12" v-if="!sticked" :class="{ 'py-0': $vuetify.breakpoint.xsOnly }">
          <v-toolbar
            dense
            color="white"
            flat
            :class="{ 'br-r5 ma-3': !$vuetify.breakpoint.xsOnly, 'ma-0 mr-4 with-tabs': $vuetify.breakpoint.xsOnly }"
          >
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
<script setup lang="ts">
import { useRouter } from '@u3u/vue-hooks'
import { computed } from '@vue/composition-api'
import JobToolBar from './parts/JobToolBar.vue'
import JobMenuPopup from './parts/JobMenuPopup.vue'
import ProjectToolBar from './parts/ProjectToolBar.vue'
import usePermission from '@/core/composition/usePermission'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'

const props = defineProps({
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
})

const { route } = useRouter()
const permission = usePermission()
const breadcrumbs = useBreadcrumbs({ start: 0, end: 5 })

const projectJobEdit = computed(() => permission.getFor(permission.labels.projectJobEdit))

const onStick = data => props.handleOnStick(data.sticked)

const isEditJobView = computed(() => route.value.name === 'workspace-project-job-edit')
</script>
