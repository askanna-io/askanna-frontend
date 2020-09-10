<template>
  <v-row justify="center">
    <v-dialog v-model="openVmodel" max-width="350px">
      <v-card class="text-center positin">
        <div class="avatar--wrapper">
          <v-avatar rounded="21" class="ma-2" size="150" tile>
            <v-img v-if="people.avatar" class="img--rounded" :src="people.avatar" />
            <v-icon v-else size="55">mdi-account-outline</v-icon>
          </v-avatar>
          <v-chip class="role" color="primary">
            {{ people.role }}
          </v-chip>
        </div>
        <v-card-text>
          <v-container pa-0>
            <v-row>
              <v-col class="pt-0" cols="12" align-self="start">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="title">{{ people.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ people.job_title }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-row class="mx-2">
            <v-col class="text-center" cols="12">
              <div>
                <v-btn small block outlined text color="secondary" class="btn--hover" @click="handleChangeRole">
                  Make Admin or Make Member
                </v-btn>
              </div>
              <div class="mt-2">
                <v-btn small block outlined text color="secondary" class="btn--hover" @click="handleRemove">
                  Remove&nbsp;<span class="error--text">{{ people.name }}</span
                  >&nbsp;from {{ workspaceName }}
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-actions>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="openVmodel = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { ref, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'WorkspacePeoplePopup',

  props: {
    people: {
      type: Object,
      default: function () {
        return {
          uuid: '',
          name: '',
          role: '',
          job_title: '',
          avatar: '',
          created: '',
          modified: '',
          short_uuid: '',
          last_active: ''
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
    value: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const dialog = ref(false)

    const openVmodel = computed({
      get: () => props.value,
      set: value => context.emit('handleValue', value)
    })

    const handleRemove = value => context.emit('handleRemove', value)
    const handleChangeRole = value => context.emit('handleChangeRole', value)

    return { dialog, openVmodel, handleRemove, handleChangeRole }
  }
})
</script>
<style scoped>
.avatar--wrapper {
  position: relative;
}
.role {
  white-space: nowrap;
  display: inline-block;
  position: absolute;
  bottom: -3px;
  left: 41%;
}
</style>
