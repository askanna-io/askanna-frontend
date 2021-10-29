<template>
  <v-navigation-drawer v-model="drawer" temporary app right hide-overlay width="450">
    <v-list-item>
      <v-list-item-title>
        AskAnna test settings
      </v-list-item-title>

      <v-list-item-content>
        <v-list-item-title>John Leider</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <template>
      <v-card class="mx-auto ma-2" max-width="400">
        <v-card-title>
          <h4 class="text-h4">
            Change workspace role
          </h4>
          <v-spacer></v-spacer>
        </v-card-title>

        <v-card-text>
          We have 3 roles now:
          <ul>
            <li>WA - workspace admin</li>
            <li>WM - workspace member</li>
            <li>WV - workspace viewer</li>
          </ul>
          You could change the role temporary for testing different permission.
        </v-card-text>

        <v-divider class="mx-4"></v-divider>

        <v-card-text>
          <span class="subheading">Select role:</span>

          <v-chip-group v-model="selectedRole" active-class="primary" mandatory>
            <v-chip v-for="role in roles" :key="role" :value="role">
              {{ role }}
            </v-chip>
          </v-chip-group>
        </v-card-text>

        <v-card-actions>
          <v-btn block class="white--text" color="primary" @click="handleChangeRole">
            Change
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-navigation-drawer>
</template>
<script>
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import useUserStore from '@/features/user/composition/useUserStore'
import { ref, watch, computed, defineComponent } from '@vue/composition-api'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: () => false
    }
  },
  setup(props, context) {
    const snackBar = useSnackBar()
    const workspaceStore = useWorkspaceStore()

    const currentRole = computed(() => workspaceStore.state.currentPeople.value.role.code)

    const drawer = computed({
      get: () => props.value,
      set: value => context.emit('onChange', value)
    })

    const selectedRole = ref('WA')
    const roles = ref(['WA', 'WM', 'WV'])

    watch(currentRole, currentRole => (selectedRole.value = currentRole))

    const handleChangeRole = async () => {
      snackBar.showSnackBar({
        message: `You have successfully updated settings`,
        color: 'success',
        timeout: 1500
      })
    }

    return {
      roles,
      drawer,
      selectedRole,

      handleChangeRole
    }
  }
})
</script>
