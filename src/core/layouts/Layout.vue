<script>
import LogindLayout from './LogindLayout'
import DashboardLayout from './DashboardLayout'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Layout',

  functional: true,

  props: {
    layout: {
      type: [String],
      default: 'dashboard'
    }
  },
  render: function (h, context) {
    function getLayout() {
      const layout = context.props.layout

      switch (true) {
        case layout === 'dashboard':
          return DashboardLayout

        case layout === 'login':
          return LogindLayout

        default:
          return DashboardLayout
      }
    }

    return h(getLayout(), context.data, context.children)
  }
})
</script>
