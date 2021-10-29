<script>
import LogindLayout from './LogindLayout'
import PublicLayout from './PublicLayout'
import DashboardLayout from './DashboardLayout'
import PublicAuthLayout from './PublicAuthLayout'
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

        case layout === 'public':
          return token ? PublicAuthLayout : PublicLayout

        default:
          return PublicLayout
      }
    }

    return h(getLayout(), context.data, context.children)
  }
})
</script>
