<template>
  <v-card class="mx-auto" :elevation="hover ? 16 : 2" :to="`project/${project.id}`">
    <v-card-title>
      <v-icon large left>
        mdi-semantic-web
      </v-icon>
      <span class="title font-weight-light">{{ project.name }}</span>
    </v-card-title>

    <v-card-text class="font-weight-bold">
      {{ project.description }}
    </v-card-text>

    <v-card-actions>
      <v-alert text dense type="success" class="d-flex">
        Status: <strong>success</strong> Last run on <strong>Oct 23, 2019</strong>
      </v-alert>
    </v-card-actions>
    <v-card-actions>
      <v-list-item>
        <v-list-item-content v-for="n in 5" :key="n" color="grey darken-3">
          <v-avatar size="30">
            <img src="https://randomuser.me/api/portraits/men/81.jpg" />
          </v-avatar>
        </v-list-item-content>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
interface Project {
  name: string
  id: string
  description: string
  lastRunOn: string
}
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class WorkspaceProjectCardItem extends Vue {
  @Prop({ required: true })
  public project!: Project

  @Prop({ required: false })
  public hover!: boolean
}
</script>
