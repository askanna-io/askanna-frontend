import routes from '~pages'
import { auth } from '@/features/auth/config'
import { user } from '@/features/user/config'
import { projects } from '@/features/projects/config'
import { workspace } from '@/features/workspace/config'
import { workspaces } from '@/features/workspaces/config'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...auth.paths,
    ...user.paths,
    ...projects.paths,
    ...workspaces.paths,
    ...workspace.paths,
    ...routes
  ]
})

export default router