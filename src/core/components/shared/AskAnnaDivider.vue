<template>
  <v-container fluid>
    <v-row no-gutters class="align-center">
      <v-col cols="5">
        <v-divider />
      </v-col>
      <v-col>
        <v-subheader class="primary--text justify-center">{{ text }}</v-subheader>
      </v-col>
      <v-col cols="5">
        <v-divider />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class AskAnnaDivider extends Vue {
  @Prop({ required: true })
  public text!: string
}
</script>
