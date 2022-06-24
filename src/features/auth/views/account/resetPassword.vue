<template>
  <div class="d-flex flex-column justify-center login-wrapper">
    <v-row align="center" justify="center">
      <v-col cols="12" class="rounded">
        <v-row align="center" justify="center">
          <v-col cols="6" xl="2" md="4" sm="6" class="pb-0 mb-0">
            <img alt="AskAnna logo" src="@/assets/logo.svg" class="logo" />
          </v-col>
        </v-row>
        <ask-anna-loading-progress :type="'table-row'" :loading="loading" loadingTitle="Anna is checking your token...">
          <v-row align="center" justify="center" v-if="isInvitationValid">
            <v-col cols="6" xl="2" md="4" sm="6" class="rounded">
              <v-expansion-panels class="login-expansion" readonly mandatory>
                <v-expansion-panel :key="0" active-class="colored-border">
                  <v-expansion-panel-header hide-actions>
                    <v-row no-gutters>
                      <v-col cols="12" class="text-h6">Reset your password</v-col>
                    </v-row>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <reset-form />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>

          <invalid-reset-password-token v-else />
        </ask-anna-loading-progress>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from '@vue/composition-api'
import { useAuthStore } from '@/features/auth/useAuthStore'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import ResetForm from '../../components/account/reset-password/ResetForm.vue'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress.vue'
import InvalidResetPasswordToken from '../../components/account/reset-password/InvalidResetPasswordToken.vue'

const authStore = useAuthStore()
const router = useRouterAskAnna()

const { token, uid } = router.route.value.query

const loading = ref(true)
const isInvitationValid = ref(false)

const fetchData = async () => {
  loading.value = true
  const tokenStatus = await authStore.validateResetToken({
    uid,
    token
  })

  if (tokenStatus && tokenStatus.status === 'valid') {
    isInvitationValid.value = true
  }
  loading.value = false
}

onBeforeMount(() => fetchData())
</script>
<style scoped>
.login-wrapper {
  height: 100vh;
}
.logo {
  height: 74px;
}

.colored-border {
  border: 1px solid;
}
.no-bg {
  background: none;
}
</style>
