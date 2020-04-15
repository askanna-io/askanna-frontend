<script>
import { createComponent } from '@vue/composition-api'
import JobNavBar from '@job/components/nav-bar/JobNavBar'
import DefaultBar from './DefaultBar'

export default createComponent({
  name: 'ProjectNavBar',

  functional: true,

  props: {
    routeName: {
      type: [Number, String],
      default: 'workspace-project-activity'
    }
  },
  render: function(h, context) {
    function appropriateBarComponent() {
      const route = context.props.routeName

      switch (true) {
        case route === 'workspace-project-job-overiew':
        case route === 'workspace-project-job-jobruns':
        case route === 'workspace-project-job-variables':
        case route === 'workspace-project-job-tokens':
          return JobNavBar

        case route.indexOf('job-uuid') !== -1:
          return JobNabBar

        default:
          return DefaultBar
      }
    }

    return h(appropriateBarComponent(), context.data, context.children)
  }
})
</script>
