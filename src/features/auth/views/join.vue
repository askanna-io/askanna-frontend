<template>
  <div class="join-wrapper">
    <v-row justify="center">
      <v-col cols="8" xl="3" md="6" sm="9" lg="4" class="rounded pb-0">
        <img alt="AskAnna logo" src="@/assets/logo.svg" class="logo" />
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col class="pt-0">
        <AskAnnaLoadingProgress
          :type="'table-row'"
          :loading="loading"
          loadingTitle="Anna is checking your invitation..."
        >
          <the-join v-if="isInvitationValid" />
          <invalid-invitation v-else />
        </AskAnnaLoadingProgress>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import TheJoin from '../components/join/TheJoin.vue'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { usePeopleStore } from '@/features/people/usePeopleStore'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { ref, computed, onBeforeMount } from '@vue/composition-api'
import InvalidInvitation from '../components/join/InvalidInvitation.vue'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress.vue'

const authStore = useAuthStore()
const router = useRouterAskAnna()
const peopleStore = usePeopleStore()
const { token, peopleId, workspaceId } = router.route.value.params

const loading = ref(true)
const isInvitationValid = computed(
  () => Boolean(peopleStore.invitation.email) && peopleStore.invitation.status !== 'accepted'
)

const fetchData = async () => {
  loading.value = true
  await authStore.logout(false)
  await peopleStore.getInvitetionInfo({
    token,
    peopleId,
    workspaceId
  })
  loading.value = false
}

onBeforeMount(() => fetchData())
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

.colored-border {
  border: 1px solid;
}
.no-bg {
  background: none;
}
</style>
