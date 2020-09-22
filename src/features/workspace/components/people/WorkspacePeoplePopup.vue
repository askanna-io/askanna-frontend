<template>
  <v-row justify="center">
    <v-dialog v-model="openVmodel" max-width="400px">
      <v-card class="text-center position">
        <v-container pa-0 class="avatar--wrapper">
          <v-row>
            <v-col class="pt-2 pb-0" cols="12" align-self="start">
              <v-avatar rounded="21" :size="people.avatar ? 150 : 50" tile>
                <v-img v-if="people.avatar" class="img--rounded" :src="people.avatar" />
                <v-icon v-else size="55">mdi-account-outline</v-icon>
              </v-avatar>
            </v-col>
            <v-col :class="[people.avatar ? 'pt-1' : 'pt-0']">
              <v-chip class="role" color="primary">
                {{ people.role }}
              </v-chip>
            </v-col>
          </v-row>
        </v-container>
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
                  Make Admin
                </v-btn>
              </div>
              <div class="mt-2">
                <v-btn small block outlined text color="secondary" class="btn--hover" @click="handleRemove">
                  Remove&nbsp;<br /><span class="error--text">{{ people.name }}</span
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
          avatar: '',
          created: '',
          modified: '',
          job_title: '',
          short_uuid: '',
          last_active: ''
        }
      }
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
}
.role {
  white-space: nowrap;
  display: inline-block;
}
</style>
