<template>
  <div class="join-wrapper">
    <v-row align="center" justify="center">
      <v-col cols="6" xl="2" md="4" sm="6" class="rounded">
        <img alt="AskAnna logo" src="@/assets/logo.svg" class="logo" />
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col>
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
import { ref, toRefs, computed, reactive, onBeforeMount, defineComponent } from '@vue/composition-api'

import TheJoin from '../components/join/TheJoin'
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

  setup(props, context) {
    const workspaceStore = useWorkspaceStore()
    const { token, peopleId, workspaceId } = context.root.$route.params

    const loading = ref(true)
    const isInvitationValid = computed(() => Boolean(workspaceStore.invitation.value.email))

    onBeforeMount(async () => {
      loading.value = true
      await workspaceStore.getInvitetionInfo({
        token,
        peopleId,
        workspaceId
      })
      loading.value = false
    })

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
