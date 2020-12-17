<template>
  <div>
    <div v-sticky="true" on-stick="onStick" :sticky-margin-width="0" sticky-offset="{top: 52, bottom: 10}">
      <v-toolbar v-if="sticked" dense color="white" class="br-r5 ma-3" :flat="!sticked">
        <v-breadcrumbs :items="breadcrumbs" class="pl-0">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item :to="item.to" exact>
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
      </v-card>
    </div>
    <v-breadcrumbs v-if="!sticked" :items="breadcrumbs">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :to="item.to" exact>
          {{ item.title }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
  </div>
</template>
<script>
import ProjectToolBar from './parts/ProjectToolBar'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'JobNavBarNotExist',

  components: { ProjectToolBar },

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
    const currentProjectTab = ref('')
    const isShowProjectBar = ref(false)
    const end = context.root.$route.name.indexOf('jobs-name') >= 1 ? 5 : 3
    const breadcrumbs = useBreadcrumbs(context, { start: 0, end: 5 })

    const onStick = data => props.handleOnStick(data.sticked)

    return {
      onStick,
      breadcrumbs,
      isShowProjectBar,
      currentProjectTab
    }
  }
})
</script>
