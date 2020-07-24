<template>
  <div>
    <div v-sticky="true" on-stick="onStick" :sticky-margin-width="0" sticky-offset="{top: 52, bottom: 10}">
      <v-toolbar dense color="white" class="br-r5 ma-3" :flat="!sticked">
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
      <v-card :flat="!sticked" :class="{ 'ma-3': sticked }">
        <v-divider v-if="!sticked" />
        <v-slide-y-transition>
          <project-tool-bar v-if="isShowProjectBar" :projectName="project.name" />
        </v-slide-y-transition>
        <v-slide-y-transition>
          <v-divider v-if="isShowProjectBar" />
        </v-slide-y-transition>
        <job-tool-bar v-if="!sticked || isShowProjectBar" :jobName="job.name" :projectName="project.name" />
      </v-card>
    </div>
  </div>
</template>
<script>
import JobToolBar from './parts/JobToolBar'
import ProjectToolBar from './parts/ProjectToolBar'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'
import { defineComponent, ref } from '@vue/composition-api'

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
      sticked.value = data.sticked
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
