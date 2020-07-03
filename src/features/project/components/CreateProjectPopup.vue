<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="100" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" small rounded color="primary" class="mr-3">
          <v-icon left>mdi-plus</v-icon>
          Create Project
        </v-btn>
      </template>

      <v-card>
        <v-col cols="12">
          <v-text-field small dense label="Project name" outlined></v-text-field>
        </v-col>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="menu = false">Create</v-btn>
          <v-btn text @click="handleMoreOptions">More options</v-btn>

          <v-btn text @click="menu = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { reactive, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'CreateProjectPopup',
  setup(props, context) {
    const handleMoreOptions = () =>
      context.root.$router.push({
        name: 'workspace-new-project',
        params: { workspaceId: context.root.$route.params.workspaceId }
      })

    return {
      fav: true,
      menu: false,
      message: false,
      hints: true,
      handleMoreOptions
    }
  }
})
</script>
