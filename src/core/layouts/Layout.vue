<script lang="ts">
import LogindLayout from './LogindLayout.vue'
import PublicLayout from './PublicLayout.vue'
import DashboardLayout from './DashboardLayout.vue'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Layout',

  functional: true,

  props: {
    layout: {
      type: [String],
      default: 'dashboard'
    },
    isLoggedIn: {
      type: Boolean,
      default: false
    }
  },
  render: function (h, context) {
    function getLayout() {
      const layout = context.props.layout
      const token = window.localStorage.getItem('token')

      switch (true) {
        case layout === 'dashboard':
          return token ? DashboardLayout : PublicLayout

        case layout === 'login':
          return LogindLayout

        default:
          return PublicLayout
      }
    }

    return h(getLayout(), context.data, context.children)
  }
})
</script>
<style lang="scss">
.a-content {
  max-width: 1248px;

  &--full {
    max-width: 100%;
  }
}
</style>
