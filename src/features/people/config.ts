export const peopleRoutes = {
  path: 'people',
  component: () => import('./views/people.vue'),
  name: 'workspace-people',
  meta: {
    hideAppBarIcon: true,
    breadcrumb: 'People'
  }
}
