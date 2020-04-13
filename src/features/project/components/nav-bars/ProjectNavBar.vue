<script>
import DefaultBar from './DefaultBar'

export default {
  name: 'ProjectNavBar',

  functional: true,

  props: {
    routeName: {
      type: [Number, String],
      default: 'orders'
    }
  },
  render: function(h, context) {
    function appropriateBarComponent() {
      const route = context.props.routeName

      switch (true) {
        case route === 'job':
          return JobNabBar

        case route.indexOf('job-uuid') !== -1:
          return JobNabBar

        default:
          return DefaultBar
      }
    }

    return h(appropriateBarComponent(), context.data, context.children)
  }
}
</script>
