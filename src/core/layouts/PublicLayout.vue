<template>
  <v-app>
    <v-app-bar app clipped-left dark color="primary" dense>
      <v-app-bar-nav-icon v-if="showAppBarIcon" @click.stop="stickedVM = !stickedVM" />
      <div v-else class="pl-9" />
      <v-container fluid class="pl-1">
        <div
          class="d-flex justify-space-between justify-sm-center align-center justify-md-space-between"
          justify="space-between"
          align="center"
          no-gutters
        >
          <div md="auto" sm="12" text-sm-center>
            <v-btn class="pa-0" :href="'https://askanna.io/'" text color="transparent">
              <img alt="AskAnna logo" src="@/assets/logo.svg" class="logo" />
            </v-btn>
          </div>
          <div class="text-sm-center ml-sm-6 ml-md-0 d-none d-sm-flex">
            <v-flex>
              <v-btn small text link :href="'https://askanna.io'" class="mx-1 white--text mx-1">
                Find out more about AskAnna
              </v-btn>
              <v-btn small exact exact-path dark class="white--text" text :to="{ path: '/projects/' }">
                Projects
              </v-btn>
            </v-flex>
          </div>
          <div>
            <router-link class="ask-anna-link white--text" :to="{ name: 'signin' }"> Sign in </router-link>
            /
            <router-link class="ask-anna-link white--text" :to="{ name: 'signup' }"> Sign up </router-link>
          </div>
        </div>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container class="a-content">
        <router-view />
      </v-container>
      <the-snack-bar />
      <update-app />
    </v-main>
  </v-app>
</template>

<script>
import '@/core/plugins/intercom.js'

import useTitle from '@/core/composition/useTitle'
import useUserStore from '@/features/user/composition/useUserStore'
import useProjectStore from '@project/composition/useProjectStore'
import UpdateApp from '@/core/components/shared/updateApp/UpdateApp'
import { ref, computed, onUpdated, onBeforeMount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'PublicLayout',

  components: { UpdateApp },

  setup(_, context) {
    useTitle(context)
    const userStore = useUserStore()
    const projectStore = useProjectStore()

    const drawer = ref(false)

    const showAppBarIcon = computed(() => !context.root.$route.meta?.hideAppBarIcon)

    const fetchData = async () => {
      await userStore.actions.getGlobalProfile()
      await userStore.actions.getUserProfile()
    }

    onBeforeMount(() => fetchData())

    onUpdated(() => {
      if (process.env.VUE_APP_INTERCOM === 'on') {
        window.Intercom('update')
      }
    })

    return {
      drawer,
      showAppBarIcon,
      stickedVM: projectStore.stickedVM
    }
  },

  data: () => ({
    items: [{ title: 'Workspace', name: 'workspace', icon: 'mdi-view-dashboard' }]
  })
})
</script>
<style scoped>
.logo {
  height: 30px;
}
.logo.--mobile {
  height: 67px;
}
.a-content {
  max-width: 1248px;
}
</style>
