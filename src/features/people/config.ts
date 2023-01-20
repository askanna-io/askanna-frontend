import { PERMISSIONS_LABELS } from '@/features/workspace/types'

export const peopleRoutes = {
  path: 'people',
  component: () => import('./views/people.vue'),
  name: 'workspace-people',
  meta: {
    hideAppBarIcon: true,
    breadcrumb: 'People',
    permission: PERMISSIONS_LABELS.workspacePeopleList
  }
}
