<script>
import JobNavBar from './JobNavBar'
import DefaultBar from './DefaultBar'
import JobRunNavBar from './JobRunNavBar'
import JobNavBarNotExist from './JobNavBarNotExist'
import PackageBarNotExist from './PackageBarNotExist'
import JobRunNavBarNotExist from './JobRunNavBarNotExist'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'ProjectNavBar',

  functional: true,

  props: {
    routeName: {
      type: [Number, String],
      default: 'workspace-project-activity'
    }
  },
  render: function (h, context) {
    function appropriateBarComponent() {
      const route = context.props.routeName

      switch (true) {
        case route === 'workspace-project-code-does-not-exist':
          return PackageBarNotExist

        case route === 'workspace-project-job-overiew':
        case route === 'workspace-project-job-jobruns':
        case route === 'workspace-project-job-variables':
        case route === 'workspace-project-job-tokens':
        case route === 'workspace-project-job-edit':
          return JobNavBar

        case route === 'workspace-project-job-does-not-exist':
          return JobNavBarNotExist

        case route.indexOf('job-uuid') !== -1:
          return JobNabBar

        case route.indexOf('workspace-project-jobs-job-jobrun') !== -1:
          return JobRunNavBar

        case route === 'workspace-project-job-run-does-not-exist':
          return JobRunNavBarNotExist

        default:
          return DefaultBar
      }
    }

    return h(appropriateBarComponent(), context.data, context.children)
  }
})
</script>
