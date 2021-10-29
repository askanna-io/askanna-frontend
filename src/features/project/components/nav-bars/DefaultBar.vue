<template>
  <div>
    <div v-sticky="true" on-stick="onStick" sticky-offset="{top: 52, bottom: 10}">
      <v-toolbar v-if="sticked" ref="refToolbar" dense color="white" class="br-r5 ma-3" :flat="!sticked">
        <v-breadcrumbs v-if="sticked" class="pl-0" :items="projectBreadcrumbs">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item :to="item.to" :exact="item.exact">
              {{ item.title }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </v-toolbar>
      <v-card v-if="sticked" :class="{ 'ma-3': sticked }">
        <v-card-title transition="slide-y-transition">
          <v-toolbar dense color="white" flat class="br-r5">
            <project-menu :projectName="project.name" :isEditProjectView="isEditProjectView" />
            <v-spacer />
          </v-toolbar>
        </v-card-title>
      </v-card>
    </div>

    <v-breadcrumbs v-if="!sticked" :items="projectBreadcrumbs">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :to="item.to" :exact="item.exact">
          {{ item.title }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <v-divider v-if="!isEditProjectView" />

    <v-card-title v-if="!isEditProjectView">
      <v-icon large left>
        mdi-semantic-web
      </v-icon>
      <span class="title font-weight-light">{{ project.name }}</span>
    </v-card-title>

    <ask-anna-description v-if="!isEditProjectView" readonly :description="project.description" />
    <v-divider v-if="!sticked" />
    <v-card :flat="!sticked" :class="{ 'ma-3': sticked }">
      <v-slide-y-transition>
        <div v-if="!sticked">
          <v-toolbar dense color="white" flat class="br-r5 ma-3">
            <project-menu :projectName="project.name" :isEditProjectView="isEditProjectView" />
            <v-spacer />

            <project-menu-popup
              v-if="!isEditProjectView && (projectRemove || projectInfoEdit)"
              :project="project"
              :routeToRedirect="'workspace'"
              :routeBackTo="'workspace-project'"
            />
          </v-toolbar>
        </div>
      </v-slide-y-transition>
    </v-card>
  </div>
</template>
<script>
import ProjectMenu from './parts/ProjectMenu'
import usePermission from '@/core/composition/usePermission'
import { ref, computed, defineComponent } from '@vue/composition-api'
import ProjectMenuPopup from '@/features/project/components/ProjectMenuPopup'

export default defineComponent({
  name: 'DefaultBar',

  components: { ProjectMenu, ProjectMenuPopup },

  props: {
    project: {
      type: Object,
      default: function () {
        return {
          name: ''
        }
      }
    },
    projectBreadcrumbs: {
      type: Array,
      default: []
    },
    isShowProjectBar: {
      type: Boolean,
      default: false
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
    const refToolbar = ref(null)
    const permission = usePermission()

    const projectRemove = computed(() => permission.getFor(permission.labels.projectRemove))
    const projectInfoEdit = computed(() => permission.getFor(permission.labels.projectInfoEdit))

    const onStick = data => {
      props.handleOnStick(data.sticked)
    }

    const isEditProjectView = computed(() => context.root.$route.name === 'workspace-project-edit')

    return {
      onStick,
      refToolbar,
      projectRemove,
      projectInfoEdit,
      isEditProjectView,
      routerParams: context.root.$route.params
    }
  }
})
</script>
