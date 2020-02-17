<template>
  <v-row align="center" class="spacer">
    <v-col cols="4">
      <v-avatar size="36px">
        <v-icon :color="message.color" v-text="message.icon"></v-icon>
      </v-avatar>
      <strong v-html="project.name"></strong>
    </v-col>

    <v-col class="text-no-wrap" cols="5" sm="3">
      <v-chip v-if="message.new" :color="`${message.color} lighten-4`" class="ml-0" label small>
        {{ message.new }} jobs fails
      </v-chip>
    </v-col>
    <v-col>
      <v-badge color="green" content="6">
        total members
      </v-badge>
    </v-col>
    <v-col>
      <v-badge bordered color="error" icon="mdi-lock" overlap>
        <v-btn class="white--text" color="error" depressed>
          Lock project
        </v-btn>
      </v-badge>
    </v-col>
  </v-row>
</template>

<script lang="ts">
interface Project {
  name: string
  description: string
  lastRunOn: string
}
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class WorkspaceProjectCardItem extends Vue {
  @Prop({ required: true })
  public project!: Project

  get message() {
    return {
      color: 'teal',
      icon: 'far fa-folder',
      name: 'AskAnna gitLabIssueReporter',
      new: 2,
      total: 4,
      title: 'Check the issue',
      exceprt: 'New deals available, Join Today'
    }
  }
}
</script>
