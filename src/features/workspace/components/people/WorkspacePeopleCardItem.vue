<template>
  <v-card
    class="mx-auto h-100"
    :elevation="hover ? 16 : 2"
    :to="{
      name: 'workspace-project-package',
      params: {
        title: `${project.name} - ${workspaceName}`,
        projectId: project.short_uuid,
        packageId: project.package.short_uuid || 'new-package'
      }
    }"
  >
    <v-card-title>
      <v-icon large left>
        mdi-semantic-web
      </v-icon>
      <span class="title font-weight-light">{{ project.name }}</span>
    </v-card-title>

    <v-card-text class="font-weight-bold project--description">
      {{ description }}
    </v-card-text>
    <template v-if="isNotBeta">
      <v-card-actions>
        <v-alert text dense type="success" class="d-flex mb-0">
          Last run on <strong>Oct 23, 2019</strong> was <strong>successfull</strong>
        </v-alert>
      </v-card-actions>
      <v-card-actions class="px-5">
        <v-hover v-slot:default="{ hover }" open-delay="200" v-for="n in 5" :key="n">
          <v-avatar
            :class="`elevation-${hover ? 16 : 2}`"
            class="mx-auto transition-swing"
            size="35"
            color="grey "
            :hover="hover"
            :to="`/workspace/project/${project.short_uuid}`"
          >
            <img src="https://randomuser.me/api/portraits/men/81.jpg" />
          </v-avatar>
        </v-hover>
      </v-card-actions>
    </template>
  </v-card>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'WorkspacePeopleCardItem',

  props: {
    project: {
      type: Object,
      default: function () {
        return {
          status: 'UNDIFENED',
          runtime: 0,
          memory: 0,
          return_payload: null,
          stdout: null,
          created: '',
          finished: ''
        }
      }
    },
    description: {
      type: String,
      default: () => ''
    },
    workspaceName: {
      type: String,
      default: () => ''
    },
    hover: {
      type: Boolean,
      default: false
    }
  }
})
</script>
<style scoped>
.h-100 {
  height: 100%;
}
.project--description {
  min-height: 82px;
  max-height: 86px;
  overflow: hidden;
}
</style>
