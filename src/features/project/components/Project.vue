<template>
  <v-card flat outlined>
    <v-form>
      <v-container fluid>
        <v-row>
          <v-col cols="4">
            <v-text-field autofocus label="Project name" outlined dense></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field label="Project URL" outlined dense></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field label="Project slug" outlined dense></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-textarea outlined :rows="3" label="Project description (optional)" value="" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card class="px-2" flat outlined>
              <v-radio-group v-model="radios">
                <template v-slot:label>
                  <div><strong>Visibility Level:</strong></div>
                </template>
                <v-radio value="shared">
                  <template v-slot:label>
                    <v-icon class="mr-2">mdi-axis-arrow-lock</v-icon>
                    <div>Shared with workspace</div>
                  </template>
                </v-radio>
                <v-radio value="private">
                  <template v-slot:label>
                    <v-icon class="mr-2">mdi-lock</v-icon>
                    <div>Private</div>
                  </template>
                </v-radio>
              </v-radio-group>
            </v-card>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col class="d-flex" cols="12">
            Do you want to create a project from a template? If yes, which project template?
          </v-col>
          <v-col class="d-flex" cols="4">
            <v-select v-model="template" :items="items" label="Template" dense></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-btn small outlined text color="secondary" class="ma-2 btn--hover" :to="{ path: '/workspace/project/1' }">
              Create
            </v-btn>
            <v-btn small outlined text color="secondary" class="ma-2 btn--hover" :to="{ path: '/workspace' }">
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: 'Project',

  data() {
    return {
      radios: 'shared',
      template: 'blank',
      items: ['Blank', 'Template 1', 'Template 2', 'Template 3']
    }
  }
}
</script>
