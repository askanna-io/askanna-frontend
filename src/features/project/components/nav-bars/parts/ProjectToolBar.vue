<template>
  <v-card-title transition="slide-y-transition">
    <span class="font-weight-light">Project: {{ projectName }}</span>
    <project-menu :projectName="projectName" />
  </v-card-title>
</template>
<script>
import ProjectMenu from './ProjectMenu'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'ProjectToolBar',

  components: { ProjectMenu },

  props: {
    projectName: {
      type: String,
      default: ''
    }
  }
})
</script>
