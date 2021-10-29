<template>
  <div class="join-wrapper">
    <v-row justify="center">
      <v-col cols="8" xl="3" md="6" sm="9" lg="4" class="rounded pb-0">
        <img alt="AskAnna logo" src="@/assets/logo.svg" class="logo" />
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col class="pt-0">
        <ask-anna-loading-progress
          :type="'table-row'"
          :loading="loading"
          loadingTitle="Anna is checking your invitation..."
        >
          <the-join v-if="isInvitationValid" />
          <invalid-invitation v-else />
        </ask-anna-loading-progress>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref, computed, onBeforeMount, defineComponent } from '@vue/composition-api'

import TheJoin from '../components/join/TheJoin'
import useAuthStore from '../composition/useAuthStore'
import InvalidInvitation from '../components/join/InvalidInvitation'
import TheCreateNewAccount from '../components/join/TheCreateNewAccount'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress'

export default defineComponent({
  name: 'join',

  components: {
    TheJoin,
    InvalidInvitation,
    TheCreateNewAccount,
    AskAnnaLoadingProgress
  },

  setup(_, context) {
    const authStore = useAuthStore()
    const workspaceStore = useWorkspaceStore()
    const { token, peopleId, workspaceId } = context.root.$route.params

    const loading = ref(true)
    const isInvitationValid = computed(
      () => Boolean(workspaceStore.invitation.value.email) && workspaceStore.invitation.value.status !== 'accepted'
    )

    const fetchData = async () => {
      loading.value = true
      await authStore.actions.logout(false)
      await workspaceStore.getInvitetionInfo({
        token,
        peopleId,
        workspaceId
      })
      loading.value = false
    }

    onBeforeMount(() => fetchData())

    return {
      loading,
      isInvitationValid
    }
  }
})
</script>
<style scoped>
.join-wrapper {
  height: 100vh;
  background-image: url('~@/assets/bg/askanna-bg-01.svg');
  background-size: cover;
}
.logo {
  height: 74px;
  margin-bottom: 6px;
}
.login-expansion .v-expansion-panel {
}
.colored-border {
  border: 1px solid;
}
.no-bg {
  background: none;
}
</style>
