export const peopleRoutes = {
  path: 'people',
  component: () => import(/* webpackChunkName: "workspace-people" */ './views/people.vue'),
  name: 'workspace-people',
  meta: {
    hideAppBarIcon: true,
    breadcrumb: 'People'
  }
}
