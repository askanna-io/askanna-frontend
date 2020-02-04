<template>
  <div />
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import { AUTH_STORE } from '@/core/store/storeTypes'
import { logout } from '@/core/store/actionTypes'
const { mapActions: mapAuthActions } = createNamespacedHelpers(AUTH_STORE)

export default {
  name: 'TheLogout',

  mounted() {
    this.logout()
  },
  methods: {
    ...mapAuthActions({
      logout
    })
  }
}
</script>
